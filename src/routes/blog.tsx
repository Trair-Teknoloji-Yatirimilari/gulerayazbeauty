import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/blog")({
  loader: () => listPublishedPosts(),
  head: () => ({
    meta: [
      { title: "Blog | Güler Ayaz Beauty" },
      { name: "description", content: "Lazer epilasyon, cilt bakımı, kirpik & kaş, tırnak sanatı ve Pilates üzerine Güler Ayaz Beauty uzmanlığıyla hazırlanan içerikler." },
      { property: "og:title", content: "Güzellik & Bakım Blogu | Güler Ayaz Beauty" },
      { property: "og:description", content: "Güzellik ritüelleri, cilt bakımı ve iyi yaşam içerikleri." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogListPage,
});

function BlogListPage() {
  const { t } = useT();
  const posts = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4">{t.blog.badge}</p>
          <h1 className="font-display text-4xl md:text-6xl text-gold-gradient mb-6">{t.blog.title}</h1>
          <p className="max-w-2xl mx-auto text-foreground/70 leading-relaxed">
            {t.blog.subtitle}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-widest text-primary hover:text-primary transition"
          >
            {t.blog.backHome}
          </Link>
        </motion.div>

        {posts && posts.length === 0 && (
          <div className="text-center text-foreground/60 py-24">{t.blog.empty}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block h-full rounded-2xl border border-border/40 bg-card/80 backdrop-blur overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted/20">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-display text-3xl">
                      GA
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  {post.category && (
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-display text-xl md:text-2xl leading-tight text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString(t.blog.dateLocale, { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary">
                      {t.blog.read} <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
