-- Montreal Trades homeowner quote form
-- Note: public.leads already exists on this project (CRM schema) — use quote_leads.

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
