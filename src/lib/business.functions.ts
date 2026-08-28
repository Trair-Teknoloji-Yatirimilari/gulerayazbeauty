import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireAdmin, requireBusiness } from "./auth.functions";

export type Business = {
  id: string;
  name: string;
  slug: string | null;
  sector: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  currency: string;
  timezone: string;
  locale: string;
  plan: string;
  status: string;
  slot_minutes: number;
};

export const getBusiness = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query("SELECT * FROM businesses WHERE id = $1", [context.businessId]);
    return (res.rows[0] ?? null) as Business | null;
  });

const businessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sector: z.string().trim().max(80).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  email: z.string().trim().max(160).optional().nullable(),
  address: z.string().trim().max(400).optional().nullable(),
  currency: z.string().trim().min(2).max(6),
  timezone: z.string().trim().max(60),
  locale: z.string().trim().max(8),
  slotMinutes: z.number().int().min(5).max(240),
});

export const updateBusiness = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => businessSchema.parse(d))
  .handler(async ({ data, context }) => {
    await db().query(
      `UPDATE businesses SET name=$2, sector=$3, description=$4, phone=$5, email=$6,
              address=$7, currency=$8, timezone=$9, locale=$10, slot_minutes=$11
        WHERE id=$1`,
      [
        context.businessId,
        data.name,
        data.sector ?? null,
        data.description ?? null,
        data.phone ?? null,
        data.email ?? null,
        data.address ?? null,
        data.currency,
        data.timezone,
        data.locale,
        data.slotMinutes,
      ],
    );
    return { ok: true };
  });

export type AiSettings = {
  business_id: string;
  tone: string;
  language: string;
  greeting: string | null;
  fallback_message: string | null;
  handoff_rules: string | null;
};

export const getAiSettings = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const pool = db();
    await pool.query(
      "INSERT INTO ai_settings (business_id) VALUES ($1) ON CONFLICT (business_id) DO NOTHING",
      [context.businessId],
    );
    const res = await pool.query("SELECT * FROM ai_settings WHERE business_id = $1", [context.businessId]);
    return res.rows[0] as AiSettings;
  });

const aiSchema = z.object({
  tone: z.enum(["formal", "friendly", "energetic"]),
  language: z.enum(["tr", "en"]),
  greeting: z.string().trim().max(500).optional().nullable(),
  fallbackMessage: z.string().trim().max(500).optional().nullable(),
  handoffRules: z.string().trim().max(2000).optional().nullable(),
});

export const updateAiSettings = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => aiSchema.parse(d))
  .handler(async ({ data, context }) => {
    await db().query(
      `INSERT INTO ai_settings (business_id, tone, language, greeting, fallback_message, handoff_rules, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6, now())
       ON CONFLICT (business_id) DO UPDATE SET tone=$2, language=$3, greeting=$4,
              fallback_message=$5, handoff_rules=$6, updated_at=now()`,
      [
        context.businessId,
        data.tone,
        data.language,
        data.greeting ?? null,
        data.fallbackMessage ?? null,
        data.handoffRules ?? null,
      ],
    );
    return { ok: true };
  });

export type Channel = {
  id: string;
  kind: "whatsapp" | "instagram" | "facebook";
  status: string;
  external_id: string | null;
  connected_at: string | null;
};

export const listChannels = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      "SELECT id, kind, status, external_id, connected_at FROM channels WHERE business_id = $1 ORDER BY kind",
      [context.businessId],
    );
    return res.rows as Channel[];
  });

const channelSchema = z.object({
  kind: z.enum(["whatsapp", "instagram", "facebook"]),
  externalId: z.string().trim().max(160).optional().nullable(),
  status: z.enum(["connected", "disconnected", "pending"]),
});

export const upsertChannel = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => channelSchema.parse(d))
  .handler(async ({ data, context }) => {
    await db().query(
      `INSERT INTO channels (business_id, kind, status, external_id, connected_at)
       VALUES ($1,$2,$3,$4, CASE WHEN $3 = 'connected' THEN now() ELSE NULL END)
       ON CONFLICT (business_id, kind) DO UPDATE SET status=$3, external_id=$4,
              connected_at = CASE WHEN $3 = 'connected' THEN now() ELSE NULL END`,
      [context.businessId, data.kind, data.status, data.externalId ?? null],
    );
    return { ok: true };
  });

export type Overview = {
  products: number;
  services: number;
  knowledge: number;
  bookingsUpcoming: number;
  ordersOpen: number;
  channelsConnected: number;
  hoursSet: number;
  readiness: number;
};

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const id = context.businessId;
    const pool = db();
    const q = async (sql: string) => Number((await pool.query(sql, [id])).rows[0].c);
    const products = await q("SELECT count(*)::int c FROM products WHERE business_id=$1");
    const services = await q("SELECT count(*)::int c FROM services WHERE business_id=$1");
    const knowledge = await q("SELECT count(*)::int c FROM knowledge_items WHERE business_id=$1");
    const bookingsUpcoming = await q(
      "SELECT count(*)::int c FROM bookings WHERE business_id=$1 AND starts_at >= now() AND status <> 'cancelled'",
    );
    const ordersOpen = await q(
      "SELECT count(*)::int c FROM orders WHERE business_id=$1 AND payment_status <> 'paid'",
    );
    const channelsConnected = await q(
      "SELECT count(*)::int c FROM channels WHERE business_id=$1 AND status='connected'",
    );
    const hoursSet = await q("SELECT count(*)::int c FROM business_hours WHERE business_id=$1");

    const checks = [products > 0, services > 0, knowledge >= 3, channelsConnected > 0, hoursSet > 0];
    const readiness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

    return {
      products,
      services,
      knowledge,
      bookingsUpcoming,
      ordersOpen,
      channelsConnected,
      hoursSet,
      readiness,
    } satisfies Overview;
  });

/** Süper admin: tüm işletmeler ve partner başvuruları. */
export const listBusinesses = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    if (context.account.role !== "superadmin") throw new Error("Bu alana erişim yetkiniz yok.");
    const res = await db().query(
      `SELECT b.id, b.name, b.sector, b.plan, b.status, b.created_at,
              (SELECT count(*)::int FROM products p WHERE p.business_id = b.id) AS products,
              (SELECT count(*)::int FROM bookings k WHERE k.business_id = b.id) AS bookings
         FROM businesses b ORDER BY b.created_at DESC`,
    );
    return res.rows as Array<{
      id: string;
      name: string;
      sector: string | null;
      plan: string;
      status: string;
      created_at: string;
      products: number;
      bookings: number;
    }>;
  });
