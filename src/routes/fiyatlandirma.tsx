import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Pricing, FAQ, Contact } from "@/components/site/sections";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/fiyatlandirma")({
  head: () => ({
    meta: [
      { title: "Fiyatlandırma — TrairX Connect Planları" },
      { name: "description", content: "Starter, Pro ve Enterprise planları. İşletmenizin büyüklüğüne göre esnek AI asistan ve rezervasyon paketleri." },
      { property: "og:title", content: "Fiyatlandırma — TrairX Connect" },
      { property: "og:description", content: "Starter, Pro ve Enterprise planlarıyla esnek fiyatlandırma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/fiyatlandirma` }],
  }),
  component: PricingPage,
});

function PricingPage() {
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
