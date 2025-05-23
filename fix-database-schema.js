#!/usr/bin/env node

/**
 * Critical Database Schema Fix for Snakkaz Chat
 * Fixes 406 subscription table errors that are disrupting chat functionality
 * Created: May 23, 2025
 * Updated: May 23, 2025 - Now includes safer SQL execution with better error handling
 * 
 * This script applies the SQL fix from CRITICAL-DATABASE-FIX.sql to the Supabase database.
 * It will:
 * 1. Create subscription_plans table if it doesn't exist
 * 2. Create subscriptions table with proper foreign key relationship
 * 3. Insert default subscription plans
 * 4. Set up Row Level Security policies
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file if available
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not available, using hardcoded values');
}

// Use environment variables if available, otherwise use hardcoded values
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Error: No Supabase API key found. Set VITE_SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY environment variable.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🚀 Starting critical database schema fix...');
console.log('======================================');

// Load the SQL script content
function loadSqlScript() {
  try {
    const sqlPath = path.join(__dirname, 'CRITICAL-DATABASE-FIX.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Error: SQL script not found at:', sqlPath);
      process.exit(1);
    }
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    return sqlContent;
  } catch (error) {
    console.error('❌ Error loading SQL script:', error.message);
    process.exit(1);
  }
}

// Split SQL script into executable statements
function splitSqlStatements(sqlContent) {
  // Remove comments and split by semicolons
  const statements = sqlContent
    .replace(/--.*$/gm, '') // Remove single line comments
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  return statements;
}

async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { query: sql });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.log('⚠️ RPC execution failed:', error.message);
    console.log('Attempting to validate schema without direct SQL execution...');
    return { success: false, error };
  }
}

async function verifyTables() {
  console.log('🔍 Verifying table existence...');
  
  // Check subscription_plans table
  const { data: plansData, error: plansError } = await supabase
    .from('subscription_plans')
    .select('count(*)')
    .limit(1);
  
  const plansExists = !plansError || plansError.code !== 'PGRST106';
  console.log(plansExists 
    ? '✅ subscription_plans table exists' 
    : '❌ subscription_plans table missing');
  
  // Check subscriptions table
  const { data: subsData, error: subsError } = await supabase
    .from('subscriptions')
    .select('count(*)')
    .limit(1);
  
  const subsExists = !subsError || subsError.code !== 'PGRST106';
  console.log(subsExists 
    ? '✅ subscriptions table exists' 
    : '❌ subscriptions table missing');
  
  return { 
    plansExists, 
    subsExists, 
    bothExist: plansExists && subsExists 
  };
}
        console.log('📋 Manual action required:');
        console.log('');
        console.log('Please run this SQL in your Supabase SQL Editor:');
        console.log('https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new');
        console.log('');
        console.log(`
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

-- Insert default subscription plans
INSERT INTO public.subscription_plans (id, name, description, price, interval, features, badge_text, highlighted)
VALUES 
  ('basic', 'Basic', 'Essential secure messaging features', 0.00, 'monthly', 
   '{"extended_storage": false, "premium_groups": false, "custom_email": false, "e2ee": true, "priority_support": false, "unlimited_messages": false}'::jsonb, 
   NULL, FALSE),
  ('premium', 'Premium', 'Enhanced security and additional features', 5.99, 'monthly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true}'::jsonb,
   'Popular', TRUE),
  ('premium_yearly', 'Premium Yearly', 'Enhanced security with yearly discount', 59.99, 'yearly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true}'::jsonb,
   'Best Value', FALSE),
  ('business', 'Business', 'Advanced features for businesses', 12.99, 'monthly', 
   '{"extended_storage": true, "premium_groups": true, "custom_email": true, "e2ee": true, "priority_support": true, "unlimited_messages": true, "advanced_security": true, "file_sharing": true, "custom_themes": true, "api_access": true, "electrum_integration": true}'::jsonb,
   NULL, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
        `);
        console.log('');
        console.log('After running the SQL, the 406 subscription errors should stop.');
        console.log('Then restart your development server.');
        return false;
      } else {
        console.log('✅ subscription_plans table exists');
      }
    } else {
      console.log('✅ subscription_plans table created/verified');
    }

    console.log('🔍 Step 2: Checking subscriptions table...');
    
    const { data: checkSubscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (subError && subError.code === 'PGRST106') {
      console.log('❌ subscriptions table does not exist');
      return false;
    } else {
      console.log('✅ subscriptions table exists');
    }

    console.log('🔍 Step 3: Verifying subscription plans data...');
    
    const { data: plans, error: plansDataError } = await supabase
      .from('subscription_plans')
      .select('*');
    
    if (plansDataError) {
      console.log(`❌ Error querying subscription_plans: ${plansDataError.message}`);
      return false;
    }

    console.log(`✅ Found ${plans?.length || 0} subscription plans in database`);
    
    if (plans && plans.length === 0) {
      console.log('📝 No subscription plans found, manual insert needed...');
      return false;
    }

    console.log('');
    console.log('🎉 DATABASE SCHEMA FIX COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('The 406 subscription errors should now be resolved.');
    console.log('Please restart your development server to see the changes.');
    return true;

  } catch (error) {
    console.error('❌ Critical error during database fix:', error);
    return false;
  }
}

// Run the fix
fixDatabaseSchema().then(success => {
  if (success) {
    process.exit(0);
  } else {
    console.log('');
    console.log('⚠️  Manual intervention required. Please see instructions above.');
    process.exit(1);
  }
});
