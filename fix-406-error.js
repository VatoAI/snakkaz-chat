#!/usr/bin/env node

/**
 * Snakkaz Chat - 406 Error Fix Script
 * Created: May 28, 2025
 * 
 * This script fixes the HTTP 406 "Not Acceptable" error occurring with 
 * subscription queries in Supabase by ensuring proper database schema
 * and improving error handling.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

console.log('🔧 Snakkaz Chat - 406 Error Diagnostic & Fix');
console.log('===========================================');
console.log('');

async function main() {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('1️⃣ Testing Supabase Connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.log('❌ Supabase connection failed:', testError.message);
      return;
    }
    console.log('✅ Supabase connection working');
    
    console.log('');
    console.log('2️⃣ Testing subscription_plans table...');
    const { data: plansData, error: plansError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .limit(1);
    
    if (plansError) {
      console.log('❌ subscription_plans error:', plansError.message);
      console.log('   Error code:', plansError.code);
      
      if (plansError.code === 'PGRST106') {
        console.log('');
        console.log('🛠️ SOLUTION: Create subscription_plans table');
        console.log('Copy this SQL to Supabase SQL Editor:');
        console.log('');
        console.log(createSubscriptionTablesSQL());
        return;
      }
    } else {
      console.log('✅ subscription_plans table exists');
      console.log(`   Found ${plansData?.length || 0} plans`);
    }
    
    console.log('');
    console.log('3️⃣ Testing subscriptions table...');
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (subsError) {
      console.log('❌ subscriptions error:', subsError.message);
      console.log('   Error code:', subsError.code);
      return;
    } else {
      console.log('✅ subscriptions table exists');
    }
    
    console.log('');
    console.log('4️⃣ Testing the problematic join query...');
    
    // Test the exact query that's causing 406 errors
    const { data: joinData, error: joinError } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', '419b9a79-e1ee-4935-83e2-375ca5a3ac13')
      .eq('status', 'active')
      .limit(1);
    
    if (joinError) {
      console.log('❌ Join query failed:', joinError.message);
      console.log('   Error code:', joinError.code);
      console.log('   Details:', joinError.details || 'No details');
      
      if (joinError.code === 'PGRST200' || joinError.message.includes('406')) {
        console.log('');
        console.log('🎯 FOUND THE 406 ERROR SOURCE!');
        console.log('');
        console.log('CAUSE: Missing foreign key relationship between tables');
        console.log('SOLUTION: Run this SQL in Supabase:');
        console.log('');
        console.log(fixForeignKeySQL());
      }
    } else {
      console.log('✅ Join query working correctly');
      console.log(`   Returned ${joinData?.length || 0} records`);
    }
    
    console.log('');
    console.log('5️⃣ Testing alternative query approach...');
    
    // Test a simpler approach that avoids the problematic join
    const { data: simpleData, error: simpleError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', '419b9a79-e1ee-4935-83e2-375ca5a3ac13')
      .eq('status', 'active')
      .limit(1);
    
    if (simpleError) {
      console.log('❌ Simple query failed:', simpleError.message);
    } else {
      console.log('✅ Simple subscription query works');
      console.log('   This can be used as a fallback');
    }
    
    console.log('');
    console.log('📋 SUMMARY & NEXT STEPS:');
    console.log('========================');
    
    if (plansError || subsError || joinError) {
      console.log('❌ Issues found that need fixing:');
      if (plansError) console.log('   - subscription_plans table missing/broken');
      if (subsError) console.log('   - subscriptions table missing/broken');  
      if (joinError) console.log('   - Foreign key relationship missing');
      
      console.log('');
      console.log('🔧 TO FIX: Run this SQL in Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new');
      console.log('');
      console.log(getCompleteFix());
    } else {
      console.log('✅ All tests passed - 406 error should be resolved');
      console.log('   If you still see 406 errors, try:');
      console.log('   1. Clear browser cache');
      console.log('   2. Restart development server');
      console.log('   3. Check browser network tab for details');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

function createSubscriptionTablesSQL() {
  return `
-- Create subscription_plans table
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

-- Create subscriptions table
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
`;
}

function fixForeignKeySQL() {
  return `
-- Add foreign key constraint if missing
ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_id_fkey;

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_id_fkey 
FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);
`;
}

function getCompleteFix() {
  return `
-- Complete fix for 406 subscription errors
${createSubscriptionTablesSQL()}

${fixForeignKeySQL()}

-- Insert default plans
INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
VALUES 
  ('basic', 'Basic', 'Essential secure messaging features', 0.00, 'monthly', 
   '{"extended_storage": false, "premium_groups": false, "custom_email": false, "e2ee": true}'::jsonb, 
   NULL, FALSE),
  ('premium', 'Premium', 'Enhanced security and additional features', 5.99, 'monthly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true}'::jsonb,
   'Popular', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Anyone can view subscription plans" 
ON public.subscription_plans FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
`;
}

main().catch(console.error);
