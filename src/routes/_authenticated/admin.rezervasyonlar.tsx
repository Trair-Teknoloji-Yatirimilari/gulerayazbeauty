import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Field, inputClass, PrimaryButton } from "@/components/admin/shell";
import { listBookings, saveBooking, setBookingStatus, type Booking } from "@/lib/scheduling.functions";
import { listServices, type Service } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/rezervasyonlar")({
  component: BookingsPage,
});

const STATUS: Record<Booking["status"], string> = {
  pending: "Bekliyor",
  confirmed: "Onaylı",
  cancelled: "İptal",
  completed: "Tamamlandı",
};

function BookingsPage() {
  const listFn = useServerFn(listBookings);
  const saveFn = useServerFn(saveBooking);
  const statusFn = useServerFn(setBookingStatus);
  const servicesFn = useServerFn(listServices);

  const { data: bookings = [], refetch } = useQuery({ queryKey: ["bookings"], queryFn: () => listFn({}) });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => servicesFn({}) });

  const [form, setForm] = useState({ serviceId: "", customerName: "", phone: "", startsAt: "", durationMin: 30, notes: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveFn({
        data: {
          serviceId: form.serviceId || null,
          customerName: form.customerName,
          phone: form.phone || null,
          startsAt: new Date(form.startsAt).toISOString(),
          durationMin: Number(form.durationMin),
          notes: form.notes || null,
        },
      });
      toast.success("Rezervasyon oluşturuldu.");
      setForm({ serviceId: "", customerName: "", phone: "", startsAt: "", durationMin: 30, notes: "" });
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Rezervasyonlar" description="Panelden veya AI üzerinden gelen tüm randevular.">
      <div className="space-y-6">
        <Card>
          <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
            <Field label="Müşteri adı">
              <input className={inputClass} required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Hizmet">
              <select className={inputClass} value={form.serviceId} onChange={(e) => {
                const svc = services.find((s: Service) => s.id === e.target.value);
                setForm({ ...form, serviceId: e.target.value, durationMin: svc?.duration_min ?? form.durationMin });
              }}>
                <option value="">Seçiniz</option>
                {services.map((s: Service) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Başlangıç">
              <input type="datetime-local" required className={inputClass} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
            </Field>
            <Field label="Süre (dk)">
              <input type="number" min={5} className={inputClass} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} />
            </Field>
            <Field label="Not">
              <input className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            <div className="md:col-span-3">
              <PrimaryButton type="submit" disabled={busy}>Rezervasyon ekle</PrimaryButton>
            </div>
          </form>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2">Tarih</th><th>Müşteri</th><th>Hizmet</th><th>Kanal</th><th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: Booking) => (
                  <tr key={b.id} className="border-t border-border/50">
                    <td className="py-2.5 pr-4">{new Date(b.starts_at).toLocaleString("tr-TR")}</td>
                    <td>{b.customer_name}<div className="text-xs text-muted-foreground">{b.phone}</div></td>
                    <td>{b.service_name ?? "—"}</td>
                    <td className="text-xs text-muted-foreground">{b.source_channel ?? "—"}</td>
                    <td>
                      <select
                        className="bg-transparent border border-border/60 rounded-lg px-2 py-1 text-xs"
                        value={b.status}
                        onChange={async (e) => {
                          await statusFn({ data: { id: b.id, status: e.target.value as Booking["status"] } });
                          refetch();
                        }}
                      >
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!bookings.length && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Henüz rezervasyon yok.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
