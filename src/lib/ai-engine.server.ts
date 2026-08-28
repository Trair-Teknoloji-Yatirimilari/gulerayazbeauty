// TrairX Connect AI motoru — sistem promptu, konuşma kaydı ve WhatsApp gönderimi.
// Sadece sunucu tarafında çalışır.
import { db } from "./db";
import { claudeComplete, CLAUDE_MODEL, type ClaudeMessage } from "./claude.server";

const TONE_TEXT: Record<string, string> = {
  formal: "Resmî, ölçülü ve profesyonel bir dil kullan.",
  friendly: "Samimi, sıcak ama profesyonel bir dil kullan.",
  energetic: "Enerjik, kısa ve satış odaklı bir dil kullan.",
};

/** İşletmenin panele girdiği verilerden Claude için sistem promptu üretir. */
export async function buildSystemPrompt(businessId: string): Promise<string> {
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
      lines.push(`- ${v.name} — ${v.price} USD, ${v.duration_min} dk${v.description ? ` (${v.description})` : ""}`);
  }
  if (hours.rows.length) {
    lines.push("", "ÇALIŞMA SAATLERİ:");
    for (const h of hours.rows)
      lines.push(`- ${days[h.weekday] ?? h.weekday}: ${h.is_closed ? "Kapalı" : `${h.open_time}–${h.close_time}`}`);
  }
  if (knowledge.rows.length) {
    lines.push("", "BİLGİ TABANI:");
    for (const k of knowledge.rows) lines.push(`- [${k.type}] ${k.question ? `${k.question} → ` : ""}${k.answer}`);
  }

  return lines.filter(Boolean).join("\n");
}

/** Konuşmayı bulur ya da oluşturur. */
export async function ensureConversation(opts: {
  businessId: string;
  channel: string;
  source: "test" | "live";
  externalId?: string | null;
  title?: string | null;
  customerName?: string | null;
}): Promise<string> {
  const pool = db();
  if (opts.externalId) {
    const found = await pool.query(
      "SELECT id FROM ai_conversations WHERE business_id=$1 AND channel=$2 AND external_id=$3",
      [opts.businessId, opts.channel, opts.externalId],
    );
    if (found.rows[0]) return found.rows[0].id as string;
  }
  const created = await pool.query(
    `INSERT INTO ai_conversations (business_id, channel, source, external_id, customer_name, title)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [opts.businessId, opts.channel, opts.source, opts.externalId ?? null, opts.customerName ?? null, opts.title ?? null],
  );
  return created.rows[0].id as string;
}

export async function appendMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  meta?: { model?: string; latencyMs?: number },
) {
  const pool = db();
  await pool.query(
    "INSERT INTO ai_messages (conversation_id, role, content, model, latency_ms) VALUES ($1,$2,$3,$4,$5)",
    [conversationId, role, content, meta?.model ?? null, meta?.latencyMs ?? null],
  );
  await pool.query("UPDATE ai_conversations SET last_message_at=now() WHERE id=$1", [conversationId]);
}

/** Bir mesajı Claude ile yanıtlar ve konuşmaya kaydeder. */
export async function answerMessage(opts: {
  businessId: string;
  conversationId: string;
  channel: string;
  message: string;
  history?: ClaudeMessage[];
}) {
  const system = await buildSystemPrompt(opts.businessId);
  const started = Date.now();
  const reply = await claudeComplete({
    system: `${system}\n\nBu mesaj ${opts.channel} kanalından geldi.`,
    messages: [...(opts.history ?? []), { role: "user", content: opts.message }],
  });
  const latencyMs = Date.now() - started;
  const text = reply || "Şu an yanıt üretemedim, lütfen tekrar deneyin.";

  await appendMessage(opts.conversationId, "user", opts.message);
  await appendMessage(opts.conversationId, "assistant", text, { model: CLAUDE_MODEL, latencyMs });

  return { reply: text, model: CLAUDE_MODEL, latencyMs };
}

/** WhatsApp Cloud API üzerinden metin mesajı gönderir. */
export async function sendWhatsAppText(to: string, body: string) {
  const token = process.env["WHATSAPP_TOKEN"];
  const phoneId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  if (!token || !phoneId) throw new Error("WHATSAPP_TOKEN veya WHATSAPP_PHONE_NUMBER_ID tanımlı değil.");

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { preview_url: false, body } }),
  });
  if (!res.ok) throw new Error(`WhatsApp gönderimi başarısız: ${res.status} ${await res.text()}`);
}

/** Gelen WhatsApp numarasına göre CRM kaydını oluşturur/günceller. */
export async function upsertCrmFromWhatsApp(businessId: string, phone: string, name: string | null, summary: string) {
  const pool = db();
  const existing = await pool.query("SELECT id FROM crm_customers WHERE business_id=$1 AND phone=$2", [businessId, phone]);
  let customerId = existing.rows[0]?.id as string | undefined;
  if (!customerId) {
    const created = await pool.query(
      `INSERT INTO crm_customers (business_id, name, phone, source_channel, stage, last_contact_at)
       VALUES ($1,$2,$3,'whatsapp','lead',now()) RETURNING id`,
      [businessId, name || phone, phone],
    );
    customerId = created.rows[0].id as string;
  } else {
    await pool.query("UPDATE crm_customers SET last_contact_at=now() WHERE id=$1", [customerId]);
  }
  await pool.query(
    `INSERT INTO crm_activities (business_id, customer_id, kind, channel, summary, by_ai)
     VALUES ($1,$2,'ai_chat','whatsapp',$3,true)`,
    [businessId, customerId, summary.slice(0, 300)],
  );
  return customerId;
}
