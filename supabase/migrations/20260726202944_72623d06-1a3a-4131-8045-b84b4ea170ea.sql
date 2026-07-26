-- Add multilingual columns to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS title_tr TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_fa TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_tr TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_fa TEXT,
  ADD COLUMN IF NOT EXISTS content_tr TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS content_fa TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_tr TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_fa TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_tr TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_fa TEXT;

-- Backfill Turkish columns from existing single-language columns
UPDATE public.blog_posts
SET
  title_tr = COALESCE(title_tr, title),
  excerpt_tr = COALESCE(excerpt_tr, excerpt),
  content_tr = COALESCE(content_tr, content),
  seo_title_tr = COALESCE(seo_title_tr, seo_title),
  seo_description_tr = COALESCE(seo_description_tr, seo_description);