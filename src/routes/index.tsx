import { createFileRoute } from "@tanstack/react-router";
import {
  SiteLayout,
  Hero,
  Trusted,
  Features,
  HowItWorks,
  UseCases,
  Pricing,
  FAQ,
  Contact,
} from "@/components/site/sections";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrairX Connect — AI'lı Müşteri Temsilcisi ve Rezervasyon Asistanı" },
      { name: "description", content: "Web sitenize entegre edin; Instagram, Facebook ve WhatsApp'ı bağlayın. TrairX Connect 7/24 müşteri temsilcisi, satış danışmanı ve rezervasyon asistanı olarak çalışır." },
      { property: "og:title", content: "TrairX Connect — AI'lı Müşteri Temsilcisi" },
      { property: "og:description", content: "Web sitenize entegre edin; Instagram, Facebook ve WhatsApp'ı bağlayın. AI asistanınız 7/24 çalışsın." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <SiteLayout>
      <Hero />
      <Trusted />
      <Features />
      <HowItWorks />
      <UseCases />
      <Pricing />
      <FAQ />
      <Contact />
    </SiteLayout>
  );
}
