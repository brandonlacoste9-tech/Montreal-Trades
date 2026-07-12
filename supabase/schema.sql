-- Montreal Trades — run in Supabase SQL Editor
-- Project: https://ulbfaxhsbbckotcbmslk.supabase.co

create extension if not exists "pgcrypto";

-- Leads from homeowner quote form
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  city text,              -- zone slug (e.g. plateau, laval)
  message text,
  language text not null default 'fr' check (language in ('fr', 'en')),
  source text not null default 'web',
  status text not null default 'new',
  market text not null default 'grand-montreal',
  contractor_id uuid,
  score int
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_city_idx on public.leads (city);

alter table public.leads enable row level security;

-- Public form inserts via service role only (API route).
-- Authenticated contractors can read later when auth is added.
drop policy if exists "service role full access leads" on public.leads;

-- Allow anon insert only if you ever call from client (we use service role).
-- Safer default: no public policies; API uses service_role which bypasses RLS.

comment on table public.leads is 'Homeowner quote requests — Grand Montréal';
