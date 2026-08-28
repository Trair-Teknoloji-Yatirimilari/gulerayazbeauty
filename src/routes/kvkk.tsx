import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/kvkk")({
  head: () => pageHead("legal", "tr"),
  component: LegalPage,
});
