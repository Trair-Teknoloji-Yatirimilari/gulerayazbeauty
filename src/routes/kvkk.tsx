import { SITE_URL } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Shield, Mail, ArrowLeft, Clock, Trash2, Eye, Lock, FileText } from "lucide-react";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [
      { title: "KVKK Aydınlatma Metni | Güler Ayaz Beauty" },
      { name: "description", content: "Güler Ayaz Beauty Kişisel Verilerin İşlenmesi Aydınlatma Metni." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "KVKK Aydınlatma Metni | Güler Ayaz Beauty" },
      { property: "og:description", content: "Kişisel verilerinizin nasıl işlendiği, saklandığı ve haklarınız." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/kvkk` }],
  }),
  component: KvkkPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const ICONS: Record<string, React.ElementType> = {
  FileText, Eye, Shield, Lock, Clock, Mail, Trash2,
};

function KvkkPage() {
  const { t } = useT();
  const legal = t.legal;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {legal.backHome}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-4">{legal.heroBadge}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-gold-gradient italic">
            {legal.title}
          </h1>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto">
            {legal.subtitle}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">{legal.lastUpdated}</p>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-12">
          <p className="text-foreground/80 leading-relaxed border-l-2 border-primary/60 pl-5 italic">
            {legal.intro}
          </p>

          {legal.sections.map((sec) => {
            const Icon = ICONS[sec.icon] ?? FileText;
            return (
              <section key={sec.title} className="border-b border-border/30 pb-10 last:border-0">
                <div className="flex items-center gap-3 mb-5">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-2xl md:text-3xl">{sec.title}</h2>
                </div>
                <div className="pl-8 whitespace-pre-line text-foreground/80 leading-relaxed text-sm">
                  {sec.body}
                </div>
              </section>
            );
          })}

          <div className="pt-8 border-t border-border/40 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {legal.footerNote1}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {legal.footerNote2}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
