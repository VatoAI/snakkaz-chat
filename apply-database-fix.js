#!/usr/bin/env node

/**
 * Database Schema Fix Application Script for Snakkaz Chat
 * 
 * This script applies the SQL fix from CRITICAL-DATABASE-FIX.sql to fix the 
 * subscription table errors (406) that are disrupting chat functionality.
 * 
 * Created: May 23, 2025
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('❌ Error: Missing VITE_SUPABASE_URL environment variable');
  console.error('Please ensure your .env file contains the proper Supabase configuration.');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase API key (VITE_SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY)');
  console.error('Please ensure your .env file contains the proper Supabase configuration.');
  process.exit(1);
}

console.log('🚀 Starting database schema fix application...');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Path to SQL file
const sqlFilePath = path.join(__dirname, 'CRITICAL-DATABASE-FIX.sql');

// Check if SQL file exists
if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ Error: SQL file not found at:', sqlFilePath);
  console.error('Please make sure the CRITICAL-DATABASE-FIX.sql file is in the project root.');
  process.exit(1);
}

// Function to verify tables exist after fix
async function verifyTables() {
  try {
    // Check subscription_plans table
    console.log('🔍 Verifying subscription_plans table...');
    const { data: plansData, error: plansError } = await supabase
      .from('subscription_plans')
      .select('count(*)')
      .limit(1);
      
    if (plansError) {
      console.error('❌ Error checking subscription_plans table:', plansError.message);
      return { plansExist: false };
    }
    
    console.log('✅ subscription_plans table exists and is accessible');
    
    // Check subscriptions table
    console.log('🔍 Verifying subscriptions table...');
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('count(*)')
      .limit(1);
      
    if (subsError) {
      console.error('❌ Error checking subscriptions table:', subsError.message);
      return { plansExist: true, subsExist: false };
    }
    
    console.log('✅ subscriptions table exists and is accessible');
    
    // Check for subscription plans data
    console.log('🔍 Checking for subscription plans data...');
    const { data: plans, error: plansDataError } = await supabase
      .from('subscription_plans')
      .select('*');
    
    if (plansDataError) {
      console.error('❌ Error fetching subscription plans:', plansDataError.message);
      return { plansExist: true, subsExist: true, plansData: false };
    }
    
    console.log(`✅ Found ${plans?.length || 0} subscription plans`);
    
    return { 
      plansExist: true, 
      subsExist: true, 
      plansData: plans && plans.length > 0,
      success: true
    };
  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
    return { success: false, error: error.message };
  }
}

// Function to display SQL fix instructions
function displaySqlInstructions() {
  console.log('\n📋 Manual SQL Fix Instructions:');
  console.log('==============================\n');
  console.log('To fix the database schema, follow these steps:\n');
  console.log('1. Open the Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new\n');
  console.log('2. Copy and paste the entire contents of this file:');
  console.log(`   ${sqlFilePath}\n`);
  console.log('3. Click the "Run" button in the SQL Editor\n');
  console.log('4. After running the SQL script, restart your development server:\n');
  console.log('   npm run dev\n');
}

// Main function
async function main() {
  try {
    // First, check if tables already exist
    const initialCheck = await verifyTables();
    
    if (initialCheck.success) {
      console.log('\n✅ Database schema is already correctly set up!');
      console.log('The 406 subscription errors should no longer occur.\n');
      return;
    }
    
    // If tables don't exist, display manual instructions
    console.log('\n⚠️ Database schema needs to be fixed.\n');
    displaySqlInstructions();
    
    // Read SQL file content for reference
    try {
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      console.log('\nSQL File Content Preview (first 300 characters):');
      console.log('-------------------------------------------');
      console.log(sqlContent.substring(0, 300) + '...');
      console.log('-------------------------------------------\n');
    } catch (err) {
      console.error('❌ Error reading SQL file:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the main function
main().then(() => {
  console.log('\nDatabase fix script completed.');
  console.log('If you applied the fixes, restart your development server to see the effects.');
});
