import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Bot, Phone, StickyNote, CalendarDays, ShoppingCart, ArrowRightLeft } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import {
  crmStats,
  listCustomers,
  getCustomer,
  saveCustomer,
  setStage,
  addActivity,
  deleteCustomer,
  type CrmCustomer,
  type CrmActivity,
} from "@/lib/crm.functions";

export const Route = createFileRoute("/_authenticated/admin/crm")({
  component: CrmPage,
});

const STAGES = [
  { key: "lead", label: "Yeni aday" },
  { key: "contacted", label: "İletişimde" },
  { key: "qualified", label: "Fırsat" },
  { key: "won", label: "Kazanıldı" },
  { key: "lost", label: "Kaybedildi" },
] as const;

const STAGE_LABEL: Record<string, string> = Object.fromEntries(STAGES.map((s) => [s.key, s.label]));

const KIND_LABEL: Record<CrmActivity["kind"], string> = {
  ai_chat: "AI sohbeti",
  note: "Not",
  call: "Arama",
  booking: "Rezervasyon",
  order: "Sipariş",
  handoff: "İnsana devir",
};

const KIND_ICON: Record<CrmActivity["kind"], typeof Bot> = {
  ai_chat: Bot,
  note: StickyNote,
  call: Phone,
  booking: CalendarDays,
  order: ShoppingCart,
  handoff: ArrowRightLeft,
};

function money(v: number, currency = "USD") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 0 }).format(v || 0);
}

function CrmPage() {
  const statsFn = useServerFn(crmStats);
  const listFn = useServerFn(listCustomers);
  const detailFn = useServerFn(getCustomer);
  const saveFn = useServerFn(saveCustomer);
  const stageFn = useServerFn(setStage);
  const activityFn = useServerFn(addActivity);
  const deleteFn = useServerFn(deleteCustomer);

  const [q, setQ] = useState("");
  const [stage, setStageFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", sourceChannel: "whatsapp", stage: "lead" });
  const [note, setNote] = useState({ kind: "note" as CrmActivity["kind"], summary: "", detail: "" });

  const { data: stats } = useQuery({ queryKey: ["crm-stats"], queryFn: () => statsFn({}) });
  const { data: customers = [], refetch } = useQuery({
    queryKey: ["crm-customers", q, stage],
    queryFn: () => listFn({ data: { q, stage } }),
  });
  const { data: detail, refetch: refetchDetail } = useQuery({
    queryKey: ["crm-customer", selected],
    queryFn: () => detailFn({ data: { id: selected as string } }),
    enabled: !!selected,
  });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveFn({
        data: {
          name: form.name,
          phone: form.phone || null,
          email: form.email || null,
          sourceChannel: form.sourceChannel,
          stage: form.stage as "lead",
        },
      });
      setForm({ name: "", phone: "", email: "", sourceChannel: form.sourceChannel, stage: "lead" });
      setSelected(res.id);
      refetch();
      toast.success("Müşteri kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    }
  };

  const changeStage = async (id: string, value: string) => {
    await stageFn({ data: { id, stage: value as "lead" } });
    refetch();
    if (selected === id) refetchDetail();
  };

  const logActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await activityFn({
        data: { customerId: selected, kind: note.kind, summary: note.summary, detail: note.detail || null },
      });
      setNote({ kind: note.kind, summary: "", detail: "" });
      refetchDetail();
      refetch();
      toast.success("Etkileşim eklendi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Eklenemedi.");
    }
  };

  return (
    <AdminShell title="CRM" description="AI'nın yanıtladığı müşteriler, satışlar ve rezervasyonlar tek ekranda.">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Toplam müşteri", value: String(stats?.total ?? 0) },
            { label: "Açık adaylar", value: String(stats?.open_leads ?? 0) },
            { label: "Kazanılan", value: String(stats?.won ?? 0) },
            { label: "Son 30 gün", value: String(stats?.new_30d ?? 0) },
            { label: "Tahsil edilen", value: money(stats?.revenue ?? 0) },
          ].map((s) => (
            <Card key={s.label}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <form onSubmit={create} className="grid md:grid-cols-6 gap-4 items-end">
            <Field label="Ad soyad">
              <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="E-posta">
              <input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Kanal">
              <select className={inputClass} value={form.sourceChannel} onChange={(e) => setForm({ ...form, sourceChannel: e.target.value })}>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="website">Web sitesi</option>
                <option value="manual">Manuel</option>
              </select>
            </Field>
            <Field label="Aşama">
              <select className={inputClass} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </Field>
            <PrimaryButton type="submit"><Plus className="w-4 h-4" /> Ekle</PrimaryButton>
          </form>
        </Card>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <Card>
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <input
                className={`${inputClass} max-w-xs`}
                placeholder="İsim, telefon veya e-posta ara"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select className={`${inputClass} max-w-[180px]`} value={stage} onChange={(e) => setStageFilter(e.target.value)}>
                <option value="all">Tüm aşamalar</option>
                {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>

            <ul className="divide-y divide-border/50">
              {customers.map((c: CrmCustomer) => (
                <li
                  key={c.id}
                  className={`py-3 flex items-start justify-between gap-3 cursor-pointer ${selected === c.id ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                  onClick={() => setSelected(c.id)}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[c.phone, c.email, c.source_channel].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {c.bookings_count} rezervasyon · {c.orders_count} sipariş · {money(c.total_spent)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`${inputClass} py-1 text-xs w-[140px]`}
                      value={c.stage}
                      onChange={(e) => changeStage(c.id, e.target.value)}
                    >
                      {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    <GhostButton
                      onClick={async () => {
                        await deleteFn({ data: { id: c.id } });
                        if (selected === c.id) setSelected(null);
                        refetch();
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </GhostButton>
                  </div>
                </li>
              ))}
              {!customers.length && <li className="py-4 text-sm text-muted-foreground">Henüz müşteri kaydı yok.</li>}
            </ul>
          </Card>

          <Card>
            {!detail && <p className="text-sm text-muted-foreground">Detay için soldan bir müşteri seçin.</p>}
            {detail && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-lg">{detail.customer.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {STAGE_LABEL[detail.customer.stage]} · {detail.customer.source_channel ?? "—"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border/50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Rezervasyon</p>
                    <p className="mt-1 font-semibold">{detail.customer.bookings_count}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Satış</p>
                    <p className="mt-1 font-semibold">{money(detail.customer.total_spent)}</p>
                  </div>
                </div>

                <form onSubmit={logActivity} className="space-y-3">
                  <Field label="Etkileşim türü">
                    <select className={inputClass} value={note.kind} onChange={(e) => setNote({ ...note, kind: e.target.value as CrmActivity["kind"] })}>
                      {Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label="Özet">
                    <input required className={inputClass} value={note.summary} onChange={(e) => setNote({ ...note, summary: e.target.value })} />
                  </Field>
                  <Field label="Detay">
                    <textarea className={`${inputClass} min-h-20`} value={note.detail} onChange={(e) => setNote({ ...note, detail: e.target.value })} />
                  </Field>
                  <PrimaryButton type="submit"><Plus className="w-4 h-4" /> Kaydet</PrimaryButton>
                </form>

                <div>
                  <h3 className="text-sm font-medium mb-2">Zaman çizelgesi</h3>
                  <ul className="space-y-3">
                    {detail.activities.map((a) => {
                      const Icon = KIND_ICON[a.kind];
                      return (
                        <li key={a.id} className="flex gap-3">
                          <span className="mt-0.5 rounded-full border border-border/60 p-1.5 h-fit">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm">
                              {a.summary}
                              {a.by_ai && <span className="ml-2 text-[10px] uppercase tracking-widest text-primary">AI</span>}
                            </p>
                            {a.detail && <p className="text-xs text-muted-foreground whitespace-pre-line">{a.detail}</p>}
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {KIND_LABEL[a.kind]} · {new Date(a.created_at).toLocaleString("tr-TR")}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                    {!detail.activities.length && <li className="text-sm text-muted-foreground">Henüz etkileşim yok.</li>}
                  </ul>
                </div>

                {!!detail.bookings.length && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Rezervasyonlar</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {detail.bookings.map((b) => (
                        <li key={b.id}>
                          {new Date(b.starts_at).toLocaleString("tr-TR")} · {b.service ?? "—"} · {b.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!!detail.orders.length && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Siparişler</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {detail.orders.map((o) => (
                        <li key={o.id}>
                          {new Date(o.created_at).toLocaleDateString("tr-TR")} · {money(o.total, o.currency)} · {o.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
