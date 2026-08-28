import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

function verify(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook secret missing", { status: 500 });

        const body = await request.text();
        if (!verify(body, request.headers.get("stripe-signature"), secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as {
          type: string;
          data: { object: { client_reference_id?: string; metadata?: Record<string, string>; amount_total?: number } };
        };
        const obj = event.data.object;

        if (event.type === "checkout.session.completed") {
          const orderId = obj.metadata?.["order_id"];
          const businessId = obj.metadata?.["business_id"];
          const plan = obj.metadata?.["plan"];
          if (orderId) {
            await db().query("UPDATE orders SET payment_status='paid', status='paid' WHERE id=$1", [orderId]);
          } else if (businessId && plan) {
            await db().query("UPDATE businesses SET plan=$2 WHERE id=$1", [businessId, plan]);
          }
        }

        return new Response("ok");
      },
    },
  },
});
