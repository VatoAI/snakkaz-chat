-- 🚀 CRITICAL SNAKKAZ DATABASE SCHEMA FIX
-- This SQL fixes the 406 subscription table errors that are disrupting chat functionality
-- Copy and paste this entire script into your Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new

-- Step 1: Create subscription_plans table
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

-- Step 2: Create subscriptions table with proper foreign key relationship
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_id TEXT REFERENCES public.subscription_plans(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'trial', 'past_due', 'incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Step 3: Insert default subscription plans (if they don't exist)
INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
VALUES 
  ('basic', 'Basic', 'Essential secure messaging features', 0.00, 'monthly', 
   '{"extended_storage": false, "premium_groups": false, "custom_email": false, "e2ee": true, "priority_support": false, "unlimited_messages": false}'::jsonb, 
   NULL, false),
  ('premium', 'Premium', 'Enhanced security and additional features', 5.99, 'monthly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true}'::jsonb,
   'Popular', true),
  ('premium_yearly', 'Premium Yearly', 'Enhanced security with yearly discount', 59.99, 'yearly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true}'::jsonb,
   'Best Value', false),
  ('business', 'Business', 'Advanced features for businesses', 12.99, 'monthly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true, "api_access": true, "electrum_integration": true}'::jsonb,
   NULL, false)
ON CONFLICT (id) DO NOTHING;

-- Step 4: Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create security policies
-- Allow everyone to view subscription plans
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" 
  ON public.subscription_plans FOR SELECT 
  USING (true);

-- Allow users to view their own subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert/update their own subscriptions
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can manage their own subscriptions" 
  ON public.subscriptions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- ✅ VERIFICATION QUERIES
-- Run these to verify the fix worked:

-- Check if tables exist and have data
SELECT 'subscription_plans table' as table_name, count(*) as row_count FROM public.subscription_plans
UNION ALL
SELECT 'subscriptions table' as table_name, count(*) as row_count FROM public.subscriptions;

-- Check the relationship exists
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' 
AND tc.table_name='subscriptions'
AND ccu.table_name='subscription_plans';

-- 🎉 SUCCESS MESSAGE
-- If the queries above return results, the 406 subscription errors should be fixed!
-- Please restart your Snakkaz development server after running this script.
