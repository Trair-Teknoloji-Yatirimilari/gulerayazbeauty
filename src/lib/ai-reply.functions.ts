import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireBusiness } from "./auth.functions";

const channelEnum = z.enum(["whatsapp", "instagram", "facebook", "web"]);

/** Panelden AI yanıtını test etmek için: gerçek Claude çağrısı yapar ve geçmişe kaydeder. */
export const testAiReply = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        message: z.string().trim().min(1).max(2000),
        channel: channelEnum.default("whatsapp"),
        conversationId: z.string().uuid().nullable().optional(),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
          .max(20)
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { answerMessage, ensureConversation } = await import("./ai-engine.server");

    const conversationId =
      data.conversationId ??
      (await ensureConversation({
        businessId: context.businessId,
        channel: data.channel,
        source: "test",
        title: data.message.slice(0, 80),
      }));

    const res = await answerMessage({
      businessId: context.businessId,
      conversationId,
      channel: data.channel,
      message: data.message,
      history: data.history ?? [],
    });

    return { ...res, conversationId, channel: data.channel };
  });

/** Panelde gösterilecek konuşma geçmişi listesi (test + canlı WhatsApp). */
export const listAiConversations = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const { db } = await import("./db");
    const res = await db().query(
      `SELECT c.id, c.channel, c.source, c.title, c.customer_name, c.external_id, c.last_message_at,
              (SELECT count(*)::int FROM ai_messages m WHERE m.conversation_id = c.id) AS message_count
         FROM ai_conversations c
        WHERE c.business_id = $1
        ORDER BY c.last_message_at DESC
        LIMIT 25`,
      [context.businessId],
    );
    return res.rows as Array<{
      id: string;
      channel: string;
      source: string;
      title: string | null;
      customer_name: string | null;
      external_id: string | null;
      last_message_at: string;
      message_count: number;
    }>;
  });

/** Tek bir konuşmanın mesajları. */
export const getAiConversation = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { db } = await import("./db");
    const pool = db();
    const conv = await pool.query("SELECT id, channel, source, title FROM ai_conversations WHERE id=$1 AND business_id=$2", [
      data.id,
      context.businessId,
    ]);
    if (!conv.rows[0]) throw new Error("Konuşma bulunamadı.");
    const msgs = await pool.query(
      "SELECT role, content, model, latency_ms, created_at FROM ai_messages WHERE conversation_id=$1 ORDER BY created_at",
      [data.id],
    );
    return {
      conversation: conv.rows[0] as { id: string; channel: string; source: string; title: string | null },
      messages: msgs.rows as Array<{
        role: "user" | "assistant";
        content: string;
        model: string | null;
        latency_ms: number | null;
        created_at: string;
      }>,
    };
  });
