import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getPostBySlug } from "@/lib/blog.functions";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => getPostBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const title = loaderData?.seo_title || loaderData?.title || decodeURIComponent(params.slug).replace(/-/g, " ");
    const desc = loaderData?.seo_description || loaderData?.excerpt ||
      "Güler Ayaz Beauty'den güzellik, cilt bakımı ve iyi yaşam üzerine uzman içerik.";
    const cover = loaderData?.cover_image_url
      ? (/^https?:\/\//.test(loaderData.cover_image_url) ? loaderData.cover_image_url : `${SITE_URL}${loaderData.cover_image_url}`)
      : `${SITE_URL}/og-image.jpg`;
    const url = `${SITE_URL}/blog/${params.slug}`;
    return {
      meta: [
        { title: `${title} | Güler Ayaz Beauty Blog` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.title,
                description: desc,
                image: cover,
                url,
                datePublished: loaderData.published_at ?? undefined,
                dateModified: loaderData.updated_at ?? undefined,
                author: { "@type": "Organization", name: "Güler Ayaz Beauty", url: SITE_URL },
                publisher: { "@type": "Organization", name: "Güler Ayaz Beauty", url: SITE_URL },
              }),
            },
          ]
        : [],
    };
  },
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { t } = useT();
  const post = Route.useLoaderData();

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 text-center px-6">
        <h1 className="font-display text-3xl text-gold-gradient mb-4">{t.blog.notFound}</h1>
        <p className="text-foreground/60 mb-8">{t.blog.notFoundBody}</p>
        <Link to="/blog" className="text-primary hover:underline">{t.blog.backBlog}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-28 pb-24">
      {post.cover_image_url && (
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
      )}

      <article className="mx-auto max-w-3xl px-6 lg:px-10 -mt-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border/40 bg-card/85 backdrop-blur-xl p-8 md:p-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-primary transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t.blog.allPosts}
          </Link>

          {post.category && (
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
              {post.category}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-5xl text-gold-gradient mt-3 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-foreground/60 mb-8 pb-8 border-b border-border/30">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString(t.blog.dateLocale, { day: "numeric", month: "long", year: "numeric" }) : ""}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="inline-flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5" />
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full border border-border/40 text-[11px]">
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>

          {post.excerpt && (
            <p className="text-lg text-foreground/80 leading-relaxed mb-8 italic">
              {post.excerpt}
            </p>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">{t.blog.ctaQuestion}</p>
            <Link
              to="/"
              hash="iletisim"
              className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              {t.blog.ctaBook}
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
