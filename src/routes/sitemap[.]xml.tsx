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

        const urls = STATIC_PAGES.map(
          (p) =>
            `  <url><loc>${base}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
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
