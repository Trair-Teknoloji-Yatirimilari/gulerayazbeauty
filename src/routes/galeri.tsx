import { SITE_URL } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { listGallery } from "@/lib/gallery.functions";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri | Güler Ayaz Beauty" },
      {
        name: "description",
        content:
          "Güler Ayaz Beauty merkezinden kareler ve videolar: cilt bakımı kabinimiz, ipek kirpik uygulaması, nail art ve uygulama anları.",
      },
      { property: "og:title", content: "Galeri | Güler Ayaz Beauty" },
      {
        property: "og:description",
        content:
          "Merkezimizden kareler, uygulama anları ve atmosferimiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/galeri` }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useT();
  const fetchGallery = useServerFn(listGallery);
  const { data, isLoading, error } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary"
          >
            {t.gallery.backHome}
          </Link>
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            {t.gallery.badge}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h1 className="font-display text-4xl md:text-6xl text-gold-gradient">
            {t.gallery.title}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t.gallery.subtitle}
          </p>
        </motion.div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-20">…</div>
        )}
        {error && (
          <div className="text-center text-rose-400 py-20">
            {t.gallery.loadError}
          </div>
        )}
        {data && data.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            {t.gallery.empty}
          </div>
        )}

        {data && data.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {data.map((item, i) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
                className="group relative overflow-hidden rounded-lg border border-border/60 bg-card break-inside-avoid"
              >
                <img
                  src={item.image_url}
                  alt={item.title || item.caption || "Gallery"}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {(item.title || item.caption) && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title && (
                      <div className="font-display text-lg text-foreground">
                        {item.title}
                      </div>
                    )}
                    {item.caption && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.caption}
                      </div>
                    )}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        )}

        <VideoSection />
      </section>
    </div>
  );
}

/* ---------------- VİDEOLAR ---------------- */

function VideoSection() {
  const { t } = useT();
  const videos = [
    {
      src: "/videos/cilt-bakimi.mp4",
      poster: "/videos/cilt-bakimi-poster.jpg",
      title: t.gallery.videoSkin,
    },
    {
      src: "/videos/ipek-kirpik.mp4",
      poster: "/videos/ipek-kirpik-poster.jpg",
      title: t.gallery.videoLash,
    },
  ];

  return (
    <div className="mt-20 md:mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl text-gold-gradient">
          {t.gallery.videosTitle}
        </h2>
        <p className="mt-3 text-muted-foreground">{t.gallery.videosSubtitle}</p>
      </motion.div>

      {/* Dikey (9:16) videolar: mobilde alt alta, sm'den itibaren yan yana */}
      <div className="flex flex-col sm:flex-row items-start justify-center gap-6 md:gap-8">
        {videos.map((v, i) => (
          <motion.figure
            key={v.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="w-full max-w-[360px] mx-auto sm:mx-0 overflow-hidden rounded-lg border border-border/60 bg-card"
          >
            <video
              controls
              muted
              playsInline
              loop
              preload="metadata"
              poster={v.poster}
              width={720}
              height={1280}
              className="w-full h-auto block aspect-[9/16] bg-muted"
            >
              <source src={v.src} type="video/mp4" />
              {t.gallery.videoFallback}
            </video>
            <figcaption className="px-4 py-3 font-display text-lg text-foreground">
              {v.title}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
