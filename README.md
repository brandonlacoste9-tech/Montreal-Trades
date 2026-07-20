# MTLTrades

**Exclusive homeowner leads for Greater Montréal trades.**  
French-first. Island boroughs + island cities + Laval + South Shore.

**Site:** https://mtltrades.com (Netlify: https://montreal-trades.netlify.app)

## Product

| Audience | Path |
|----------|------|
| Homeowners (FR) | `/` · `/soumission` |
| Homeowners (EN) | `/en` · `/en/soumission` |
| Zones list | `/zones` · `/en/zones` |
| Contractors (leads) | `/entrepreneurs` · `/en/entrepreneurs` |
| Directory (FR) | `/annuaire` · `/inscription` · `/entrepreneur/[slug]` |
| Directory (EN) | `/en/annuaire` · `/en/inscription` · `/en/entrepreneur/[slug]` |
| Dashboard | `/dashboard` · `/en/dashboard` |

**Sell:** name + phone + email from the quote form (exclusive claim for paid contractors).  
**Directory:** free public listings + $79/mo featured placement (independent of lead plans).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- `pnpm`
- Supabase (`quote_leads`, `contractors`)
- Stripe subscriptions ($149 Starter / $299 Pro CAD) + Featured directory ($79 CAD)
- Telegram alerts on new homeowner leads

## Directory

Public contractor directory (French-first). Free listings via `/inscription`; paid featured via Stripe.

| Route | Purpose |
|-------|---------|
| `/annuaire` | Directory index (trades + zones) |
| `/annuaire/[metier]` · `/annuaire/[metier]/[zone]` | Filtered lists (featured first) |
| `/inscription` | Free list / claim profile |
| `/entrepreneur/[slug]` | Public contractor profile |

English UI uses the same French path slugs under `/en/...`.

### Featured ($79/mo)

Set in `.env.local` and Netlify:

```bash
STRIPE_PRICE_FEATURED=price_...          # Stripe Price ID for featured subscription
# optional offline sales link:
NEXT_PUBLIC_STRIPE_LINK_FEATURED=https://buy.stripe.com/...
```

Webhook already handles featured via `/api/stripe/webhook` (sets `is_featured`, `directory_plan`, `featured_until`).

### Migration (apply before seed / go-live)

Apply in Supabase **SQL Editor** (do not rely on auto-push until reviewed):

`supabase/migrations/20260720000000_directory_fields.sql`

Adds directory columns on `contractors` (`slug`, `trades[]`, `zones[]`, `rbq`, `bio`, `listing_status`, `directory_plan`, `is_featured`, `featured_until`, etc.).

### Seed (staging / local only)

```bash
node --env-file=.env.local scripts/seed-directory.mjs
```

Uses `scripts/seed-directory-data.json`. **Do not run against production** unless intentionally seeding live free profiles after review.

### Local checks

```bash
node scripts/test-directory-lib.mjs   # pure helpers
pnpm build
```

## Setup

```bash
pnpm install
cp .env.example .env.local   # add secrets
pnpm dev
```

### Supabase

1. Project: `https://ulbfaxhsbbckotcbmslk.supabase.co`
2. `supabase db push` (or run migrations in SQL Editor)
3. Keys in `.env.local` / Netlify

### Stripe

| Plan | Price ID |
|------|----------|
| Starter $149 | `price_1TsP50CzqBvMqSYFRoQ2kg0G` |
| Pro $299 | `price_1TsP51CzqBvMqSYF1nKMP9oN` |
| Featured $79 | `STRIPE_PRICE_FEATURED` (env) |
| Featured link (optional) | `NEXT_PUBLIC_STRIPE_LINK_FEATURED` |

Webhook: `https://mtltrades.com/api/stripe/webhook`  
(or Netlify URL until custom domain is live)

### Telegram

`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` on Netlify.

## Deploy checklist (directory)

Operator steps before promoting `feat/directory-layer` (or merge) to production:

1. **Stripe** — Create Featured $79 CAD recurring price; copy Price ID into Netlify `STRIPE_PRICE_FEATURED`. Optionally create Payment Link → `NEXT_PUBLIC_STRIPE_LINK_FEATURED`.
2. **Supabase migration** — Run `supabase/migrations/20260720000000_directory_fields.sql` in SQL Editor; confirm new columns on `contractors`.
3. **Env (Netlify)** — Ensure existing Supabase + Stripe webhook secrets remain set; add featured price env vars above; `NEXT_PUBLIC_SITE_URL=https://mtltrades.com`.
4. **Deploy** — Merge/deploy branch; confirm build green on Netlify.
5. **Smoke test (prod)** — Open `/annuaire`, `/inscription`, one `/entrepreneur/[slug]` (after seed or first registration); submit a free listing; run featured checkout in test mode if needed.
6. **Seed** — Only if intentionally populating free profiles: `node --env-file=.env.local scripts/seed-directory.mjs` against the **intended** project (review JSON first). Prefer staging first.
7. **Webhook** — Confirm Stripe webhook still points at `/api/stripe/webhook` and receives `checkout.session.completed` for featured.
8. **Do not** — Push secrets to git; skip migration; seed blindly into prod without review.

## Domain (mtltrades.com)

1. Netlify → Domain management → Add `mtltrades.com` + `www`
2. DNS at registrar (Netlify nameservers or CNAME/A records)
3. Env: `NEXT_PUBLIC_SITE_URL=https://mtltrades.com`
4. Update Stripe webhook URL to the custom domain
5. Redeploy

## License

See `LICENSE`.
