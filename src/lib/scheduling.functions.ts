import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

export type BusinessHour = {
  weekday: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
};

export const listHours = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      "SELECT weekday, open_time, close_time, is_closed FROM business_hours WHERE business_id=$1 ORDER BY weekday",
      [context.businessId],
    );
    const map = new Map<number, BusinessHour>();
    for (const r of res.rows as BusinessHour[]) map.set(r.weekday, r);
    return Array.from({ length: 7 }, (_, i) =>
      map.get(i) ?? { weekday: i, open_time: "09:00:00", close_time: "18:00:00", is_closed: i === 0 },
    );
  });

const hoursSchema = z.object({
  hours: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        openTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
        closeTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
        isClosed: z.boolean(),
      }),
    )
    .length(7),
});

export const saveHours = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => hoursSchema.parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    for (const h of data.hours) {
      await pool.query(
        `INSERT INTO business_hours (business_id, weekday, open_time, close_time, is_closed)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (business_id, weekday) DO UPDATE SET open_time=$3, close_time=$4, is_closed=$5`,
        [context.businessId, h.weekday, h.openTime, h.closeTime, h.isClosed],
      );
    }
    return { ok: true };
  });

export type HourException = {
  id: string;
  date: string;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

export const listExceptions = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      "SELECT id, date, is_closed, open_time, close_time, note FROM hour_exceptions WHERE business_id=$1 ORDER BY date",
      [context.businessId],
    );
    return res.rows as HourException[];
  });

export const saveException = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        isClosed: z.boolean(),
        note: z.string().trim().max(200).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await db().query(
      `INSERT INTO hour_exceptions (business_id, date, is_closed, note) VALUES ($1,$2,$3,$4)
       ON CONFLICT (business_id, date) DO UPDATE SET is_closed=$3, note=$4`,
      [context.businessId, data.date, data.isClosed, data.note ?? null],
    );
    return { ok: true };
  });

export const deleteException = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await db().query("DELETE FROM hour_exceptions WHERE id=$1 AND business_id=$2", [
      data.id,
      context.businessId,
    ]);
    return { ok: true };
  });

export type Booking = {
  id: string;
  service_id: string | null;
  service_name: string | null;
  customer_name: string;
  phone: string | null;
  email: string | null;
  starts_at: string;
  ends_at: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  source_channel: string | null;
  notes: string | null;
};

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      `SELECT b.id, b.service_id, s.name AS service_name, b.customer_name, b.phone, b.email,
              b.starts_at, b.ends_at, b.status, b.source_channel, b.notes
         FROM bookings b LEFT JOIN services s ON s.id = b.service_id
        WHERE b.business_id = $1 ORDER BY b.starts_at DESC LIMIT 200`,
      [context.businessId],
    );
    return res.rows as Booking[];
  });

export const saveBooking = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        serviceId: z.string().uuid().optional().nullable(),
        customerName: z.string().trim().min(2).max(120),
        phone: z.string().trim().max(40).optional().nullable(),
        email: z.string().trim().max(160).optional().nullable(),
        startsAt: z.string().min(10),
        durationMin: z.number().int().min(5).max(600),
        notes: z.string().trim().max(1000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date(data.startsAt);
    if (Number.isNaN(start.getTime())) throw new Error("Geçersiz tarih.");
    const end = new Date(start.getTime() + data.durationMin * 60_000);
    const clash = await db().query(
      `SELECT 1 FROM bookings WHERE business_id=$1 AND status <> 'cancelled'
         AND tstzrange(starts_at, ends_at) && tstzrange($2,$3) LIMIT 1`,
      [context.businessId, start.toISOString(), end.toISOString()],
    );
    if (clash.rowCount) throw new Error("Bu saat aralığı dolu.");
    await db().query(
      `INSERT INTO bookings (business_id, service_id, customer_name, phone, email, starts_at, ends_at, notes, source_channel)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'panel')`,
      [
        context.businessId,
        data.serviceId ?? null,
        data.customerName,
        data.phone ?? null,
        data.email ?? null,
        start.toISOString(),
        end.toISOString(),
        data.notes ?? null,
      ],
    );
    return { ok: true };
  });

export const setBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await db().query("UPDATE bookings SET status=$3 WHERE id=$1 AND business_id=$2", [
      data.id,
      context.businessId,
      data.status,
    ]);
    return { ok: true };
  });

/** Belirli bir gün için boş slotları hesaplar (AI'ın rezervasyon önerisiyle aynı mantık). */
export const getFreeSlots = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        durationMin: z.number().int().min(5).max(600).default(30),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const pool = db();
    const day = new Date(`${data.date}T00:00:00Z`);
    const weekday = day.getUTCDay();

    const exc = await pool.query(
      "SELECT is_closed, open_time, close_time FROM hour_exceptions WHERE business_id=$1 AND date=$2",
      [context.businessId, data.date],
    );
    let open = "09:00:00";
    let close = "18:00:00";
    if (exc.rows[0]) {
      if (exc.rows[0].is_closed) return [] as string[];
      open = exc.rows[0].open_time ?? open;
      close = exc.rows[0].close_time ?? close;
    } else {
      const hrs = await pool.query(
        "SELECT open_time, close_time, is_closed FROM business_hours WHERE business_id=$1 AND weekday=$2",
        [context.businessId, weekday],
      );
      if (hrs.rows[0]) {
        if (hrs.rows[0].is_closed) return [] as string[];
        open = hrs.rows[0].open_time;
        close = hrs.rows[0].close_time;
      }
    }

    const biz = await pool.query("SELECT slot_minutes FROM businesses WHERE id=$1", [context.businessId]);
    const step = Number(biz.rows[0]?.slot_minutes ?? 30);

    const taken = await pool.query(
      `SELECT starts_at, ends_at FROM bookings
        WHERE business_id=$1 AND status <> 'cancelled' AND starts_at::date = $2::date`,
      [context.businessId, data.date],
    );
    const busy = (taken.rows as Array<{ starts_at: string; ends_at: string }>).map((r) => [
      new Date(r.starts_at).getTime(),
      new Date(r.ends_at).getTime(),
    ]);

    const toMs = (t: string) => {
      const [h = "0", m = "0"] = t.split(":");
      return Date.parse(`${data.date}T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00Z`);
    };
    const slots: string[] = [];
    for (let t = toMs(open); t + data.durationMin * 60_000 <= toMs(close); t += step * 60_000) {
      const end = t + data.durationMin * 60_000;
      const overlaps = busy.some(([bs, be]) => t < (be as number) && end > (bs as number));
      if (!overlaps) slots.push(new Date(t).toISOString());
    }
    return slots;
  });
