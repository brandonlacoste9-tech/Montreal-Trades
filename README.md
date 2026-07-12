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
