// Stripe REST istemcisi (SDK'sız, Worker/Node uyumlu). Sadece sunucuda çalışır.
export type StripeSession = { id: string; url: string };

function key(): string {
  const k = process.env["STRIPE_SECRET_KEY"];
  if (!k) throw new Error("STRIPE_SECRET_KEY tanımlı değil. Sunucu ortam değişkenlerine ekleyin.");
  return k;
}

function encodeForm(obj: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) if (v !== undefined && v !== null) p.append(k, String(v));
  return p.toString();
}

export async function stripePost(
  path: string,
  form: Record<string, string | number | undefined>,
): Promise<StripeSession> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodeForm(form),
  });
  const json = (await res.json()) as { url?: string; id?: string; error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message || `Stripe hatası (${res.status})`);
  return { id: json.id ?? "", url: json.url ?? "" };
}
