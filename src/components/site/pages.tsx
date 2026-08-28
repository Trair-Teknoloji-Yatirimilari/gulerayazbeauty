import { motion } from "motion/react";
import { Shield, Mail, ArrowLeft, Clock, Trash2, Eye, Lock, FileText } from "lucide-react";
import { useT } from "@/i18n/context";
import { LocaleLink } from "@/components/site/LocaleLink";
import {
  SiteLayout,
  PageHero,
  Hero,
  Trusted,
  Stats,
  Features,
  HowItWorks,
  UseCases,
  Pricing,
  FAQ,
  Contact,
} from "@/components/site/sections";

export function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Trusted />
      <Stats />
      <Features />
      <HowItWorks />
      <UseCases />
      <Pricing />
      <FAQ />
      <Contact />
    </SiteLayout>
  );
}

export function FeaturesPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.features} title={t.features.title} subtitle={t.features.subtitle} />
      <Features withHeading={false} />
      <HowItWorks />
      <Contact />
    </SiteLayout>
  );
}

export function HowItWorksPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.howItWorks} title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
      <HowItWorks withHeading={false} />
      <Trusted />
      <Contact />
    </SiteLayout>
  );
}

export function UseCasesPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.useCases} title={t.useCases.title} subtitle={t.useCases.subtitle} />
      <UseCases withHeading={false} />
      <Features />
      <Contact />
    </SiteLayout>
  );
}

export function PricingPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.pricing} title={t.pricing.title} subtitle={t.pricing.subtitle} />
      <Pricing withHeading={false} />
      <FAQ />
      <Contact />
    </SiteLayout>
  );
}

export function ContactPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.contact} title={t.contact.title} subtitle={t.contact.subtitle} />
      <Contact withHeading={false} />
      <FAQ />
    </SiteLayout>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const ICONS: Record<string, React.ElementType> = {
  FileText, Eye, Shield, Lock, Clock, Mail, Trash2,
};

export function LegalPage() {
  const { t } = useT();
  const legal = t.legal;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-5">
          <LocaleLink
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {legal.backHome}
          </LocaleLink>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="mb-16 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary">{legal.heroBadge}</p>
          <h1 className="font-display text-4xl leading-tight text-gradient italic md:text-5xl">{legal.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-foreground/60">{legal.subtitle}</p>
          <p className="mt-4 text-xs text-muted-foreground">{legal.lastUpdated}</p>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-12">
          <p className="border-l-2 border-primary/60 pl-5 italic leading-relaxed text-foreground/80">{legal.intro}</p>

          {legal.sections.map((sec) => {
            const Icon = ICONS[sec.icon] ?? FileText;
            return (
              <section key={sec.title} className="border-b border-border/30 pb-10 last:border-0">
                <div className="mb-5 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <h2 className="font-display text-2xl md:text-3xl">{sec.title}</h2>
                </div>
                <div className="whitespace-pre-line pl-8 text-sm leading-relaxed text-foreground/80">{sec.body}</div>
              </section>
            );
          })}

          <div className="space-y-4 border-t border-border/40 pt-8">
            <p className="text-xs leading-relaxed text-muted-foreground">{legal.footerNote1}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{legal.footerNote2}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
