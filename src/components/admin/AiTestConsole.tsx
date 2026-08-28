import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bot, History, MessageCircle, Plus, Send, Sparkles, User } from "lucide-react";
import { Card, Field, inputClass, PrimaryButton } from "@/components/admin/shell";
import { testAiReply, listAiConversations, getAiConversation } from "@/lib/ai-reply.functions";

type Msg = { role: "user" | "assistant"; content: string; meta?: string };
type Conversation = {
  id: string;
  channel: string;
  source: string;
  title: string | null;
  customer_name: string | null;
  external_id: string | null;
  last_message_at: string;
  message_count: number;
};

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "web", label: "Web widget" },
] as const;

const SCENARIOS = [
  { label: "Fiyat sorgusu", steps: ["Merhaba, fiyat listeniz nedir?", "En uygun paket hangisi olur?"] },
  { label: "Randevu talebi", steps: ["Yarın öğleden sonra randevu var mı?", "14:00 uygun, adıma yazabilir misiniz?"] },
  { label: "Satış & ödeme", steps: ["Bu ürünü almak istiyorum.", "Ödeme linkini gönderir misiniz?"] },
  { label: "Teknik destek", steps: ["Ürünü kullanırken sorun yaşıyorum.", "Yetkiliye bağlanabilir miyim?"] },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AiTestConsole() {
  const replyFn = useServerFn(testAiReply);
  const listFn = useServerFn(listAiConversations);
  const loadFn = useServerFn(getAiConversation);

  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["value"]>("whatsapp");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<Conversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshHistory = async () => {
    try {
      setHistory((await listFn()) as Conversation[]);
    } catch {
      /* geçmiş yüklenemedi */
    }
  };

  useEffect(() => {
    void refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = async (text: string): Promise<boolean> => {
    if (!text.trim() || busy) return false;
    const priorHistory = msgs.map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    setTyping(true);
    try {
      const res = await replyFn({ data: { message: text, channel, conversationId, history: priorHistory } });
      setConversationId(res.conversationId);
      setTyping(false);
      // Sinematik yazım efekti — gerçek Claude yanıtı kelime kelime akar.
      const words = res.reply.split(" ");
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      for (let i = 0; i < words.length; i++) {
        const partial = words.slice(0, i + 1).join(" ");
        setMsgs((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "assistant", content: partial };
          return next;
        });
        await sleep(18);
      }
      setMsgs((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "assistant",
          content: res.reply,
          meta: `${res.model} · ${(res.latencyMs / 1000).toFixed(1)} sn`,
        };
        return next;
      });
      void refreshHistory();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yanıt alınamadı.");
      return false;
    } finally {
      setTyping(false);
      setBusy(false);
    }
  };

  const runScenario = async (steps: string[]) => {
    if (busy) return;
    newChat();
    await sleep(120);
    for (const step of steps) {
      const ok = await send(step);
      if (!ok) break;
      await sleep(700);
    }
  };

  const newChat = () => {
    setMsgs([]);
    setConversationId(null);
  };

  const openConversation = async (id: string) => {
    try {
      const res = await loadFn({ data: { id } });
      setConversationId(res.conversation.id);
      setChannel((res.conversation.channel as typeof channel) ?? "whatsapp");
      setMsgs(
        res.messages.map((m) => ({
          role: m.role,
          content: m.content,
          meta: m.model ? `${m.model}${m.latency_ms ? ` · ${(m.latency_ms / 1000).toFixed(1)} sn` : ""}` : undefined,
        })),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Konuşma açılamadı.");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-lg">AI yanıt testi</h2>
            <p className="text-sm text-muted-foreground">
              Claude, panelde girdiğiniz ürün, hizmet ve saat bilgileriyle gerçek mesaj akışını simüle eder.
            </p>
          </div>
          <div className="flex items-end gap-2">
            <Field label="Kanal">
              <select className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)}>
                {CHANNELS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={newChat}
              className="mb-0.5 inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-2 text-xs transition-colors hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" /> Yeni sohbet
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="max-h-96 min-h-52 space-y-3 overflow-y-auto rounded-2xl border border-border/60 bg-background/50 p-4">
          {!msgs.length && (
            <p className="text-sm text-muted-foreground">
              Bir senaryo seçin ya da mesaj yazın; yapay zekânın gerçek yanıtını canlı akışla görün.
            </p>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2.5 text-sm ${m.role === "user" ? "" : "flex-row-reverse text-right"}`}>
              <span className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </span>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.role === "user" ? "bg-muted" : "border border-primary/20 bg-primary/10"}`}>
                <p className="whitespace-pre-line">{m.content}</p>
                {m.meta && <p className="mt-1 text-[10px] text-muted-foreground">{m.meta}</p>}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex flex-row-reverse gap-2.5">
              <span className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5"><Bot className="h-3.5 w-3.5" /></span>
              <div className="flex items-center gap-1 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={busy}
              onClick={() => void runScenario(s.steps)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3" /> {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="mt-4 flex gap-3">
          <input className={inputClass} placeholder="Müşteri mesajı yazın…" value={input} onChange={(e) => setInput(e.target.value)} />
          <PrimaryButton type="submit" disabled={busy}><Send className="h-4 w-4" /> Gönder</PrimaryButton>
        </form>
      </Card>

      <Card className="h-fit">
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm">Yanıt geçmişi</h3>
        </div>
        {!history.length && <p className="text-xs text-muted-foreground">Henüz kayıtlı konuşma yok.</p>}
        <div className="space-y-2">
          {history.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => void openConversation(c.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition-colors hover:bg-muted ${
                conversationId === c.id ? "border-primary/40 bg-primary/5" : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  {c.channel === "whatsapp" && <MessageCircle className="h-3 w-3 text-[#25D366]" />}
                  {c.customer_name || c.external_id || c.channel}
                </span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {c.source === "live" ? "canlı" : "test"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-muted-foreground">{c.title ?? "—"}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {new Date(c.last_message_at).toLocaleString("tr-TR")} · {c.message_count} mesaj
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
