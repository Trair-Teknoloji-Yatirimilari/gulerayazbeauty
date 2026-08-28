import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/pages";
import { pageHead } from "@/i18n/meta";

export const Route = createFileRoute("/iletisim")({
  head: () => pageHead("contact", "tr"),
  component: ContactPage,
});
