import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/auth.functions";
import {
  listAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/appointments.functions";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Loader2, LogOut, Trash2, Phone, Mail, Calendar, MessageSquare, ShieldCheck } from "lucide-react";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Randevu Yönetim Paneli | Dr. Gökhan Değirmencioğlu" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Status = "pending" | "confirmed" | "completed" | "cancelled";

const statusStyles: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  completed: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

function AdminPage() {
  const { t } = useT();
  const statusLabels = t.admin.status;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listAppointments);
  const updateFn = useServerFn(updateAppointmentStatus);
  const deleteFn = useServerFn(deleteAppointment);
  const [filter, setFilter] = useState<Status | "all">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => listFn(),
  });

  const updateMut = useMutation({
    mutationFn: (v: { id: string; status: Status }) => updateFn({ data: v }),
    onSuccess: () => {
      toast.success(t.admin.updated);
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : t.admin.errorGeneric),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success(t.admin.deleted);
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : t.admin.errorGeneric),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((a) => a.status === filter);
  }, [data, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 };
    (["pending", "confirmed", "completed", "cancelled"] as Status[]).forEach(
      (s) => (c[s] = data?.filter((a) => a.status === s).length ?? 0),
    );
    return c;
  }, [data]);

  const signOut = async () => {
    await logout();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary">
              {t.admin.backSite}
            </Link>
            <h1 className="font-display text-xl md:text-2xl text-gold-gradient mt-1">
              {t.admin.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/gallery"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              {t.admin.galleryManagement}
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <LogOut className="w-4 h-4" /> {t.admin.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              {f === "all" ? t.admin.filterAll : statusLabels[f]} ({counts[f] ?? 0})
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> {t.admin.loading}
          </div>
        )}

        {error && (
          <div className="p-6 border border-destructive/40 bg-destructive/10 rounded-sm text-sm text-destructive">
            {error instanceof Error ? error.message : t.admin.loadError}
            <div className="mt-3 text-xs text-muted-foreground">
              {t.admin.accessNotice}
            </div>
          </div>
        )}

        {!isLoading && filtered.length === 0 && !error && (
          <div className="text-center py-20 text-muted-foreground">
            {t.admin.empty}
          </div>
        )}

        <div className="grid gap-4">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="bg-card/60 backdrop-blur border border-border/60 rounded-sm p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-lg md:text-xl text-foreground">{a.full_name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(a.created_at).toLocaleString(t.gallery.dateLocale)}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyles[a.status as Status]}`}
                >
                  {statusLabels[a.status as Status]}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <a href={`tel:${a.phone}`} className="flex items-center gap-2 text-foreground/80 hover:text-primary">
                  <Phone className="w-4 h-4 text-primary" /> {a.phone}
                </a>
                {a.email && (
                  <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-foreground/80 hover:text-primary break-all">
                    <Mail className="w-4 h-4 text-primary" /> {a.email}
                  </a>
                )}
                {a.preferred_date && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date(a.preferred_date).toLocaleDateString(t.gallery.dateLocale)}
                  </div>
                )}
                {a.service && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.admin.service}</span>
                    {a.service}
                  </div>
                )}
                <div className="flex items-center gap-2 text-foreground/80">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mr-1">{t.admin.kvkkConsent}</span>
                  {a.consent_given ? (
                    <span className="text-emerald-400 text-xs">{t.admin.consentApproved}</span>
                  ) : (
                    <span className="text-amber-400 text-xs">{t.admin.consentPending}</span>
                  )}
                </div>
              </div>

              {a.message && (
                <div className="mt-4 p-4 bg-background/40 border border-border/40 rounded-sm text-sm text-foreground/75 flex gap-3">
                  <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="whitespace-pre-wrap">{a.message}</p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-border/40">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mr-2">
                  {t.admin.statusLabel}
                </span>
                {(["pending", "confirmed", "completed", "cancelled"] as Status[]).map((s) => (
                  <button
                    key={s}
                    disabled={updateMut.isPending || a.status === s}
                    onClick={() => updateMut.mutate({ id: a.id, status: s })}
                    className={`text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      a.status === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (confirm(t.admin.deleteConfirm)) {
                      deleteMut.mutate(a.id);
                    }
                  }}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t.admin.delete}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
