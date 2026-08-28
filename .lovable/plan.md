# TrairX Connect — Landing Site Plan

## Goal
Build a B2B marketing/landing site for TrairX Connect: an embeddable AI-powered widget that businesses add to their websites to handle reservations, sales, customer service, and social channel integration (Instagram, Facebook, WhatsApp).

## Scope
Replace the current Güler Ayaz Beauty content with a clean, Apple-inspired SaaS landing site. Keep the technical stack (TanStack Start, Tailwind v4, Framer Motion, i18n-ready structure) but reset brand, content, and visuals to TrairX Connect.

## Design direction
- Light theme, generous whitespace, soft shadows, subtle gradients.
- Primary: deep navy/slate (`#0f172a`) with electric blue accent (`#3b82f6`).
- Typography: clean sans-serif (Inter / SF Pro style), large display headings.
- Motion: slow, professional fades and slides — no medical/clinical cues.

## Sections
1. **Hero** — value prop, embeddable widget preview, primary CTA.
2. **Trusted by / Logos** — sector-agnostic business types.
3. **Features grid** — AI agent, reservations, social integrations, partner pages, analytics.
4. **How it works** — 3-step flow: embed → connect channels → let AI work.
5. **Use cases** — beauty, hospitality, services, retail.
6. **Pricing** — 3 tiers (Starter, Pro, Enterprise).
7. **FAQ** — common B2B questions.
8. **Contact / Demo CTA** — form + contact info.
9. **Footer** — links, social, legal.

## Pages
- `/` — landing page
- `/kvkk` — privacy/terms (reused, content updated)
- `/galeri` — removed; replaced with `/ozellikler` or removed
- `/admin` — retained for future TrairX admin but simplified

## Technical tasks
1. Reset brand tokens and colors in `src/styles.css`.
2. Update `src/i18n/dictionaries/{tr,en,fa}.ts` with TrairX Connect copy.
3. Replace `src/routes/index.tsx` with new landing sections.
4. Remove beauty-specific assets and replace with generated/abstract tech visuals.
5. Update `src/routes/__root.tsx` metadata.
6. Clean up unused beauty routes/components (gallery admin, appointment form) or repurpose.
7. Run typecheck and verify build.

## Out of scope for this phase
- Actual widget JavaScript SDK implementation
- Backend integrations with Instagram/Facebook/WhatsApp APIs
- Real payment processing
- Authentication/user dashboard

## Next step
Get user approval on plan and design direction, then implement.