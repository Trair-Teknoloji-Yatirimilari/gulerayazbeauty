import { Link } from "@tanstack/react-router";
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
import { useState, type ReactNode } from "react";
import { useT } from "@/i18n/context";
import { BRAND } from "@/lib/site";

const ICONS: Record<string, React.ElementType> = {
  MessageCircle,
  Calendar,
  Share2,
  Store,
  Headphones,
  BarChart3,
};

export const fadeUp = {
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

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="relative pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-5 text-muted-foreground">{subtitle}</p>
      </motion.div>
    </section>
  );
}

export function Header() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/ozellikler", label: t.nav.features },
    { to: "/nasil-calisir", label: t.nav.howItWorks },
    { to: "/sektorler", label: t.nav.useCases },
    { to: "/fiyatlandirma", label: t.nav.pricing },
    { to: "/iletisim", label: t.nav.contact },
  ] as const;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex flex-col items-start leading-none">
          <span className="text-lg md:text-xl font-semibold tracking-tight text-foreground">{t.nav.brand}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.nav.tagline}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground" }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/iletisim"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t.nav.ctaDemo}
          </Link>
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
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/iletisim"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t.nav.ctaDemo}
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function LiveChat() {
  const { t } = useT();
  const w = t.hero.widget;
  const bubbles = [
    { from: "bot" as const, text: w.msg1 },
    { from: "user" as const, text: w.msg2 },
    { from: "bot" as const, text: w.msg3 },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= bubbles.length) {
      const reset = setTimeout(() => setVisible(0), 5200);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setVisible((v) => v + 1), 1100 + visible * 350);
    return () => clearTimeout(timer);
  }, [visible, bubbles.length]);

  return (
    <div className="widget-mock rounded-[28px] p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse-ring">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{BRAND}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {w.status}
          </p>
        </div>
      </div>

      <div className="min-h-[210px] space-y-3">
        <AnimatePresence initial={false}>
          {bubbles.slice(0, visible).map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={
                b.from === "bot"
                  ? "max-w-[85%] rounded-2xl rounded-tl-md bg-secondary p-3"
                  : "ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-primary p-3 text-primary-foreground"
              }
            >
              <p className="text-sm leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
          {visible < bubbles.length && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-tl-md bg-secondary p-3"
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        {[Instagram, Facebook, Phone].map((Icon, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground/70"
          >
            <Icon className="h-3.5 w-3.5" />
          </motion.span>
        ))}
        <span className="ml-auto">{w.channels}</span>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useT();
  const { ref, y } = useParallax(50);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      <Aurora />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.hero.badge}
            </motion.div>

            <AnimatedHeadline
              text={t.hero.title}
              delay={0.15}
              className="text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-[4.2rem]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <Link
                  to="/iletisim"
                  className="shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/nasil-calisir"
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/70 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative [transform-perspective:1200px]"
          >
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-primary/10 blur-3xl" />
            <TiltCard>
              <LiveChat />
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const { t } = useT();
  return (
    <section className="border-y border-border/40 bg-card/50 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-10">
        {t.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Trusted() {
  const { t } = useT();
  return (
    <section className="border-b border-border/30 bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t.trusted.title}
        </p>
        <Marquee items={[...t.trusted.items]} />
      </div>
    </section>
  );
}

export function Features({ withHeading = true }: { withHeading?: boolean }) {
  const { t } = useT();
  return (
    <section id="ozellikler" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {withHeading && (
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.features}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.features.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.features.subtitle}</p>
          </motion.div>
        )}

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

export function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  const { t } = useT();
  return (
    <section id="nasil-calisir" className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {withHeading && (
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.howItWorks}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.howItWorks.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.howItWorks.subtitle}</p>
          </motion.div>
        )}

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

export function UseCases({ withHeading = true }: { withHeading?: boolean }) {
  const { t } = useT();
  return (
    <section id="sektorler" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {withHeading && (
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.useCases}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.useCases.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.useCases.subtitle}</p>
          </motion.div>
        )}

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

export function Pricing({ withHeading = true }: { withHeading?: boolean }) {
  const { t } = useT();
  return (
    <section id="fiyatlandirma" className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {withHeading && (
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.pricing}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.pricing.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.pricing.subtitle}</p>
          </motion.div>
        )}

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
                  {t.pricing.popular}
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
              <Link
                to="/iletisim"
                className={`mt-6 block w-full text-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${tier.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border/60 text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ({ withHeading = true }: { withHeading?: boolean }) {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="sss" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        {withHeading && (
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.faq}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.faq.title}</h2>
            <p className="mt-4 text-muted-foreground">{t.faq.subtitle}</p>
          </motion.div>
        )}

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

export function Contact({ withHeading = true }: { withHeading?: boolean }) {
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
            {withHeading && (
              <>
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.nav.contact}</p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.contact.title}</h2>
              </>
            )}
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

export function Footer() {
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
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.pages}</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ozellikler" className="text-foreground/70 hover:text-foreground">{t.nav.features}</Link></li>
              <li><Link to="/nasil-calisir" className="text-foreground/70 hover:text-foreground">{t.nav.howItWorks}</Link></li>
              <li><Link to="/sektorler" className="text-foreground/70 hover:text-foreground">{t.nav.useCases}</Link></li>
              <li><Link to="/fiyatlandirma" className="text-foreground/70 hover:text-foreground">{t.nav.pricing}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.legal}</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kvkk" className="text-foreground/70 hover:text-foreground">{t.footer.links.privacy}</Link></li>
              <li><Link to="/iletisim" className="text-foreground/70 hover:text-foreground">{t.footer.links.contact}</Link></li>
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
