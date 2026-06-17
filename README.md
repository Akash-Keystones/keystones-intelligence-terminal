# Keystones Backend Start

## Files
- `index.html` — existing app screen
- `app.js` — connects frontend to backend API and WhatsApp CTA
- `styles.css` — premium black-gold styling
- `api/feed.js` — protected backend endpoint for reading and posting opportunities
- `schema.sql` — Supabase database table + security policy
- `package.json` — dependencies for Vercel deployment

## Required environment variables on Vercel
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

## Backend routes
- `GET /api/feed` — public feed
- `POST /api/feed` — admin-only posting with `x-admin-token`
