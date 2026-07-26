import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | Dr. Gökhan Değirmencioğlu" },
      { name: "description", content: "Medikal estetik uygulamaları, botoks, dolgu, mezoterapi, lazer ve cilt sağlığı hakkında Dr. Gökhan Değirmencioğlu tarafından hazırlanan uzman yazılar." },
      { property: "og:title", content: "Medikal Estetik Blog | Dr. Gökhan Değirmencioğlu" },
      { property: "og:description", content: "Uzman kaleminden estetik uygulamalar, tedaviler ve cilt sağlığı içerikleri." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogListPage,
});

function BlogListPage() {
  const listFn = useServerFn(listPublishedPosts);
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: () => listFn(),
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-4">Bilgi & İçgörü</p>
          <h1 className="font-display text-4xl md:text-6xl text-gold-gradient mb-6">Blog</h1>
          <p className="max-w-2xl mx-auto text-foreground/70 leading-relaxed">
            Medikal estetik, cilt sağlığı ve modern anti-aging yaklaşımları üzerine
            Dr. Gökhan Değirmencioğlu tarafından hazırlanan uzman içerikler.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-widest text-primary/80 hover:text-primary transition"
          >
            ← Ana Sayfa
          </Link>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        )}
        {error && (
          <div className="text-center text-rose-400 py-12">Yazılar yüklenemedi.</div>
        )}
        {posts && posts.length === 0 && (
          <div className="text-center text-foreground/60 py-24">Henüz yayınlanmış bir yazı yok.</div>
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
                className="block h-full rounded-2xl border border-border/40 bg-card/40 backdrop-blur overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1"
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
                    <div className="w-full h-full flex items-center justify-center text-primary/30 font-display text-3xl">
                      Dr. GD
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  {post.category && (
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary/70">
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
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary">
                      Oku <ArrowUpRight className="w-3.5 h-3.5" />
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
