import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListPosts, deletePost } from "@/lib/blog.functions";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  head: () => ({ meta: [{ title: "Blog Yönetimi" }, { name: "robots", content: "noindex" }] }),
  component: AdminBlogPage,
});

function AdminBlogPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPosts);
  const delFn = useServerFn(deletePost);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: () => listFn(),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Yazı silindi.");
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Hata"),
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/_authenticated/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70 hover:text-primary mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Randevular
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-gold-gradient">Blog Yönetimi</h1>
          </div>
          <Link
            to="/_authenticated/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" /> Yeni Yazı
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-2xl border border-border/40 bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/60 text-foreground/60 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left p-4">Başlık</th>
                  <th className="text-left p-4 hidden md:table-cell">Kategori</th>
                  <th className="text-left p-4">Durum</th>
                  <th className="text-left p-4 hidden lg:table-cell">Güncellenme</th>
                  <th className="text-right p-4">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-foreground/60">Henüz yazı yok.</td></tr>
                )}
                {data?.map((post) => (
                  <tr key={post.id} className="border-t border-border/30 hover:bg-background/40 transition">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-xs text-foreground/50 mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-foreground/70">{post.category ?? "—"}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider border ${post.status === "published" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-amber-500/30 text-amber-400 bg-amber-500/10"}`}>
                        {post.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-foreground/60 text-xs">
                      {new Date(post.updated_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === "published" && (
                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            target="_blank"
                            className="p-2 rounded hover:bg-primary/10 text-foreground/70 hover:text-primary transition"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to="/_authenticated/admin/blog/$id"
                          params={{ id: post.id }}
                          className="p-2 rounded hover:bg-primary/10 text-foreground/70 hover:text-primary transition"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`"${post.title}" silinsin mi?`)) delMut.mutate(post.id);
                          }}
                          className="p-2 rounded hover:bg-rose-500/10 text-foreground/70 hover:text-rose-400 transition"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
