import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/$lang/fiyatlandirma")({
  head: ({ params }) => pageHead("pricing", isLocale(params.lang) ? params.lang : DEFAULT_LOCALE),
  component: PricingPage,
});
