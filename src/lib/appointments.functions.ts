import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

const ADMIN_EMAIL = "info@drgokhandegirmencioglu.com";

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => appointmentSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const url = process.env.SUPABASE_URL!;
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const payload = {
      full_name: data.full_name,
      phone: data.phone,
      email: data.email ? data.email : null,
      preferred_date: data.preferred_date ? data.preferred_date : null,
      service: data.service ? data.service : null,
      message: data.message ? data.message : null,
      consent_given: data.consent_given,
    };

    const { data: inserted, error } = await supabase
      .from("appointments")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("createAppointment insert error", error);
      throw new Error("Randevu talebiniz kaydedilemedi. Lütfen tekrar deneyin.");
    }

    // Best-effort email notifications (skipped silently if email not configured)
    try {
      const mod = await import("@/lib/email-templates/send-email").catch(() => null);
      if (!mod?.sendTemplateEmail) return;
      const { sendTemplateEmail } = mod;
      await Promise.allSettled([
        sendTemplateEmail("admin-appointment-notification", ADMIN_EMAIL, {
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
          ? sendTemplateEmail("appointment-confirmation", data.email, {
              templateData: {
                fullName: data.full_name,
                preferredDate: data.preferred_date || "En kısa sürede sizinle iletişime geçilecek",
                service: data.service || "Belirtilmedi",
              },
              idempotencyKey: `appt-user-${inserted.id}`,
            })
          : Promise.resolve(),
      ]);
    } catch (e) {
      console.warn("appointment email skipped:", e);
    }

    return { id: inserted.id };
  });

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Yetkisiz erişim.");

    const { data, error } = await context.supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateStatusSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Yetkisiz erişim.");
    const { error } = await context.supabase
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const deleteSchema = z.object({ id: z.string().uuid() });

export const deleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Yetkisiz erişim.");
    const { error } = await context.supabase.from("appointments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
