import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import { getAiSettings, updateAiSettings } from "@/lib/business.functions";
import { listKnowledge, saveKnowledge, deleteKnowledge, type KnowledgeItem } from "@/lib/knowledge.functions";

export const Route = createFileRoute("/_authenticated/admin/ai")({
  component: AiPage,
});

const TYPE_LABEL: Record<KnowledgeItem["type"], string> = {
  faq: "Sık sorulan soru",
  note: "Kampanya / not",
  rule: "Kural (yapma)",
  doc: "Doküman",
};

function AiPage() {
  const getFn = useServerFn(getAiSettings);
  const saveFn = useServerFn(updateAiSettings);
  const listFn = useServerFn(listKnowledge);
  const saveKFn = useServerFn(saveKnowledge);
  const delKFn = useServerFn(deleteKnowledge);

  const { data: settings } = useQuery({ queryKey: ["ai-settings"], queryFn: () => getFn({}) });
  const { data: items = [], refetch } = useQuery({ queryKey: ["knowledge"], queryFn: () => listFn({}) });

  const [form, setForm] = useState({ tone: "friendly", language: "tr", greeting: "", fallbackMessage: "", handoffRules: "" });
  const [entry, setEntry] = useState({ type: "faq" as KnowledgeItem["type"], question: "", answer: "" });

  useEffect(() => {
    if (!settings) return;
    setForm({
      tone: settings.tone ?? "friendly",
      language: settings.language ?? "tr",
      greeting: settings.greeting ?? "",
      fallbackMessage: settings.fallback_message ?? "",
      handoffRules: settings.handoff_rules ?? "",
    });
  }, [settings]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveFn({ data: { ...form, tone: form.tone as "formal" | "friendly" | "energetic", language: form.language as "tr" | "en" } });
      toast.success("AI ayarları kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    }
  };

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveKFn({ data: { type: entry.type, question: entry.question || null, answer: entry.answer } });
      setEntry({ type: entry.type, question: "", answer: "" });
      refetch();
      toast.success("Bilgi eklendi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Eklenemedi.");
    }
  };

  return (
    <AdminShell title="AI eğitimi" description="Yapay zekânın nasıl konuşacağını ve neleri bileceğini burada belirlersiniz.">
      <div className="space-y-6">
        <Card>
          <form onSubmit={saveSettings} className="grid md:grid-cols-2 gap-5">
            <Field label="Ton">
              <select className={inputClass} value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                <option value="formal">Resmî</option>
                <option value="friendly">Samimi</option>
                <option value="energetic">Enerjik</option>
              </select>
            </Field>
            <Field label="Konuşma dili">
              <select className={inputClass} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Karşılama mesajı">
                <textarea className={`${inputClass} min-h-20`} value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Bilinmeyen soruda verilecek cevap">
                <textarea className={`${inputClass} min-h-20`} value={form.fallbackMessage} onChange={(e) => setForm({ ...form, fallbackMessage: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="İnsana devretme kuralları">
                <textarea className={`${inputClass} min-h-20`} value={form.handoffRules} onChange={(e) => setForm({ ...form, handoffRules: e.target.value })} placeholder="Örn. şikâyet, iade veya fiyat pazarlığı konularında insana devret." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <PrimaryButton type="submit">Kaydet</PrimaryButton>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Bilgi tabanı</h2>
          <form onSubmit={addEntry} className="grid md:grid-cols-4 gap-4 items-end">
            <Field label="Tür">
              <select className={inputClass} value={entry.type} onChange={(e) => setEntry({ ...entry, type: e.target.value as KnowledgeItem["type"] })}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <div className="md:col-span-3">
              <Field label="Soru / başlık">
                <input className={inputClass} value={entry.question} onChange={(e) => setEntry({ ...entry, question: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-4">
              <Field label="Cevap / içerik">
                <textarea required className={`${inputClass} min-h-24`} value={entry.answer} onChange={(e) => setEntry({ ...entry, answer: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-4">
              <PrimaryButton type="submit"><Plus className="w-4 h-4" /> Ekle</PrimaryButton>
            </div>
          </form>

          <ul className="mt-6 divide-y divide-border/50">
            {items.map((k: KnowledgeItem) => (
              <li key={k.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{TYPE_LABEL[k.type]}</p>
                  {k.question && <p className="text-sm font-medium mt-1">{k.question}</p>}
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{k.answer}</p>
                </div>
                <GhostButton onClick={async () => { await delKFn({ data: { id: k.id } }); refetch(); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </GhostButton>
              </li>
            ))}
            {!items.length && <li className="py-4 text-sm text-muted-foreground">Henüz bilgi eklenmedi.</li>}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
