import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, Upload, Download, Plus } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import {
  listProducts,
  saveProduct,
  deleteProduct,
  importProducts,
  type Product,
} from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/urunler")({
  component: ProductsPage,
});

const EMPTY = { id: undefined as string | undefined, name: "", description: "", sku: "", price: 0, stock: 0, imageUrl: "", isActive: true };

/** Basit CSV ayrıştırıcı: name,description,sku,price,stock,image_url */
function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { rows: [], errors: ["Dosyada veri satırı yok."] };
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (k: string) => header.indexOf(k);
  const errors: string[] = [];
  const rows: Array<{ name: string; description: string | null; sku: string | null; price: number; stock: number; imageUrl: string | null }> = [];
  lines.slice(1).forEach((line, i) => {
    const cols = line.split(",").map((c) => c.trim());
    const name = cols[idx("name")] ?? "";
    if (!name) {
      errors.push(`${i + 2}. satır: ad boş.`);
      return;
    }
    rows.push({
      name,
      description: cols[idx("description")] || null,
      sku: cols[idx("sku")] || null,
      price: Number(cols[idx("price")] || 0) || 0,
      stock: Number(cols[idx("stock")] || 0) || 0,
      imageUrl: cols[idx("image_url")] || null,
    });
  });
  return { rows, errors };
}

function ProductsPage() {
  const listFn = useServerFn(listProducts);
  const saveFn = useServerFn(saveProduct);
  const delFn = useServerFn(deleteProduct);
  const importFn = useServerFn(importProducts);

  const { data: products = [], refetch } = useQuery({ queryKey: ["products"], queryFn: () => listFn({}) });
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = products.filter((p: Product) =>
    [p.name, p.sku ?? ""].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await saveFn({ data: { ...form, price: Number(form.price), stock: Number(form.stock) } });
      toast.success(form.id ? "Ürün güncellendi." : "Ürün eklendi.");
      setForm(EMPTY);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await delFn({ data: { id } });
    toast.success("Ürün silindi.");
    refetch();
  };

  const onCsv = async (file: File) => {
    const { rows, errors } = parseCsv(await file.text());
    if (errors.length) toast.warning(`${errors.length} satır atlandı.`);
    if (!rows.length) return;
    const res = await importFn({ data: { rows } });
    toast.success(`${res.inserted} ürün eklendi, ${res.updated} ürün güncellendi.`);
    refetch();
  };

  const template = "data:text/csv;charset=utf-8," + encodeURIComponent("name,description,sku,price,stock,image_url\nÖrnek Ürün,Kısa açıklama,SKU-1,199.90,25,https://...\n");

  return (
    <AdminShell
      title="Ürünler"
      description="Yapay zekâ bu listeden fiyat verir, stok kontrol eder ve satış linki gönderir."
      actions={
        <>
          <a href={template} download="urun-sablonu.csv">
            <GhostButton type="button"><Download className="w-3.5 h-3.5" /> CSV şablonu</GhostButton>
          </a>
          <label className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Toplu yükle
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && onCsv(e.target.files[0])} />
          </label>
        </>
      }
    >
      <div className="space-y-6">
        <Card>
          <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
            <Field label="Ürün adı">
              <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="SKU / stok kodu">
              <input className={inputClass} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
            <Field label="Fiyat">
              <input type="number" step="0.01" min={0} className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Stok">
              <input type="number" min={0} className={inputClass} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </Field>
            <Field label="Görsel URL">
              <input className={inputClass} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </Field>
            <Field label="Durum">
              <select className={inputClass} value={form.isActive ? "1" : "0"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "1" })}>
                <option value="1">Aktif</option>
                <option value="0">Pasif</option>
              </select>
            </Field>
            <div className="md:col-span-3">
              <Field label="Açıklama">
                <textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-3 flex gap-3">
              <PrimaryButton type="submit" disabled={busy}>
                <Plus className="w-4 h-4" /> {form.id ? "Güncelle" : "Ürün ekle"}
              </PrimaryButton>
              {form.id && <GhostButton type="button" onClick={() => setForm(EMPTY)}>Vazgeç</GhostButton>}
            </div>
          </form>
        </Card>

        <Card>
          <input className={`${inputClass} mb-4`} placeholder="Ürün ara…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2">Ürün</th>
                  <th>SKU</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Product) => (
                  <tr key={p.id} className="border-t border-border/50">
                    <td className="py-2.5 pr-4">{p.name}</td>
                    <td className="text-muted-foreground">{p.sku ?? "—"}</td>
                    <td>{Number(p.price).toLocaleString("tr-TR")} {p.currency}</td>
                    <td>{p.stock}</td>
                    <td className="text-xs">{p.is_active ? "Aktif" : "Pasif"}</td>
                    <td className="text-right whitespace-nowrap">
                      <button className="p-2 text-muted-foreground hover:text-primary" onClick={() => setForm({ id: p.id, name: p.name, description: p.description ?? "", sku: p.sku ?? "", price: Number(p.price), stock: p.stock, imageUrl: p.image_url ?? "", isActive: p.is_active })}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-destructive" onClick={() => remove(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground text-sm">Henüz ürün yok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
