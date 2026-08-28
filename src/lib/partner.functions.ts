import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireAdmin } from "./auth.functions";

const applicationSchema = z.object({
  company: z.string().trim().min(2).max(160),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  sector: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const submitPartnerApplication = createServerFn({ method: "POST" })
  .validator((d: unknown) => applicationSchema.parse(d))
  .handler(async ({ data }) => {
    await db().query(
      `INSERT INTO partner_applications (company, name, email, phone, sector, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [data.company, data.name, data.email, data.phone || null, data.sector || null, data.message || null],
    );
    return { ok: true };
  });

export type PartnerApplication = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string | null;
  sector: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export const listPartnerApplications = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    if (context.account.role !== "superadmin") throw new Error("Bu alana erişim yetkiniz yok.");
    const res = await db().query(
      "SELECT * FROM partner_applications ORDER BY created_at DESC LIMIT 200",
    );
    return res.rows as PartnerApplication[];
  });

export const setApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "approved", "rejected"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (context.account.role !== "superadmin") throw new Error("Bu alana erişim yetkiniz yok.");
    await db().query("UPDATE partner_applications SET status=$2 WHERE id=$1", [data.id, data.status]);
    return { ok: true };
  });
