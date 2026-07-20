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
