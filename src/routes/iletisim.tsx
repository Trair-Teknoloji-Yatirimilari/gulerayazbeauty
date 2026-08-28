import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Contact, FAQ } from "@/components/site/sections";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim & Demo Talebi — TrairX Connect" },
      { name: "description", content: "TrairX Connect ekibiyle iletişime geçin, işletmeniz için ücretsiz demo talep edin ve entegrasyon sürecini planlayın." },
      { property: "og:title", content: "İletişim & Demo Talebi — TrairX Connect" },
      { property: "og:description", content: "Ücretsiz demo talep edin, entegrasyon sürecini birlikte planlayalım." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/iletisim` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useT();
  return (
    <SiteLayout>
      <PageHero eyebrow={t.nav.contact} title={t.contact.title} subtitle={t.contact.subtitle} />
      <Contact withHeading={false} />
      <FAQ />
    </SiteLayout>
  );
}
