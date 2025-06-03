#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database Schema...\n');
  
  const supabase = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // Check tables
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    console.log('📋 Available Tables:');
    console.log('=' .repeat(30));
    tables?.forEach(table => {
      console.log(`   📄 ${table.table_name}`);
    });
    
    console.log(`\n✅ Total tables: ${tables?.length || 0}\n`);
    
    // Test basic functionality
    console.log('🧪 Testing Basic Queries:');
    console.log('-'.repeat(30));
    
    // Test each main table
    const testTables = ['profiles', 'messages', 'group_chats', 'group_members'];
    
    for (const tableName of testTables) {
      try {
        const start = Date.now();
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);
        
        const duration = Date.now() - start;
        
        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`   ✅ ${tableName}: ${count || 0} rows (${duration}ms)`);
        }
      } catch (err) {
        console.log(`   ⚠️  ${tableName}: Table might not exist`);
      }
    }
    
    console.log('\n🚀 Database Performance Test Results:');
    console.log('=' .repeat(50));
    
    // Performance test with timing
    const performanceTests = [
      { name: 'Simple SELECT', query: () => supabase.from('profiles').select('*').limit(5) },
      { name: 'COUNT query', query: () => supabase.from('profiles').select('*', { count: 'exact', head: true }) },
    ];
    
    for (const test of performanceTests) {
      const start = Date.now();
      try {
        const result = await test.query();
        const duration = Date.now() - start;
        console.log(`   ⚡ ${test.name}: ${duration}ms`);
      } catch (error) {
        console.log(`   ❌ ${test.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkDatabase();
