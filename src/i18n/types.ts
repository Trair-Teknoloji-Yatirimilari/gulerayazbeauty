export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const langs = navigator.languages ?? [navigator.language];
  for (const l of langs) {
    const low = l.toLowerCase();
    if (low.startsWith("en")) return "en";
    if (low.startsWith("tr")) return "tr";
  }
  return DEFAULT_LOCALE;
}

export function dirOf(_l: Locale): "ltr" | "rtl" {
  return "ltr";
}

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
};

export const localeFullNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};
