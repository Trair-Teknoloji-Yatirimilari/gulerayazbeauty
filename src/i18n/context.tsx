import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, dirOf, isLocale, detectBrowserLocale, type Locale } from "./types";
import { getDict, type Dict } from "./index";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dict; dir: "ltr" | "rtl" };
const LocaleCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "app.locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isLocale(stored)) {
        setLocaleState(stored);
        return;
      }
    } catch {}
    setLocaleState(detectBrowserLocale());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  const value = useMemo<Ctx>(() => ({
    locale,
    setLocale,
    t: getDict(locale),
    dir: dirOf(locale),
  }), [locale]);

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useT() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) return { locale: DEFAULT_LOCALE, t: getDict(DEFAULT_LOCALE), dir: "ltr" as const, setLocale: () => {} };
  return ctx;
}
