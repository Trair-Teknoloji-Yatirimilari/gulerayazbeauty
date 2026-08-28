import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

type WaPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        metadata?: { phone_number_id?: string };
        contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>;
        messages?: Array<{ from?: string; type?: string; text?: { body?: string } }>;
      };
    }>;
  }>;
};

function verifySignature(raw: string, header: string | null): boolean {
  const secret = process.env["WHATSAPP_APP_SECRET"];
  if (!secret) return true; // imza doğrulaması opsiyonel (secret yoksa atlanır)
  if (!header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header.slice(7));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** phone_number_id -> business eşlemesi (channels.external_id), yoksa varsayılan işletme. */
async function resolveBusinessId(phoneNumberId?: string): Promise<string | null> {
  const pool = db();
  if (phoneNumberId) {
    const res = await pool.query(
      "SELECT business_id FROM channels WHERE kind='whatsapp' AND external_id=$1 LIMIT 1",
      [phoneNumberId],
    );
    if (res.rows[0]) return res.rows[0].business_id as string;
  }
  const fallback = process.env["WHATSAPP_DEFAULT_BUSINESS_ID"];
  if (fallback) return fallback;
  const first = await pool.query("SELECT id FROM businesses ORDER BY created_at LIMIT 1");
  return (first.rows[0]?.id as string) ?? null;
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      // Meta webhook doğrulaması
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge") ?? "";
        if (mode === "subscribe" && token && token === process.env["WHATSAPP_VERIFY_TOKEN"]) {
          return new Response(challenge, { status: 200, headers: { "content-type": "text/plain" } });
        }
        return new Response("Forbidden", { status: 403 });
      },

      POST: async ({ request }) => {
        const raw = await request.text();
        if (!verifySignature(raw, request.headers.get("x-hub-signature-256"))) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: WaPayload;
        try {
          payload = JSON.parse(raw) as WaPayload;
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const value = payload.entry?.[0]?.changes?.[0]?.value;
        const msg = value?.messages?.[0];
        const from = msg?.from;
        const text = msg?.type === "text" ? msg.text?.body?.trim() : undefined;
        if (!from || !text) return new Response("ok"); // durum bildirimleri vb.

        const businessId = await resolveBusinessId(value?.metadata?.phone_number_id);
        if (!businessId) return new Response("ok");

        const { answerMessage, ensureConversation, sendWhatsAppText, upsertCrmFromWhatsApp } = await import(
          "@/lib/ai-engine.server"
        );
        const contactName = value?.contacts?.[0]?.profile?.name ?? null;

        try {
          const conversationId = await ensureConversation({
            businessId,
            channel: "whatsapp",
            source: "live",
            externalId: from,
            customerName: contactName,
            title: text.slice(0, 80),
          });

          // Son 10 mesajı bağlam olarak taşı
          const prev = await db().query(
            "SELECT role, content FROM (SELECT role, content, created_at FROM ai_messages WHERE conversation_id=$1 ORDER BY created_at DESC LIMIT 10) t ORDER BY created_at",
            [conversationId],
          );

          const res = await answerMessage({
            businessId,
            conversationId,
            channel: "whatsapp",
            message: text,
            history: prev.rows as Array<{ role: "user" | "assistant"; content: string }>,
          });

          await sendWhatsAppText(from, res.reply);
          await upsertCrmFromWhatsApp(businessId, from, contactName, `WhatsApp: ${text}`);
        } catch (err) {
          console.error("WhatsApp webhook hatası", err);
        }

        return new Response("ok");
      },
    },
  },
});
