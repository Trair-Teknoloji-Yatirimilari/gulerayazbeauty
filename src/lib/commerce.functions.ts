import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

export type OrderRow = {
  id: string;
  token: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: string;
  currency: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  payment_status: string;
  created_at: string;
  items: number;
};

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      `SELECT o.id, o.token, o.customer_name, o.customer_phone, o.total, o.currency,
              o.status, o.payment_status, o.created_at,
              (SELECT count(*)::int FROM order_items i WHERE i.order_id = o.id) AS items
         FROM orders o WHERE o.business_id=$1 ORDER BY o.created_at DESC LIMIT 200`,
      [context.businessId],
    );
    return res.rows as OrderRow[];
  });

function makeToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Ürünlerden ödeme linki oluşturur — AI sohbette bu linki gönderir. */
export const createPaymentLink = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        items: z
          .array(z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(999) }))
          .min(1)
          .max(50),
        customerName: z.string().trim().max(120).optional().nullable(),
        customerPhone: z.string().trim().max(40).optional().nullable(),
        sourceChannel: z.string().trim().max(30).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const pool = db();
    const ids = data.items.map((i) => i.productId);
    const products = await pool.query(
      "SELECT id, name, price, currency FROM products WHERE business_id=$1 AND id = ANY($2::uuid[])",
      [context.businessId, ids],
    );
    if (products.rowCount !== ids.length) throw new Error("Ürün bulunamadı.");

    const rows = products.rows as Array<{ id: string; name: string; price: string; currency: string }>;
    let total = 0;
    for (const item of data.items) {
      const p = rows.find((r) => r.id === item.productId)!;
      total += Number(p.price) * item.qty;
    }

    const token = makeToken();
    const order = await pool.query(
      `INSERT INTO orders (business_id, token, customer_name, customer_phone, total, currency, status, source_channel)
       VALUES ($1,$2,$3,$4,$5,$6,'sent',$7) RETURNING id`,
      [
        context.businessId,
        token,
        data.customerName ?? null,
        data.customerPhone ?? null,
        total.toFixed(2),
        rows[0]?.currency ?? "TRY",
        data.sourceChannel ?? "panel",
      ],
    );

    for (const item of data.items) {
      const p = rows.find((r) => r.id === item.productId)!;
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, name, unit_price, qty) VALUES ($1,$2,$3,$4,$5)",
        [order.rows[0].id, p.id, p.name, p.price, item.qty],
      );
    }

    return { token, total, path: `/pay/${token}` };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["draft", "sent", "paid", "cancelled"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await db().query(
      `UPDATE orders SET status=$3, payment_status = CASE WHEN $3 = 'paid' THEN 'paid' ELSE payment_status END
        WHERE id=$1 AND business_id=$2`,
      [data.id, context.businessId, data.status],
    );
    return { ok: true };
  });

export type PublicOrder = {
  token: string;
  business: string;
  currency: string;
  total: string;
  payment_status: string;
  items: Array<{ name: string; unit_price: string; qty: number }>;
};

/** Ödeme sayfası için sipariş özeti (herkese açık, token ile). */
export const getPublicOrder = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token: z.string().min(8).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const pool = db();
    const res = await pool.query(
      `SELECT o.token, b.name AS business, o.currency, o.total, o.payment_status
         FROM orders o JOIN businesses b ON b.id = o.business_id WHERE o.token = $1`,
      [data.token],
    );
    const order = res.rows[0];
    if (!order) return null;
    const items = await pool.query(
      "SELECT name, unit_price, qty FROM order_items WHERE order_id = (SELECT id FROM orders WHERE token=$1)",
      [data.token],
    );
    return { ...order, items: items.rows } as PublicOrder;
  });

/** Ödeme sağlayıcısı bağlanana kadar: müşteri bilgilerini kaydeder, siparişi "beklemede" yapar. */
export const submitCheckout = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        token: z.string().min(8).max(64),
        name: z.string().trim().min(2).max(120),
        phone: z.string().trim().min(5).max(40),
        email: z.string().trim().email().max(160).optional().or(z.literal("")),
        address: z.string().trim().max(400).optional().or(z.literal("")),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const res = await db().query(
      `UPDATE orders SET customer_name=$2, customer_phone=$3, customer_email=$4, customer_address=$5,
              payment_status='pending'
        WHERE token=$1 AND payment_status <> 'paid' RETURNING id`,
      [data.token, data.name, data.phone, data.email || null, data.address || null],
    );
    if (!res.rowCount) throw new Error("Sipariş bulunamadı veya zaten ödendi.");
    return { ok: true };
  });
