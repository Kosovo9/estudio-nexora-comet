# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Your `.env.local` file already exists with all API keys. Verify it contains:
- Clerk keys
- Supabase URL and keys
- Google AI API key
- Stripe keys
- App URL

### 3. Set Up Supabase
1. Go to your Supabase project
2. Run `supabase-schema.sql` in SQL Editor
3. Create storage bucket `images` (public)

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 What's Built

✅ **Complete Next.js 14 App** with App Router
✅ **Photo Upload** - Drag & drop, 3+ images required
✅ **Consent Form** - 3 checkboxes for authorization
✅ **Style Selector** - Dark Studio / Paris Café
✅ **AI Generation** - Google AI integration
✅ **Watermark Preview** - Canvas-based watermarking
✅ **Payment System** - Bank MX transfer + Stripe
✅ **Download** - Without watermark after payment
✅ **Authentication** - Clerk integration
✅ **Database** - Supabase for storage and payments

## 🎯 User Flow

1. Sign in/up with Clerk
2. Upload 3+ photos
3. Accept consent form
4. Select style (Dark Studio or Paris Café)
5. Generate AI image
6. Preview with watermark
7. Complete payment (Bank or Stripe)
8. Download without watermark

## 🔧 Next Steps

1. **Test locally** - Run `npm run dev` and test the flow
2. **Deploy to Vercel** - Follow `DEPLOYMENT.md`
3. **Configure domain** - Add `studio-nexora.com` in Vercel
4. **Set up webhooks** - Configure Stripe webhook endpoint

## 📝 Notes

- AI generation currently processes the first image (MVP)
- For production, integrate Google Imagen API for actual image generation
- Bank payments require manual verification
- Stripe payments are automated via webhook

## 🐛 Troubleshooting

**Can't upload images?**
- Check Supabase storage bucket exists and is public
- Verify RLS policies allow uploads

**Payment not working?**
- Check Stripe keys are correct
- Verify webhook is configured (production only)

**Auth issues?**
- Verify Clerk keys in `.env.local`
- Check callback URLs in Clerk dashboard

