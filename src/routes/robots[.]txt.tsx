import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host =
          request.headers.get("x-forwarded-host") ??
          request.headers.get("host") ??
          "trairxconnect.com";
        const body = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /auth",
          "Disallow: /admin",
          "",
          `Sitemap: https://${host}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
