import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Features, HowItWorks, Contact } from "@/components/site/sections";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/ozellikler")({
  head: () => ({
    meta: [
      { title: "Özellikler — TrairX Connect AI Asistan Yetenekleri" },
      { name: "description", content: "7/24 AI sohbet, rezervasyon yönetimi, Instagram/Facebook/WhatsApp entegrasyonu, partner sayfaları ve anlık analizler tek platformda." },
      { property: "og:title", content: "Özellikler — TrairX Connect" },
      { property: "og:description", content: "AI sohbet, rezervasyon, sosyal kanal entegrasyonu ve analizler tek platformda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ozellikler` }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
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
