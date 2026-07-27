import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "./auth.functions";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

const uploadSchema = z.object({
  mime: z.string(),
  dataBase64: z.string().min(1),
});

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data }) => {
    const ext = EXT_BY_MIME[data.mime];
    if (!ext) throw new Error("Sadece JPG, PNG veya WebP yükleyebilirsiniz.");
    const buf = Buffer.from(data.dataBase64, "base64");
    if (buf.length === 0) throw new Error("Dosya boş.");
    if (buf.length > MAX_SIZE) throw new Error("Dosya 5MB'den büyük olamaz.");
    const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    const dir = uploadDir();
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buf);
    return { url: `/uploads/${name}` };
  });
