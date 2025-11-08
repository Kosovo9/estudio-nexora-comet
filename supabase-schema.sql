-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  bank_details JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON payments(stripe_session_id);

-- Enable Row Level Security (optional, adjust as needed)
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your security requirements)
CREATE POLICY "Users can view their own generations"
  ON generations FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create temporary downloads table (24h expiration)
CREATE TABLE IF NOT EXISTS temp_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_temp_downloads_expires_at ON temp_downloads(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_downloads_user_id ON temp_downloads(user_id);

-- Enable RLS
ALTER TABLE temp_downloads ENABLE ROW LEVEL SECURITY;

-- Policies for temp_downloads
CREATE POLICY "Users can view their own temp downloads"
  ON temp_downloads FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own temp downloads"
  ON temp_downloads FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Function to clean expired downloads (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_downloads()
RETURNS void AS $$
BEGIN
  DELETE FROM temp_downloads
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  total_earnings NUMERIC(10, 2) DEFAULT 0,
  pending_earnings NUMERIC(10, 2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id TEXT NOT NULL,
  referral_email TEXT,
  referral_user_id TEXT,
  commission_amount NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  transaction_type TEXT, -- photo_generation, payment
  transaction_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tenants table (multi-tenant support)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  domain TEXT,
  custom_config JSONB,
  subscription_status TEXT DEFAULT 'active', -- active, suspended, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  reason TEXT NOT NULL,
  metadata JSONB,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- White pages table
CREATE TABLE IF NOT EXISTS white_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  template_id TEXT NOT NULL,
  customization JSONB,
  domain TEXT,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM tracking table
CREATE TABLE IF NOT EXISTS crm_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- registration, photo_generated, payment_completed
  crm_provider TEXT, -- hubspot, zoho, salesforce
  crm_contact_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email tracking table
CREATE TABLE IF NOT EXISTS email_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT,
  status TEXT DEFAULT 'sent', -- sent, delivered, opened, clicked, bounced
  message_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_security_logs_identifier ON security_logs(identifier);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_white_pages_user_id ON white_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_white_pages_tenant_id ON white_pages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_tracking_email ON crm_tracking(email);
CREATE INDEX IF NOT EXISTS idx_crm_tracking_event_type ON crm_tracking(event_type);
CREATE INDEX IF NOT EXISTS idx_email_tracking_to_email ON email_tracking(to_email);
CREATE INDEX IF NOT EXISTS idx_email_tracking_status ON email_tracking(status);

-- Enable RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Users can view their own affiliate data"
  ON affiliates FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own affiliate data"
  ON affiliates FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (auth.uid()::text = affiliate_id);

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenants"
  ON tenants FOR SELECT
  USING (auth.uid()::text = owner_id);

CREATE POLICY "Users can insert their own tenants"
  ON tenants FOR INSERT
  WITH CHECK (auth.uid()::text = owner_id);

-- RLS Policies for white_pages
CREATE POLICY "Users can view their own white pages"
  ON white_pages FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own white pages"
  ON white_pages FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own white pages"
  ON white_pages FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Function to auto-create affiliate record
CREATE OR REPLACE FUNCTION create_affiliate_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO affiliates (user_id, referral_code)
  VALUES (NEW.id::text, 'REF' || substr(md5(random()::text), 1, 8))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create affiliate (if using Supabase Auth)
-- CREATE TRIGGER on_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_affiliate_for_user();

-- Copilot history table
CREATE TABLE IF NOT EXISTS copilot_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copilot_history_user_id ON copilot_history(user_id);
CREATE INDEX IF NOT EXISTS idx_copilot_history_created_at ON copilot_history(created_at);

-- CMS content table (for Supabase CMS)
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'page',
  category TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(type);
CREATE INDEX IF NOT EXISTS idx_cms_content_status ON cms_content(status);

-- 2FA table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_2fa_user_id ON two_factor_auth(user_id);

-- User logs table (for analytics and admin dashboard)
CREATE TABLE IF NOT EXISTS user_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_logs_event ON user_logs(event);
CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_session_id ON user_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON user_logs(created_at);

-- Enable RLS for user_logs
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_logs (admins can see all, users see their own)
CREATE POLICY "Users can view their own logs"
  ON user_logs FOR SELECT
  USING (auth.uid()::text = user_id OR auth.uid()::text IN (SELECT id::text FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Users can insert their own logs"
  ON user_logs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

-- Storage policies for secure private bucket
-- Create private bucket (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('private-files', 'private-files', false);

-- Policy: Users can only access their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'private-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'private-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'private-files' AND auth.uid()::text = (storage.foldername(name))[1]);

