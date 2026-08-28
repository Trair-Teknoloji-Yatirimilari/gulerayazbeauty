// TrairX Connect abonelik planları — tüm fiyatlar USD (sent cinsinden).
export type PlanKey = "free" | "starter" | "custom";

export type Plan = {
  key: PlanKey;
  name: string;
  amountCents: number; // 0 = ücretsiz, custom = teklif
  currency: "usd";
  interval: "month" | null;
  checkout: boolean; // Stripe checkout açılabilir mi
  description: string;
};

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key: "free",
    name: "Free",
    amountCents: 0,
    currency: "usd",
    interval: "month",
    checkout: false,
    description: "500 sohbet, 1 web sitesi, temel analizler.",
  },
  starter: {
    key: "starter",
    name: "Starter",
    amountCents: 4900, // $49.00 / ay
    currency: "usd",
    interval: "month",
    checkout: true,
    description: "Sınırsız sohbet, 3 kanal, rezervasyon ve ödeme modülü.",
  },
  custom: {
    key: "custom",
    name: "Custom",
    amountCents: 0,
    currency: "usd",
    interval: null,
    checkout: false,
    description: "Çok şubeli markalar için özel fiyatlandırma ve entegrasyon.",
  },
};

export const PLAN_KEYS: PlanKey[] = ["free", "starter", "custom"];

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
