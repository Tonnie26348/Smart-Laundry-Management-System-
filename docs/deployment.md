# Production Deployment Guide

This guide details the final steps to deploy the Smart Laundry Management System to production.

## 1. Supabase Backend
1.  **Project:** Create your project in the Supabase Dashboard.
2.  **Database:** Execute all migrations from `supabase/migrations/` in the SQL Editor.
3.  **RLS:** Ensure RLS is enabled on all tables as defined in migrations.
4.  **Auth:** Configure the Auth provider (Email/Password) in the Supabase Dashboard.
5.  **Storage:** Create a bucket named `order-items` (if used for item photos) and set RLS policies.
6.  **Secrets:** Add M-Pesa credentials (`CONSUMER_KEY`, `CONSUMER_SECRET`, `PASSKEY`, `SHORTCODE`) to **Supabase Vault** or Environment Variables in Edge Functions.
7.  **CORS:** In Supabase Auth -> URL Configuration, set the "Site URL" to your Vercel deployment URL. Add Vercel URL to CORS allowed origins.

## 2. Frontend Deployment (Vercel)
1.  **Import:** Connect your GitHub repository to Vercel.
2.  **Environment Variables:** Add the following to Vercel project settings:
    - `VITE_SUPABASE_URL`: (Your Supabase Project URL)
    - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
3.  **Build Command:** `npm run build`
4.  **Output Directory:** `dist`

## 3. Post-Deployment Smoke Test
- Verify login/auth.
- Verify dashboard loads.
- Verify payment STK Push initiation.
- Verify realtime status updates.
