// Anthropic (Claude) Messages API istemcisi — sadece sunucu tarafı.
export type ClaudeMessage = { role: "user" | "assistant"; content: string };

export const CLAUDE_MODEL = process.env["ANTHROPIC_MODEL"] || "claude-sonnet-4-5";

export async function claudeComplete(opts: {
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY tanımlı değil. Sunucu ortam değişkenlerine ekleyin.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: opts.maxTokens ?? 700,
      temperature: opts.temperature ?? 0.4,
      system: opts.system,
      messages: opts.messages,
    }),
  });

  const json = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    const msg = json.error?.message || `Claude hatası (${res.status})`;
    if (res.status === 401) throw new Error("Claude API anahtarı geçersiz.");
    if (res.status === 429) throw new Error("Claude hız limiti aşıldı, birazdan tekrar deneyin.");
    throw new Error(msg);
  }

  return (json.content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text!.trim())
    .join("\n")
    .trim();
}
