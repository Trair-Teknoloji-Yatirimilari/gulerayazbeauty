import { createFileRoute } from "@tanstack/react-router";
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
  ChevronRight,
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
import beautyPortrait from "@/assets/beauty-portrait.jpg";
import serviceBotox from "@/assets/service-botox.jpg";
import serviceFiller from "@/assets/service-filler.jpg";
import serviceMeso from "@/assets/service-meso.jpg";
import serviceGold from "@/assets/service-goldneedle.jpg";
import serviceLaser from "@/assets/service-laser.jpg";
import serviceHifu from "@/assets/service-hifu.jpg";
import { AppointmentForm } from "@/components/AppointmentForm";

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

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Philosophy />
      <Services />
      <Devices />
      <Journey />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#hakkinda", label: "Hakkımda" },
    { href: "#uygulamalar", label: "Uygulamalar" },
    { href: "#cihazlar", label: "Teknoloji" },
    { href: "#surec", label: "Süreç" },
    { href: "#iletisim", label: "İletişim" },
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
            Dr. Gökhan Değirmencioğlu
          </span>
          <span className="hidden lg:block text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Medikal Estetik
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#iletisim"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
        >
          Randevu <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary p-2"
          aria-label="Menu"
        >
          <div className="w-6 h-px bg-current mb-1.5" />
          <div className="w-6 h-px bg-current mb-1.5" />
          <div className="w-4 h-px bg-current ml-auto" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-foreground/80">
                {l.label}
              </a>
            ))}
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroClinic}
          alt="Lüks medikal estetik klinik ortamı"
          className="w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />
      </motion.div>

      {/* floating gold orb */}
      <div className="pointer-events-none absolute -top-24 -right-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-float-slow" />

      <motion.div style={{ opacity }} className="relative z-10 h-full flex items-end pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">
              Medikal Estetik Uzmanı
            </span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl">
            {"Dr. Gökhan".split("").map((c, i) => (
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
              Değirmencioğlu
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-8 max-w-xl text-lg text-foreground/70 leading-relaxed"
          >
            Yüzün doğal dengesini bozmadan; ölçülü, sanatsal ve bilimsel bir yaklaşımla
            tasarlanmış medikal estetik uygulamalar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#iletisim"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
            >
              Konsültasyon Talebi
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#uygulamalar"
              className="inline-flex items-center gap-3 rounded-full border border-border px-8 py-3.5 text-sm uppercase tracking-widest text-foreground/80 hover:border-primary hover:text-primary transition-all"
            >
              Uygulamalar
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/80"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Keşfet</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee() {
  const items = [
    "Botoks", "Dolgu", "Mezoterapi", "Altın İğne", "Q-Switch Lazer",
    "HIFU · LIFU", "Gençlik Aşısı", "Nefertiti Lift", "Jawline Design",
  ];
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

/* ---------------- ABOUT ---------------- */

function About() {
  return (
    <section id="hakkinda" className="relative py-24 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <motion.div
          {...fadeUp}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <img
              src={beautyPortrait}
              alt="Doğal medikal estetik sonucu"
              className="w-full h-full object-cover"
              width={1200}
              height={1600}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block border border-primary/40 bg-background/80 backdrop-blur px-6 py-4 rounded-sm">
            <div className="text-gold-gradient font-display text-4xl">15+</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              Yıl Klinik Deneyim
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">Hakkında</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Yüzün <span className="italic text-gold-gradient">mimarisine</span> sadık,
            <br /> sanatsal bir yaklaşım.
          </h2>
          <div className="hairline my-10 max-w-md" />
          <p className="text-foreground/75 leading-relaxed text-lg">
            Dr. Gökhan Değirmencioğlu, medikal estetik uygulamalarında yüzün doğal
            hatlarını, oranlarını ve mimiklerini koruyan bir perspektifle çalışır.
            Her yüz kendine has bir kompozisyondur; amaç değiştirmek değil,
            zamanın bıraktığı izleri incelikle rötuşlamaktır.
          </p>
          <p className="text-foreground/75 leading-relaxed mt-4">
            Klinikte tüm süreçler kişiye özel planlanır: yüz analizi, üç boyutlu
            değerlendirme, teknik seçim ve takip. Kullanılan tüm ürünler global
            standartlarda sertifikalı, cihazlar ise son nesil teknolojilerdir.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            {[
              { k: "Doğal", v: "Sonuç" },
              { k: "Hassas", v: "Teknik" },
              { k: "Steril", v: "Ortam" },
              { k: "Kişiye Özel", v: "Plan" },
            ].map((f) => (
              <div key={f.k} className="border-l border-primary/40 pl-4">
                <div className="text-gold-gradient font-display text-2xl">{f.k}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {f.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PHILOSOPHY ---------------- */

function Philosophy() {
  const lines = [
    "Yüz bir sanat eseridir.",
    "Uygulama değil, kompozisyon.",
    "Fark edilen değil, hissedilen bir tazelik.",
  ];
  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {lines.map((line, i) => (
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

/* ---------------- SHARED DETAIL ---------------- */

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
  open,
  onOpenChange,
  title,
  subtitle,
  image,
  items,
  detail,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  image: string;
  items: string[];
  detail: Detail;
}) {
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
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Detay</span>
              </div>
              <DialogTitle className="font-display text-3xl md:text-4xl font-normal">
                {title}
              </DialogTitle>
              <DialogDescription className="text-primary/90 italic font-display text-lg">
                {subtitle}
              </DialogDescription>
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
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Süre</div>
                <div className="text-foreground/90 mt-1">{detail.duration}</div>
              </div>
              <div>
                <Timer className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Etki</div>
                <div className="text-foreground/90 mt-1">{detail.effect}</div>
              </div>
              <div>
                <Repeat className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Aralık</div>
                <div className="text-foreground/90 mt-1">{detail.interval}</div>
              </div>
            </div>

            <div className="hairline my-6" />

            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">
                Uygulama Alanları
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <span
                    key={it}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card/50 text-foreground/75"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-foreground/70 italic border-l-2 border-primary/60 pl-4">
              {detail.closing}
            </p>

            {detail.faqs?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-primary">
                    Sık Sorulan Sorular
                  </span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {detail.faqs.map((f, idx) => (
                    <AccordionItem
                      key={f.q}
                      value={`faq-${idx}`}
                      className="border-b border-border/60"
                    >
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
                Randevu Al <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                Hekim kontrolünde
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

/* ---------------- SERVICES ---------------- */

type Service = {
  icon: typeof Syringe;
  title: string;
  subtitle: string;
  image: string;
  items: string[];
  detail: Detail;
};

const services: Service[] = [
  {
    icon: Syringe,
    title: "Botoks",
    subtitle: "Mimiklere sadık, ölçülü rahatlama",
    image: serviceBotox,
    items: [
      "Üst Yüz Botoksu",
      "Masseter (Çene İnceltme)",
      "Diş Sıkma Tedavisi",
      "Boyun · Nefertiti Lift",
      "Gummy Smile",
      "Terleme (Koltuk Altı / El / Ayak)",
      "Kaş Kaldırma",
      "Burun Ucu Kaldırma",
      "Çene Ucu Botoksu",
    ],
    detail: {
      pitch:
        "Yüz ifadenizi silmeden; alın, göz çevresi ve kaşlar arasındaki mimik çizgilerini yumuşatan hassas bir uygulama. Aşırı dozdan uzak, oranı koruyan mikro-dozaj ile doğal bir dinlenmişlik hissi.",
      benefits: [
        "Doğal mimik, hareketli ve canlı görünüm",
        "Alın, kaz ayakları ve öfke çizgilerinde belirgin yumuşama",
        "Çene inceltme ile yüzde V hattı",
        "Diş sıkma ve baş ağrısında rahatlama",
      ],
      duration: "15–20 dk",
      effect: "3–5 gün",
      interval: "4–6 ay",
      closing:
        "Amaç değişmek değil; dinlenmiş, aydınlık ve daha genç bir versiyonunuza kavuşmak.",
      faqs: [
        { q: "Botoks yüzümü donuk gösterir mi?", a: "Hayır. Mikro-dozaj tekniği ile mimikleriniz korunur; sadece istenmeyen çizgiler yumuşar. Amacımız hareketsiz değil, dinlenmiş bir ifade." },
        { q: "Etkisi ne zaman başlar, ne kadar sürer?", a: "İlk etki 3–5 gün içinde belli olur, tam sonuç 10–14 günde oturur. Ortalama 4–6 ay boyunca etkisini korur." },
        { q: "Uygulama ağrılı mıdır?", a: "Çok ince iğnelerle yapılır; hafif bir batma hissi dışında ağrı hissedilmez. Gerekirse soğutma veya numaralayıcı krem kullanılır." },
        { q: "Uygulama sonrası günlük hayata dönebilir miyim?", a: "Evet. İlk 4 saat uzanmamak, egzersiz ve sıcak ortamlardan uzak durmak dışında herhangi bir kısıtlama yoktur." },
      ],
    },
  },
  {
    icon: Droplets,
    title: "Dolgu",
    subtitle: "Hacim, kontur ve ışık",
    image: serviceFiller,
    items: [
      "Dudak Dolgusu",
      "Çene · Jawline Dolgusu",
      "Elmacık Kemiği · Malar",
      "Nazolabial",
      "Göz Altı Işık Dolgusu",
      "Şakak Dolgusu",
      "Ameliyatsız Burun Estetiği",
    ],
    detail: {
      pitch:
        "Zamanla azalan hacmi ve yüz mimarisinde kayan hatları hyaluronik asit bazlı, geri dönüşümü mümkün dolgularla yeniden tasarlıyoruz. Dudak, elmacık, çene ve göz altı için farklı yoğunlukta ürünler.",
      benefits: [
        "Elmacık ve çene hattında belirginlik",
        "Doğal dolgunlukta, orantılı dudak tasarımı",
        "Göz altı morluk ve çöküklüğünde ışık etkisi",
        "Ameliyatsız burun estetiği ile pürüzsüz profil",
      ],
      duration: "20–40 dk",
      effect: "Anında",
      interval: "9–18 ay",
      closing:
        "Doğallıktan taviz vermeden yüzün altın oranlarını yeniden görünür kılıyoruz.",
      faqs: [
        { q: "Dolgu kalıcı mıdır?", a: "Kullandığımız hyaluronik asit dolguları geri dönüşümlüdür ve 9–18 ay içinde vücut tarafından doğal olarak emilir. Gerektiğinde özel enzimle çözülebilir." },
        { q: "Dudağım şişkin veya orantısız görünür mü?", a: "Doğal ve ölçülü tasarım anlayışıyla yüz oranlarınıza uygun dozda uygulama yapılır. Amaç dudağınızı büyütmek değil, hatlarını dengelemektir." },
        { q: "İşleme hemen sonra sosyal hayata dönebilir miyim?", a: "Evet, ancak ilk 24–48 saat hafif şişlik ve nadiren morarma olabilir. Önemli bir davetten en az 1 hafta önce uygulama planlanır." },
        { q: "Göz altı ışık dolgusu herkese yapılır mı?", a: "Hayır. Göz altı fıtığı, ödem eğilimi ve cilt kalitesine göre uygunluk değerlendirilir; her hastaya yapılmaz." },
      ],
    },
  },
  {
    icon: Sparkles,
    title: "Mezoterapi & Gençlik Aşısı",
    subtitle: "Cildin biyolojik canlanması",
    image: serviceMeso,
    items: [
      "Cilt Mezoterapisi",
      "Saç Mezoterapisi",
      "Bölgesel İncelme",
      "Lipolitik Mezoterapi",
      "Gençlik Aşısı",
    ],
    detail: {
      pitch:
        "Vitamin, aminoasit ve hyaluronik asit kokteylleri ile cildi hücresel düzeyde besleyen bir tazelenme protokolü. Cilt parlar, gözenekler sıkılaşır, saç köklerinde güç geri kazanılır.",
      benefits: [
        "Cilt tonunda belirgin canlanma ve parlaklık",
        "İnce çizgilerde ve mat görünümde iyileşme",
        "Saç dökülmesinde durma, yeni çıkışa destek",
        "Bölgesel yağlanmada erime ve konturlama",
      ],
      duration: "20–30 dk",
      effect: "2–3 seans",
      interval: "4–6 seans / kür",
      closing:
        "Cildinizi kozmetikle örtmek yerine, içeriden aydınlatarak dönüştürüyoruz.",
      faqs: [
        { q: "Kaç seansta sonuç alırım?", a: "Genellikle 4–6 seanslık bir kür önerilir. İlk canlanma 2–3 seansta hissedilir, kalıcı etkiler kür sonunda oturur." },
        { q: "Saç mezoterapisi dökülmeyi durdurur mu?", a: "Aktif dökülme dönemindeki uygun vakalarda dökülmeyi belirgin şekilde yavaşlatır ve yeni saç çıkışını destekler. Genetik kellikte destek tedavisidir." },
        { q: "Hamilelikte veya emzirirken uygulanır mı?", a: "Hayır. Hamilelik ve emzirme döneminde mezoterapi ve gençlik aşısı önerilmez." },
        { q: "Uygulama sonrası ne yapmamalıyım?", a: "12 saat makyaj yapmamak, 24 saat sauna/hamam ve yoğun spor yapmamak, güneşten korunmak yeterlidir." },
      ],
    },
  },
];

function Services() {
  return (
    <section id="uygulamalar" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">Uygulamalar</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Enjeksiyon <span className="italic text-gold-gradient">sanatı</span>
          </h2>
          <p className="mt-6 text-foreground/70 text-lg leading-relaxed">
            Her uygulama, kişinin yüz anatomisi ve estetik hedefleri
            doğrultusunda planlanır. Aşağıdaki başlıklar, kliniğimizde en sık
            uygulanan tedavilerdir.
          </p>
        </motion.div>

        <div className="mt-16 space-y-24">
          {services.map((s, i) => (
            <ServiceRow key={s.title} service={s} reversed={i % 2 === 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, reversed, index }: { service: Service; reversed: boolean; index: number }) {
  const Icon = service.icon;
  const [open, setOpen] = useState(false);
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
            src={service.image}
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
          Detayları Gör <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={service.title}
          subtitle={service.subtitle}
          image={service.image}
          items={service.items}
          detail={service.detail}
        />
      )}
    </motion.div>
  );
}

/* ---------------- DEVICES ---------------- */

type Device = {
  icon: typeof Zap;
  name: string;
  tag: string;
  desc: string;
  image: string;
  items: string[];
  detail: Detail;
};

const devices: Device[] = [
  {
    icon: Zap,
    name: "Altın İğne",
    tag: "Fraksiyonel Radyofrekans",
    desc: "Cildin derin katmanlarında kolajen üretimini tetikleyen, izlere ve gözeneklere hassasiyetle çalışan altın uçlu radyofrekans teknolojisi.",
    image: serviceGold,
    items: [
      "Cilt Gençleştirme",
      "Sıkılaştırma",
      "Gözenek Tedavisi",
      "Akne İzi Tedavisi",
      "Kırışıklık Tedavisi",
      "Yara İzi (Skar) Tedavisi",
      "Boyun · Dekolte · El Gençleştirme",
    ],
    detail: {
      pitch:
        "Altın kaplı mikro iğneler, cildin belirlenen derinliğine radyofrekans enerjisi taşır. Üst tabakayı zedelemeden dermiste kolajen ve elastin üretimini tetikler; iz, gözenek ve gevşeklik aynı seansta iyileşir.",
      benefits: [
        "Akne izi ve yara izlerinde belirgin düzelme",
        "Gözeneklerde küçülme, cilt yüzeyinde pürüzsüzlük",
        "Kolajen artışıyla doğal sıkılaşma",
        "Boyun, dekolte ve elde gençleştirme",
      ],
      duration: "45–60 dk",
      effect: "2–4 hafta",
      interval: "3–4 seans / 4 hafta arayla",
      closing:
        "Filtresiz aydınlık bir cilt için, cildi içeriden yeniden inşa eden altın standart.",
      faqs: [
        { q: "Altın iğne acı verir mi?", a: "Uygulama öncesi yoğun numaralayıcı krem uygulanır; işlem sırasında yalnızca hafif titreşim ve sıcaklık hissi olur." },
        { q: "İşlem sonrası izlenim nasıldır?", a: "İlk 24–48 saat hafif kızarıklık ve kuruluk olabilir. 3. günden itibaren makyajla kolayca kapatılır ve sosyal hayata dönülür." },
        { q: "Kaç seans gerekir?", a: "Akne izi ve gençleştirme için ortalama 3–4 seans, 4 hafta aralıklarla planlanır. Yılda 1 tekrar seansı sonucu korur." },
        { q: "Yaz aylarında yapılabilir mi?", a: "Yapılabilir; ancak sonrasında en az 4 hafta güneş koruyucu kullanımı ve doğrudan güneşten kaçınma şarttır." },
      ],
    },
  },
  {
    icon: Sun,
    name: "Q-Switch Lazer",
    tag: "Pigment & Leke Tedavisi",
    desc: "Cildin tonunu bozan pigmentleri hedef alan, yüzeyi zedelemeden çalışan hassas lazer sistemi. Leke, dövme ve kalıcı makyaj temizliği.",
    image: serviceLaser,
    items: [
      "Güneş ve Yaşlılık Lekesi",
      "Çil Tedavisi",
      "Melazma (Uygun Vakalar)",
      "Hiperpigmentasyon",
      "Karbon Peeling",
      "Cilt Tonu Eşitleme",
      "Kalıcı Makyaj · Dövme Silme",
    ],
    detail: {
      pitch:
        "Nano-saniye atımlarıyla yalnızca pigmenti hedef alan, çevre dokuyu koruyan hassas lazer. Güneş lekesinden dövme silmeye kadar geniş bir aralıkta güvenli ve öngörülebilir sonuç sağlar.",
      benefits: [
        "Güneş ve yaşlılık lekelerinde ton eşitleme",
        "Karbon peeling ile parlak, arınmış cilt",
        "Kalıcı makyaj ve dövme temizliği",
        "Downtime düşük, günlük hayata hızlı dönüş",
      ],
      duration: "20–30 dk",
      effect: "1–2 seans sonrası",
      interval: "3–6 seans / 3–4 hafta arayla",
      closing:
        "Kapatmadan aydınlanan bir cilt: lekelerinizi silen, tonunuzu yeniden dengeleyen teknoloji.",
      faqs: [
        { q: "Q-Switch her cilt tonuna uygun mu?", a: "Uygun parametrelerle koyu cilt tonlarında da güvenle uygulanabilir. Uygulama öncesi cilt tipi ve leke türü mutlaka değerlendirilir." },
        { q: "Dövme tamamen silinir mi?", a: "Dövmenin rengi, mürekkep kalitesi ve yaşına göre 5–10 seans arasında belirgin şekilde açılır; çoğu vakada tamamen silinebilir." },
        { q: "Karbon peeling nedir?", a: "Cildin üzerine sürülen özel karbon maskenin lazerle buharlaştırıldığı; gözenekleri temizleyen ve cildi parlatan hızlı bir uygulamadır." },
        { q: "İşlem sonrası ne yapmalıyım?", a: "En az 4 hafta güneş koruyucu kullanmak, ovalamamak ve nemlendirici kullanmak sonucu belirgin şekilde iyileştirir." },
      ],
    },
  },
  {
    icon: Waves,
    name: "HIFU · LIFU",
    tag: "Ameliyatsız Yüz Germe",
    desc: "Yüksek yoğunluklu odaklanmış ultrason ile SMAS tabakasına ulaşan; ameliyatsız yüz germe, jawline belirginleştirme ve vücut sıkılaştırma teknolojisi.",
    image: serviceHifu,
    items: [
      "Ameliyatsız Yüz Germe",
      "Cilt Sıkılaştırma",
      "Jawline Belirginleştirme",
      "Gıdı Toparlama",
      "Kaş Kaldırma",
      "Dekolte Sıkılaştırma",
      "Karın · Kol · Vücut Sıkılaştırma",
    ],
    detail: {
      pitch:
        "Odaklanmış ultrason enerjisi; cerrahide gerdirilen SMAS tabakasına kesi olmadan ulaşır. Cilt kendi kolajenini yeniden üreterek aylar içinde toparlanır; jawline belirginleşir, gıdı ve gevşeklik geri çekilir.",
      benefits: [
        "Ameliyatsız yüz germe ve toparlanma",
        "Jawline ve elmacık hatlarında belirginlik",
        "Boyun, dekolte ve gıdıda sıkılaşma",
        "Karın, kol ve vücutta bölgesel toparlama",
      ],
      duration: "45–90 dk",
      effect: "6–12 hafta içinde belirginleşir",
      interval: "Yılda 1–2 seans",
      closing:
        "Neşteri, dikişi ve iyileşme sürecini elemeden yüzün mimarisini yeniden yukarı taşıyoruz.",
      faqs: [
        { q: "HIFU ile LIFU arasındaki fark nedir?", a: "HIFU derin SMAS tabakasına odaklanır ve germe etkisi güçlüdür; LIFU daha yüzeysel katmanlarda çalışır, cilt sıkılaştırma ve doku canlandırma sağlar. Çoğu zaman kombine uygulanır." },
        { q: "Ameliyat gibi sonuç verir mi?", a: "Cerrahi germe kadar dramatik olmasa da; hafif–orta düzey gevşemede ameliyatsız, izsiz ve iyileşme süreci gerektirmeyen belirgin bir toparlama sağlar." },
        { q: "Etkisi ne zaman görülür?", a: "İlk etki uygulama sonrası hissedilse de kalıcı toparlanma 6–12 hafta içinde kolajen üretimiyle birlikte belirginleşir." },
        { q: "Kimlere uygulanmaz?", a: "Yüzde metal implant, kalp pili, aktif cilt enfeksiyonu, hamilelik ve ileri derece sarkması olan hastalara uygulanmaz." },
      ],
    },
  },
];

function Devices() {
  return (
    <section id="cihazlar" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">Teknoloji</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Cihazlarımız &<br /><span className="italic text-gold-gradient">enerji tabanlı tedaviler</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {devices.map((d, i) => (
            <DeviceCard key={d.name} device={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCard({ device, index }: { device: Device; index: number }) {
  const Icon = device.icon;
  const [open, setOpen] = useState(false);
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
          src={device.image}
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
          Detaylı Bilgi <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={device.name}
          subtitle={device.tag}
          image={device.image}
          items={device.items}
          detail={device.detail}
        />
      )}
    </motion.article>
  );
}

/* ---------------- JOURNEY ---------------- */

function Journey() {
  const steps = [
    { n: "01", t: "Konsültasyon", d: "Yüz analizi, beklentilerin dinlenmesi ve kişiye özel plan." },
    { n: "02", t: "Tasarım", d: "Anatomiye ve estetik dengeye göre teknik ve ürün seçimi." },
    { n: "03", t: "Uygulama", d: "Steril klinik ortamında hassas, konforlu uygulama." },
    { n: "04", t: "Takip", d: "Kontrol seansları ve uzun vadeli bakım önerileri." },
  ];
  return (
    <section id="surec" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">Süreç</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Kliniğimize <span className="italic text-gold-gradient">yolculuk</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
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
  return (
    <section id="iletisim" className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/15 blur-[130px] animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">İletişim</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Kişiye özel bir <span className="italic text-gold-gradient">konsültasyon</span> için
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl mx-auto">
            Sorularınız ve randevu talepleriniz için bize ulaşın. Ekibimiz en kısa
            sürede size dönüş yapacaktır.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: "Telefon", value: "+90 (___) ___ __ __", href: "tel:" },
            { icon: Mail, label: "E-posta", value: "info@drgokhandegirmencioglu.com", href: "mailto:info@drgokhandegirmencioglu.com" },
            { icon: MapPin, label: "Klinik", value: "İstanbul, Türkiye", href: "#" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
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

        <motion.div {...fadeUp} className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary/80">Randevu Formu</span>
              <div className="h-px w-8 bg-primary/60" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-foreground">
              Talebinizi <span className="italic text-gold-gradient">bize bırakın</span>
            </h3>
          </div>
          <AppointmentForm />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="relative border-t border-border/40 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-gold-gradient font-display text-base tracking-wide whitespace-nowrap">
            Dr. Gökhan Değirmencioğlu
          </span>
          <span className="hidden md:block text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Medikal Estetik
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Dr. Gökhan Değirmencioğlu. Tüm hakları saklıdır.
        </p>
        <a
          href="#"
          aria-label="Instagram"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Instagram className="w-4 h-4" />
        </a>
      </div>
      <p className="mt-6 px-6 text-[10px] text-muted-foreground/60 text-center max-w-3xl mx-auto leading-relaxed">
        Bu sitedeki bilgiler tanıtım amaçlıdır ve hekim muayenesi yerine geçmez.
        Uygulama sonuçları kişiye göre farklılık gösterebilir.
      </p>
    </footer>
  );
}
