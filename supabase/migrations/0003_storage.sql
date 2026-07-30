-- Level Line — Storage bucket for listening audio
-- Run after 0002_row_level_security.sql

insert into storage.buckets (id, name, public)
values ('listening-audio', 'listening-audio', true)
on conflict (id) do nothing;

-- Anyone can read/stream audio files (needed for students taking the test).
create policy "Public can read listening audio"
  on storage.objects for select
  using (bucket_id = 'listening-audio');

-- Only admins can upload/replace/delete audio files.
create policy "Admins can upload listening audio"
  on storage.objects for insert
  with check (bucket_id = 'listening-audio' and is_admin());

create policy "Admins can update listening audio"
  on storage.objects for update
  using (bucket_id = 'listening-audio' and is_admin())
  with check (bucket_id = 'listening-audio' and is_admin());

create policy "Admins can delete listening audio"
  on storage.objects for delete
  using (bucket_id = 'listening-audio' and is_admin());
