import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { logout, getAdminSession } from "@/lib/auth.functions";
import {
  LayoutDashboard,
  Building2,
  Package,
  Sparkles,
  Clock,
  CalendarDays,
  ShoppingCart,
  Brain,
  Share2,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Genel bakış", icon: LayoutDashboard, exact: true },
  { to: "/admin/isletme", label: "İşletme profili", icon: Building2 },
  { to: "/admin/urunler", label: "Ürünler", icon: Package },
  { to: "/admin/hizmetler", label: "Hizmetler", icon: Sparkles },
  { to: "/admin/saatler", label: "Çalışma saatleri", icon: Clock },
  { to: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: CalendarDays },
  { to: "/admin/siparisler", label: "Siparişler & ödeme", icon: ShoppingCart },
  { to: "/admin/ai", label: "AI eğitimi", icon: Brain },
  { to: "/admin/kanallar", label: "Kanallar & widget", icon: Share2 },
  { to: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
] as const;

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const logoutFn = useServerFn(logout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sessionFn = useServerFn(getAdminSession);
  const { data: session } = useQuery({ queryKey: ["admin-session"], queryFn: () => sessionFn({}) });

  const signOut = async () => {
    await logoutFn({});
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-border/60">
          <Link to="/" className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary">
            TrairX Connect
          </Link>
          <p className="mt-1 font-display text-sm text-foreground truncate">
            {session?.businessName ?? "İşletme paneli"}
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
          {session?.role === "superadmin" && (
            <Link
              to="/admin/superadmin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                pathname.startsWith("/admin/superadmin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} /> Süper admin
            </Link>
          )}
        </nav>
        <button
          onClick={signOut}
          className="m-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-primary"
        >
          <LogOut className="w-4 h-4" /> Çıkış yap
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="border-b border-border/60 bg-card/60 backdrop-blur sticky top-0 z-10">
          <div className="px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl md:text-2xl">{title}</h1>
              {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
          <div className="lg:hidden overflow-x-auto border-t border-border/60 px-3 py-2 flex gap-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="px-5 md:px-8 py-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-5 md:p-6", className)}>{children}</div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full bg-background/70 border border-border/60 focus:border-primary/70 rounded-xl px-3 py-2 text-sm outline-none";

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
        props.className,
      )}
    >
      {children}
    </button>
  );
}
