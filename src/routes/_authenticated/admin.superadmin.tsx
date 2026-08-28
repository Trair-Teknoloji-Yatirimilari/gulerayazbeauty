import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AdminShell, Card } from "@/components/admin/shell";
import { listBusinesses } from "@/lib/business.functions";
import { listPartnerApplications, setApplicationStatus, type PartnerApplication } from "@/lib/partner.functions";

export const Route = createFileRoute("/_authenticated/admin/superadmin")({
  component: SuperAdminPage,
});

const APP_STATUS = { new: "Yeni", contacted: "İletişime geçildi", approved: "Onaylandı", rejected: "Reddedildi" } as const;

function SuperAdminPage() {
  const bizFn = useServerFn(listBusinesses);
  const appsFn = useServerFn(listPartnerApplications);
  const statusFn = useServerFn(setApplicationStatus);

  const { data: businesses = [] } = useQuery({ queryKey: ["all-businesses"], queryFn: () => bizFn({}) });
  const { data: apps = [], refetch } = useQuery({ queryKey: ["partner-apps"], queryFn: () => appsFn({}) });

  return (
    <AdminShell title="Süper admin" description="Tüm işletmeler ve partner başvuruları.">
      <div className="space-y-6">
        <Card>
          <h2 className="font-display text-lg mb-4">İşletmeler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="py-2">İşletme</th><th>Sektör</th><th>Plan</th><th>Durum</th><th>Ürün</th><th>Rezervasyon</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b.id} className="border-t border-border/50">
                    <td className="py-2.5 pr-4">{b.name}</td>
                    <td>{b.sector ?? "—"}</td>
                    <td>{b.plan}</td>
                    <td>{b.status}</td>
                    <td>{b.products}</td>
                    <td>{b.bookings}</td>
                  </tr>
                ))}
                {!businesses.length && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Kayıt yok.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Partner başvuruları</h2>
          <ul className="divide-y divide-border/50">
            {apps.map((a: PartnerApplication) => (
              <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{a.company} — {a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.email} · {a.phone ?? "—"} · {a.sector ?? "—"}</p>
                  {a.message && <p className="text-sm text-muted-foreground mt-1">{a.message}</p>}
                </div>
                <select
                  className="bg-transparent border border-border/60 rounded-lg px-2 py-1 text-xs"
                  value={a.status}
                  onChange={async (e) => {
                    await statusFn({ data: { id: a.id, status: e.target.value as keyof typeof APP_STATUS } });
                    refetch();
                  }}
                >
                  {Object.entries(APP_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </li>
            ))}
            {!apps.length && <li className="py-4 text-sm text-muted-foreground">Başvuru yok.</li>}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
