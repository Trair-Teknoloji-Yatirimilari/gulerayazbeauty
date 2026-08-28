import { useParams } from "@tanstack/react-router";
import { tr } from "./dictionaries/tr";
import { en } from "./dictionaries/en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";

export type Dict = typeof tr;

const DICTS: Record<Locale, Dict> = { tr, en };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

export function useLocaleFromRoute(): Locale {
  const params = useParams({ strict: false }) as { lang?: string };
  return isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
}

export { DEFAULT_LOCALE, isLocale, type Locale } from "./types";
