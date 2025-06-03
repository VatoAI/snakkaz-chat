#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function checkExistingPolicies() {
  console.log('🔍 Checking existing RLS policies...\n');
  
  const supabase = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // Query to get all existing policies
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: `
        SELECT 
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual
        FROM pg_policies 
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname;
      `
    });
    
    if (error) {
      console.error('❌ Error querying policies:', error);
      return;
    }
    
    console.log('📋 Existing RLS Policies:');
    console.log('=' .repeat(80));
    
    let currentTable = '';
    data.forEach(policy => {
      if (policy.tablename !== currentTable) {
        currentTable = policy.tablename;
        console.log(`\n🗂️  Table: ${policy.tablename}`);
        console.log('-'.repeat(40));
      }
      
      console.log(`   📜 ${policy.policyname}`);
      console.log(`      Command: ${policy.cmd}`);
      console.log(`      Roles: ${policy.roles ? policy.roles.join(', ') : 'ALL'}`);
      if (policy.qual) {
        console.log(`      Condition: ${policy.qual.substring(0, 100)}...`);
      }
      console.log('');
    });
    
    // Count policies by table
    const tableStats = {};
    data.forEach(policy => {
      tableStats[policy.tablename] = (tableStats[policy.tablename] || 0) + 1;
    });
    
    console.log('\n📊 Policy Count by Table:');
    console.log('=' .repeat(40));
    Object.entries(tableStats).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} policies`);
    });
    
    console.log(`\n✅ Total policies found: ${data.length}`);
    
  } catch (error) {
    console.error('❌ Failed to check policies:', error.message);
  }
}

checkExistingPolicies();
