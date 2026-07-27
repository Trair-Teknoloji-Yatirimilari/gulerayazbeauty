import { createFileRoute } from "@tanstack/react-router";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const Route = createFileRoute("/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { readFile } = await import("node:fs/promises");
        const path = await import("node:path");
        const { uploadDir } = await import("@/lib/upload.functions");

        const splat = (params as { _splat?: string })._splat ?? "";
        // Dizin dışına çıkma girişimlerini engelle
        const safe = path.basename(splat);
        const ext = safe.split(".").pop()?.toLowerCase() ?? "";
        const mime = MIME_BY_EXT[ext];
        if (!safe || !mime) return new Response("Not found", { status: 404 });
        try {
          const buf = await readFile(path.join(uploadDir(), safe));
          return new Response(new Uint8Array(buf), {
            headers: {
              "content-type": mime,
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
