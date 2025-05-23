#!/bin/bash
# fix-subscription-schema-alt.sh
# Alternative method to fix subscription schema using Supabase CLI or direct SQL

echo "🔄 Alternative Method: Fixing Subscription Schema"
echo "==============================================="

# Sjekk om Supabase CLI er installert
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI funnet"
    echo "Du kan bruke følgende kommando for å fikse skjemaet:"
    echo ""
    echo "supabase db push"
    echo ""
    echo "Alternativt, logg inn på Supabase-dashboardet og kjør følgende SQL:"
else
    echo "⚠️ Supabase CLI ikke funnet"
    echo ""
    echo "For å fikse abonnementsskjemaet, kopier følgende SQL og kjør det direkte i Supabase SQL Editor:"
fi

cat << 'EOL'

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

-- Enable RLS on tables
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify subscription plans" ON public.subscription_plans;
CREATE POLICY "Only admins can modify subscription plans" ON public.subscription_plans
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create policies for subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can modify subscriptions" ON public.subscriptions;
CREATE POLICY "Only admins can modify subscriptions" ON public.subscriptions
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

EOL

echo ""
echo "========================================================"
echo "📊 Instruksjoner for å verifisere fiksingen:"
echo "1. Logg inn på Supabase Dashboard"
echo "2. Gå til 'Table Editor'"
echo "3. Sjekk at tabellene 'subscription_plans' og 'subscriptions' eksisterer"
echo "4. Sjekk at det er et foreign key-forhold mellom 'subscriptions.plan_id' og 'subscription_plans.id'"
echo "5. Start applikasjonen på nytt etter å ha kjørt SQL"
echo "========================================================"

# Sjekk om vi har curl og supabase_url/key i miljøvariablene
SUPABASE_URL=$(grep -o 'VITE_SUPABASE_URL=.*' .env 2>/dev/null | cut -d '=' -f2)
SUPABASE_KEY=$(grep -o 'VITE_SUPABASE_ANON_KEY=.*' .env 2>/dev/null | cut -d '=' -f2)

if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_KEY" ]; then
    echo ""
    echo "📊 Her er en lenke til Supabase SQL-editoren (krever innlogging):"
    echo "${SUPABASE_URL/https:\/\//https://app.supabase.com/project/}/sql"
    echo ""
fi
