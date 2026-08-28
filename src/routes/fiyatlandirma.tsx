import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/fiyatlandirma")({
  head: () => pageHead("pricing", "tr"),
  component: PricingPage,
});
