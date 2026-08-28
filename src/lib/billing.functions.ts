import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";
import { PLANS, type PlanKey } from "./plans";

function origin(): string {
  return process.env["PUBLIC_SITE_URL"] || "http://localhost:8080";
}

/** Abonelik (plan) checkout — tüm fiyatlar USD. */
export const createPlanCheckout = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ plan: z.enum(["free", "starter", "custom"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const plan = PLANS[data.plan as PlanKey];
    if (!plan.checkout || plan.amountCents <= 0) {
      throw new Error(`${plan.name} planı için ödeme gerekmiyor; satış ekibiyle iletişime geçin.`);
    }
    const { stripePost } = await import("./stripe.server");
    const session = await stripePost("checkout/sessions", {
      mode: "subscription",
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": plan.amountCents,
      "line_items[0][price_data][recurring][interval]": "month",
      "line_items[0][price_data][product_data][name]": `TrairX Connect ${plan.name}`,
      "line_items[0][price_data][product_data][description]": plan.description,
      client_reference_id: context.businessId,
      "metadata[business_id]": context.businessId,
      "metadata[plan]": plan.key,
      success_url: `${origin()}/admin/ayarlar?checkout=success`,
      cancel_url: `${origin()}/admin/ayarlar?checkout=cancel`,
    });
    return { url: session.url };
  });

/** Sipariş ödemesi (pay/$token) — Stripe Checkout, USD. */
export const createOrderCheckout = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token: z.string().min(8).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const pool = db();
    const order = (
      await pool.query(
        `SELECT o.id, o.token, o.payment_status, b.name AS business
           FROM orders o JOIN businesses b ON b.id=o.business_id WHERE o.token=$1`,
        [data.token],
      )
    ).rows[0];
    if (!order) throw new Error("Sipariş bulunamadı.");
    if (order.payment_status === "paid") throw new Error("Bu sipariş zaten ödendi.");

    const items = (
      await pool.query("SELECT name, unit_price, qty FROM order_items WHERE order_id=$1", [order.id])
    ).rows as Array<{ name: string; unit_price: string; qty: number }>;
    if (!items.length) throw new Error("Siparişte ürün yok.");

    const form: Record<string, string | number> = {
      mode: "payment",
      client_reference_id: order.token,
      "metadata[order_id]": order.id,
      success_url: `${origin()}/pay/${order.token}?payment=success`,
      cancel_url: `${origin()}/pay/${order.token}?payment=cancel`,
    };
    items.forEach((it, i) => {
      form[`line_items[${i}][quantity]`] = it.qty;
      form[`line_items[${i}][price_data][currency]`] = "usd";
      form[`line_items[${i}][price_data][unit_amount]`] = Math.round(Number(it.unit_price) * 100);
      form[`line_items[${i}][price_data][product_data][name]`] = it.name;
    });

    const { stripePost } = await import("./stripe.server");
    const session = await stripePost("checkout/sessions", form);
    await pool.query("UPDATE orders SET payment_status='pending', currency='USD' WHERE id=$1", [order.id]);
    return { url: session.url };
  });
