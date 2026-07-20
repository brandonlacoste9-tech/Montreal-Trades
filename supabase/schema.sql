-- Montreal Trades — run in Supabase SQL Editor (or use: supabase db push)
-- Project: https://ulbfaxhsbbckotcbmslk.supabase.co
--
-- NOTE: public.leads already exists (CRM). Homeowner form uses quote_leads.

create extension if not exists "pgcrypto";

create table if not exists public.quote_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  city text,
  message text,
  language text not null default 'fr' check (language in ('fr', 'en')),
  source text not null default 'web',
  status text not null default 'new',
  market text not null default 'grand-montreal',
  contractor_id uuid,
  score int
);

create index if not exists quote_leads_created_at_idx on public.quote_leads (created_at desc);
create index if not exists quote_leads_status_idx on public.quote_leads (status);
create index if not exists quote_leads_city_idx on public.quote_leads (city);

alter table public.quote_leads enable row level security;

comment on table public.quote_leads is 'Montreal Trades — homeowner quote requests (Grand Montréal)';

-- ---------------------------------------------------------------------------
-- Contractors (base) — see migrations/20260712000002_contractors_and_claims.sql
-- ---------------------------------------------------------------------------

create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  password_hash text, -- nullable for unclaimed seeded directory listings
  name text not null,
  phone text,
  trade text not null default 'general',
  plan text not null default 'starter' check (plan in ('starter', 'pro')),
  status text not null default 'pending' check (status in ('pending', 'active', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  claims_this_month int not null default 0,
  claims_month text, -- YYYY-MM for reset
  market text not null default 'grand-montreal',
  -- Directory layer (migrations/20260720000000_directory_fields.sql)
  slug text,
  trades text[] not null default '{}',
  zones text[] not null default '{}',
  rbq_number text,
  bio text,
  photo_url text,
  listing_status text not null default 'draft'
    check (listing_status in ('draft', 'pending', 'live', 'hidden')),
  is_featured boolean not null default false,
  featured_until timestamptz,
  directory_plan text not null default 'free'
    check (directory_plan in ('free', 'featured')),
  stripe_featured_subscription_id text,
  claim_token text
);

create index if not exists contractors_email_idx on public.contractors (email);
create index if not exists contractors_status_idx on public.contractors (status);

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

alter table public.contractors enable row level security;

comment on column public.contractors.listing_status is 'Public directory visibility';
comment on column public.contractors.directory_plan is 'free | featured (independent of lead plan)';

-- Claim columns on quote_leads
alter table public.quote_leads
  add column if not exists claimed_by uuid references public.contractors(id),
  add column if not exists claimed_at timestamptz;

create index if not exists quote_leads_claimed_by_idx on public.quote_leads (claimed_by);
create index if not exists quote_leads_open_idx on public.quote_leads (created_at desc)
  where claimed_by is null and status = 'new';

