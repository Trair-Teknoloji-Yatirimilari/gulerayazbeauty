import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useT } from "@/i18n/context";
import { localePath, stripLocale } from "@/i18n/paths";
import { LOCALES, localeLabels, type Locale } from "@/i18n/types";

const AnyLink = Link as unknown as (props: Record<string, unknown>) => ReactNode;

type LocaleLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  activeProps?: Record<string, unknown>;
  onClick?: () => void;
  "aria-label"?: string;
};

/** <Link> that automatically prefixes the active locale (tr stays unprefixed). */
export function LocaleLink({ to, ...rest }: LocaleLinkProps) {
  const { locale } = useT();
  return <AnyLink to={localePath(locale, to)} {...rest} />;
}

/** Current canonical (locale-free) path of the page being viewed. */
export function useCanonicalPath() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return stripLocale(pathname).path;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useT();
  const path = useCanonicalPath();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border/60 bg-card/70 p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l: Locale) => (
        <AnyLink
          key={l}
          to={localePath(l, path)}
          hrefLang={l}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors ${
            l === locale ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[l]}
        </AnyLink>
      ))}
    </div>
  );
}
