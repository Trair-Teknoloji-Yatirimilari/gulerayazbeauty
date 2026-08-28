import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, UseCases, Features, Contact } from "@/components/site/sections";
import { useT } from "@/i18n/context";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sektorler")({
  head: () => ({
    meta: [
      { title: "Sektörler — TrairX Connect Kullanım Senaryoları" },
      { name: "description", content: "Güzellik, restoran, eğitim, otel, perakende ve klinik: her sektöre uyarlanabilen AI müşteri temsilcisi ve rezervasyon asistanı." },
      { property: "og:title", content: "Sektörler — TrairX Connect" },
      { property: "og:description", content: "Her sektöre uyarlanabilen AI müşteri temsilcisi ve rezervasyon asistanı." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/sektorler` }],
  }),
  component: UseCasesPage,
});

function UseCasesPage() {
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
