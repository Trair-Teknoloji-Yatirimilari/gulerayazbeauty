import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, HowItWorks, Trusted, Contact } from "@/components/site/sections";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/nasil-calisir")({
  head: () => ({
    meta: [
      { title: "Nasıl Çalışır — TrairX Connect Kurulumu 3 Adımda" },
      { name: "description", content: "Kodu sitenize ekleyin, sosyal kanallarınızı bağlayın ve AI asistanınız çalışmaya başlasın. Teknik bilgi gerekmez." },
      { property: "og:title", content: "Nasıl Çalışır — TrairX Connect" },
      { property: "og:description", content: "3 adımda kurulum: kodu ekle, kanalları bağla, AI çalışsın." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/nasil-calisir` }],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
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
