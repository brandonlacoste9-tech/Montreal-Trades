-- Contractors who pay for exclusive homeowner leads

create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  phone text,
  trade text not null default 'general',
  plan text not null default 'starter' check (plan in ('starter', 'pro')),
  status text not null default 'pending' check (status in ('pending', 'active', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  claims_this_month int not null default 0,
  claims_month text, -- YYYY-MM for reset
  market text not null default 'grand-montreal'
);

create index if not exists contractors_email_idx on public.contractors (email);
create index if not exists contractors_status_idx on public.contractors (status);

alter table public.contractors enable row level security;

-- Claim columns on quote_leads
alter table public.quote_leads
  add column if not exists claimed_by uuid references public.contractors(id),
  add column if not exists claimed_at timestamptz;

create index if not exists quote_leads_claimed_by_idx on public.quote_leads (claimed_by);
create index if not exists quote_leads_open_idx on public.quote_leads (created_at desc)
  where claimed_by is null and status = 'new';
