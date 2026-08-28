import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bot, Send, User } from "lucide-react";
import { Card, Field, inputClass, PrimaryButton } from "@/components/admin/shell";
import { testAiReply } from "@/lib/ai-reply.functions";

type Msg = { role: "user" | "assistant"; content: string; meta?: string };

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "web", label: "Web widget" },
] as const;

const SAMPLES = [
  "Merhaba, fiyat listeniz nedir?",
  "Yarın öğleden sonra randevu var mı?",
  "Bu ürünü almak istiyorum, ödeme linki gönderir misiniz?",
];

export function AiTestConsole() {
  const replyFn = useServerFn(testAiReply);
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["value"]>("whatsapp");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const history = msgs.map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    try {
      const res = await replyFn({ data: { message: text, channel, history } });
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: res.reply, meta: `${res.model} · ${(res.latencyMs / 1000).toFixed(1)} sn` },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Yanıt alınamadı.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-lg">AI yanıt testi</h2>
          <p className="text-sm text-muted-foreground">Claude, panelde girdiğiniz ürün, hizmet ve saat bilgileriyle yanıt verir.</p>
        </div>
        <Field label="Kanal">
          <select className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)}>
            {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/50 p-4 min-h-52 max-h-96 overflow-y-auto space-y-3">
        {!msgs.length && <p className="text-sm text-muted-foreground">Örnek bir mesaj gönderin ve yapay zekânın cevabını görün.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2.5 text-sm ${m.role === "user" ? "" : "flex-row-reverse text-right"}`}>
            <span className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </span>
            <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${m.role === "user" ? "bg-muted" : "bg-primary/10 border border-primary/20"}`}>
              <p className="whitespace-pre-line">{m.content}</p>
              {m.meta && <p className="mt-1 text-[10px] text-muted-foreground">{m.meta}</p>}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs text-muted-foreground">Claude yanıt yazıyor…</p>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-border/60 px-3 py-1.5 text-xs hover:bg-muted transition-colors">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-4 flex gap-3"
      >
        <input className={inputClass} placeholder="Müşteri mesajı yazın…" value={input} onChange={(e) => setInput(e.target.value)} />
        <PrimaryButton type="submit" disabled={busy}><Send className="w-4 h-4" /> Gönder</PrimaryButton>
      </form>
    </Card>
  );
}
