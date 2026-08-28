import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { logout } from "@/lib/auth.functions";
import { LogOut } from "lucide-react";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Yönetim Paneli | TrairX Connect" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const logoutFn = useServerFn(logout);

  const signOut = async () => {
    await logoutFn();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary">
              {t.admin.backSite}
            </Link>
            <h1 className="font-display text-xl md:text-2xl text-gradient mt-1">
              {t.admin.title}
            </h1>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            <LogOut className="w-4 h-4" /> {t.admin.signOut}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-muted-foreground">{t.admin.placeholder}</p>
      </main>
    </div>
  );
}
