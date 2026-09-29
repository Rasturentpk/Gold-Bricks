# Gold Bricks — live admin website

This version converts the original single-file site from browser-only saving to a real Supabase-backed website.

## What changed
- `index.html` is the public website.
- `admin.html` is the separate admin panel.
- `app.js` loads website content from Supabase, with the original content as a fallback.
- `admin.js` authenticates with Supabase Auth and saves edits to the database.
- `default-data.js` preserves the original Gold Bricks content and embedded images.
- `styles.css` keeps the original visual design.
- `supabase-schema.sql` creates the database, Row Level Security policies, admin table, and optional image bucket.
- No `localStorage` is used for publishing.

## Setup
1. Create a Supabase project.
2. In Supabase Dashboard → Authentication → Users, create an admin user with an email and password.
3. Copy that user's UUID.
4. Open `supabase-schema.sql`. Uncomment the `insert into public.admin_users...` line and replace `ADMIN_USER_UUID` with the real UUID. Run the SQL in Supabase SQL Editor.
5. In Supabase Dashboard → Project Settings → API, copy the Project URL and the anon/publishable key.
6. Put those two values in `config.js`.
7. Insert the initial content into `site_content`. The easiest route is to copy the JSON object from `default-data.js` (the value after `window.GOLD_BRICKS_DEFAULTS =`) and run:

```sql
insert into public.site_content(id,data) values (true, <PASTE_JSON_HERE>);
```

If you skip this seed step, the public site still shows the bundled original content, but the admin save will require the database row to exist.

## Deploy
The files are plain HTML/CSS/JS, so they can be hosted on GitHub Pages, Netlify, Vercel static hosting, or any normal static host. Supabase handles authentication and database storage.

## Admin URL
After deployment, open `/admin.html` and log in with the Supabase Auth admin account.

## Security
Do not put a Supabase `service_role` key in browser code. Use only the public anon/publishable key. Database writes are protected by Row Level Security and the `admin_users` table.

## Important
The current image editor keeps edited images as data URLs inside the JSON record. This is simple and works for this site, but for a larger production site you should upload images to the `site-assets` storage bucket and save their public URLs in the database. The included SQL already creates that bucket and its policies.
