import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireAdmin } from "./auth.functions";

export interface GalleryItem {
  id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}

export const listGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { rows } = await db().query<GalleryItem>(
    `SELECT id, image_url, title, caption, category, sort_order, created_at
     FROM gallery ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows;
});

const createSchema = z.object({
  image_url: z.string().trim().min(1).max(1000),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  caption: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const { rows } = await db().query<GalleryItem>(
      `INSERT INTO gallery (image_url, title, caption, category, sort_order)
       VALUES ($1, NULLIF($2,''), NULLIF($3,''), NULLIF($4,''), $5)
       RETURNING id, image_url, title, caption, category, sort_order, created_at`,
      [data.image_url, data.title ?? "", data.caption ?? "", data.category ?? "", data.sort_order],
    );
    return rows[0];
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await db().query(`DELETE FROM gallery WHERE id = $1`, [data.id]);
    return { ok: true };
  });
