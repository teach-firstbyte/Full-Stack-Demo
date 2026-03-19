# Advanced Frontend Demo

For Day 3 of ViTaL Workshops!

Learn how to use React and TypeScript by turning your old HTML/CSS/JS into React Components and use them in your full-stack Habit Tracker Web App!

## Structure

- **`frontend/`** – React (Vite) app; calls the backend API.
- **`backend/`** – Express server; reads/writes Supabase (habits, habit_completions).
- **`supabase/`** – Migrations for the Supabase schema.

## Setup

1. **Backend env** – In `backend/`, copy `.env.example` to `.env` and set:
   - `SUPABASE_URL` – your Supabase project URL
   - `SUPABASE_ANON_KEY` – your Supabase anon key

2. **Supabase** – Apply migrations in `supabase/migrations/` to create the `habits` and `habit_completions` tables.

3. **Install and run**
   - From repo root: `npm run dev` (starts backend on port 3001 and frontend on Vite’s port).
   - Or run separately: `npm run dev:backend` and `npm run dev:frontend`.

In development, the frontend proxies `/api` to the backend. For production, set `VITE_API_URL` in `frontend/.env` to your backend URL before building.
