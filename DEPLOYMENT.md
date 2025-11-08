# Deployment Guide - Studio Nexora Comet

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database and storage set up
- [ ] Clerk authentication configured
- [ ] Stripe account and webhook configured
- [ ] Google AI API key obtained
- [ ] Domain DNS configured

## Step-by-Step Deployment

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-schema.sql` in the SQL Editor
3. Go to Storage → Create bucket:
   - Name: `images`
   - Public: Yes
   - File size limit: 10MB
4. Copy your project URL and anon key to `.env.local`

### 2. Clerk Setup

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure sign-in methods (Email, Google, etc.)
4. Copy publishable key and secret key to `.env.local`
5. Add callback URLs:
   - Development: `http://localhost:3000`
   - Production: `https://studio-nexora.com`

### 3. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Copy secret key to `.env.local`
4. Create webhook endpoint (after deployment):
   - URL: `https://studio-nexora.com/api/payments/webhook`
   - Events: `checkout.session.completed`
   - Copy webhook secret to `.env.local`

### 4. Google AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy to `NEXT_PUBLIC_GOOGLE_AI_API_KEY` in `.env.local`

### 5. Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and deploy:**
   ```bash
   vercel login
   vercel
   ```

3. **Add environment variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Configure domain:**
   - Go to Settings → Domains
   - Add `studio-nexora.com`
   - Follow DNS configuration instructions
   - Update `NEXT_PUBLIC_APP_URL` to `https://studio-nexora.com`

5. **Redeploy with production URL:**
   ```bash
   vercel --prod
   ```

### 6. Post-Deployment

1. **Update Stripe webhook URL** to production URL
2. **Test all flows:**
   - Sign up / Sign in
   - Photo upload
   - Style selection
   - AI generation
   - Payment (both methods)
   - Download

3. **Monitor:**
   - Vercel logs
   - Supabase logs
   - Stripe webhook events

## Troubleshooting

### Images not uploading
- Check Supabase storage bucket permissions
- Verify RLS policies
- Check file size limits

### Payments not working
- Verify Stripe webhook is configured
- Check webhook secret matches
- Verify API keys are correct

### Authentication issues
- Check Clerk callback URLs
- Verify environment variables
- Check middleware configuration

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Custom domain configured and SSL active
- [ ] Stripe webhook endpoint working
- [ ] Supabase RLS policies configured
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Analytics configured (if needed)
- [ ] Backup strategy in place

