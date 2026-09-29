-- Gold Bricks: Supabase database setup
-- 1) Create a Supabase project.
-- 2) In Authentication > Users, create the admin email/password account.
-- 3) Copy that user's UUID and replace ADMIN_USER_UUID below.
-- 4) Run this entire file in Supabase SQL Editor.

create table if not exists public.site_content (
  id boolean primary key default true check (id = true),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- Replace this UUID with the UUID of your Supabase Auth admin user.
-- insert into public.admin_users(user_id) values ('ADMIN_USER_UUID');

create policy "Public can read site content" on public.site_content
for select using (true);

create policy "Admins can update site content" on public.site_content
for update using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Only an existing admin can insert/delete content.
create policy "Admins can insert site content" on public.site_content
for insert with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "Admins can delete site content" on public.site_content
for delete using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Seed the initial website content by copying the JSON from default-data.js.
-- The application can also read the bundled defaults if the database row is unavailable.
-- After you configure the project, run the following in SQL Editor with your JSON:
-- insert into public.site_content(id,data) values (true, <PASTE_JSON_HERE>);

-- Optional storage bucket for future image uploads.
insert into storage.buckets (id,name,public) values ('site-assets','site-assets',true) on conflict (id) do nothing;

create policy "Public can view site assets" on storage.objects
for select using (bucket_id = 'site-assets');
create policy "Admins can upload site assets" on storage.objects
for insert with check (bucket_id = 'site-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "Admins can update site assets" on storage.objects
for update using (bucket_id = 'site-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (bucket_id = 'site-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "Admins can delete site assets" on storage.objects
for delete using (bucket_id = 'site-assets' and exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
