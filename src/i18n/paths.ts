import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "./types";

/** Canonical (Turkish) paths used as the internal page identity. */
export const PAGE_PATHS = {
  home: "/",
  features: "/ozellikler",
  howItWorks: "/nasil-calisir",
  useCases: "/sektorler",
  pricing: "/fiyatlandirma",
  contact: "/iletisim",
  legal: "/kvkk",
} as const;

export type PageKey = keyof typeof PAGE_PATHS;
export const PAGE_KEYS = Object.keys(PAGE_PATHS) as PageKey[];

/** Prefix a canonical path with the locale segment (tr stays unprefixed). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Split "/en/ozellikler" into { locale: "en", path: "/ozellikler" }. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const path = `/${rest.join("/")}`.replace(/\/$/, "");
    return { locale: first, path: path === "" ? "/" : path };
  }
  const path = pathname.replace(/\/$/, "");
  return { locale: DEFAULT_LOCALE, path: path === "" ? "/" : path };
}

export const HREFLANG: Record<Locale, string> = { tr: "tr-TR", en: "en" };

/** canonical + hreflang alternates for a canonical path. */
export function localeLinks(siteUrl: string, locale: Locale, path: string) {
  return [
    { rel: "canonical", href: `${siteUrl}${localePath(locale, path)}` },
    ...LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: HREFLANG[l],
      href: `${siteUrl}${localePath(l, path)}`,
    })),
    { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}${localePath(DEFAULT_LOCALE, path)}` },
  ];
}

export { LOCALES, DEFAULT_LOCALE, isLocale, type Locale };
