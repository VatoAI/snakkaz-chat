-- Migration: Fix subscription schema and enforce foreign key relationships

-- 1. Create subscription_plans table
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

-- 2. Create subscriptions table with foreign key to subscription_plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active','canceled','trial','past_due','incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Enable Row Level Security on both tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Allow everyone to view subscription plans
CREATE POLICY "Anyone can view subscription_plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 5. (Optional) Verify tables and relationships exist
-- SELECT * FROM public.subscription_plans LIMIT 1;
-- SELECT * FROM public.subscriptions LIMIT 1;
