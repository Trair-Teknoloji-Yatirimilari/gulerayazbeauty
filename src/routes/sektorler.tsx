import { createFileRoute } from "@tanstack/react-router";
import { UseCasesPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/sektorler")({
  head: () => pageHead("useCases", "tr"),
  component: UseCasesPage,
});
