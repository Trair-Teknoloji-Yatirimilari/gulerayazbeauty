import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/$lang/nasil-calisir")({
  head: ({ params }) => pageHead("howItWorks", isLocale(params.lang) ? params.lang : DEFAULT_LOCALE),
  component: HowItWorksPage,
});
