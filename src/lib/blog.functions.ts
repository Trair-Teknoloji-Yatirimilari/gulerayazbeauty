import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const url = process.env.SUPABASE_URL!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().default(""),
  cover_image_url: z.string().trim().url().max(1000).optional().or(z.literal("")),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(400).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type BlogPostInput = z.infer<typeof postSchema>;

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, category, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: post, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select("id, slug, title, status, category, published_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: post, error } = await context.supabase
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ data, context }) => {
    const payload = {
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
      published_at:
        data.status === "published"
          ? new Date().toISOString()
          : null,
      author_id: context.userId,
    };

    if (data.id) {
      // Preserve original published_at when updating an already-published post
      if (data.status === "published") {
        const { data: existing } = await context.supabase
          .from("blog_posts")
          .select("published_at, status")
          .eq("id", data.id)
          .maybeSingle();
        if (existing?.published_at && existing.status === "published") {
          payload.published_at = existing.published_at;
        }
      }
      const { data: updated, error } = await context.supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", data.id)
        .select("id, slug")
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }

    const { data: inserted, error } = await context.supabase
      .from("blog_posts")
      .insert(payload)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
