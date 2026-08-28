import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { getPublicOrder, submitCheckout, type PublicOrder } from "@/lib/commerce.functions";
import { createOrderCheckout } from "@/lib/billing.functions";

export const Route = createFileRoute("/pay/$token")({
  head: () => ({
    meta: [
      { title: "Güvenli Ödeme | TrairX Connect" },
      { name: "description", content: "TrairX Connect üzerinden oluşturulan siparişiniz için güvenli ödeme sayfası." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Güvenli Ödeme | TrairX Connect" },
      { property: "og:description", content: "Siparişinizi güvenle tamamlayın." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PayPage,
});

const input =
  "w-full bg-background/70 border border-border/60 focus:border-primary/70 rounded-xl px-4 py-3 text-sm outline-none transition-colors";

function PayPage() {
  const { token } = Route.useParams();
  const orderFn = useServerFn(getPublicOrder);
  const submitFn = useServerFn(submitCheckout);

  const { data: order, isLoading } = useQuery({
    queryKey: ["public-order", token],
    queryFn: () => orderFn({ data: { token } }),
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitFn({ data: { token, ...form } });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gönderilemedi.");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return <main className="min-h-screen grid place-items-center text-sm text-muted-foreground">Sipariş yükleniyor…</main>;
  }

  if (!order) {
    return (
      <main className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl">Sipariş bulunamadı</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ödeme bağlantısı geçersiz veya süresi dolmuş olabilir.</p>
        </div>
      </main>
    );
  }

  const o = order as PublicOrder;

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{o.business}</p>
        <h1 className="font-display text-3xl md:text-4xl mt-2">Güvenli ödeme</h1>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg mb-4">Sipariş özeti</h2>
            <ul className="divide-y divide-border/50">
              {o.items.map((it, i) => (
                <li key={i} className="flex justify-between py-2.5 text-sm">
                  <span>{it.name} × {it.qty}</span>
                  <span>{(Number(it.unit_price) * it.qty).toLocaleString("tr-TR")} {o.currency}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4 mt-2 border-t border-border/60 font-medium">
              <span>Toplam</span>
              <span>{Number(o.total).toLocaleString("tr-TR")} {o.currency}</span>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" /> Bilgileriniz şifreli bağlantı ile iletilir.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6">
            {done || o.payment_status === "paid" ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                <h2 className="font-display text-xl mt-4">Siparişiniz alındı</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  İşletme ödeme onayı için sizinle iletişime geçecek.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-display text-lg">Teslimat & iletişim</h2>
                <input className={input} required placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className={input} required placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className={input} type="email" placeholder="E-posta (opsiyonel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <textarea className={`${input} min-h-24`} placeholder="Adres (opsiyonel)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  <Lock className="w-4 h-4" /> Siparişi tamamla
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await submitFn({ data: { token, ...form } });
                      const { url } = await stripeFn({ data: { token } });
                      if (url) window.location.href = url;
                      else toast.error("Ödeme sayfası açılamadı.");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Ödeme başlatılamadı.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/70 px-6 py-3 text-sm font-medium hover:bg-muted disabled:opacity-60 transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Kart ile öde (USD)
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Kart ödemeleri Stripe altyapısı ile güvenle alınır; tutarlar USD olarak tahsil edilir.
                </p>

              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
