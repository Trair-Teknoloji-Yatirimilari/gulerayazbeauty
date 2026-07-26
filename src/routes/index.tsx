import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { memo, useRef, useState } from "react";
import {
  Sparkles,
  Syringe,
  Droplets,
  Zap,
  Sun,
  Waves,
  ChevronDown,
  Phone,
  MapPin,
  Instagram,
  Mail,
  ArrowUpRight,
  Check,
  Clock,
  Timer,
  Repeat,
  ShieldCheck,
  GraduationCap,
  HeartPulse,
  Award,
  Stethoscope,
  Building2,
  Leaf,
  Activity,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import heroClinic from "@/assets/hero-clinic.jpg";
import drPortrait from "@/assets/dr-portrait.jpg.asset.json";
import serviceBotox from "@/assets/service-botox.jpg";
import serviceFiller from "@/assets/service-filler.jpg";
import serviceMeso from "@/assets/service-meso.jpg";
import serviceGold from "@/assets/service-goldneedle.jpg";
import serviceLaser from "@/assets/service-laser.jpg";
import serviceHifu from "@/assets/service-hifu.jpg";
import { AppointmentForm } from "@/components/AppointmentForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Gökhan Değirmencioğlu | Medikal Estetik Kliniği" },
      { name: "description", content: "Botoks, dolgu, mezoterapi, altın iğne, Q-Switch lazer, HIFU ve LIFU uygulamalarında doğal ve sanatsal medikal estetik. Randevu için iletişime geçin." },
      { property: "og:title", content: "Dr. Gökhan Değirmencioğlu | Medikal Estetik" },
      { property: "og:description", content: "Sinematik bir estetik deneyim. Doğal, dengeli ve hassas medikal estetik uygulamalar." },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---- Icon maps (dictionary carries copy; icons stay client-side) ---- */
const CREDENTIAL_ICONS = [GraduationCap, HeartPulse, Award, Stethoscope];
const MILESTONE_ICONS = [
  Activity, Building2, GraduationCap, Stethoscope, HeartPulse,
  HeartPulse, Activity, Leaf, Award, Sparkles,
];
const SERVICE_ICONS: Record<string, typeof Syringe> = {
  botox: Syringe, filler: Droplets, meso: Sparkles,
};
const SERVICE_IMAGES: Record<string, string> = {
  botox: serviceBotox, filler: serviceFiller, meso: serviceMeso,
};
const DEVICE_ICONS: Record<string, typeof Zap> = {
  gold: Zap, qswitch: Sun, hifu: Waves,
};
const DEVICE_IMAGES: Record<string, string> = {
  gold: serviceGold, qswitch: serviceLaser, hifu: serviceHifu,
};

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <HeroCta />
      <Marquee />
      <About />
      <Philosophy />
      <Services />
      <Devices />
      <Journey />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const links: { href: string; label: string; route?: boolean }[] = [
    { href: "#hakkinda", label: t.nav.about },
    { href: "#uygulamalar", label: t.nav.services },
    { href: "#cihazlar", label: t.nav.devices },
    { href: "#surec", label: t.nav.journey },
    { href: "/blog", label: t.nav.blog, route: true },
    { href: "#sss", label: t.nav.faq },
    { href: "#iletisim", label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="text-gold-gradient font-display text-base md:text-lg tracking-wide whitespace-nowrap">
            {t.nav.brand}
          </span>
          <span className="hidden lg:block text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            {t.nav.tagline}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.route ? (
              <Link key={l.href} to={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
              </a>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <a href="#iletisim" className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            {t.nav.ctaAppointment} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setOpen(!open)} className="text-primary p-2" aria-label={t.nav.menuAria}>
            <div className="w-6 h-px bg-current mb-1.5" />
            <div className="w-6 h-px bg-current mb-1.5" />
            <div className="w-4 h-px bg-current ml-auto" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) =>
              l.route ? (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-sm text-foreground/80">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-foreground/80">{l.label}</a>
              ),
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useT();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <motion.div
        initial={{ filter: "brightness(0.72) saturate(0.85)", opacity: 0.9 }}
        animate={{ filter: "brightness(1) saturate(1)", opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <img src={heroClinic} alt={t.hero.heroAlt} className="w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent blur-[1px] animate-hero-scan" />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-primary/10 to-transparent animate-hero-scan" />
      </div>

      <div className="pointer-events-none absolute -top-24 -right-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-float-slow" />

      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
        {[
          { left: "12%", delay: "0s", duration: "14s", opacity: 0.35, drift: "18px" },
          { left: "26%", delay: "2.2s", duration: "18s", opacity: 0.25, drift: "-14px" },
          { left: "44%", delay: "4.5s", duration: "16s", opacity: 0.3, drift: "22px" },
          { left: "58%", delay: "1.1s", duration: "20s", opacity: 0.2, drift: "-10px" },
          { left: "72%", delay: "6s", duration: "15s", opacity: 0.28, drift: "16px" },
          { left: "86%", delay: "3.3s", duration: "17s", opacity: 0.22, drift: "-20px" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 w-[2px] h-[2px] rounded-full bg-ivory/80 animate-hero-particle"
            style={{
              left: p.left,
              bottom: `${10 + (i * 6)}%`,
              ["--particle-delay" as string]: p.delay,
              ["--particle-duration" as string]: p.duration,
              ["--particle-opacity" as string]: p.opacity,
              ["--particle-drift-x" as string]: p.drift,
            }}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex items-end pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.hero.badge}</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl">
            {t.hero.firstName.split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-gold-gradient italic"
            >
              {t.hero.lastName}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-8 max-w-xl text-lg text-foreground/70 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href="#iletisim" className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold">
              {t.hero.ctaConsult}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a href="#uygulamalar" className="inline-flex items-center gap-3 rounded-full border border-border px-8 py-3.5 text-sm uppercase tracking-widest text-foreground/80 hover:border-primary hover:text-primary transition-all">
              {t.hero.ctaServices}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-10 flex justify-center px-6">
        <svg viewBox="0 0 320 24" fill="none" className="w-full max-w-md h-6 text-primary/40 animate-hero-heartbeat" aria-hidden="true">
          <path d="M0 12 H120 L136 4 L152 20 L168 4 L184 20 L200 12 H320" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/80"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">{t.hero.discover}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- HERO CTA ---------------- */

function HeroCta() {
  const { t } = useT();
  return (
    <section className="relative z-20 -mt-24 md:-mt-32 pb-8 md:pb-12 pointer-events-none">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/70 backdrop-blur-xl border border-primary/30 rounded-sm px-6 py-6 md:px-10 md:py-8 shadow-elegant"
        >
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <div className="h-px w-8 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary/80">{t.nav.ctaAppointment}</span>
            </div>
            <p className="text-foreground/80 text-sm md:text-base max-w-md leading-relaxed">
              {t.hero.appointmentCtaDesc}
            </p>
          </div>
          <a href="#randevu-formu" className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold shrink-0">
            {t.hero.appointmentCta}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee() {
  const { t } = useT();
  const items = t.marquee;
  return (
    <div className="border-y border-border/40 bg-card/40 backdrop-blur overflow-hidden py-6">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="font-display text-2xl md:text-3xl text-foreground/60">{it}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ABOUT / BIOGRAPHY ---------------- */

function About() {
  const { t } = useT();
  return (
    <section id="hakkinda" className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <motion.div {...fadeUp} className="lg:col-span-5 relative lg:sticky lg:top-28">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img src={drPortrait.url} alt={t.about.portraitAlt} className="w-full h-full object-cover" width={447} height={447} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block border border-primary/40 bg-background/90 backdrop-blur px-6 py-4 rounded-sm">
              <div className="text-gold-gradient font-display text-4xl">{t.about.experienceYears}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {t.about.experienceBadge}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary" />
              <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.about.badge}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              {t.about.firstName}
              <br />
              <span className="italic text-gold-gradient">{t.about.lastName}</span>
            </h2>
            <div className="hairline my-8 max-w-md" />

            {t.about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? "text-foreground/80 leading-relaxed text-lg" : "text-foreground/75 leading-relaxed mt-4"}
              >
                {p}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {t.about.credentials.map((c, i) => {
                const Icon = CREDENTIAL_ICONS[i] ?? Award;
                return (
                  <div key={c.label} className="group border border-border/60 bg-card/30 hover:bg-card/60 transition-colors p-5 rounded-sm">
                    <Icon className="w-6 h-6 text-primary mb-3" strokeWidth={1.2} />
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
                    <div className="text-sm text-foreground/90 mt-1 leading-snug">{c.value}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="mt-32">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary" />
              <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.about.careerBadge}</span>
              <div className="h-px w-10 bg-primary" />
            </div>
            <h3 className="font-display text-3xl md:text-5xl">
              {t.about.careerTitleA} <span className="italic text-gold-gradient">{t.about.careerTitleB}</span>
            </h3>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
            <div className="space-y-10">
              {t.about.milestones.map((m, i) => {
                const Icon = MILESTONE_ICONS[i] ?? Sparkles;
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={m.year + m.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${isLeft ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <div className="pl-12 md:pl-0">
                        <div className="text-gold-gradient font-display text-2xl md:text-3xl">{m.year}</div>
                        <h4 className="text-lg text-foreground/90 mt-1">{m.title}</h4>
                        <p className="text-sm text-foreground/60 mt-2 leading-relaxed max-w-sm">{m.desc}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 top-0 w-8 h-8 rounded-full border border-primary/50 bg-background flex items-center justify-center z-10">
                      <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div {...fadeUp} className="mt-24 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent rounded-sm p-8 md:p-12 text-center">
          <h4 className="font-display text-2xl md:text-3xl text-foreground/90">
            {t.about.quote}
          </h4>
          <p className="mt-4 text-foreground/60 text-sm max-w-2xl mx-auto">
            {t.about.quoteDesc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PHILOSOPHY ---------------- */

function Philosophy() {
  const { t } = useT();
  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {t.philosophy.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-3xl md:text-5xl lg:text-6xl leading-tight ${
              i === 1 ? "text-gold-gradient italic my-6" : "text-foreground/90"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SHARED DETAIL DIALOG ---------------- */

type Detail = {
  pitch: string;
  benefits: string[];
  duration: string;
  effect: string;
  interval: string;
  closing: string;
  faqs: { q: string; a: string }[];
};

const DetailDialog = memo(function DetailDialog({
  open, onOpenChange, title, subtitle, image, items, detail,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  image: string;
  items: string[];
  detail: Detail;
}) {
  const { t } = useT();
  const L = t.detailLabels;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background border border-primary/30 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-full overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/70" />
          </div>
          <div className="p-8 md:p-10">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary">{L.detail}</span>
              </div>
              <DialogTitle className="font-display text-3xl md:text-4xl font-normal">{title}</DialogTitle>
              <DialogDescription className="text-primary/90 italic font-display text-lg">{subtitle}</DialogDescription>
            </DialogHeader>

            <p className="mt-5 text-foreground/80 leading-relaxed text-sm">{detail.pitch}</p>

            <div className="mt-6 space-y-2">
              {detail.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="hairline my-6" />

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <Clock className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.duration}</div>
                <div className="text-foreground/90 mt-1">{detail.duration}</div>
              </div>
              <div>
                <Timer className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.effect}</div>
                <div className="text-foreground/90 mt-1">{detail.effect}</div>
              </div>
              <div>
                <Repeat className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.interval}</div>
                <div className="text-foreground/90 mt-1">{detail.interval}</div>
              </div>
            </div>

            <div className="hairline my-6" />

            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">{L.areas}</div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <span key={it} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card/50 text-foreground/75">
                    {it}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-foreground/70 italic border-l-2 border-primary/60 pl-4">{detail.closing}</p>

            {detail.faqs?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-primary">{L.faqSection}</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {detail.faqs.map((f, idx) => (
                    <AccordionItem key={f.q} value={`faq-${idx}`} className="border-b border-border/60">
                      <AccordionTrigger className="text-left text-sm font-normal text-foreground/90 hover:text-primary hover:no-underline py-3">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-4">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <a
                href="#iletisim"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
              >
                {L.appointmentCta} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                {L.doctorSupervised}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

/* ---------------- SERVICES ---------------- */

function Services() {
  const { t } = useT();
  return (
    <section id="uygulamalar" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.services.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.services.titleA} <span className="italic text-gold-gradient">{t.services.titleB}</span>
          </h2>
          <p className="mt-6 text-foreground/70 text-lg leading-relaxed">{t.services.intro}</p>
        </motion.div>

        <div className="mt-16 space-y-24">
          {t.services.items.map((s, i) => (
            <ServiceRow key={s.key} service={s} reversed={i % 2 === 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceItem = ReturnType<typeof useT>["t"]["services"]["items"][number];

function ServiceRow({ service, reversed, index }: { service: ServiceItem; reversed: boolean; index: number }) {
  const { t } = useT();
  const Icon = SERVICE_ICONS[service.key] ?? Syringe;
  const image = SERVICE_IMAGES[service.key] ?? serviceBotox;
  const [open, setOpen] = useState(false);
  const detail: Detail = {
    pitch: service.pitch,
    benefits: service.benefits,
    duration: service.duration,
    effect: service.effect,
    interval: service.interval,
    closing: service.closing,
    faqs: service.faqs,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${reversed ? "lg:[&>div:first-child]:order-2" : ""}`}
    >
      <div className="lg:col-span-6 relative group">
        <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
          <motion.img
            src={image}
            alt={service.title}
            className="w-full h-full object-cover"
            width={1200}
            height={1200}
            loading="lazy"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 text-primary/80">
            <span className="font-display text-sm">0{index + 1}</span>
            <div className="h-px w-8 bg-primary/60" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-6">
        <Icon className="w-10 h-10 text-primary mb-6" strokeWidth={1} />
        <h3 className="font-display text-4xl md:text-5xl">{service.title}</h3>
        <p className="mt-3 text-primary/90 italic font-display text-xl">{service.subtitle}</p>
        <div className="hairline my-8 max-w-xs" />
        <ul className="grid sm:grid-cols-2 gap-3">
          {service.items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-foreground/80 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen(true)}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/60 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
        >
          {t.detailLabels.seeDetails} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={service.title}
          subtitle={service.subtitle}
          image={image}
          items={service.items}
          detail={detail}
        />
      )}
    </motion.div>
  );
}

/* ---------------- DEVICES ---------------- */

function Devices() {
  const { t } = useT();
  return (
    <section id="cihazlar" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.devices.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.devices.titleA}<br /><span className="italic text-gold-gradient">{t.devices.titleB}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.devices.items.map((d, i) => (
            <DeviceCard key={d.key} device={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type DeviceItem = ReturnType<typeof useT>["t"]["devices"]["items"][number];

function DeviceCard({ device, index }: { device: DeviceItem; index: number }) {
  const { t } = useT();
  const Icon = DEVICE_ICONS[device.key] ?? Zap;
  const image = DEVICE_IMAGES[device.key] ?? serviceGold;
  const [open, setOpen] = useState(false);
  const detail: Detail = {
    pitch: device.pitch,
    benefits: device.benefits,
    duration: device.duration,
    effect: device.effect,
    interval: device.interval,
    closing: device.closing,
    faqs: device.faqs,
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-background border border-border/60 rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-700 flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={device.name}
          className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
          width={1200}
          height={1200}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute top-6 left-6">
          <Icon className="w-8 h-8 text-primary" strokeWidth={1} />
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-[0.35em] text-primary/80">{device.tag}</span>
        <h3 className="font-display text-3xl mt-2">{device.name}</h3>
        <p className="text-sm text-foreground/70 leading-relaxed mt-4">{device.desc}</p>
        <div className="hairline my-6" />
        <ul className="space-y-2 flex-1">
          {device.items.map((it) => (
            <li key={it} className="flex items-start gap-2 text-xs text-foreground/70">
              <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {it}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex items-center justify-between gap-2 rounded-full border border-primary/50 px-5 py-2.5 text-[11px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
        >
          {t.detailLabels.moreInfo} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={device.name}
          subtitle={device.tag}
          image={image}
          items={device.items}
          detail={detail}
        />
      )}
    </motion.article>
  );
}

/* ---------------- JOURNEY ---------------- */

function Journey() {
  const { t } = useT();
  return (
    <section id="surec" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.journey.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.journey.titleA} <span className="italic text-gold-gradient">{t.journey.titleB}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {t.journey.steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-full border border-primary/60 bg-background flex items-center justify-center mb-6 relative z-10">
                <span className="font-display text-primary text-lg">{s.n}</span>
              </div>
              <h4 className="font-display text-2xl">{s.t}</h4>
              <p className="text-sm text-foreground/65 mt-3 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */

function Contact() {
  const { t } = useT();
  const cards = [
    { icon: Phone, label: t.contact.cards.phone, value: "+90 545 450 88 34", href: "tel:+905454508834" },
    { icon: Mail, label: t.contact.cards.email, value: "info@drgokhandegirmencioglu.com", href: "mailto:info@drgokhandegirmencioglu.com" },
    {
      icon: MapPin,
      label: t.contact.cards.clinic,
      value: t.contact.address,
      href: "https://www.google.com/maps/search/?api=1&query=Huzur+Mahallesi+Azerbaycan+Caddesi+No:4+Skyland+Ofis+B+Blok+Kat:6+Daire:99+Sarıyer+İstanbul",
    },
    { icon: Instagram, label: t.contact.cards.instagram, value: "@dr.gokhandegirmencioglu", href: "https://www.instagram.com/dr.gokhandegirmencioglu/" },
  ];
  return (
    <section id="iletisim" className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/15 blur-[130px] animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.contact.badge}</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.contact.titleA} <span className="italic text-gold-gradient">{t.contact.titleB}</span> {t.contact.titleC}
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl mx-auto">{t.contact.intro}</p>
        </motion.div>

        <motion.div {...fadeUp} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative bg-card/60 backdrop-blur border border-border/60 hover:border-primary/60 rounded-sm p-8 transition-all duration-500"
            >
              <c.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1} />
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{c.label}</div>
              <div className="font-display text-lg mt-2 text-foreground/90 group-hover:text-primary transition-colors break-words">
                {c.value}
              </div>
              <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-primary/50 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </motion.div>

        <motion.div {...fadeUp} id="randevu-formu" className="mt-16 max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary/80">{t.contact.formBadge}</span>
              <div className="h-px w-8 bg-primary/60" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-foreground">
              {t.contact.formTitleA} <span className="italic text-gold-gradient">{t.contact.formTitleB}</span>
            </h3>
          </div>
          <AppointmentForm />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const { t } = useT();
  return (
    <section id="sss" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.faqSection.badge}</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.faqSection.titleA} <span className="italic text-gold-gradient">{t.faqSection.titleB}</span>
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl mx-auto">{t.faqSection.intro}</p>
        </motion.div>

        <motion.div {...fadeUp}>
          <Accordion type="single" collapsible className="w-full">
            {t.faqSection.items.map((f, idx) => (
              <AccordionItem key={f.q} value={`faq-${idx}`} className="border-b border-border/60">
                <AccordionTrigger className="text-left text-base font-normal text-foreground/90 hover:text-primary hover:no-underline py-5">
                  <span className="flex items-start gap-4">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.2} />
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-5 pl-9">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div {...fadeUp} className="mt-12 text-center">
          <a href="#iletisim" className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            {t.faqSection.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  const { t } = useT();
  const addressLines = t.footer.address.split("\n");
  return (
    <footer className="relative border-t border-border/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 items-start">
          <div>
            <span className="text-gold-gradient font-display text-lg tracking-wide whitespace-nowrap block">
              {t.nav.brand}
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mt-2 block">
              {t.footer.tagline}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{t.footer.contactHeader}</h4>
            <a href="tel:+905454508834" className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
              +90 545 450 88 34
            </a>
            <a href="mailto:info@drgokhandegirmencioglu.com" className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" strokeWidth={1.5} />
              info@drgokhandegirmencioglu.com
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Huzur+Mahallesi+Azerbaycan+Caddesi+No:4+Skyland+Ofis+B+Blok+Kat:6+Daire:99+Sarıyer+İstanbul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5" strokeWidth={1.5} />
              <span>
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </a>
          </div>

          <div className="md:text-right">
            <h4 className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">{t.footer.socialHeader}</h4>
            <a
              href="https://www.instagram.com/dr.gokhandegirmencioglu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram: @dr.gokhandegirmencioglu"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @dr.gokhandegirmencioglu
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {t.nav.brand}. {t.footer.copyright}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
            <Link to="/blog" className="hover:text-primary transition-colors underline underline-offset-2">
              {t.footer.blogLink}
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/kvkk" className="hover:text-primary transition-colors underline underline-offset-2">
              {t.footer.legalLink}
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.disclaimer}</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60 text-center max-w-3xl mx-auto leading-relaxed">
            {t.footer.resultDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
