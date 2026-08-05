import { createFileRoute } from "@tanstack/react-router";

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/galeri", changefreq: "weekly", priority: "0.7" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host =
          request.headers.get("x-forwarded-host") ??
          request.headers.get("host") ??
          "gulerayazbeauty.com";
        const base = `https://${host}`;

        let posts: { slug: string; updated_at: string }[] = [];
        try {
          const { db } = await import("@/lib/db");
          const res = await db().query(
            `SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`,
          );
          posts = res.rows;
        } catch {
          /* DB erişilemezse statik sayfalarla devam */
        }

        const urls = [
          ...STATIC_PAGES.map(
            (p) =>
              `  <url><loc>${base}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
          ),
          ...posts.map(
            (p) =>
              `  <url><loc>${base}/blog/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString().slice(0, 10)}</lastmod><priority>0.7</priority></url>`,
          ),
        ].join("\n");

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
