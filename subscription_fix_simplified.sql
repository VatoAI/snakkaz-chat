-- Oppdatert subscription fix script som også legger til is_admin kolonnen

-- Sjekk om profiles-tabellen eksisterer og opprett den hvis ikke
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Legg til is_admin kolonnen til profiles-tabellen hvis den ikke finnes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create subscription plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  interval TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  badge_text TEXT,
  highlighted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create subscriptions table with foreign key to subscription_plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_id TEXT REFERENCES public.subscription_plans NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'trial', 'past_due', 'incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Check if the tables are empty and insert default plans if needed
INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
SELECT 'basic', 'Basic', 'Essential secure messaging features', 0.00, 'monthly', 
  '{"extended_storage": false, "premium_groups": false, "custom_email": false, "e2ee": true, "priority_support": false, "unlimited_messages": false}'::jsonb, 
  NULL, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE id = 'basic');

INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
SELECT 'premium', 'Premium', 'Enhanced security and additional features', 5.99, 'monthly', 
  '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true}'::jsonb,
  'Popular', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE id = 'premium');

INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
SELECT 'premium_yearly', 'Premium Yearly', 'Enhanced security and additional features with yearly discount', 59.99, 'yearly', 
  '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true}'::jsonb,
  'Best Value', FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE id = 'premium_yearly');

INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
SELECT 'business', 'Business', 'Advanced features for businesses and teams', 12.99, 'monthly', 
  '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true, "api_access": true, "electrum_integration": true}'::jsonb,
  NULL, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE id = 'business');

-- Add RLS policies
-- Enable RLS on tables
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Opprett enklere policy som tillater visning av abonnementsplaner
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);

-- Opprett policy som lar alle endre abonnementsplaner (midlertidig for testing)
DROP POLICY IF EXISTS "Allow all to modify subscription plans" ON public.subscription_plans;
CREATE POLICY "Allow all to modify subscription plans" ON public.subscription_plans USING (true);

-- Opprett policy for visning av egne abonnementer
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
FOR SELECT USING (auth.uid() = user_id);

-- Opprett policy som lar alle endre abonnementer (midlertidig for testing)
DROP POLICY IF EXISTS "Allow all to modify subscriptions" ON public.subscriptions;
CREATE POLICY "Allow all to modify subscriptions" ON public.subscriptions USING (true);
