import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/")({
  head: () => pageHead("home", "tr"),
  component: HomePage,
});
