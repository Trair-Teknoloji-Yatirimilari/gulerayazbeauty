import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import { listServices, saveService, deleteService, type Service } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/hizmetler")({
  component: ServicesPage,
});

const EMPTY = {
  id: undefined as string | undefined,
  name: "",
  description: "",
  durationMin: 30,
  price: 0,
  capacity: 1,
  isActive: true,
};

function ServicesPage() {
  const listFn = useServerFn(listServices);
  const saveFn = useServerFn(saveService);
  const delFn = useServerFn(deleteService);
  const { data: services = [], refetch } = useQuery({ queryKey: ["services"], queryFn: () => listFn({}) });
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveFn({ data: form });
      toast.success(form.id ? "Hizmet güncellendi." : "Hizmet eklendi.");
      setForm(EMPTY);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Hizmetler" description="Randevu süresi ve kapasitesi, boş slot hesaplamasında kullanılır.">
      <div className="space-y-6">
        <Card>
          <form onSubmit={submit} className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Field label="Hizmet adı">
                <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
            </div>
            <Field label="Süre (dk)">
              <input type="number" min={5} max={600} className={inputClass} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} />
            </Field>
            <Field label="Fiyat">
              <input type="number" step="0.01" min={0} className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Aynı anda kapasite">
              <input type="number" min={1} max={200} className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </Field>
            <Field label="Durum">
              <select className={inputClass} value={form.isActive ? "1" : "0"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "1" })}>
                <option value="1">Aktif</option>
                <option value="0">Pasif</option>
              </select>
            </Field>
            <div className="md:col-span-4">
              <Field label="Açıklama">
                <textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-4 flex gap-3">
              <PrimaryButton type="submit" disabled={busy}><Plus className="w-4 h-4" /> {form.id ? "Güncelle" : "Hizmet ekle"}</PrimaryButton>
              {form.id && <GhostButton type="button" onClick={() => setForm(EMPTY)}>Vazgeç</GhostButton>}
            </div>
          </form>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2">Hizmet</th><th>Süre</th><th>Fiyat</th><th>Kapasite</th><th>Durum</th><th />
                </tr>
              </thead>
              <tbody>
                {services.map((s: Service) => (
                  <tr key={s.id} className="border-t border-border/50">
                    <td className="py-2.5 pr-4">{s.name}</td>
                    <td>{s.duration_min} dk</td>
                    <td>{Number(s.price).toLocaleString("tr-TR")}</td>
                    <td>{s.capacity}</td>
                    <td className="text-xs">{s.is_active ? "Aktif" : "Pasif"}</td>
                    <td className="text-right whitespace-nowrap">
                      <button className="p-2 text-muted-foreground hover:text-primary" onClick={() => setForm({ id: s.id, name: s.name, description: s.description ?? "", durationMin: s.duration_min, price: Number(s.price), capacity: s.capacity, isActive: s.is_active })}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-destructive" onClick={async () => { await delFn({ data: { id: s.id } }); refetch(); }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!services.length && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Henüz hizmet yok.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
