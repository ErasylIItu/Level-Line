-- Level Line — Row Level Security
-- Run after 0001_init_schema.sql

-- ─────────────────────────────────────────────
-- Helper: is the current user an admin?
-- ─────────────────────────────────────────────
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql stable security definer;

-- ─────────────────────────────────────────────
-- admin_users
-- No one can read/write this table via the client API.
-- Managed only from the Supabase dashboard / service role.
-- ─────────────────────────────────────────────
alter table admin_users enable row level security;

-- (No policies = no access for anon/authenticated roles by default.)

-- ─────────────────────────────────────────────
-- reading_passages — public read, admin write
-- ─────────────────────────────────────────────
alter table reading_passages enable row level security;

create policy "Public can read passages"
  on reading_passages for select
  using (true);

create policy "Admins can insert passages"
  on reading_passages for insert
  with check (is_admin());

create policy "Admins can update passages"
  on reading_passages for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete passages"
  on reading_passages for delete
  using (is_admin());

-- ─────────────────────────────────────────────
-- listening_audios — public read, admin write
-- ─────────────────────────────────────────────
alter table listening_audios enable row level security;

create policy "Public can read audios"
  on listening_audios for select
  using (true);

create policy "Admins can insert audios"
  on listening_audios for insert
  with check (is_admin());

create policy "Admins can update audios"
  on listening_audios for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete audios"
  on listening_audios for delete
  using (is_admin());

-- ─────────────────────────────────────────────
-- questions — public read (needed to render the test),
-- but correct_option_id is stripped before reaching the client
-- by the API layer (Phase 7), not by RLS. Write is admin-only.
-- ─────────────────────────────────────────────
alter table questions enable row level security;

create policy "Public can read questions"
  on questions for select
  using (true);

create policy "Admins can insert questions"
  on questions for insert
  with check (is_admin());

create policy "Admins can update questions"
  on questions for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete questions"
  on questions for delete
  using (is_admin());

-- ─────────────────────────────────────────────
-- test_sessions / test_results — NO direct client access at all.
-- All reads/writes happen through Next.js API routes using the
-- service role key (which bypasses RLS entirely). Locking these
-- tables down here is defense-in-depth in case the anon/authenticated
-- key is ever used against them directly.
-- ─────────────────────────────────────────────
alter table test_sessions enable row level security;
alter table test_results enable row level security;

-- (No policies defined = fully inaccessible to anon/authenticated roles.)
