import { SITE_URL } from "@/lib/site";
import { localeLinks, PAGE_PATHS, type PageKey } from "./paths";
import { DEFAULT_LOCALE, type Locale } from "./types";

type Entry = { title: string; description: string };

const META: Record<PageKey, Record<Locale, Entry>> = {
  home: {
    tr: {
      title: "TrairX Connect — AI'lı Müşteri Temsilcisi ve Rezervasyon Asistanı",
      description:
        "Web sitenize entegre edin; Instagram, Facebook ve WhatsApp'ı bağlayın. TrairX Connect 7/24 müşteri temsilcisi, satış danışmanı ve rezervasyon asistanı olarak çalışır.",
    },
    en: {
      title: "TrairX Connect — AI Customer Agent & Booking Assistant",
      description:
        "Embed it on your website and connect Instagram, Facebook and WhatsApp. TrairX Connect works 24/7 as your support agent, sales consultant and booking assistant.",
    },
    fa: {
      title: "TrairX Connect — دستیار هوش مصنوعی پشتیبانی و رزرو",
      description:
        "آن را در وب‌سایت خود جاسازی کنید و اینستاگرام، فیسبوک و واتساپ را متصل کنید. TrairX Connect به‌صورت ۲۴ ساعته پشتیبان، مشاور فروش و دستیار رزرو شماست.",
    },
  },
  features: {
    tr: {
      title: "Özellikler — TrairX Connect AI Asistan Yetenekleri",
      description:
        "7/24 AI sohbet, rezervasyon yönetimi, Instagram/Facebook/WhatsApp entegrasyonu, partner sayfaları ve anlık analizler tek platformda.",
    },
    en: {
      title: "Features — TrairX Connect AI Assistant Capabilities",
      description:
        "24/7 AI chat, booking management, Instagram/Facebook/WhatsApp integration, partner pages and live analytics in one platform.",
    },
    fa: {
      title: "امکانات — قابلیت‌های دستیار هوشمند TrairX Connect",
      description:
        "گفتگوی هوشمند ۲۴ ساعته، مدیریت رزرو، اتصال اینستاگرام/فیسبوک/واتساپ، صفحات شرکا و تحلیل لحظه‌ای در یک پلتفرم.",
    },
  },
  howItWorks: {
    tr: {
      title: "Nasıl Çalışır — 3 Adımda TrairX Connect Kurulumu",
      description:
        "Kodu ekleyin, sosyal kanalları bağlayın, AI'yı eğitin. Dakikalar içinde web sitenizde çalışan bir AI asistan.",
    },
    en: {
      title: "How It Works — Set Up TrairX Connect in 3 Steps",
      description:
        "Add the snippet, connect your channels, train the AI. An assistant live on your website in minutes.",
    },
    fa: {
      title: "چگونه کار می‌کند — راه‌اندازی TrairX Connect در ۳ گام",
      description:
        "کد را اضافه کنید، کانال‌ها را متصل کنید و هوش مصنوعی را آموزش دهید. دستیار شما در چند دقیقه فعال می‌شود.",
    },
  },
  useCases: {
    tr: {
      title: "Sektörler — Her İş Modeline Uyum Sağlayan AI Asistan",
      description:
        "Güzellik, restoran, eğitim, turizm, e-ticaret ve sağlık işletmeleri için özelleşen TrairX Connect senaryoları.",
    },
    en: {
      title: "Industries — An AI Assistant for Every Business Model",
      description:
        "TrairX Connect scenarios tailored for beauty, restaurants, education, travel, e-commerce and healthcare businesses.",
    },
    fa: {
      title: "صنایع — دستیار هوشمند برای هر مدل کسب‌وکار",
      description:
        "سناریوهای TrairX Connect برای زیبایی، رستوران، آموزش، گردشگری، فروشگاه اینترنتی و مراکز درمانی.",
    },
  },
  pricing: {
    tr: {
      title: "Fiyatlandırma — TrairX Connect Paketleri",
      description: "Ücretsiz başlayın, büyüdükçe yükseltin. Starter, Pro ve Enterprise paket detayları.",
    },
    en: {
      title: "Pricing — TrairX Connect Plans",
      description: "Start free and upgrade as you grow. Starter, Pro and Enterprise plan details.",
    },
    fa: {
      title: "قیمت‌گذاری — پلن‌های TrairX Connect",
      description: "رایگان شروع کنید و با رشد کسب‌وکار ارتقا دهید. جزئیات پلن‌های Starter، Pro و Enterprise.",
    },
  },
  contact: {
    tr: {
      title: "İletişim — TrairX Connect Demo Talebi",
      description: "Ücretsiz demo talep edin; ekibimiz işletmenize özel kurulumu birlikte planlasın.",
    },
    en: {
      title: "Contact — Request a TrairX Connect Demo",
      description: "Request a free demo and let our team plan a setup tailored to your business.",
    },
    fa: {
      title: "تماس — درخواست دموی TrairX Connect",
      description: "دموی رایگان درخواست کنید تا تیم ما راه‌اندازی متناسب با کسب‌وکار شما را برنامه‌ریزی کند.",
    },
  },
  legal: {
    tr: {
      title: "Gizlilik ve KVKK Aydınlatma Metni | TrairX Connect",
      description: "TrairX Connect Kişisel Verilerin İşlenmesi Aydınlatma Metni.",
    },
    en: {
      title: "Privacy & Data Protection Notice | TrairX Connect",
      description: "How TrairX Connect collects, processes and protects your personal data.",
    },
    fa: {
      title: "حریم خصوصی و حفاظت از داده‌ها | TrairX Connect",
      description: "نحوه جمع‌آوری، پردازش و حفاظت از داده‌های شخصی شما در TrairX Connect.",
    },
  },
};

/** Full head() payload for a page in a given locale (meta + canonical + hreflang). */
export function pageHead(key: PageKey, locale: Locale = DEFAULT_LOCALE) {
  const { title, description } = META[key][locale];
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale === "tr" ? "tr_TR" : locale === "fa" ? "fa_IR" : "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: localeLinks(SITE_URL, locale, PAGE_PATHS[key]),
  };
}
