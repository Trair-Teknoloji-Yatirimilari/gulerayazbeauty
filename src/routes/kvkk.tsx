import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Shield, Mail, Phone, MapPin, ArrowLeft, Clock, Trash2, Eye, Lock, FileText } from "lucide-react";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [
      { title: "KVKK Aydınlatma Metni | Dr. Gökhan Değirmencioğlu" },
      { name: "description", content: "Dr. Gökhan Değirmencioğlu Medikal Estetik Kliniği Kişisel Verilerin İşlenmesi Aydınlatma Metni." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "KVKK Aydınlatma Metni | Dr. Gökhan Değirmencioğlu" },
      { property: "og:description", content: "Kişisel verilerinizin nasıl işlendiği, saklandığı ve haklarınız." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KvkkPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Siteye dön
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Kişisel Verilerin İşlenmesi<br />
            <span className="text-gold-gradient italic">Aydınlatma Metni</span>
          </h1>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto">
            Bu sayfa, Dr. Gökhan Değirmencioğlu Medikal Estetik Kliniği tarafından
            hazırlanmıştır. Randevu talebi ve iletişim süreçlerindeki veri
            uygulamalarımız şeffaf bir şekilde açıklanmaktadır.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-12">
          <Section icon={FileText} title="Veri Sorumlusu">
            <p className="text-foreground/80 leading-relaxed">
              Kişisel verilerinizin işlenmesinden sorumlu tüzel kişi:
            </p>
            <div className="mt-4 p-5 bg-card/50 border border-border/60 rounded-sm space-y-3">
              <div className="font-display text-lg">Dr. Gökhan Değirmencioğlu</div>
              <div className="flex items-start gap-3 text-sm text-foreground/70">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Huzur Mahallesi Azerbaycan Caddesi No:4<br />
                  Skyland Ofis B Blok Kat:6 Daire:99<br />
                  34396 Sarıyer / İstanbul
                </span>
              </div>
              <a
                href="mailto:info@drgokhandegirmencioglu.com"
                className="flex items-center gap-3 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                info@drgokhandegirmencioglu.com
              </a>
              <a
                href="tel:+905454508834"
                className="flex items-center gap-3 text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                +90 545 450 88 34
              </a>
            </div>
          </Section>

          <Section icon={Eye} title="Hangi Verileri Topluyoruz?">
            <p className="text-foreground/80 leading-relaxed">
              Kliniğimize ulaşmanız ve randevu talebiniz esnasında yalnızca hizmet
              sunumu için gerekli verileri topluyoruz:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Ad ve soyad",
                "Telefon numarası",
                "E-posta adresi (isteğe bağlı)",
                "Tercih ettiğiniz randevu tarihi",
                "İlgilendiğiniz uygulama/hizmet",
                "Talep veya sağlık geçmişine dair kısa notunuz (isteğe bağlı)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-foreground/60">
              Özel nitelikli kişisel veri (sağlık verisi, biyometrik veri vb.) yalnızca
              sizin açık rızanızla ve hekim muayenesi kapsamında işlenir. Web
              formumuz aracılığıyla bu tür verileri göndermemenizi rica ederiz.
            </p>
          </Section>

          <Section icon={FileText} title="Verilerinizin İşlenme Amaçları">
            <p className="text-foreground/80 leading-relaxed">
              Topladığımız verileri aşağıdaki amaçlarla kullanıyoruz:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Randevu taleplerinizi almak ve değerlendirmek",
                "Sizinle randevu, konsültasyon ve tedavi süreçleri kapsamında iletişim kurmak",
                "Talep ettiğiniz hizmete uygun bilgilendirme sağlamak",
                "Hukuki yükümlülüklerimizi yerine getirmek",
                "Hizmet kalitemizi artırmak amacıyla iç istatistiksel analiz yapmak",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Lock} title="Hukuki Sebep ve Açık Rıza">
            <p className="text-foreground/80 leading-relaxed">
              Randevu formunu doldurarak, kişisel verilerinizin yukarıda belirtilen
              amaçlarla işlenmesine <strong className="text-foreground">açık rıza</strong>{" "}
              vermiş olursunuz. Onay kutusunu işaretlemeden form gönderilemez.
              Ayrıca, hizmet sözleşmesinin kurulması ve ifası için gerekli veriler,
              sözleşmesel hukuki sebebe dayanarak da işlenebilir.
            </p>
          </Section>

          <Section icon={Lock} title="Verilerinizin Paylaşılması">
            <p className="text-foreground/80 leading-relaxed">
              Kişisel verileriniz üçüncü taraflarla pazarlama amacıyla paylaşılmaz.
              Yalnızca klinik personelimiz ve hizmet aldığımız sınırlı teknik
              altyapı sağlayıcıları (barındırma, e-posta iletimi) ile, yasal
              yükümlülüklerimiz çerçevesinde ve gizlilik taahhütleri altında
              paylaşılabilir.
            </p>
          </Section>

          <Section icon={Clock} title="Saklama Süresi">
            <p className="text-foreground/80 leading-relaxed">
              Kişisel verileriniz, ilgili mevzuatta öngörülen sürelerle uyumlu
              olarak saklanır. Sağlık hizmetlerine ilişkin kayıtlar yasal
              yükümlülüklerimiz nedeniyle 10 yıl süreyle muhafaza edilebilir.
              Bunun dışındaki iletişim verileri, talebiniz üzerine veya işleme
              amacının ortadan kalkması hâlinde silinir, yok edilir veya
              anonimleştirilir.
            </p>
          </Section>

          <Section icon={Trash2} title="Haklarınız">
            <p className="text-foreground/80 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki
              haklara sahipsiniz:
            </p>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "İşlenmişse bilgi talep etme",
                "İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme",
                "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
                "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
                "Silinmesini, yok edilmesini veya anonimleştirilmesini isteme",
                "İşleme faaliyetlerine itiraz etme",
                "Zarara uğramanız hâlinde tazminat talep etme",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-foreground/60">
              Haklarınızı kullanmak için yukarıdaki iletişim bilgilerinden bize
              başvurabilirsiniz. Talebiniz en kısa sürede ve en geç 30 gün içinde
              ücretsiz olarak değerlendirilir.
            </p>
          </Section>

          <Section icon={Lock} title="Çerezler ve Analitik">
            <p className="text-foreground/80 leading-relaxed">
              Sitemiz yalnızca temel teknik işlevsellik için gerekli çerezleri
              kullanır. Üçüncü taraf izleme, reklam veya analitik çerezleri
              kullanılmamaktadır. Tarayıcınızın çerez ayarlarını dilediğiniz gibi
              yönetebilirsiniz.
            </p>
          </Section>

          <div className="pt-8 border-t border-border/40">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Sorumluluk sınırı:</strong> Bu sayfa,
              kliniğimizin veri uygulamalarını açıklamak amacıyla hazırlanmış
              app-owned içeriktir. Belirtilen süreçler, mevcut altyapımız ve
              yasal düzenlemelerdeki değişiklikler doğrultusunda güncellenebilir.
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border/30 pb-10 last:border-0">
      <div className="flex items-center gap-3 mb-5">
        <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      </div>
      <div className="pl-8">{children}</div>
    </section>
  );
}
