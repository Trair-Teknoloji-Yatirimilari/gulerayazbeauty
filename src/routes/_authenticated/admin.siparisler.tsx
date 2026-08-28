import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Link2 } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import { listOrders, createPaymentLink, setOrderStatus, type OrderRow } from "@/lib/commerce.functions";
import { listProducts, type Product } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/siparisler")({
  component: OrdersPage,
});

const STATUS: Record<OrderRow["status"], string> = {
  draft: "Taslak",
  sent: "Link gönderildi",
  paid: "Ödendi",
  cancelled: "İptal",
};

function OrdersPage() {
  const listFn = useServerFn(listOrders);
  const productsFn = useServerFn(listProducts);
  const linkFn = useServerFn(createPaymentLink);
  const statusFn = useServerFn(setOrderStatus);

  const { data: orders = [], refetch } = useQuery({ queryKey: ["orders"], queryFn: () => listFn({}) });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => productsFn({}) });

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [customer, setCustomer] = useState("");
  const [lastLink, setLastLink] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    try {
      const res = await linkFn({ data: { items: [{ productId, qty: Number(qty) }], customerName: customer || null } });
      setLastLink(`${origin}${res.path}`);
      toast.success("Ödeme linki oluşturuldu.");
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Oluşturulamadı.");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı.");
  };

  return (
    <AdminShell title="Siparişler & ödeme linkleri" description="AI müşteriye bu linki gönderir; müşteri ödeme ekranında bilgilerini girer.">
      <div className="space-y-6">
        <Card>
          <form onSubmit={create} className="grid md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Field label="Ürün">
                <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)} required>
                  <option value="">Seçiniz</option>
                  {products.map((p: Product) => (
                    <option key={p.id} value={p.id}>{p.name} — {Number(p.price).toLocaleString("tr-TR")} {p.currency}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Adet">
              <input type="number" min={1} className={inputClass} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </Field>
            <Field label="Müşteri (opsiyonel)">
              <input className={inputClass} value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </Field>
            <div className="md:col-span-4">
              <PrimaryButton type="submit"><Link2 className="w-4 h-4" /> Ödeme linki oluştur</PrimaryButton>
            </div>
          </form>
          {lastLink && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-sm">
              <span className="truncate">{lastLink}</span>
              <GhostButton onClick={() => copy(lastLink)}><Copy className="w-3.5 h-3.5" /> Kopyala</GhostButton>
            </div>
          )}
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2">Tarih</th><th>Müşteri</th><th>Tutar</th><th>Ödeme</th><th>Durum</th><th>Link</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: OrderRow) => (
                  <tr key={o.id} className="border-t border-border/50">
                    <td className="py-2.5 pr-4">{new Date(o.created_at).toLocaleDateString("tr-TR")}</td>
                    <td>{o.customer_name ?? "—"}<div className="text-xs text-muted-foreground">{o.customer_phone}</div></td>
                    <td>{Number(o.total).toLocaleString("tr-TR")} {o.currency}</td>
                    <td className="text-xs">{o.payment_status}</td>
                    <td>
                      <select
                        className="bg-transparent border border-border/60 rounded-lg px-2 py-1 text-xs"
                        value={o.status}
                        onChange={async (e) => {
                          await statusFn({ data: { id: o.id, status: e.target.value as OrderRow["status"] } });
                          refetch();
                        }}
                      >
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td>
                      <GhostButton onClick={() => copy(`${origin}/pay/${o.token}`)}><Copy className="w-3.5 h-3.5" /> Kopyala</GhostButton>
                    </td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Henüz sipariş yok.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
