-- contacts crm + ai usage fields
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  instagram_username text not null,
  instagram_display_name text,
  profile_picture_url text,
  captured_via text,
  automation_id uuid null,
  interaction_count integer default 1,
  engagement_score integer default 0,
  tags text[] default '{}',
  follows_you boolean default false,
  you_follow boolean default false,
  last_interaction_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists contacts_owner_username_unique
  on public.contacts(owner_user_id, instagram_username);

create index if not exists contacts_owner_username_idx
  on public.contacts(owner_user_id, instagram_username);

alter table public.profiles
  add column if not exists plan_type text,
  add column if not exists ai_used_today integer default 0,
  add column if not exists ai_used_monthly integer default 0,
  add column if not exists ai_daily_reset_date timestamptz,
  add column if not exists ai_month_reset_date timestamptz,
  add column if not exists subscription_end_date timestamptz;

update public.profiles
set plan_type = coalesce(plan_type, plan, 'free')
where plan_type is null;
