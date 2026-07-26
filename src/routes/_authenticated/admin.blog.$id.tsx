import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { adminGetPost } from "@/lib/blog.functions";
import { BlogPostForm } from "@/components/BlogPostForm";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  head: () => ({ meta: [{ title: "Yazıyı Düzenle" }, { name: "robots", content: "noindex" }] }),
  component: EditPostPage,
});

function EditPostPage() {
  const { id } = Route.useParams();
  const getFn = useServerFn(adminGetPost);
  const { data: post, isLoading } = useQuery({
    queryKey: ["admin", "blog", id],
    queryFn: () => getFn({ data: { id } }),
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/_authenticated/admin/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70 hover:text-primary mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Blog Yönetimi
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-gold-gradient mb-8">Yazıyı Düzenle</h1>
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : post ? (
          <BlogPostForm
            initial={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt ?? "",
              content: post.content ?? "",
              cover_image_url: post.cover_image_url ?? "",
              category: post.category ?? "",
              tags: post.tags ?? [],
              seo_title: post.seo_title ?? "",
              seo_description: post.seo_description ?? "",
              status: post.status,
            }}
          />
        ) : (
          <p className="text-foreground/60">Yazı bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
