-- Level Line — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────
create type question_type as enum ('vocabulary', 'grammar', 'reading', 'listening');
create type test_session_status as enum ('in_progress', 'completed', 'expired');

-- ─────────────────────────────────────────────
-- Admin allowlist
-- Rows are added manually (via Supabase dashboard or SQL) after an
-- admin creates an account through Supabase Auth. Presence of a row
-- here — not just a valid session — is what grants admin access.
-- ─────────────────────────────────────────────
create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Reading passages
-- ─────────────────────────────────────────────
create table reading_passages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Listening audio
-- ─────────────────────────────────────────────
create table listening_audios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audio_url text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Questions
-- Single table for all four question types. `options` is a JSON array
-- of { id, label }. `passage_id` / `audio_id` are only set for
-- reading / listening questions respectively.
-- ─────────────────────────────────────────────
create table questions (
  id uuid primary key default gen_random_uuid(),
  type question_type not null,
  prompt text not null,
  options jsonb not null,
  correct_option_id text not null,
  order_index int not null default 0,
  passage_id uuid references reading_passages (id) on delete cascade,
  audio_id uuid references listening_audios (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_passage_only_for_reading
    check (passage_id is null or type = 'reading'),
  constraint questions_audio_only_for_listening
    check (audio_id is null or type = 'listening')
);

create index questions_type_idx on questions (type);
create index questions_passage_idx on questions (passage_id);
create index questions_audio_idx on questions (audio_id);

-- ─────────────────────────────────────────────
-- Test sessions
-- Created anonymously when a student clicks "Start Test". All reads
-- and writes happen through server-side API routes using the service
-- role key — never directly from the browser. See RLS policies below.
-- ─────────────────────────────────────────────
create table test_sessions (
  id uuid primary key default gen_random_uuid(),
  status test_session_status not null default 'in_progress',
  current_question_index int not null default 0,
  answers jsonb not null default '{}'::jsonb,       -- { [question_id]: option_id }
  listening_plays jsonb not null default '{}'::jsonb, -- { [audio_id]: play_count }
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Test results
-- ─────────────────────────────────────────────
create table test_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references test_sessions (id) on delete cascade,
  overall_score int not null,
  total_questions int not null default 40,
  cefr_level text not null,
  recommended_course text not null,
  section_scores jsonb not null, -- [{ section, correct, total }]
  started_at timestamptz not null,
  finished_at timestamptz not null,
  duration_seconds int not null,
  created_at timestamptz not null default now()
);

create index test_results_session_idx on test_results (session_id);

-- ─────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reading_passages_updated_at
  before update on reading_passages
  for each row execute function set_updated_at();

create trigger listening_audios_updated_at
  before update on listening_audios
  for each row execute function set_updated_at();

create trigger questions_updated_at
  before update on questions
  for each row execute function set_updated_at();
