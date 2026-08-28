import { createFileRoute } from "@tanstack/react-router";

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/ozellikler", changefreq: "monthly", priority: "0.8" },
  { path: "/nasil-calisir", changefreq: "monthly", priority: "0.8" },
  { path: "/sektorler", changefreq: "monthly", priority: "0.7" },
  { path: "/fiyatlandirma", changefreq: "monthly", priority: "0.9" },
  { path: "/iletisim", changefreq: "monthly", priority: "0.7" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host =
          request.headers.get("x-forwarded-host") ??
          request.headers.get("host") ??
          "trairxconnect.com";
        const base = `https://${host}`;

        const LOCALES = ["tr", "en"] as const;
        const prefixed = (locale: string, path: string) =>
          locale === "tr" ? path : path === "/" ? `/${locale}` : `/${locale}${path}`;

        const urls = STATIC_PAGES.flatMap((p) =>
          LOCALES.map((locale) => {
            const alternates = LOCALES.map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt}" href="${base}${prefixed(alt, p.path)}"/>`,
            ).join("\n");
            return [
              `  <url>`,
              `    <loc>${base}${prefixed(locale, p.path)}</loc>`,
              alternates,
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${p.path}"/>`,
              `    <changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority>`,
              `  </url>`,
            ].join("\n");
          }),
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
