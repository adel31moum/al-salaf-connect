-- ============================================================
-- إضافات v2 — تحقق من هوية الولي وسجل النزاعات وتدقيق الموافقات
-- نفّذها بعد schema.sql الأساسي: npx supabase db push
-- ============================================================

alter table marriage_profiles
  add column if not exists guardian_verification_status text default 'pending'
  check (guardian_verification_status in ('pending','verified','rejected'));

create table if not exists guardian_disputes (
  id uuid primary key default gen_random_uuid(),
  marriage_profile_id uuid references marriage_profiles(id) not null,
  raised_by uuid references profiles(id) not null,
  reason text not null,
  status text default 'open', -- open | resolved_by_board | withdrawn
  resolved_by uuid references profiles(id),
  resolution_note text,
  created_at timestamptz default now()
);

create table if not exists approval_audit_log (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references proposal_requests(id) not null,
  actor_id uuid references profiles(id) not null,
  action text not null, -- approved | rejected | requested_more_info
  created_at timestamptz default now()
);

alter table guardian_disputes enable row level security;
alter table approval_audit_log enable row level security;

create policy "disputes_visible_to_board_and_parties"
on guardian_disputes for select
using (
  auth.uid() = raised_by
  or exists (select 1 from profiles where id = auth.uid() and role = 'shariah_board')
);

create policy "audit_log_visible_to_board_and_parties"
on approval_audit_log for select
using (
  auth.uid() = actor_id
  or exists (select 1 from profiles where id = auth.uid() and role = 'shariah_board')
);
