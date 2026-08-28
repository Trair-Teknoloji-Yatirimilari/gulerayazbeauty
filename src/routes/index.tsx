import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  MessageCircle,
  Calendar,
  Share2,
  Store,
  Headphones,
  BarChart3,
  Menu,
  X,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Instagram,
  Facebook,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/context";
import { SITE_URL, BRAND } from "@/lib/site";

const ICONS: Record<string, React.ElementType> = {
  MessageCircle,
  Calendar,
  Share2,
  Store,
  Headphones,
  BarChart3,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

const itemFade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrairX Connect — AI'lı Müşteri Temsilcisi ve Rezervasyon Asistanı" },
      { name: "description", content: "Web sitenize entegre edin; Instagram, Facebook ve WhatsApp'ı bağlayın. TrairX Connect 7/24 müşteri temsilcisi, satış danışmanı ve rezervasyon asistanı olarak çalışır." },
      { property: "og:title", content: "TrairX Connect — AI'lı Müşteri Temsilcisi" },
      { property: "og:description", content: "Web sitenize entegre edin; Instagram, Facebook ve WhatsApp'ı bağlayın. TrairX Connect 7/24 müşteri temsilcisi, satış danışmanı ve rezervasyon asistanı olarak çalışır." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Trusted />
        <Features />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#ozellikler", label: t.nav.features },
    { href: "#nasil-calisir", label: t.nav.howItWorks },
    { href: "#sektorler", label: t.nav.useCases },
    { href: "#fiyatlandirma", label: t.nav.pricing },
    { href: "#sss", label: t.nav.faq },
    { href: "#iletisim", label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex flex-col items-start leading-none group">
          <span className="text-lg md:text-xl font-semibold tracking-tight text-foreground">{t.nav.brand}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.nav.tagline}</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#iletisim"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t.nav.ctaDemo}
          </a>
        </div>

        <button
          aria-label={t.nav.menuAria}
          onClick={() => setOpen((p) => !p)}
          className="md:hidden p-2 text-foreground"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur"
        >
          <div className="px-6 py-4 space-y-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#iletisim"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t.nav.ctaDemo}
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function Hero() {
  const { t } = useT();
  return (
    <section id="top" className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight whitespace-pre-line">
              {t.hero.title}
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t.hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#nasil-calisir"
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="widget-mock rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{BRAND}</p>
                  <p className="text-xs text-muted-foreground">Çevrimiçi</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/60 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm text-foreground">Merhaba! Size nasıl yardımcı olabilirim? Randevu, ürün veya bilgi almak için yazmanız yeterli.</p>
                </div>
                <div className="ml-auto bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[75%]">
                  <p className="text-sm">Cuma günü 14:00 için randevu alabilir miyim?</p>
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <p className="text-sm text-foreground">Tabii, 14:00 için boş yerimiz var. Onaylamamı ister misiniz?</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Instagram className="w-3.5 h-3.5" />
                <Facebook className="w-3.5 h-3.5" />
                <Phone className="w-3.5 h-3.5" />
                <span className="ml-auto">Tüm kanallar bağlı</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Trusted() {
  const { t } = useT();
  return (
    <section className="py-12 border-y border-border/30 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          {t.trusted.title}
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {t.trusted.items.map((item) => (
            <span key={item} className="text-sm font-medium text-foreground/70">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useT();
  return (
    <section id="ozellikler" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.features}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.features.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.features.subtitle}</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {t.features.items.map((f) => {
            const Icon = ICONS[f.icon] ?? Sparkles;
            return (
              <motion.div
                key={f.title}
                variants={itemFade}
                className="group rounded-2xl border border-border/40 bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useT();
  return (
    <section id="nasil-calisir" className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.howItWorks}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.howItWorks.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.howItWorks.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span className="text-5xl font-semibold text-primary/10">{step.number}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const { t } = useT();
  return (
    <section id="sektorler" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.useCases}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.useCases.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.useCases.subtitle}</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {t.useCases.cases.map((c) => (
            <motion.div
              key={c.title}
              variants={itemFade}
              className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:bg-card transition-colors"
            >
              <h3 className="text-base font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useT();
  return (
    <section id="fiyatlandirma" className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.pricing}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.pricing.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.pricing.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.pricing.tiers.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl border p-6 ${tier.popular ? "border-primary bg-card shadow-lg" : "border-border/40 bg-card/60"}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
                  Popüler
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#iletisim"
                className={`mt-6 block w-full text-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${tier.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border/60 text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="sss" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.faq}</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.faq.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.faq.subtitle}</p>
        </motion.div>

        <div className="space-y-4">
          {t.faq.items.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium pr-4">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                  {item.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="iletisim" className="py-24 md:py-32 bg-primary/[0.03]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.contact}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.contact.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.contact.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border/40 bg-card p-6 md:p-8 shadow-sm"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-foreground font-medium">{t.contact.form.success}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.form.name} className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={t.contact.form.company} className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.form.email} className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.contact.form.phone} className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.form.message} rows={4} className="w-full rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t.contact.form.submit}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex flex-col leading-none mb-4">
              <span className="text-xl font-semibold text-foreground">{t.nav.brand}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.nav.tagline}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Sayfalar</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#ozellikler" className="text-foreground/70 hover:text-foreground">{t.nav.features}</a></li>
              <li><a href="#nasil-calisir" className="text-foreground/70 hover:text-foreground">{t.nav.howItWorks}</a></li>
              <li><a href="#fiyatlandirma" className="text-foreground/70 hover:text-foreground">{t.nav.pricing}</a></li>
              <li><a href="#sss" className="text-foreground/70 hover:text-foreground">{t.nav.faq}</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Yasal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kvkk" className="text-foreground/70 hover:text-foreground">{t.footer.links.privacy}</Link></li>
              <li><a href="#iletisim" className="text-foreground/70 hover:text-foreground">{t.footer.links.contact}</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{t.footer.copyright.replace("{year}", String(year))}</p>
          <p className="text-xs text-muted-foreground">{BRAND}</p>
        </div>
      </div>
    </footer>
  );
}
