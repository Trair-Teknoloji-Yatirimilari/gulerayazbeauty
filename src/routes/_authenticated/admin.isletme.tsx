import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Field, inputClass, PrimaryButton } from "@/components/admin/shell";
import { getBusiness, updateBusiness } from "@/lib/business.functions";

export const Route = createFileRoute("/_authenticated/admin/isletme")({
  component: BusinessPage,
});

function BusinessPage() {
  const getFn = useServerFn(getBusiness);
  const saveFn = useServerFn(updateBusiness);
  const { data, refetch } = useQuery({ queryKey: ["business"], queryFn: () => getFn({}) });

  const [form, setForm] = useState({
    name: "",
    sector: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    currency: "TRY",
    timezone: "Europe/Istanbul",
    locale: "tr",
    slotMinutes: 30,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.name ?? "",
      sector: data.sector ?? "",
      description: data.description ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      address: data.address ?? "",
      currency: data.currency ?? "TRY",
      timezone: data.timezone ?? "Europe/Istanbul",
      locale: data.locale ?? "tr",
      slotMinutes: data.slot_minutes ?? 30,
    });
  }, [data]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFn({ data: form });
      toast.success("İşletme bilgileri kaydedildi.");
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="İşletme profili" description="Bu bilgiler yapay zekânın kendini tanıtırken kullandığı temeldir.">
      <form onSubmit={submit} className="space-y-6">
        <Card className="grid md:grid-cols-2 gap-5">
          <Field label="İşletme adı">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Sektör">
            <input className={inputClass} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Güzellik, restoran, klinik…" />
          </Field>
          <Field label="Telefon">
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="E-posta">
            <input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Adres">
              <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="İşletme tanıtımı">
              <textarea className={`${inputClass} min-h-28`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="AI bu metni müşterilere işletmenizi anlatırken kullanır." />
            </Field>
          </div>
        </Card>

        <Card className="grid md:grid-cols-4 gap-5">
          <Field label="Para birimi">
            <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
          <Field label="Zaman dilimi">
            <input className={inputClass} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </Field>
          <Field label="Varsayılan dil">
            <select className={inputClass} value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })}>
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="Slot aralığı (dk)">
            <input type="number" min={5} max={240} className={inputClass} value={form.slotMinutes} onChange={(e) => setForm({ ...form, slotMinutes: Number(e.target.value) })} />
          </Field>
        </Card>

        <PrimaryButton type="submit" disabled={saving}>Kaydet</PrimaryButton>
      </form>
    </AdminShell>
  );
}
