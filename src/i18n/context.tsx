import { useEffect, useMemo, type ReactNode } from "react";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { DEFAULT_LOCALE, dirOf, isLocale, type Locale } from "./types";
import { getDict, type Dict } from "./index";
import { localePath, stripLocale } from "./paths";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dict; dir: "ltr" | "rtl" };

const STORAGE_KEY = "app.locale";

/**
 * Locale is derived from the URL: `/...` = tr (default), `/en/...`.
 * The URL is the single source of truth so SSR, SEO and hydration always agree.
 */
export function useT(): Ctx {
  const params = useParams({ strict: false }) as { lang?: string };
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const locale: Locale = isLocale(params.lang) ? params.lang : stripLocale(pathname).locale;

  return useMemo<Ctx>(
    () => ({
      locale,
      dir: dirOf(locale),
      t: getDict(locale),
      setLocale: (l: Locale) => {
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* storage unavailable */
        }
        navigate({ to: localePath(l, stripLocale(pathname).path) as never });
      },
    }),
    [locale, pathname, navigate],
  );
}

/** Keeps <html lang/dir> in sync with the URL locale and stores the last choice. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const { locale, dir } = useT();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
  }, [locale, dir]);

  return <>{children}</>;
}

export { DEFAULT_LOCALE };
