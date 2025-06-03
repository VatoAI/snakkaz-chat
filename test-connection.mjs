#!/usr/bin/env node

console.log('🔍 Debug: Script started');

import { createClient } from '@supabase/supabase-js';

console.log('🔍 Debug: Imports successful');

// Local Supabase configuration
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('🔍 Debug: Configuration set');

async function testConnection() {
  console.log('🏗️  SUPABASE CONNECTION TEST');
  console.log('============================');
  
  try {
    console.log('📡 Checking health endpoint...');
    const healthResponse = await fetch(`${LOCAL_SUPABASE_URL}/health`);
    console.log(`Health check status: ${healthResponse.status}`);
    
    console.log('🔌 Creating Supabase client...');
    const client = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY);
    
    console.log('🧪 Testing simple query...');
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Query error:', error);
    } else {
      console.log('✅ Query successful, data:', data);
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error);
  }
}

testConnection();
