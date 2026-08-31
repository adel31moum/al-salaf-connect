-- ============================================================
-- Al-Salaf Connect — Supabase Schema
-- نفّذها عبر: npx supabase db push
-- ============================================================

create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  country text,
  city text,
  language text default 'ar',
  role text default 'member', -- member | scholar | local_admin | shariah_board
  gender text check (gender in ('male','female')),
  created_at timestamptz default now()
);

create table if not exists marriage_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  guardian_id uuid references profiles(id) not null,
  bio_text text not null,
  religious_commitment text,
  seeking_description text,
  is_active boolean default false,
  verified_by_admin uuid references profiles(id),
  created_at timestamptz default now()
  -- عمدًا: لا يوجد عمود photo/image/avatar في هذا الجدول
);

create table if not exists proposal_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) not null,
  target_profile_id uuid references marriage_profiles(id) not null,
  status text default 'pending_guardian',
  guardian_a_approved boolean default false,
  guardian_b_approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists guardian_chat_rooms (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references proposal_requests(id) not null,
  participant_ids uuid[] not null,
  constraint min_three_parties check (array_length(participant_ids, 1) >= 3)
);

-- سجل مراجعة بشرية للمنشورات المُعلَّمة تلقائيًا من محرك السياسات (shariaPolicyEngine.js)
create table if not exists moderation_queue (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  reason text not null,
  status text default 'pending_human_review', -- pending_human_review | approved | rejected
  reviewed_by uuid references profiles(id),
  created_at timestamptz default now()
);

alter table marriage_profiles enable row level security;
alter table guardian_chat_rooms enable row level security;
alter table moderation_queue enable row level security;

create policy "female_profile_visibility"
on marriage_profiles for select
using (
  (select gender from profiles where id = user_id) = 'male'
  or auth.uid() = guardian_id
  or auth.uid() = user_id
  or exists (select 1 from profiles where id = auth.uid() and role = 'shariah_board')
);

create policy "no_direct_messaging"
on guardian_chat_rooms for insert
with check (array_length(participant_ids, 1) >= 3);

create policy "moderation_visible_to_board_only"
on moderation_queue for select
using (exists (select 1 from profiles where id = auth.uid() and role in ('shariah_board','local_admin')));
