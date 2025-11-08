# Studio Nexora Comet - AI Photo Studio MVP

Production-ready Next.js application for AI-powered photo transformations.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Clerk** - Authentication
- **Supabase** - Database & Storage
- **Google AI Studio** - AI image generation
- **Stripe** - Payment processing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Features

✅ Photo upload (3+ images required)
✅ Consent form (authorize image use)
✅ Style selector (Dark Studio / Paris Café)
✅ AI generation (Google AI Studio)
✅ Watermark preview
✅ Payment system (Bank MX + Stripe)
✅ Download without watermark

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.local` (already exists with API keys) or create it with:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your-google-ai-key
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up Supabase:**
   - Go to your Supabase project dashboard
   - Run the SQL from `supabase-schema.sql` in the SQL Editor
   - Go to Storage and create a bucket named `images` (public access)
   - Set up RLS policies as needed

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy

3. **Configure Custom Domain:**
   - In Vercel dashboard, go to Settings → Domains
   - Add `studio-nexora.com`
   - Update DNS records as instructed
   - Update `NEXT_PUBLIC_APP_URL` to `https://studio-nexora.com`

4. **Set up Stripe Webhook:**
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://studio-nexora.com/api/payments/webhook`
   - Select events: `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## Database Schema

### `generations` table
- `id` (uuid, primary key)
- `user_id` (text)
- `image_url` (text)
- `style` (text)
- `created_at` (timestamp)

### `payments` table
- `id` (uuid, primary key)
- `user_id` (text)
- `payment_method` (text)
- `amount` (numeric)
- `currency` (text)
- `status` (text)
- `stripe_session_id` (text, nullable)
- `bank_details` (jsonb, nullable)
- `image_url` (text)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)

## License

MIT

