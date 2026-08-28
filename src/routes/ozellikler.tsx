import { createFileRoute } from "@tanstack/react-router";
import { FeaturesPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/ozellikler")({
  head: () => pageHead("features", "tr"),
  component: FeaturesPage,
});
