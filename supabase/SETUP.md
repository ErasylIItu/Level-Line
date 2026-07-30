# Supabase setup — Level Line

## 1. Create a project
Go to [supabase.com](https://supabase.com) → New project. Wait for it to finish provisioning.

## 2. Run the migrations
Open **SQL Editor** in the Supabase dashboard and run these files, in order:

1. `supabase/migrations/0001_init_schema.sql`
2. `supabase/migrations/0002_row_level_security.sql`
3. `supabase/migrations/0003_storage.sql`
4. *(optional)* `supabase/seed.sql` — adds a few sample questions so the app has content right away.

(If you use the Supabase CLI instead: `supabase link` then `supabase db push`.)

## 3. Create your admin account
1. In the dashboard, go to **Authentication → Users → Add user** and create yourself an account (email + password).
2. Copy the new user's UUID.
3. In the **SQL Editor**, run:
   ```sql
   insert into admin_users (id, email) values ('<paste-uuid>', '<your-email>');
   ```
   This is what actually grants admin access — having a login alone isn't enough, the RLS policies check for a matching row in `admin_users`.

## 4. Create the audio storage bucket
Already handled by `0003_storage.sql` — it creates a public `listening-audio` bucket with admin-only write access.

## 5. Copy your API keys
In **Settings → API**, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server-only)

Paste them into `.env.local` (copy `.env.example` if you haven't already).

## 6. Restart the dev server
```
npm run dev
```

That's it — the schema, RLS, and storage are ready. Actually wiring the app's pages to this data happens in Phase 7 (Backend API).
