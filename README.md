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
| Contractors | `/entrepreneurs` · `/en/entrepreneurs` |
| Dashboard | `/dashboard` · `/en/dashboard` |

**Sell:** name + phone + email from the quote form (exclusive claim for paid contractors).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- `pnpm`
- Supabase (`quote_leads`, `contractors`)
- Stripe subscriptions ($149 Starter / $299 Pro CAD)
- Telegram alerts on new homeowner leads

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
| Featured $79 | `STRIPE_PRICE_FEATURED` |
| Featured link (optional) | `NEXT_PUBLIC_STRIPE_LINK_FEATURED` |

Webhook: `https://mtltrades.com/api/stripe/webhook`  
(or Netlify URL until custom domain is live)

### Telegram

`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` on Netlify.

## Domain (mtltrades.com)

1. Netlify → Domain management → Add `mtltrades.com` + `www`
2. DNS at registrar (Netlify nameservers or CNAME/A records)
3. Env: `NEXT_PUBLIC_SITE_URL=https://mtltrades.com`
4. Update Stripe webhook URL to the custom domain
5. Redeploy

## License

See `LICENSE`.
