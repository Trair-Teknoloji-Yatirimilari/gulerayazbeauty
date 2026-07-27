import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireAdmin } from "./auth.functions";

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().default(""),
  cover_image_url: z
    .string()
    .trim()
    .max(1000)
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Geçerli bir URL veya /uploads yolu girin")
    .optional()
    .or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(400).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type BlogPostInput = z.infer<typeof postSchema>;

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostListItem = Pick<
  BlogPostRow,
  "id" | "slug" | "title" | "excerpt" | "cover_image_url" | "category" | "tags" | "published_at"
>;


export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { rows } = await db().query<BlogPostListItem>(
    `SELECT id, slug, title, excerpt, cover_image_url, category, tags, published_at
     FROM blog_posts WHERE status = 'published'
     ORDER BY published_at DESC`,
  );
  return rows;
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { rows } = await db().query<BlogPostRow>(
      `SELECT * FROM blog_posts WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [data.slug],
    );
    return rows[0] ?? null;
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { rows } = await db().query<Pick<BlogPostRow, "id" | "slug" | "title" | "status" | "category" | "published_at" | "updated_at">>(
      `SELECT id, slug, title, status, category, published_at, updated_at
       FROM blog_posts ORDER BY updated_at DESC`,
    );
    return rows;
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { rows } = await db().query<BlogPostRow>(`SELECT * FROM blog_posts WHERE id = $1`, [data.id]);
    return rows[0] ?? null;
  });

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ data }) => {
    const pool = db();
    const vals = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || null,
      content: data.content,
      cover_image_url: data.cover_image_url || null,
      category: data.category || null,
      tags: data.tags,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      status: data.status,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };

    if (data.id) {
      // Yayınlanmış bir yazı güncellenirken orijinal yayın tarihini koru
      if (data.status === "published") {
        const { rows } = await pool.query(
          `SELECT published_at, status FROM blog_posts WHERE id = $1`,
          [data.id],
        );
        if (rows[0]?.published_at && rows[0].status === "published") {
          vals.published_at = rows[0].published_at;
        }
      }
      const { rows } = await pool.query(
        `UPDATE blog_posts SET
           slug=$1, title=$2, excerpt=$3, content=$4, cover_image_url=$5,
           category=$6, tags=$7, seo_title=$8, seo_description=$9,
           status=$10, published_at=$11
         WHERE id=$12 RETURNING id, slug`,
        [vals.slug, vals.title, vals.excerpt, vals.content, vals.cover_image_url,
         vals.category, vals.tags, vals.seo_title, vals.seo_description,
         vals.status, vals.published_at, data.id],
      );
      if (!rows[0]) throw new Error("Yazı bulunamadı.");
      return rows[0];
    }

    const { rows } = await pool.query(
      `INSERT INTO blog_posts
         (slug, title, excerpt, content, cover_image_url, category, tags,
          seo_title, seo_description, status, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, slug`,
      [vals.slug, vals.title, vals.excerpt, vals.content, vals.cover_image_url,
       vals.category, vals.tags, vals.seo_title, vals.seo_description,
       vals.status, vals.published_at],
    );
    return rows[0];
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await db().query(`DELETE FROM blog_posts WHERE id = $1`, [data.id]);
    return { ok: true };
  });
