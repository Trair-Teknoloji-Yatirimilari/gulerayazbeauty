import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireAdmin } from "./auth.functions";

const appointmentSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(5).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent_given: z.boolean().refine((v) => v === true, {
    message: "Aydınlatma metnini onaylamanız gerekiyor.",
  }),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export interface AppointmentRow {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_date: string | null;
  service: string | null;
  message: string | null;
  consent_given: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}


const ADMIN_EMAIL = "info@drgokhandegirmencioglu.com";

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => appointmentSchema.parse(data))
  .handler(async ({ data }) => {
    const { rows } = await db().query(
      `INSERT INTO appointments (full_name, phone, email, preferred_date, service, message, consent_given)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [
        data.full_name,
        data.phone,
        data.email || null,
        data.preferred_date || null,
        data.service || null,
        data.message || null,
        data.consent_given,
      ],
    );
    const inserted = rows[0];

    // E-posta bildirimi (yapılandırılmadıysa sessizce atlanır)
    try {
      const mod = await import("@/lib/email-templates/send-email").catch(() => null);
      if (mod?.sendTemplateEmail) {
        await Promise.allSettled([
          mod.sendTemplateEmail("admin-appointment-notification", ADMIN_EMAIL, {
            templateData: {
              fullName: data.full_name,
              phone: data.phone,
              email: data.email || "—",
              preferredDate: data.preferred_date || "—",
              service: data.service || "—",
              message: data.message || "—",
            },
            idempotencyKey: `appt-admin-${inserted.id}`,
          }),
          data.email
            ? mod.sendTemplateEmail("appointment-confirmation", data.email, {
                templateData: {
                  fullName: data.full_name,
                  preferredDate: data.preferred_date || "En kısa sürede sizinle iletişime geçilecek",
                  service: data.service || "Belirtilmedi",
                },
                idempotencyKey: `appt-user-${inserted.id}`,
              })
            : Promise.resolve(),
        ]);
      }
    } catch (e) {
      console.warn("appointment email skipped:", e);
    }

    return { id: inserted.id };
  });

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { rows } = await db().query<AppointmentRow>(`SELECT * FROM appointments ORDER BY created_at DESC`);
    return rows;
  });

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => updateStatusSchema.parse(d))
  .handler(async ({ data }) => {
    await db().query(`UPDATE appointments SET status = $1 WHERE id = $2`, [data.status, data.id]);
    return { ok: true };
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await db().query(`DELETE FROM appointments WHERE id = $1`, [data.id]);
    return { ok: true };
  });
