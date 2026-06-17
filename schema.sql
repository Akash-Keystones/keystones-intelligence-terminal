create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  builder text not null,
  type text not null check (type in ('hot','market','rera','builder')),
  summary text not null,
  budget text,
  is_pinned boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;

-- Public visitors can only read active opportunities.
drop policy if exists "Public can read active opportunities" on public.opportunities;
create policy "Public can read active opportunities"
on public.opportunities
for select
using (is_active = true);

-- Inserts are handled only by the protected Vercel API using the service role key.
-- Do not create public insert/update/delete policies.
