import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import {
  listGallery,
  createGalleryItem,
  deleteGalleryItem,
} from "@/lib/gallery.functions";
import { uploadImage } from "@/lib/upload.functions";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/_authenticated/admin_/gallery")({
  head: () => ({
    meta: [
      { title: "Galeri Yönetimi | Güler Ayaz Beauty" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminGalleryPage,
});

function AdminGalleryPage() {
  const { t } = useT();
  const qc = useQueryClient();
  const listFn = useServerFn(listGallery);
  const createFn = useServerFn(createGalleryItem);
  const deleteFn = useServerFn(deleteGalleryItem);
  const uploadFn = useServerFn(uploadImage);

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["gallery-admin"],
    queryFn: () => listFn(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          image_url: imageUrl,
          title,
          caption,
          category,
          sort_order: Number(sortOrder) || 0,
        },
      }),
    onSuccess: () => {
      toast.success(t.galleryAdmin.added);
      setImageUrl("");
      setTitle("");
      setCaption("");
      setCategory("");
      setSortOrder(0);
      qc.invalidateQueries({ queryKey: ["gallery-admin"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t.galleryAdmin.error),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success(t.galleryAdmin.deleted);
      qc.invalidateQueries({ queryKey: ["gallery-admin"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t.galleryAdmin.error),
  });

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      const b64 = btoa(
        new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), ""),
      );
      const { url } = await uploadFn({
        data: { mime: file.type, dataBase64: b64 },
      });
      setImageUrl(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.galleryAdmin.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error(t.galleryAdmin.urlRequired);
      return;
    }
    createMut.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary"
          >
            ← {t.galleryAdmin.backAppointments}
          </Link>
          <h1 className="font-display text-xl md:text-2xl text-gold-gradient">
            {t.galleryAdmin.title}
          </h1>
          <span />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 grid gap-10 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-border/60 bg-card p-6 space-y-4 h-fit"
        >
          <div>
            <h2 className="font-display text-lg text-foreground">
              {t.galleryAdmin.addTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t.galleryAdmin.subtitle}
            </p>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.galleryAdmin.uploadFile}
            </span>
            <label className="mt-2 flex items-center justify-center gap-2 border border-dashed border-border rounded-md p-4 cursor-pointer hover:border-primary text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              {uploading ? t.galleryAdmin.uploading : t.galleryAdmin.uploadFile}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                  e.target.value = "";
                }}
              />
            </label>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.galleryAdmin.imageUrl}
            </span>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t.galleryAdmin.imageUrlPh}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-40 object-cover rounded-md border border-border/60"
            />
          )}

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.galleryAdmin.itemTitle}
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.galleryAdmin.caption}
            </span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.galleryAdmin.category}
              </span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.galleryAdmin.sortOrder}
              </span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                min={0}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={createMut.isPending || uploading}
            className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {createMut.isPending ? t.galleryAdmin.saving : t.galleryAdmin.save}
          </button>
        </form>

        <section>
          {(!data || data.length === 0) && (
            <div className="text-center text-muted-foreground py-20 border border-dashed border-border/60 rounded-lg">
              {t.galleryAdmin.empty}
            </div>
          )}
          {data && data.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-lg overflow-hidden border border-border/60 bg-card"
                >
                  <img
                    src={item.image_url}
                    alt={item.title || ""}
                    className="w-full h-48 object-cover"
                  />
                  {(item.title || item.category) && (
                    <div className="p-3">
                      {item.title && (
                        <div className="text-sm text-foreground truncate">
                          {item.title}
                        </div>
                      )}
                      {item.category && (
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                          {item.category}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(t.galleryAdmin.deleteConfirm)) {
                        deleteMut.mutate(item.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20 hover:border-rose-500/40"
                    aria-label={t.galleryAdmin.delete}
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
