# MTLTrades Directory Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a French-first public contractor directory on mtltrades.com (free listings + $79/mo featured) so we can seed 50–100 profiles and sell 5–10 paid featured slots in 30 days.

**Architecture:** Extend the existing `contractors` table with directory fields; add public read via service-role REST helpers already in `lib/db.ts`. New App Router pages under `/annuaire` and `/entrepreneur/[slug]`, registration API, and Stripe “featured” plan wired through the existing checkout/webhook pattern. Lead plans (Starter/Pro) remain unchanged as upsell.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind 4, Supabase REST (`sbFetch`), Stripe subscriptions, Zod, existing i18n (`lib/i18n.ts`, `/en/*` routes).

**Spec:** `docs/superpowers/specs/2026-07-20-mtltrades-directory-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `supabase/migrations/20260720000000_directory_fields.sql` | Schema: slug, trades[], zones[], RBQ, featured flags, listing_status |
| `src/lib/directory.ts` | Pure helpers: slugify, isFeaturedActive, sortDirectoryListings, directory trade meta (FR/EN slugs) |
| `src/lib/directory-pricing.ts` | Featured plan price config + Stripe price id helpers |
| `src/lib/directory-queries.ts` | Server queries: list by trade/zone, get by slug, insert free listing |
| `src/app/api/directory/register/route.ts` | POST free listing / claim-ready create |
| `src/app/api/directory/featured-checkout/route.ts` | POST Stripe Checkout for featured (existing contractor id or email) |
| `src/app/api/stripe/webhook/route.ts` | Handle `product=featured` metadata without breaking lead subs |
| `src/components/directory/DirectoryList.tsx` | List UI (featured badge first) |
| `src/components/directory/ContractorCard.tsx` | Card for one listing |
| `src/components/directory/DirectoryRegisterForm.tsx` | Free inscription form |
| `src/components/directory/FeaturedCheckoutButton.tsx` | Client CTA → featured checkout API |
| `src/app/annuaire/page.tsx` | Directory index FR |
| `src/app/annuaire/[metier]/page.tsx` | Trade list FR |
| `src/app/annuaire/[metier]/[zone]/page.tsx` | Trade×zone FR |
| `src/app/entrepreneur/[slug]/page.tsx` | Profile FR |
| `src/app/inscription/page.tsx` | Free register FR |
| `src/app/en/annuaire/...` | EN mirrors (same structure) |
| `src/app/en/inscription/page.tsx` | EN register |
| `src/app/en/entrepreneur/[slug]/page.tsx` | EN profile |
| `scripts/seed-directory.mjs` | Seed 50–100 free live profiles |
| `scripts/test-directory-lib.mjs` | Node tests for pure helpers |
| Modify: `src/lib/paths.ts`, `src/lib/i18n.ts`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/app/sitemap.ts`, `src/components/TradeLanding.tsx` or trade pages, `src/app/entrepreneurs/page.tsx` (sales copy) |

---

### Task 1: Directory pure helpers + tests

**Files:**
- Create: `src/lib/directory.ts`
- Create: `scripts/test-directory-lib.mjs`

- [ ] **Step 1: Write pure helpers**

```ts
// src/lib/directory.ts
import type { TradeId } from "@/lib/trades";
import { TRADES } from "@/lib/trades";
import { getZoneBySlug, type Zone } from "@/lib/zones";

/** URL slug for trade in directory (French path segment). */
export const DIRECTORY_TRADES: {
  id: TradeId;
  slugFr: string;
  slugEn: string;
  nameFr: string;
  nameEn: string;
  week1: boolean;
}[] = [
  { id: "plumbing", slugFr: "plomberie", slugEn: "plumbing", nameFr: "Plomberie", nameEn: "Plumbing", week1: true },
  { id: "electrical", slugFr: "electricite", slugEn: "electrical", nameFr: "Électricité", nameEn: "Electrical", week1: true },
  { id: "roofing", slugFr: "toiture", slugEn: "roofing", nameFr: "Toiture", nameEn: "Roofing", week1: true },
  { id: "hvac", slugFr: "cvac", slugEn: "hvac", nameFr: "CVAC", nameEn: "HVAC", week1: false },
  { id: "renovations", slugFr: "renovation", slugEn: "renovation", nameFr: "Rénovation", nameEn: "Renovations", week1: false },
  { id: "general", slugFr: "general", slugEn: "general", nameFr: "Général", nameEn: "General", week1: false },
  { id: "other", slugFr: "autre", slugEn: "other", nameFr: "Autre", nameEn: "Other", week1: false },
];

export type DirectoryListing = {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  trades: string[];
  zones: string[];
  rbq_number: string | null;
  bio: string | null;
  photo_url: string | null;
  is_featured: boolean;
  featured_until: string | null;
  listing_status: string;
  directory_plan: string;
};

export function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isFeaturedActive(
  listing: Pick<DirectoryListing, "is_featured" | "featured_until">,
  now: Date = new Date()
): boolean {
  if (!listing.is_featured) return false;
  if (!listing.featured_until) return true;
  return new Date(listing.featured_until).getTime() > now.getTime();
}

export function sortDirectoryListings<T extends Pick<DirectoryListing, "is_featured" | "featured_until" | "name">>(
  rows: T[],
  now: Date = new Date()
): T[] {
  return [...rows].sort((a, b) => {
    const af = isFeaturedActive(a, now) ? 1 : 0;
    const bf = isFeaturedActive(b, now) ? 1 : 0;
    if (bf !== af) return bf - af;
    return a.name.localeCompare(b.name, "fr");
  });
}

export function getDirectoryTradeBySlug(slug: string) {
  return DIRECTORY_TRADES.find((t) => t.slugFr === slug || t.slugEn === slug);
}

export function getDirectoryTradeById(id: string) {
  return DIRECTORY_TRADES.find((t) => t.id === id);
}

export function tradeLabel(id: string, lang: "fr" | "en"): string {
  const t = getDirectoryTradeById(id) || TRADES.find((x) => x.id === id);
  if (!t) return id;
  return lang === "fr" ? ("nameFr" in t ? t.nameFr : t.fr) : ("nameEn" in t ? t.nameEn : t.en);
}

export function resolveZone(slug: string): Zone | undefined {
  return getZoneBySlug(slug);
}
```

- [ ] **Step 2: Write Node test script**

```js
// scripts/test-directory-lib.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Compile-free reimplementation checks for slugify + featured sort logic
// (mirrors src/lib/directory.ts — keep in sync when changing helpers)

function slugifyName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isFeaturedActive(listing, now = new Date()) {
  if (!listing.is_featured) return false;
  if (!listing.featured_until) return true;
  return new Date(listing.featured_until).getTime() > now.getTime();
}

function sortDirectoryListings(rows, now = new Date()) {
  return [...rows].sort((a, b) => {
    const af = isFeaturedActive(a, now) ? 1 : 0;
    const bf = isFeaturedActive(b, now) ? 1 : 0;
    if (bf !== af) return bf - af;
    return a.name.localeCompare(b.name, "fr");
  });
}

assert.equal(slugifyName("Plomberie Montréal Inc."), "plomberie-montreal-inc");
assert.equal(slugifyName("Électricité Café"), "electricite-cafe");

const now = new Date("2026-07-20T12:00:00Z");
const sorted = sortDirectoryListings(
  [
    { name: "Beta Free", is_featured: false, featured_until: null },
    { name: "Alpha Featured", is_featured: true, featured_until: null },
    { name: "Zulu Expired", is_featured: true, featured_until: "2026-01-01T00:00:00Z" },
    { name: "Charlie Free", is_featured: false, featured_until: null },
  ],
  now
);
assert.equal(sorted[0].name, "Alpha Featured");
assert.equal(sorted[1].name, "Beta Free");
assert.equal(sorted[2].name, "Charlie Free");
assert.equal(sorted[3].name, "Zulu Expired");

console.log("ok: directory helpers");
```

- [ ] **Step 3: Run tests**

Run: `node scripts/test-directory-lib.mjs`  
Expected: `ok: directory helpers`

- [ ] **Step 4: Commit**

```bash
git add src/lib/directory.ts scripts/test-directory-lib.mjs
git commit -m "feat(directory): add pure helpers and unit checks"
```

---

### Task 2: Supabase migration for directory fields

**Files:**
- Create: `supabase/migrations/20260720000000_directory_fields.sql`
- Modify: `supabase/schema.sql` (append same definitions for docs parity)

- [ ] **Step 1: Write migration SQL**

```sql
-- Directory layer on contractors (MTLTrades)

alter table public.contractors
  add column if not exists slug text,
  add column if not exists trades text[] not null default '{}',
  add column if not exists zones text[] not null default '{}',
  add column if not exists rbq_number text,
  add column if not exists bio text,
  add column if not exists photo_url text,
  add column if not exists listing_status text not null default 'draft'
    check (listing_status in ('draft', 'pending', 'live', 'hidden')),
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_until timestamptz,
  add column if not exists directory_plan text not null default 'free'
    check (directory_plan in ('free', 'featured')),
  add column if not exists stripe_featured_subscription_id text,
  add column if not exists claim_token text;

-- password_hash nullable for unclaimed seeded listings
alter table public.contractors
  alter column password_hash drop not null;

-- Backfill trades from single trade column
update public.contractors
set trades = array[trade]
where (trades is null or trades = '{}') and trade is not null;

-- Unique slug when present
create unique index if not exists contractors_slug_uidx
  on public.contractors (slug)
  where slug is not null;

create index if not exists contractors_listing_status_idx
  on public.contractors (listing_status);

create index if not exists contractors_is_featured_idx
  on public.contractors (is_featured)
  where listing_status = 'live';

create index if not exists contractors_trades_gin
  on public.contractors using gin (trades);

create index if not exists contractors_zones_gin
  on public.contractors using gin (zones);

comment on column public.contractors.listing_status is 'Public directory visibility';
comment on column public.contractors.directory_plan is 'free | featured (independent of lead plan)';
```

- [ ] **Step 2: Apply migration**

Run in Supabase SQL Editor (project `ulbfaxhsbbckotcbmslk`) or:

```bash
# if CLI linked:
npx supabase db push
```

Expected: migration succeeds; `contractors` has new columns.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260720000000_directory_fields.sql supabase/schema.sql
git commit -m "feat(directory): add contractors directory columns migration"
```

---

### Task 3: Directory pricing config

**Files:**
- Create: `src/lib/directory-pricing.ts`

- [ ] **Step 1: Add featured pricing module**

```ts
// src/lib/directory-pricing.ts
export const FEATURED_PLAN = {
  id: "featured" as const,
  nameFr: "En vedette",
  nameEn: "Featured",
  priceCad: 79,
  featuresFr: [
    "En tête des listes métier × zone",
    "Badge En vedette",
    "Profil public prioritaire",
    "Annulation en tout temps",
  ],
  featuresEn: [
    "Top of trade × zone lists",
    "Featured badge",
    "Priority public profile",
    "Cancel anytime",
  ],
};

/** Set STRIPE_PRICE_FEATURED in env; optional public payment link fallback. */
export function featuredPriceId(): string | null {
  return process.env.STRIPE_PRICE_FEATURED || process.env.NEXT_PUBLIC_STRIPE_PRICE_FEATURED || null;
}

export function featuredPaymentLink(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_LINK_FEATURED || null;
}
```

- [ ] **Step 2: Document env vars in README** (append under Stripe section)

```markdown
| Featured $79 | `STRIPE_PRICE_FEATURED` | create product in Stripe Dashboard |
| Featured link (optional) | `NEXT_PUBLIC_STRIPE_LINK_FEATURED` | Payment Link fallback |
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/directory-pricing.ts README.md
git commit -m "feat(directory): add featured $79 pricing config"
```

---

### Task 4: Directory query helpers

**Files:**
- Create: `src/lib/directory-queries.ts`

- [ ] **Step 1: Implement queries via `sbFetch`**

```ts
// src/lib/directory-queries.ts
import { sbFetch } from "@/lib/db";
import {
  type DirectoryListing,
  isFeaturedActive,
  sortDirectoryListings,
  slugifyName,
} from "@/lib/directory";

const SELECT =
  "id,slug,name,phone,trades,zones,rbq_number,bio,photo_url,is_featured,featured_until,listing_status,directory_plan";

export async function listLiveContractors(opts?: {
  tradeId?: string;
  zoneSlug?: string;
}): Promise<DirectoryListing[]> {
  // PostgREST: listing_status=eq.live
  let path = `contractors?listing_status=eq.live&select=${SELECT}`;
  if (opts?.tradeId) {
    path += `&trades=cs.{${opts.tradeId}}`;
  }
  if (opts?.zoneSlug) {
    path += `&zones=cs.{${opts.zoneSlug}}`;
  }
  path += `&order=name.asc`;

  const res = await sbFetch<DirectoryListing[]>(path);
  if (!res.ok || !Array.isArray(res.data)) return [];
  return sortDirectoryListings(res.data);
}

export async function getContractorBySlug(
  slug: string
): Promise<DirectoryListing | null> {
  const res = await sbFetch<DirectoryListing[]>(
    `contractors?slug=eq.${encodeURIComponent(slug)}&listing_status=eq.live&select=${SELECT}&limit=1`
  );
  if (!res.ok || !Array.isArray(res.data) || !res.data[0]) return null;
  return res.data[0];
}

export async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = slugifyName(base) || "entrepreneur";
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const res = await sbFetch<{ id: string }[]>(
      `contractors?slug=eq.${encodeURIComponent(candidate)}&select=id&limit=1`
    );
    if (!res.ok || !Array.isArray(res.data) || res.data.length === 0) {
      return candidate;
    }
  }
  return `${slug}-${Date.now().toString(36)}`;
}

export async function insertFreeListing(input: {
  name: string;
  email: string;
  phone?: string | null;
  trades: string[];
  zones: string[];
  rbq_number?: string | null;
  bio?: string | null;
}): Promise<{ ok: true; id: string; slug: string } | { ok: false; error: string }> {
  const emailNorm = input.email.trim().toLowerCase();
  const slug = await ensureUniqueSlug(input.name);
  const primaryTrade = input.trades[0] || "general";

  const created = await sbFetch<{ id: string; slug: string }[]>("contractors", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      email: emailNorm,
      password_hash: null,
      name: input.name.trim(),
      phone: input.phone || null,
      trade: primaryTrade,
      trades: input.trades,
      zones: input.zones,
      rbq_number: input.rbq_number || null,
      bio: input.bio || null,
      slug,
      listing_status: "live",
      directory_plan: "free",
      is_featured: false,
      plan: "starter",
      status: "pending",
    }),
  });

  if (!created.ok || !Array.isArray(created.data) || !created.data[0]) {
    return { ok: false, error: created.text.slice(0, 300) || "insert failed" };
  }
  return { ok: true, id: created.data[0].id, slug: created.data[0].slug || slug };
}

export { isFeaturedActive };
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/directory-queries.ts
git commit -m "feat(directory): add list/get/insert query helpers"
```

---

### Task 5: Register API

**Files:**
- Create: `src/app/api/directory/register/route.ts`

- [ ] **Step 1: Implement POST `/api/directory/register`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TRADES } from "@/lib/trades";
import { ALL_ZONES } from "@/lib/zones";
import { insertFreeListing } from "@/lib/directory-queries";
import { notifyNewLead } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tradeIds = TRADES.map((t) => t.id);
const zoneSlugs = ALL_ZONES.map((z) => z.slug);

const Body = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  trades: z.array(z.string().refine((v) => tradeIds.includes(v))).min(1).max(5),
  zones: z.array(z.string().refine((v) => zoneSlugs.includes(v))).min(1).max(15),
  rbq_number: z.string().max(40).optional(),
  bio: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const d = parsed.data;
    const result = await insertFreeListing({
      name: d.name,
      email: d.email,
      phone: d.phone,
      trades: d.trades,
      zones: d.zones,
      rbq_number: d.rbq_number,
      bio: d.bio,
    });
    if (!result.ok) {
      console.error("[directory/register]", result.error);
      // Unique email conflict often returns 409 from PostgREST
      if (/duplicate|unique/i.test(result.error)) {
        return NextResponse.json(
          { error: "Email already registered", code: "EMAIL_EXISTS" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Could not create listing" }, { status: 502 });
    }

    await notifyNewLead({
      name: `DIR free: ${d.name}`,
      phone: d.phone,
      email: d.email,
      trade: d.trades.join(","),
      zone: d.zones.slice(0, 3).join(","),
      message: `Nouvelle inscription annuaire. slug=${result.slug}`,
      language: "fr",
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      id: result.id,
      slug: result.slug,
      url: `/entrepreneur/${result.slug}`,
    });
  } catch (err) {
    console.error("[directory/register]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Manual smoke (dev server running + Supabase env)**

```bash
curl -s -X POST http://localhost:3000/api/directory/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Plomberie ABC\",\"email\":\"test-dir-$(date +%s)@example.com\",\"phone\":\"5145550100\",\"trades\":[\"plumbing\"],\"zones\":[\"plateau\"],\"bio\":\"Test seed\"}"
```

Expected JSON: `{ "ok": true, "slug": "test-plomberie-abc", ... }`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/directory/register/route.ts
git commit -m "feat(directory): free listing registration API"
```

---

### Task 6: Directory UI components

**Files:**
- Create: `src/components/directory/ContractorCard.tsx`
- Create: `src/components/directory/DirectoryList.tsx`
- Create: `src/components/directory/DirectoryRegisterForm.tsx`

- [ ] **Step 1: ContractorCard**

```tsx
// src/components/directory/ContractorCard.tsx
import type { Lang } from "@/lib/i18n";
import type { DirectoryListing } from "@/lib/directory";
import { isFeaturedActive, tradeLabel } from "@/lib/directory";
import { getZoneBySlug, zoneLabel } from "@/lib/zones";
import { hrefFor } from "@/lib/paths";
import { cn } from "@/lib/cn";

export default function ContractorCard({
  listing,
  lang,
}: {
  listing: DirectoryListing;
  lang: Lang;
}) {
  const featured = isFeaturedActive(listing);
  const profileHref =
    lang === "en"
      ? `/en/entrepreneur/${listing.slug}`
      : `/entrepreneur/${listing.slug}`;

  return (
    <article
      className={cn(
        "rounded-2xl border p-5",
        featured
          ? "border-amber-500/60 bg-amber-500/5"
          : "border-white/10 bg-white/[0.02]"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white">
            <a href={profileHref} className="hover:text-amber-400">
              {listing.name}
            </a>
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {listing.trades.map((t) => tradeLabel(t, lang)).join(" · ")}
          </p>
        </div>
        {featured && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-black">
            {lang === "fr" ? "En vedette" : "Featured"}
          </span>
        )}
      </div>
      {listing.zones?.length > 0 && (
        <p className="mt-2 text-xs text-zinc-500">
          {listing.zones
            .slice(0, 4)
            .map((z) => {
              const zone = getZoneBySlug(z);
              return zone ? zoneLabel(zone, lang) : z;
            })
            .join(", ")}
          {listing.zones.length > 4 ? "…" : ""}
        </p>
      )}
      {listing.rbq_number && (
        <p className="mt-2 text-xs text-zinc-400">
          RBQ {listing.rbq_number}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {listing.phone && (
          <a
            href={`tel:${listing.phone}`}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400"
          >
            {lang === "fr" ? "Appeler" : "Call"}
          </a>
        )}
        <a
          href={profileHref}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-zinc-200 hover:border-white/30"
        >
          {lang === "fr" ? "Voir le profil" : "View profile"}
        </a>
        <a
          href={`${hrefFor(lang, "soumission")}?trade=${listing.trades[0] || ""}`}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-zinc-400 hover:text-white"
        >
          {lang === "fr" ? "Soumission" : "Get quote"}
        </a>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: DirectoryList**

```tsx
// src/components/directory/DirectoryList.tsx
import type { Lang } from "@/lib/i18n";
import type { DirectoryListing } from "@/lib/directory";
import ContractorCard from "./ContractorCard";

export default function DirectoryList({
  listings,
  lang,
  emptyMessage,
}: {
  listings: DirectoryListing[];
  lang: Lang;
  emptyMessage: string;
}) {
  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-zinc-400">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {listings.map((l) => (
        <li key={l.id}>
          <ContractorCard listing={l} lang={lang} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: DirectoryRegisterForm (client)**

```tsx
// src/components/directory/DirectoryRegisterForm.tsx
"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { TRADES } from "@/lib/trades";
import { ALL_ZONES, zoneLabel } from "@/lib/zones";
import { cn } from "@/lib/cn";

const WEEK1 = ["plumbing", "electrical", "roofing"];

export default function DirectoryRegisterForm({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trade, setTrade] = useState("plumbing");
  const [zones, setZones] = useState<string[]>(["plateau"]);
  const [rbq, setRbq] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneSlug, setDoneSlug] = useState("");

  function toggleZone(slug: string) {
    setZones((z) =>
      z.includes(slug) ? z.filter((x) => x !== slug) : z.length >= 15 ? z : [...z, slug]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/directory/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          trades: [trade],
          zones,
          rbq_number: rbq || undefined,
          bio: bio || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      setDoneSlug(data.slug as string);
    } catch {
      setError(lang === "fr" ? "Erreur réseau" : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (doneSlug) {
    const href = lang === "en" ? `/en/entrepreneur/${doneSlug}` : `/entrepreneur/${doneSlug}`;
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center">
        <p className="font-bold text-white">
          {lang === "fr" ? "Profil publié !" : "Profile live!"}
        </p>
        <a href={href} className="mt-3 inline-block text-amber-400 underline">
          {href}
        </a>
      </div>
    );
  }

  const trades = TRADES.filter((t) => WEEK1.includes(t.id) || true);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={lang === "fr" ? "Nom de l'entreprise" : "Business name"}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      />
      <input
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={lang === "fr" ? "Téléphone" : "Phone"}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      />
      <select
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      >
        {trades.map((t) => (
          <option key={t.id} value={t.id}>
            {lang === "fr" ? t.fr : t.en}
          </option>
        ))}
      </select>
      <input
        value={rbq}
        onChange={(e) => setRbq(e.target.value)}
        placeholder="RBQ (optionnel)"
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={lang === "fr" ? "Courte description" : "Short bio"}
        rows={3}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white"
      />
      <fieldset>
        <legend className="mb-2 text-sm text-zinc-400">
          {lang === "fr" ? "Zones (max 15)" : "Zones (max 15)"}
        </legend>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {ALL_ZONES.map((z) => (
            <label key={z.slug} className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={zones.includes(z.slug)}
                onChange={() => toggleZone(z.slug)}
              />
              {zoneLabel(z, lang)}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || zones.length === 0}
        className={cn(
          "w-full rounded-xl bg-amber-500 py-3 font-bold text-black hover:bg-amber-400",
          loading && "opacity-60"
        )}
      >
        {loading
          ? "..."
          : lang === "fr"
            ? "Publier mon profil gratuit"
            : "Publish free profile"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/directory/
git commit -m "feat(directory): list, card, and register form components"
```

---

### Task 7: Public pages — annuaire + profile + inscription (FR + EN)

**Files:**
- Create: `src/app/annuaire/page.tsx`
- Create: `src/app/annuaire/[metier]/page.tsx`
- Create: `src/app/annuaire/[metier]/[zone]/page.tsx`
- Create: `src/app/entrepreneur/[slug]/page.tsx`
- Create: `src/app/inscription/page.tsx`
- Create: `src/app/en/annuaire/page.tsx`
- Create: `src/app/en/annuaire/[metier]/page.tsx`
- Create: `src/app/en/annuaire/[metier]/[zone]/page.tsx`
- Create: `src/app/en/entrepreneur/[slug]/page.tsx`
- Create: `src/app/en/inscription/page.tsx`
- Optional shared: `src/components/directory/DirectoryIndex.tsx`, `DirectoryTradePage.tsx`, `ProfilePage.tsx` to avoid FR/EN duplication

- [ ] **Step 1: Shared server components for pages**

Create `src/components/directory/DirectoryShell.tsx` wrapping title + list.

**FR `/annuaire/page.tsx` pattern:**

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DIRECTORY_TRADES } from "@/lib/directory";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Annuaire des entrepreneurs — Grand Montréal | MTLTrades",
  description:
    "Trouvez un plombier, électricien ou couvreur vérifié sur le Grand Montréal. Licence RBQ, zones, contact direct.",
  alternates: {
    canonical: `${SITE_URL}/annuaire`,
    languages: { "fr-CA": `${SITE_URL}/annuaire`, "en-CA": `${SITE_URL}/en/annuaire` },
  },
};

export default function AnnuaireIndexPage() {
  const week1 = DIRECTORY_TRADES.filter((t) => t.week1);
  return (
    <>
      <Navbar lang="fr" />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-black text-white">
          Annuaire des entrepreneurs
        </h1>
        <p className="mt-2 text-zinc-400">
          Grand Montréal — plomberie, électricité, toiture.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {week1.map((t) => (
            <li key={t.id}>
              <a
                href={`/annuaire/${t.slugFr}`}
                className="block rounded-2xl border border-white/10 p-5 font-bold text-amber-400 hover:border-amber-500/50"
              >
                {t.nameFr}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-zinc-500">
          Entrepreneur ?{" "}
          <a href="/inscription" className="text-amber-400 underline">
            Publiez votre profil gratuit
          </a>
        </p>
      </main>
      <Footer lang="fr" />
    </>
  );
}
```

**FR `/annuaire/[metier]/page.tsx`:** resolve slug via `getDirectoryTradeBySlug`, 404 if unknown; `listLiveContractors({ tradeId })`; render `DirectoryList`.

**FR `/annuaire/[metier]/[zone]/page.tsx`:** resolve trade + `getZoneBySlug`; list filtered; SEO title `Plombier Plateau-Mont-Royal`.

**FR `/entrepreneur/[slug]/page.tsx`:** `getContractorBySlug`; show bio, phone, RBQ, zones, CTA soumission + featured upgrade link for owner later.

**FR `/inscription/page.tsx`:** `DirectoryRegisterForm lang="fr"`.

**EN:** Same with `lang="en"`, paths under `/en/...`, English copy.

- [ ] **Step 2: Build check**

Run: `pnpm build`  
Expected: compile success; routes listed for annuaire/entrepreneur/inscription.

- [ ] **Step 3: Commit**

```bash
git add src/app/annuaire src/app/entrepreneur src/app/inscription src/app/en/annuaire src/app/en/entrepreneur src/app/en/inscription src/components/directory
git commit -m "feat(directory): public annuaire, profile, and inscription pages"
```

---

### Task 8: Nav, paths, i18n, sitemap, trade landing links

**Files:**
- Modify: `src/lib/paths.ts`
- Modify: `src/lib/i18n.ts`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx` (if footer has links)
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/TradeLanding.tsx` (or each trade page) — add link “Voir l’annuaire”

- [ ] **Step 1: paths.ts — add pairs**

```ts
// inside pathPairs() base array:
{ fr: "annuaire", en: "annuaire" },
{ fr: "inscription", en: "inscription" },
// dynamic entrepreneur/* left as same-slug fallback via resolvePair
```

- [ ] **Step 2: i18n keys**

```ts
"nav.directory": { fr: "Annuaire", en: "Directory" },
"nav.listBusiness": { fr: "S'inscrire", en: "List free" },
```

- [ ] **Step 3: Navbar — link Annuaire before zones**

```tsx
<a href={hrefFor(lang, "annuaire")} className="hidden text-zinc-300 hover:text-white sm:inline">
  {t(lang, "nav.directory")}
</a>
```

- [ ] **Step 4: sitemap — static directory routes + week1 trade pages**

```ts
{ path: "/annuaire", enPath: "/en/annuaire", priority: 0.92, change: "weekly" },
{ path: "/inscription", enPath: "/en/inscription", priority: 0.85, change: "monthly" },
{ path: "/annuaire/plomberie", enPath: "/en/annuaire/plumbing", priority: 0.9, change: "weekly" },
{ path: "/annuaire/electricite", enPath: "/en/annuaire/electrical", priority: 0.9, change: "weekly" },
{ path: "/annuaire/toiture", enPath: "/en/annuaire/roofing", priority: 0.9, change: "weekly" },
```

(Optional later: dynamic sitemap from DB for all live slugs.)

- [ ] **Step 5: Trade landing CTA**

On each trade landing, add:

```tsx
<a href={`/annuaire/${slugFr}`} className="...">
  {lang === "fr" ? "Parcourir l'annuaire" : "Browse directory"}
</a>
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/paths.ts src/lib/i18n.ts src/components/Navbar.tsx src/components/Footer.tsx src/app/sitemap.ts src/components/TradeLanding.tsx
git commit -m "feat(directory): nav, i18n, sitemap, trade landing links"
```

---

### Task 9: Featured Stripe checkout + webhook

**Files:**
- Create: `src/app/api/directory/featured-checkout/route.ts`
- Create: `src/components/directory/FeaturedCheckoutButton.tsx`
- Modify: `src/app/api/stripe/webhook/route.ts`
- Modify: `src/app/entrepreneurs` page or profile to show Featured offer

- [ ] **Step 1: Featured checkout API**

```ts
// src/app/api/directory/featured-checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { featuredPaymentLink, featuredPriceId } from "@/lib/directory-pricing";
import { sbFetch } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  contractorId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  slug: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 422 });
  }

  let contractorId = parsed.data.contractorId;
  if (!contractorId && parsed.data.slug) {
    const r = await sbFetch<{ id: string }[]>(
      `contractors?slug=eq.${encodeURIComponent(parsed.data.slug)}&select=id&limit=1`
    );
    contractorId = r.data?.[0]?.id;
  }
  if (!contractorId && parsed.data.email) {
    const r = await sbFetch<{ id: string }[]>(
      `contractors?email=eq.${encodeURIComponent(parsed.data.email.trim().toLowerCase())}&select=id&limit=1`
    );
    contractorId = r.data?.[0]?.id;
  }
  if (!contractorId) {
    return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
  }

  const priceId = featuredPriceId();
  if (!isStripeConfigured() || !priceId) {
    const link = featuredPaymentLink();
    if (link) {
      return NextResponse.json({ url: link, mode: "payment_link" });
    }
    return NextResponse.json(
      { error: "Featured Stripe price not configured", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: parsed.data.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/entrepreneur/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/entrepreneurs?canceled=1`,
    metadata: {
      contractor_id: contractorId,
      product: "featured",
      plan: "featured",
    },
    subscription_data: {
      metadata: {
        contractor_id: contractorId,
        product: "featured",
        plan: "featured",
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
```

- [ ] **Step 2: Webhook — branch on product=featured**

In `checkout.session.completed`:

```ts
const product = session.metadata?.product;
const contractorId = session.metadata?.contractor_id;
if (contractorId && product === "featured") {
  const until = new Date();
  until.setMonth(until.getMonth() + 1);
  await sbFetch(`contractors?id=eq.${contractorId}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      is_featured: true,
      directory_plan: "featured",
      featured_until: until.toISOString(),
      stripe_featured_subscription_id: session.subscription,
      listing_status: "live",
    }),
  });
  // telegram notify...
} else if (contractorId) {
  // existing lead plan path
}
```

In `customer.subscription.deleted` / `updated`: if `sub.metadata?.product === "featured"`, clear `is_featured`, set `directory_plan: "free"`, clear `featured_until`. Do **not** overwrite lead `plan`/`status` when product is featured.

- [ ] **Step 3: FeaturedCheckoutButton client component**

```tsx
"use client";
export default function FeaturedCheckoutButton({
  slug,
  email,
  lang,
}: {
  slug?: string;
  email?: string;
  lang: "fr" | "en";
}) {
  async function buy() {
    const res = await fetch("/api/directory/featured-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Error");
  }
  return (
    <button type="button" onClick={buy} className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-black">
      {lang === "fr" ? "Passer en vedette — 79 $/mois" : "Go featured — $79/mo"}
    </button>
  );
}
```

- [ ] **Step 4: Stripe Dashboard (manual ops)**

1. Create Product “MTLTrades En vedette” — $79 CAD / month  
2. Copy price id → Netlify/env `STRIPE_PRICE_FEATURED`  
3. Optional Payment Link → `NEXT_PUBLIC_STRIPE_LINK_FEATURED`  
4. Ensure webhook endpoint already points at `/api/stripe/webhook`

- [ ] **Step 5: Simple success page**

Create `src/app/entrepreneur/success/page.tsx` — thank you + link to profile/dashboard.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/directory/featured-checkout src/app/api/stripe/webhook/route.ts src/components/directory/FeaturedCheckoutButton.tsx src/app/entrepreneur/success
git commit -m "feat(directory): Stripe featured checkout and webhook"
```

---

### Task 10: Entrepreneurs sales page + profile upgrade CTA

**Files:**
- Modify: contractor-facing page under `src/app/entrepreneurs/` (and EN)  
- Modify: profile page to show Featured CTA when not featured

- [ ] **Step 1: Add Featured pricing card above or beside Starter/Pro**

Use `FEATURED_PLAN` from `directory-pricing.ts`. Copy:

- FR: “Soyez #1 dans votre zone — 79 $/mois. Pas de minimum de leads requis.”  
- Link to `/inscription` for free + FeaturedCheckoutButton after they have a slug.

- [ ] **Step 2: Commit**

```bash
git add src/app/entrepreneurs src/app/en/entrepreneurs src/app/entrepreneur
git commit -m "feat(directory): sales page featured offer and profile CTA"
```

---

### Task 11: Seed script (50+ listings)

**Files:**
- Create: `scripts/seed-directory.mjs`
- Create: `scripts/seed-directory-data.json` (sample 20–50 rows; expand offline)

- [ ] **Step 1: Seed data shape**

```json
[
  {
    "name": "Plomberie Exemple Plateau",
    "email": "seed-plomberie-plateau@example.invalid",
    "phone": "5145551001",
    "trades": ["plumbing"],
    "zones": ["plateau", "rosemont"],
    "rbq_number": "5678-1234-01",
    "bio": "Urgences et rénovation — Plateau et Rosemont."
  }
]
```

Use only `.invalid` emails or real outreach targets you own consent for. For cold seed without email spam, use unique `seed-{n}@mtltrades.invalid` and never email them from product.

- [ ] **Step 2: seed-directory.mjs**

```js
// Requires env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Usage: node --env-file=.env.local scripts/seed-directory.mjs

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const rows = JSON.parse(
  readFileSync(resolve("scripts/seed-directory-data.json"), "utf8")
);

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

for (const row of rows) {
  const slug = slugify(row.name);
  const body = {
    email: row.email.toLowerCase(),
    password_hash: null,
    name: row.name,
    phone: row.phone || null,
    trade: row.trades[0] || "general",
    trades: row.trades,
    zones: row.zones,
    rbq_number: row.rbq_number || null,
    bio: row.bio || null,
    slug,
    listing_status: "live",
    directory_plan: "free",
    is_featured: false,
    plan: "starter",
    status: "pending",
  };
  const res = await fetch(`${url}/rest/v1/contractors`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(res.status, row.name, text.slice(0, 120));
}
```

- [ ] **Step 3: Run seed**

```bash
node --env-file=.env.local scripts/seed-directory.mjs
```

Expected: mostly 201; listings appear on `/annuaire/plomberie`.

- [ ] **Step 4: Commit script + sample data (no secrets)**

```bash
git add scripts/seed-directory.mjs scripts/seed-directory-data.json
git commit -m "chore(directory): seed script for free contractor profiles"
```

---

### Task 12: Final verification + deploy checklist

**Files:** none required (ops)

- [ ] **Step 1: Local verification**

```bash
node scripts/test-directory-lib.mjs
pnpm build
pnpm dev
```

Manual browser checklist:

1. `/annuaire` → three trades  
2. `/annuaire/plomberie` → seeded + featured sort  
3. `/annuaire/plomberie/plateau` → filtered  
4. `/entrepreneur/{slug}` → phone + RBQ  
5. `/inscription` → create listing → redirect/link works  
6. `/en/annuaire` → English copy  

- [ ] **Step 2: Deploy**

```bash
git push origin main
```

Netlify env: add `STRIPE_PRICE_FEATURED` (and optional payment link).  
Redeploy. Confirm production URLs on mtltrades.com.

- [ ] **Step 3: GTM handoff (not code)**

- Export outreach list from seed (name, phone, trade, zone, profile URL)  
- Sales script: free profile live → offer $79 featured for their zone  
- Track: conversations / paid featured / week  

- [ ] **Step 4: Final commit if any deploy docs updated**

```bash
git add README.md
git commit -m "docs: directory deploy and featured Stripe env"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Extend `contractors` schema | Task 2 |
| Free listing + public profiles | Tasks 5–7 |
| `/annuaire`, trade, trade×zone, profile | Task 7 |
| Featured $79 Stripe | Tasks 3, 9 |
| Webhook featured vs leads | Task 9 |
| French-first + EN mirrors | Task 7–8 |
| Week-1 trades plumbing/electrical/roofing | Tasks 1, 7, 11 |
| Seed 50–100 | Task 11 |
| Nav + sitemap SEO | Task 8 |
| Keep lead Starter/Pro | Task 9 (branch only) |
| Sales page | Task 10 |
| 30-day GTM | Task 12 step 3 |

---

## Out of plan (explicit)

- Claim-token email magic links (schema has `claim_token`; wire later)  
- Full RBQ API verification  
- Dynamic sitemap of every profile  
- Review system  
- Password set flow for free-only listings → can reuse dashboard later  

---

## Self-review notes

- No TBD placeholders in tasks  
- Types: `DirectoryListing`, `listing_status`, `directory_plan`, `product: "featured"` consistent across tasks  
- Webhook must not clobber lead `plan` when handling featured  
- `password_hash` nullable required for seed  
- PostgREST `trades=cs.{plumbing}` contains filter requires array column from Task 2  
