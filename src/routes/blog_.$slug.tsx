import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Loader2, Tag } from "lucide-react";
import { getPostBySlug } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog_/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${decodeURIComponent(params.slug).replace(/-/g, " ")} | Dr. Gökhan Değirmencioğlu Blog` },
      { name: "description", content: "Dr. Gökhan Değirmencioğlu'nun medikal estetik ve cilt sağlığı üzerine uzman yazısı." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const getFn = useServerFn(getPostBySlug);
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => getFn({ data: { slug } }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 text-center px-6">
        <h1 className="font-display text-3xl text-gold-gradient mb-4">Yazı bulunamadı</h1>
        <p className="text-foreground/60 mb-8">Aradığınız yazı kaldırılmış veya taşınmış olabilir.</p>
        <Link to="/blog" className="text-primary hover:underline">← Bloga dön</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-28 pb-24">
      {post.cover_image_url && (
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/40 to-background" />
        </div>
      )}

      <article className="mx-auto max-w-3xl px-6 lg:px-10 -mt-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border/40 bg-card/70 backdrop-blur-xl p-8 md:p-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-primary transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Tüm Yazılar
          </Link>

          {post.category && (
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/70">
              {post.category}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-5xl text-gold-gradient mt-3 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-foreground/60 mb-8 pb-8 border-b border-border/30">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : ""}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="inline-flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5" />
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full border border-border/40 text-[11px]">
                    {t}
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
            className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-gold-gradient prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">Bu konu hakkında görüşmek ister misiniz?</p>
            <Link
              to="/"
              hash="iletisim"
              className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Randevu Al
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
