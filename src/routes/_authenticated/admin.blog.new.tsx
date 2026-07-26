import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/BlogPostForm";

export const Route = createFileRoute("/_authenticated/admin/blog/new")({
  head: () => ({ meta: [{ title: "Yeni Yazı" }, { name: "robots", content: "noindex" }] }),
  component: NewPostPage,
});

function NewPostPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/_authenticated/admin/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70 hover:text-primary mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Blog Yönetimi
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-gold-gradient mb-8">Yeni Yazı</h1>
        <BlogPostForm />
      </div>
    </div>
  );
}
