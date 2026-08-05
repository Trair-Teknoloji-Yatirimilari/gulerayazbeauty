import { useT } from "@/i18n/context";
import { LOCALES, localeLabels, type Locale } from "@/i18n/types";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher({ variant = "header" }: { variant?: "header" | "footer" }) {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const base =
    variant === "header"
      ? "inline-flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 text-[11px] uppercase tracking-widest text-foreground/80 hover:border-primary/60 hover:text-primary transition-colors"
      : "inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={base}
        aria-label="Language / Dil"
      >
        <Globe className="w-3.5 h-3.5" />
        {localeLabels[locale]}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[110px] rounded-md border border-border/60 bg-popover backdrop-blur py-1 shadow-lg z-50">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLocale(l as Locale); setOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-primary/10 ${l === locale ? "text-primary" : "text-foreground/80"}`}
            >
              {localeLabels[l]} · {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
