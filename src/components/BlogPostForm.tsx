import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { upsertPost, type BlogPostInput } from "@/lib/blog.functions";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useT } from "@/i18n/context";

interface Props {
  initial?: Partial<BlogPostInput> & { id?: string };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogPostForm({ initial }: Props) {
  const { t } = useT();
  const f = t.blogForm;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertPost);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [cover, setCover] = useState(initial?.cover_image_url ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(initial?.seo_description ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");

  const mut = useMutation({
    mutationFn: (payload: BlogPostInput) => upsertFn({ data: payload }),
    onSuccess: () => {
      toast.success(initial?.id ? f.updated : f.saved);
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      qc.invalidateQueries({ queryKey: ["blog"] });
      navigate({ to: "/admin/blog" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : f.saveError),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: BlogPostInput = {
      id: initial?.id,
      title: title.trim(),
      slug: (slug || slugify(title)).trim(),
      excerpt: excerpt.trim(),
      content,
      cover_image_url: cover.trim(),
      category: category.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      seo_title: seoTitle.trim(),
      seo_description: seoDesc.trim(),
      status,
    };
    mut.mutate(payload);
  };

  const input = "w-full rounded-md border border-border/40 bg-background/60 px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition";
  const label = "block text-xs uppercase tracking-widest text-foreground/60 mb-2";

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div>
          <label className={label}>{f.titleLabel}</label>
          <input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={`${input} text-lg font-display`}
          />
        </div>

        <div>
          <label className={label}>{f.slugLabel}</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/50">{f.slugPrefix}</span>
            <input
              required
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              className={input}
              placeholder={f.slugPh}
            />
          </div>
        </div>

        <div>
          <label className={label}>{f.excerpt}</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className={input}
            placeholder={f.excerptPh}
          />
        </div>

        <div>
          <label className={label}>{f.content}</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
          <div>
            <label className={label}>{f.statusLabel}</label>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-md text-xs uppercase tracking-wider border transition ${status === s ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-foreground/60 hover:border-primary/40"}`}
                >
                  {s === "draft" ? f.draft : f.published}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground py-2.5 text-sm hover:bg-primary/90 transition disabled:opacity-50"
          >
            {mut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {f.save}
          </button>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
          <div>
            <label className={label}>{f.category}</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={input} placeholder={f.categoryPh} />
          </div>
          <div>
            <label className={label}>{f.tags}</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className={input} placeholder={f.tagsPh} />
          </div>
          <div>
            <label className={label}>{f.cover}</label>
            <input value={cover} onChange={(e) => setCover(e.target.value)} className={input} placeholder="https://..." />
            {cover && (
              <img src={cover} alt={f.coverAlt} className="mt-3 rounded-md w-full aspect-video object-cover border border-border/40" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary/70">{f.seo}</p>
          <div>
            <label className={label}>{f.seoTitle}</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>{f.seoDesc}</label>
            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} className={input} />
          </div>
        </div>
      </div>
    </form>
  );
}
