import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

export type CrmStage = "lead" | "contacted" | "qualified" | "won" | "lost";
export type CrmActivityKind = "ai_chat" | "note" | "call" | "booking" | "order" | "handoff";

export type CrmCustomer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source_channel: string | null;
  stage: CrmStage;
  notes: string | null;
  last_contact_at: string | null;
  created_at: string;
  bookings_count: number;
  orders_count: number;
  total_spent: number;
};

export type CrmActivity = {
  id: string;
  kind: CrmActivityKind;
  channel: string | null;
  summary: string;
  detail: string | null;
  by_ai: boolean;
  created_at: string;
};

export type CrmDetail = {
  customer: CrmCustomer;
  activities: CrmActivity[];
  bookings: { id: string; starts_at: string; status: string; service: string | null }[];
  orders: { id: string; total: number; currency: string; status: string; created_at: string }[];
};

export const crmStats = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      `SELECT
         count(*)::int AS total,
         count(*) FILTER (WHERE stage IN ('lead','contacted'))::int AS open_leads,
         count(*) FILTER (WHERE stage = 'won')::int AS won,
         count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS new_30d
       FROM crm_customers WHERE business_id = $1`,
      [context.businessId],
    );
    const revenue = await db().query(
      `SELECT COALESCE(SUM(total),0)::float AS revenue
         FROM orders WHERE business_id = $1 AND payment_status = 'paid'`,
      [context.businessId],
    );
    return { ...res.rows[0], revenue: revenue.rows[0].revenue as number };
  });

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z.object({ q: z.string().trim().max(120).optional(), stage: z.string().optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const res = await db().query(
      `SELECT c.id, c.name, c.phone, c.email, c.source_channel, c.stage, c.notes,
              c.last_contact_at, c.created_at,
              (SELECT count(*) FROM bookings b WHERE b.customer_id = c.id)::int AS bookings_count,
              (SELECT count(*) FROM orders o WHERE o.customer_id = c.id)::int AS orders_count,
              (SELECT COALESCE(SUM(o.total),0) FROM orders o
                 WHERE o.customer_id = c.id AND o.payment_status = 'paid')::float AS total_spent
         FROM crm_customers c
        WHERE c.business_id = $1
          AND ($2::text IS NULL OR c.name ILIKE '%'||$2||'%' OR c.phone ILIKE '%'||$2||'%' OR c.email ILIKE '%'||$2||'%')
          AND ($3::text IS NULL OR c.stage::text = $3)
        ORDER BY COALESCE(c.last_contact_at, c.created_at) DESC
        LIMIT 300`,
      [context.businessId, data.q || null, data.stage && data.stage !== "all" ? data.stage : null],
    );
    return res.rows as CrmCustomer[];
  });

export const getCustomer = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    const cust = await pool.query(
      `SELECT c.id, c.name, c.phone, c.email, c.source_channel, c.stage, c.notes,
              c.last_contact_at, c.created_at,
              (SELECT count(*) FROM bookings b WHERE b.customer_id = c.id)::int AS bookings_count,
              (SELECT count(*) FROM orders o WHERE o.customer_id = c.id)::int AS orders_count,
              (SELECT COALESCE(SUM(o.total),0) FROM orders o
                 WHERE o.customer_id = c.id AND o.payment_status = 'paid')::float AS total_spent
         FROM crm_customers c WHERE c.id = $1 AND c.business_id = $2`,
      [data.id, context.businessId],
    );
    if (!cust.rows[0]) throw new Error("Müşteri bulunamadı.");

    const activities = await pool.query(
      `SELECT id, kind, channel, summary, detail, by_ai, created_at
         FROM crm_activities WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [data.id],
    );
    const bookings = await pool.query(
      `SELECT b.id, b.starts_at, b.status::text AS status, s.name AS service
         FROM bookings b LEFT JOIN services s ON s.id = b.service_id
        WHERE b.customer_id = $1 ORDER BY b.starts_at DESC LIMIT 50`,
      [data.id],
    );
    const orders = await pool.query(
      `SELECT id, total::float AS total, currency, status::text AS status, created_at
         FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [data.id],
    );
    return {
      customer: cust.rows[0] as CrmCustomer,
      activities: activities.rows as CrmActivity[],
      bookings: bookings.rows,
      orders: orders.rows,
    } as CrmDetail;
  });

export const saveCustomer = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().trim().min(2).max(120),
        phone: z.string().trim().max(30).optional().nullable(),
        email: z.string().trim().max(160).optional().nullable(),
        sourceChannel: z.string().trim().max(40).optional().nullable(),
        stage: z.enum(["lead", "contacted", "qualified", "won", "lost"]),
        notes: z.string().trim().max(4000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const pool = db();
    if (data.id) {
      await pool.query(
        `UPDATE crm_customers SET name=$3, phone=$4, email=$5, source_channel=$6, stage=$7::crm_stage, notes=$8
           WHERE id=$1 AND business_id=$2`,
        [
          data.id,
          context.businessId,
          data.name,
          data.phone || null,
          data.email || null,
          data.sourceChannel || null,
          data.stage,
          data.notes || null,
        ],
      );
      return { id: data.id };
    }
    const res = await pool.query(
      `INSERT INTO crm_customers (business_id, name, phone, email, source_channel, stage, notes, last_contact_at)
       VALUES ($1,$2,$3,$4,$5,$6::crm_stage,$7, now()) RETURNING id`,
      [
        context.businessId,
        data.name,
        data.phone || null,
        data.email || null,
        data.sourceChannel || null,
        data.stage,
        data.notes || null,
      ],
    );
    return { id: res.rows[0].id as string };
  });

export const setStage = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({ id: z.string().uuid(), stage: z.enum(["lead", "contacted", "qualified", "won", "lost"]) })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await db().query(
      "UPDATE crm_customers SET stage=$3::crm_stage WHERE id=$1 AND business_id=$2",
      [data.id, context.businessId, data.stage],
    );
    return { ok: true };
  });

export const addActivity = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        customerId: z.string().uuid(),
        kind: z.enum(["ai_chat", "note", "call", "booking", "order", "handoff"]),
        channel: z.string().trim().max(40).optional().nullable(),
        summary: z.string().trim().min(2).max(300),
        detail: z.string().trim().max(4000).optional().nullable(),
        byAi: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const pool = db();
    const res = await pool.query(
      `INSERT INTO crm_activities (business_id, customer_id, kind, channel, summary, detail, by_ai)
       SELECT $1, c.id, $3::crm_activity_kind, $4, $5, $6, $7
         FROM crm_customers c WHERE c.id = $2 AND c.business_id = $1
       RETURNING id`,
      [
        context.businessId,
        data.customerId,
        data.kind,
        data.channel || null,
        data.summary,
        data.detail || null,
        data.byAi ?? false,
      ],
    );
    if (!res.rows[0]) throw new Error("Müşteri bulunamadı.");
    await pool.query(
      "UPDATE crm_customers SET last_contact_at = now() WHERE id=$1 AND business_id=$2",
      [data.customerId, context.businessId],
    );
    return { id: res.rows[0].id as string };
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await db().query("DELETE FROM crm_customers WHERE id=$1 AND business_id=$2", [
      data.id,
      context.businessId,
    ]);
    return { ok: true };
  });
