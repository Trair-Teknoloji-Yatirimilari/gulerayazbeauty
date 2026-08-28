import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/$lang/kvkk")({
  head: ({ params }) => pageHead("legal", isLocale(params.lang) ? params.lang : DEFAULT_LOCALE),
  component: LegalPage,
});
