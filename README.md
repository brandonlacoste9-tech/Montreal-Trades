# Montreal Trades

**Exclusive homeowner leads for Greater Montréal trades.**  
French-first. Island boroughs + island cities + Laval + South Shore.

## Product

| Audience | Path |
|----------|------|
| Homeowners (FR) | `/` · `/soumission` |
| Homeowners (EN) | `/en` · `/en/soumission` |
| Zones list | `/zones` · `/en/zones` |
| Contractors | `/entrepreneurs` · `/en/entrepreneurs` |

**Sell:** name + phone + email from the quote form (not open-data permits).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- `pnpm`
- Zod form validation
- Optional Supabase (`leads` table) — otherwise local `data/leads.jsonl`

## Setup

```bash
pnpm install
cp .env.example .env.local   # then add Supabase keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

1. Project URL: `https://ulbfaxhsbbckotcbmslk.supabase.co`
2. SQL Editor → run `supabase/schema.sql`
3. Settings → API → paste into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only — never commit)
4. Restart `pnpm dev` — form posts to `leads` table

Without keys, leads still save to `data/leads.jsonl` locally.

## Deploy (Netlify)

Site is built for **Netlify** (`netlify.toml` + `@netlify/plugin-nextjs`).

**Site settings → Environment variables** (required for live form → Supabase):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ulbfaxhsbbckotcbmslk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** secret (server only) |

Then **Trigger deploy**. Without `SUPABASE_SERVICE_ROLE_KEY` on Netlify, form inserts won’t hit `quote_leads`.

## Geo scope (phase 1)

- 19 arrondissements de Montréal  
- Villes de l’île (West Island, Westmount, etc.)  
- Laval  
- Rive-Sud: Longueuil, Brossard, Saint-Lambert, Boucherville, Saint-Bruno  

## Roadmap

1. Supabase + contractor auth / exclusive claim  
2. Telegram alerts on new form leads  
3. Paid plans + ads to `/soumission`  
4. Borough landing pages for SEO  

## License

See `LICENSE`.

## Make money (contractor subscriptions)

| Plan | Price | Limits |
|------|-------|--------|
| Starter | $149 CAD/mo | 15 exclusive claims |
| Pro | $299 CAD/mo | Unlimited |

1. Create products in Stripe ? copy Price IDs  
2. Netlify env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`  
3. Stripe webhook ? `https://YOUR-SITE.netlify.app/api/stripe/webhook` events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`  
4. Contractors buy on `/entrepreneurs` ? claim on `/dashboard`

