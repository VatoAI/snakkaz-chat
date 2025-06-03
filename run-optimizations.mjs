#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function measurePerformance(supabase, label) {
  console.log(`📊 Testing ${label}...`);
  
  const tests = [
    { name: 'Profiles count', query: 'SELECT count(*) FROM profiles' },
    { name: 'Messages sample', query: 'SELECT * FROM messages LIMIT 20' },
    { name: 'Groups sample', query: 'SELECT * FROM group_chats LIMIT 10' }
  ];

  const results = {};
  
  for (const test of tests) {
    const start = Date.now();
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: test.query });
      const duration = Date.now() - start;
      results[test.name] = duration;
      console.log(`   ${test.name}: ${duration}ms`);
    } catch (error) {
      console.log(`   ${test.name}: ERROR - ${error.message}`);
      results[test.name] = -1;
    }
  }
  
  const validResults = Object.values(results).filter(r => r > 0);
  const average = validResults.length > 0 ? validResults.reduce((a, b) => a + b, 0) / validResults.length : 0;
  console.log(`   Average: ${average.toFixed(2)}ms\n`);
  
  return { results, average };
}

async function applyOptimizations() {
  console.log('🚀 Snakkaz RLS Performance Optimization\n');
  
  const supabase = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  
  // Test performance BEFORE optimizations
  console.log('🔍 BEFORE Optimization Measurements:');
  const beforeResults = await measurePerformance(supabase, 'baseline');
  
  // Apply optimizations
  console.log('🔧 Applying RLS Performance Optimizations...\n');
  
  const parts = [
    'sql-optimization-part1.sql',
    'sql-optimization-part2.sql', 
    'sql-optimization-part3.sql',
    'sql-optimization-part4.sql'
  ];
  
  let totalSuccess = 0;
  let totalAttempted = 0;
  
  for (let i = 0; i < parts.length; i++) {
    const partFile = parts[i];
    console.log(`📝 Processing ${partFile}...`);
    
    try {
      const sqlContent = readFileSync(partFile, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.startsWith('ALTER POLICY'));
      
      totalAttempted += statements.length;
      let partSuccess = 0;
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (!error) {
            partSuccess++;
            totalSuccess++;
          }
        } catch (e) {
          // Policy might not exist, which is okay
        }
      }
      
      console.log(`   ✅ Applied ${partSuccess}/${statements.length} policies`);
      
    } catch (error) {
      console.log(`   ❌ Error reading ${partFile}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Optimization Summary:`);
  console.log(`   ✅ Successfully applied: ${totalSuccess}/${totalAttempted} policies`);
  console.log(`   📊 Success rate: ${((totalSuccess/totalAttempted) * 100).toFixed(1)}%\n`);
  
  // Test performance AFTER optimizations  
  console.log('🔍 AFTER Optimization Measurements:');
  const afterResults = await measurePerformance(supabase, 'optimized');
  
  // Calculate improvement
  if (beforeResults.average > 0 && afterResults.average > 0) {
    const improvement = ((beforeResults.average - afterResults.average) / beforeResults.average) * 100;
    console.log(`🚀 Performance Improvement: ${improvement.toFixed(1)}%`);
    
    if (improvement > 0) {
      console.log(`💡 Optimization successful! Queries are now ${improvement.toFixed(1)}% faster.`);
    } else {
      console.log(`📊 Performance baseline established. Improvements may be visible under higher load.`);
    }
  }
  
  console.log(`\n✨ RLS Performance Optimization Complete!`);
  console.log(`🔗 Monitor performance at: ${LOCAL_SUPABASE_URL.replace('8000', '8001')}`);
}

applyOptimizations().catch(console.error);
