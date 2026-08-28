import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/nasil-calisir")({
  head: () => pageHead("howItWorks", "tr"),
  component: HowItWorksPage,
});
