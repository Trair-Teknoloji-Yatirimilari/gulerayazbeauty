import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AdminShell, Card } from "@/components/admin/shell";
import { getOverview } from "@/lib/business.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: OverviewPage,
});

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

function OverviewPage() {
  const fn = useServerFn(getOverview);
  const { data, isLoading } = useQuery({ queryKey: ["overview"], queryFn: () => fn({}) });

  return (
    <AdminShell title="Genel bakış" description="Yapay zekânızın ne kadar hazır olduğunu buradan takip edin.">
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Yükleniyor…</p>
      ) : (
        <div className="space-y-8">
          <Card className="bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">AI hazırlık skoru</p>
                <p className="font-display text-4xl mt-2">%{data.readiness}</p>
              </div>
              <div className="w-full sm:w-64 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${data.readiness}%` }} />
              </div>
            </div>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              {[
                [data.products > 0, "Ürün ekleyin", "/admin/urunler"],
                [data.services > 0, "Hizmet ekleyin", "/admin/hizmetler"],
                [data.knowledge >= 3, "En az 3 bilgi/SSS girin", "/admin/ai"],
                [data.hoursSet > 0, "Çalışma saatlerini tanımlayın", "/admin/saatler"],
                [data.channelsConnected > 0, "Bir kanal bağlayın", "/admin/kanallar"],
              ].map(([done, label, to]) => (
                <li key={String(label)}>
                  <Link to={to as string} className="hover:text-primary">
                    {done ? "✓" : "○"} {label as string}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Ürün" value={data.products} />
            <Stat label="Hizmet" value={data.services} />
            <Stat label="Yaklaşan rezervasyon" value={data.bookingsUpcoming} />
            <Stat label="Bekleyen sipariş" value={data.ordersOpen} />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
