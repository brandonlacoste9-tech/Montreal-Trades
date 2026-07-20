# MTLTrades Directory Layer — Design Spec

**Date:** 2026-07-20  
**Status:** Approved direction (awaiting user review of this written spec)  
**Repo:** `Montreal-Trades` (`mtltrades.com`)  
**Approach:** B — Directory layer on existing lead product (not a new repo)

---

## 1. Problem

Homeowners in Greater Montréal search for trusted local trades (plumbing, electrical, roofing, reno). National lead mills and generic directories are English-heavy or low-trust. Contractors pay for leads but also want **visibility** (rank #1 on “plombier + zone”).

MTLTrades already captures homeowner quotes and sells exclusive lead subscriptions. It lacks a **public, browsable contractor directory** that:

1. Ranks for French local intent SEO  
2. Sells a simpler first product: **featured listing**  
3. Feeds the existing lead upsell later  

## 2. Goals (30 days)

| Metric | Target |
|--------|--------|
| Seeded public profiles | 50–100 live |
| Paid featured listings | 5–10 (or paid deposits) |
| Launch trades (week 1 focus) | Plumbing, electrical, roofing |
| Stack | Extend current Next.js + Supabase + Stripe |

**Primary success:** first paid directory revenue, not feature completeness.

### Non-goals (MVP)

- Full review/rating system  
- Automated RBQ API verification pipeline  
- Canada-wide or multi-province expansion  
- Rebuild of trades-canada-v2 marketplace complexity  
- Mobile apps, chat, multi-quote auction UI  

## 3. Product positioning

**FR:** *Trouvez un entrepreneur vérifié sur le Grand Montréal — licence RBQ, zones desservies, contact direct.*  

**EN:** *Find a verified contractor in Greater Montréal — RBQ licence, service areas, direct contact.*  

**Wedge vs competitors (SoumissionRénovation, YP, Google):** French-first, neighborhood-level pages, visible RBQ number, local brand (mtltrades.com), hybrid free listing + featured + optional exclusive leads.

## 4. Users & jobs

| Actor | Job |
|-------|-----|
| Homeowner | Find a trustworthy local trade; contact or request quote |
| Contractor (free) | Appear in search; claim profile; get occasional calls |
| Contractor (featured) | Rank above free listings on trade×zone; badge trust |
| Contractor (leads Pro) | Existing $149/$299 exclusive claim product — upsell |
| Operator (you) | Seed listings, run Stripe, outreach, mark featured |

## 5. Monetization

| Tier | Price (CAD) | Includes |
|------|-------------|----------|
| **Gratuit** | $0 | Basic public profile; appears below featured |
| **En vedette (Featured)** | **$79/mo** (or $199/3 mo promo) | Top of relevant trade×zone lists; “En vedette” badge; priority CTA |
| **Starter / Pro leads** (existing) | $149 / $299 | Exclusive quote claims — keep as upsell after featured |

**Checkout:** Stripe (new Price for Featured; reuse existing subscription webhook patterns).  
**Sales motion:** Free seed → claim → sell featured on call/in person with Payment Link or Checkout.

## 6. Information architecture

### French (default)

| Route | Purpose |
|-------|---------|
| `/` | Home: trade + zone search, trust, CTAs to directory + soumission |
| `/annuaire` | Directory index (trades + zones) |
| `/annuaire/[metier]` | Trade list (featured first) |
| `/annuaire/[metier]/[zone]` | Trade × zone list |
| `/entrepreneur/[slug]` | Public profile |
| `/inscription` | Free list / claim profile |
| `/entrepreneurs` | Sales: featured + leads |
| Existing | `/plombier-montreal`, `/electricien-montreal`, `/toiture-montreal`, `/renovation-montreal`, `/soumission`, `/zones`, `/dashboard` |

### English mirrors

Prefix with `/en/` using existing i18n patterns (`/en/directory/...` or keep French slugs with EN UI — **decision:** French URL slugs for SEO authority in Quebec; EN pages use same path structure under `/en/annuaire/...` with English copy).

### Week-1 trade scope (public directory filters)

Primary: `plumbing`, `electrical`, `roofing`  
Also allow in data model: `hvac`, `renovations`, `general`, `other` (from existing `TRADES`) but de-emphasize in nav until seeded.

## 7. Data model

Extend existing `public.contractors` (do not create a parallel businesses table).

### 7.1 New / altered columns on `contractors`

| Column | Type | Notes |
|--------|------|-------|
| `slug` | text unique | Public URL key |
| `trades` | text[] | Multi-trade; migrate from single `trade` |
| `zones` | text[] | Zone slugs from `zones.ts` |
| `rbq_number` | text nullable | Displayed for trust |
| `bio` | text nullable | Short FR-first description |
| `photo_url` | text nullable | Optional |
| `listing_status` | text | `draft` \| `pending` \| `live` \| `hidden` |
| `is_featured` | boolean default false | |
| `featured_until` | timestamptz nullable | |
| `directory_plan` | text | `free` \| `featured` |
| `stripe_featured_subscription_id` | text nullable | Separate from lead plan sub if needed |
| `password_hash` | text nullable | Nullable for seed/unclaimed listings |
| `claim_token` | text nullable | One-time claim for seeded rows |

**Backward compatibility:** Keep `trade` column populated from first of `trades` for lead dashboard until fully migrated. Lead `plan` (`starter`/`pro`) stays for exclusive leads; `directory_plan` is independent.

### 7.2 RLS

- **Public read:** `listing_status = 'live'` profiles (anon select limited columns: no password_hash, email optional hide until claim policy).  
- **Public write:** none (insert via server API with service role / validated form).  
- **Authenticated contractor:** update own row after claim/login (existing session model).

### 7.3 Seed strategy

- Manual + script insert 50–100 contractors for plumbing/electrical/roofing across key zones (Plateau, Rosemont, Villeray, NDG, Laval, Longueuil, Brossard, etc.).  
- `listing_status = 'live'`, `directory_plan = 'free'`, `password_hash` null until claimed.  
- Outreach list CSV derived from seed for sales week 2–4.

## 8. UX flows

### 8.1 Homeowner browse

1. Land on `/` or SEO trade page → enter trade + zone or click category  
2. See list: **featured first**, then free (alphabetical or recent)  
3. Open profile → call / email / “Demander une soumission” (pre-fills trade)  

### 8.2 Free inscription / claim

1. `/inscription` form: name, trade(s), zones, phone, email, RBQ optional, bio  
2. Creates `listing_status = 'pending'` or `'live'` (operator choice: auto-live for speed in MVP)  
3. Claim seeded profile: email match + claim token link  

### 8.3 Featured purchase

1. Profile owner or sales link → Stripe Checkout for Featured  
2. Webhook sets `is_featured = true`, `directory_plan = 'featured'`, `featured_until`  
3. Cancel/past_due clears featured flags (mirror lead webhook patterns)

### 8.4 Operator

- Supabase table editor sufficient for MVP seed + force feature  
- Optional later: thin admin page  

## 9. Technical architecture

| Layer | Choice |
|-------|--------|
| App | Next.js App Router (existing) |
| DB | Supabase Postgres (existing project) |
| Payments | Stripe Checkout + webhook (extend) |
| i18n | Existing `lib/i18n.ts` + `/en` routes |
| Geo | Existing `lib/zones.ts` |
| Trades | Existing `lib/trades.ts` |
| Deploy | Netlify + mtltrades.com |

### 9.1 Sorting rules (directory lists)

1. `is_featured = true` AND (`featured_until` is null OR `featured_until > now()`)  
2. Then `name` asc  

### 9.2 SEO

- Unique title/description per trade×zone page (FR)  
- JSON-LD `LocalBusiness` / `ProfessionalService` on profiles  
- Sitemap entries for `/annuaire/*` and `/entrepreneur/*`  
- Internal links from existing trade landings to directory  

### 9.3 APIs to add

| Endpoint | Role |
|----------|------|
| `POST /api/directory/register` | Free listing create |
| `POST /api/directory/claim` | Claim seeded listing |
| `POST /api/stripe/checkout` | Extend for `featured` plan price |
| Webhook | Handle featured subscription events |

## 10. Pricing config

Add to `lib/pricing.ts` (or sibling `directory-pricing.ts`):

```ts
featured: { priceCad: 79, nameFr: "En vedette", nameEn: "Featured" }
```

Stripe: create `STRIPE_PRICE_FEATURED` + optional Payment Link for offline sales.

## 11. 30-day execution plan

| Week | Engineering | GTM |
|------|-------------|-----|
| **1** | Migration + `/annuaire` + profile + seed script; free `/inscription` | Compile 50 targets; seed live free profiles |
| **2** | Featured sort + Stripe Featured + sales copy on `/entrepreneurs` | 20 outreach conversations |
| **3** | SEO polish top trade×zone pages; claim flow | Close 5 paid featured |
| **4** | Bugfix; lead upsell CTA on featured success | Close toward 10; double down on winning trade |

## 12. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Empty directory | Seed before heavy marketing; start 3 trades only |
| Lead volume too low to sell Pro | Sell Featured first (visibility, not lead SLA) |
| Duplicate product sprawl | Single repo; no new brand unless required |
| Thin SEO content | Real zones + unique intros per trade×zone; no doorway spam |
| Unclaimed spam listings | Pending review flag; phone required; operator hide |

## 13. Open decisions (resolved for MVP)

| Decision | Choice |
|----------|--------|
| Approach | B — directory on Montreal-Trades |
| First trades | Plumbing, electrical, roofing |
| Featured price | $79 CAD/mo |
| New repo? | No |
| Auto-publish free listings | Yes for MVP speed; operator can hide |
| English URLs | `/en/annuaire/...` with shared French slugs |

## 14. Implementation readiness

After this spec is accepted:

1. Write implementation plan (`docs/superpowers/plans/...`)  
2. Migration → directory UI → Stripe featured → seed → outreach checklist  

---

## Appendix A — Existing assets to reuse

- Domain/site: mtltrades.com  
- Stripe lead prices already live  
- Zones model complete for Grand Montréal  
- Trade landing pages for SEO  
- Contractor dashboard + login for post-claim account  
- Quote form `/soumission` for secondary monetization  
