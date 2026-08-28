import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/types";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    // Only /en and /fa are prefixed; Turkish lives on unprefixed paths.
    if (!isLocale(params.lang) || params.lang === DEFAULT_LOCALE) throw notFound();
  },
  component: () => <Outlet />,
});
