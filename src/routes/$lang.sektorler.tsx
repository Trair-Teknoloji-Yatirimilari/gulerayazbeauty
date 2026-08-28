import { createFileRoute } from "@tanstack/react-router";
import { UseCasesPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/$lang/sektorler")({
  head: ({ params }) => pageHead("useCases", isLocale(params.lang) ? params.lang : DEFAULT_LOCALE),
  component: UseCasesPage,
});
