import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

const TONE_TEXT: Record<string, string> = {
  formal: "Resmî, ölçülü ve profesyonel bir dil kullan.",
  friendly: "Samimi, sıcak ama profesyonel bir dil kullan.",
  energetic: "Enerjik, kısa ve satış odaklı bir dil kullan.",
};

/** İşletmenin panele girdiği verilerden Claude için sistem promptu üretir. */
async function buildSystemPrompt(businessId: string): Promise<string> {
  const pool = db();
  const [biz, settings, products, services, hours, knowledge] = await Promise.all([
    pool.query("SELECT name, sector, description FROM businesses WHERE id=$1", [businessId]),
    pool.query("SELECT tone, language, greeting, fallback_message, handoff_rules FROM ai_settings WHERE business_id=$1", [businessId]),
    pool.query("SELECT name, price, currency, description FROM products WHERE business_id=$1 AND is_active LIMIT 100", [businessId]),
    pool.query("SELECT name, price, duration_min, description FROM services WHERE business_id=$1 AND is_active LIMIT 100", [businessId]),
    pool.query("SELECT weekday, open_time, close_time, is_closed FROM business_hours WHERE business_id=$1 ORDER BY weekday", [businessId]),

    pool.query("SELECT type, question, answer FROM knowledge_items WHERE business_id=$1 LIMIT 200", [businessId]),
  ]);

  const b = biz.rows[0] ?? { name: "İşletme" };
  const s = settings.rows[0] ?? {};
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  const lines: string[] = [
    `Sen ${b.name} işletmesinin TrairX Connect üzerinden çalışan yapay zekâ müşteri temsilcisisin.`,
    b.sector ? `Sektör: ${b.sector}.` : "",
    b.description ? `İşletme tanımı: ${b.description}` : "",
    TONE_TEXT[s.tone as string] ?? TONE_TEXT["friendly"]!,
    (s.language ?? "tr") === "en" ? "Reply in English." : "Yanıtlarını Türkçe ver.",
    s.greeting ? `Karşılama mesajı: ${s.greeting}` : "",
    "",
    "KURALLAR:",
    "- Sadece aşağıdaki bilgilere dayan; bilmediğin fiyat, stok veya randevu bilgisini uydurma.",
    "- Fiyatları listedeki para birimiyle söyle.",
    "- Satın alma niyeti varsa ödeme linki oluşturulacağını belirt ve ad-soyad/telefon iste.",
    "- Randevu talebinde çalışma saatlerine uygun slot öner.",
    "- Yanıtlar kısa olsun (en fazla 5 cümle).",
    s.handoff_rules ? `- İnsana devir kuralları: ${s.handoff_rules}` : "",
    s.fallback_message ? `- Cevabı bilmiyorsan şunu söyle: ${s.fallback_message}` : "",
  ];

  if (products.rows.length) {
    lines.push("", "ÜRÜNLER:");
    for (const p of products.rows) lines.push(`- ${p.name} — ${p.price} ${p.currency}${p.description ? ` (${p.description})` : ""}`);
  }
  if (services.rows.length) {
    lines.push("", "HİZMETLER:");
    for (const v of services.rows)
      lines.push(`- ${v.name} — ${v.price} ${v.currency}, ${v.duration_min} dk${v.description ? ` (${v.description})` : ""}`);
  }
  if (hours.rows.length) {
    lines.push("", "ÇALIŞMA SAATLERİ:");
    for (const h of hours.rows) lines.push(`- ${days[h.weekday] ?? h.weekday}: ${h.open_time}–${h.close_time}`);
  }
  if (knowledge.rows.length) {
    lines.push("", "BİLGİ TABANI:");
    for (const k of knowledge.rows) lines.push(`- [${k.type}] ${k.question ? `${k.question} → ` : ""}${k.answer}`);
  }

  return lines.filter(Boolean).join("\n");
}

const channelEnum = z.enum(["whatsapp", "instagram", "facebook", "web"]);

/** Panelden AI yanıtını test etmek için: gerçek Claude çağrısı yapar. */
export const testAiReply = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        message: z.string().trim().min(1).max(2000),
        channel: channelEnum.default("whatsapp"),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
          .max(20)
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { claudeComplete, CLAUDE_MODEL } = await import("./claude.server");
    const system = await buildSystemPrompt(context.businessId);
    const started = Date.now();

    const reply = await claudeComplete({
      system: `${system}\n\nBu mesaj ${data.channel} kanalından geldi.`,
      messages: [...(data.history ?? []), { role: "user" as const, content: data.message }],
    });

    return {
      reply: reply || "Şu an yanıt üretemedim, lütfen tekrar deneyin.",
      model: CLAUDE_MODEL,
      latencyMs: Date.now() - started,
      channel: data.channel,
    };
  });
