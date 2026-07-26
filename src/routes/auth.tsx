import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Yönetici Girişi | Dr. Gökhan Değirmencioğlu" },
      { name: "description", content: "Klinik yönetici paneli girişi." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useT();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t.auth.successSignin);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success(t.auth.successSignup);
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.auth.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 text-xs uppercase tracking-[0.4em] text-muted-foreground hover:text-primary">
          {t.auth.backHome}
        </Link>
        <div className="bg-card/60 backdrop-blur border border-border/60 rounded-sm p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" strokeWidth={1.2} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-gold-gradient">{t.auth.badge}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin" ? t.auth.subtitleSignin : t.auth.subtitleSignup}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{t.auth.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/40 border border-border/60 focus:border-primary/70 rounded-sm px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{t.auth.passwordLabel}</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/40 border border-border/60 focus:border-primary/70 rounded-sm px-4 py-3 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? t.auth.signIn : t.auth.signUp}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? t.auth.noAccount : t.auth.hasAccount}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline"
            >
              {mode === "signin" ? t.auth.signUpLink : t.auth.signInLink}
            </button>
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground/70 text-center leading-relaxed">
            {t.auth.notice}
          </p>
        </div>
      </div>
    </div>
  );
}
