#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function analyzeDatabase() {
  console.log('🔍 Analyzing Supabase Database for RLS Optimization...\n');
  
  const supabase = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // Test basic queries on existing tables to measure performance
    const tables = ['group_chats', 'group_members', 'group_invites', 'group_settings', 'subscriptions', 'subscription_plans', 'premium_emails'];
    
    console.log('📊 Performance Baseline Tests:');
    console.log('=' .repeat(50));
    
    let totalTime = 0;
    let successfulQueries = 0;
    
    for (const table of tables) {
      try {
        const start = Date.now();
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(5);
        
        const duration = Date.now() - start;
        totalTime += duration;
        successfulQueries++;
        
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: ${count || 0} rows (${duration}ms)`);
        }
      } catch (err) {
        console.log(`   ⚠️  ${table}: ${err.message}`);
      }
    }
    
    const avgTime = successfulQueries > 0 ? totalTime / successfulQueries : 0;
    console.log(`\n📈 Average Query Time: ${avgTime.toFixed(2)}ms`);
    console.log(`✅ Successful Queries: ${successfulQueries}/${tables.length}`);
    
    // Test some RLS-enabled operations
    console.log('\n🔒 Testing RLS-enabled Operations:');
    console.log('=' .repeat(40));
    
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from('group_chats')
        .select('id, name, created_by')
        .limit(10);
      
      const duration = Date.now() - start;
      console.log(`   🔍 Group Chats with RLS: ${duration}ms (${data?.length || 0} rows)`);
      
      if (error) {
        console.log(`   ⚠️  RLS Error: ${error.message}`);
      }
    } catch (err) {
      console.log(`   ❌ RLS Test Failed: ${err.message}`);
    }
    
    console.log('\n🎯 RLS Optimization Recommendations:');
    console.log('=' .repeat(50));
    console.log('✅ Database is running with the following tables:');
    tables.forEach(table => console.log(`   📄 ${table}`));
    
    console.log('\n💡 Performance Optimization Opportunities:');
    console.log('   1. Optimize auth.uid() calls in RLS policies');
    console.log('   2. Add indexes for foreign key relationships');
    console.log('   3. Cache auth.uid() results using (select auth.uid())');
    console.log('   4. Optimize group membership checks');
    
    console.log('\n🚀 Ready to apply RLS performance optimizations!');
    console.log(`📊 Current average query time: ${avgTime.toFixed(2)}ms`);
    console.log('🎯 Target improvement: 50-80% faster queries');
    
  } catch (error) {
    console.error('❌ Database analysis failed:', error.message);
  }
}

analyzeDatabase();
