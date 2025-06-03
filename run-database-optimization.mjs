#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Local Supabase configuration (from status command)
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function checkLocalInstance() {
  try {
    const response = await fetch(`${LOCAL_SUPABASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function testPerformance(client, label) {
  console.log(`🧪 Testing ${label}...`);
  
  const testResults = {};

  try {
    // Test 1: Simple query with timing
    const start1 = Date.now();
    const { data: profiles } = await client.from('profiles').select('*').limit(10);
    testResults.profilesQuery = Date.now() - start1;
    console.log(`   📊 Profiles query: ${testResults.profilesQuery}ms (${profiles?.length || 0} rows)`);

    // Test 2: Messages query  
    const start2 = Date.now();
    const { data: messages } = await client.from('messages').select('*').limit(20);
    testResults.messagesQuery = Date.now() - start2;
    console.log(`   📊 Messages query: ${testResults.messagesQuery}ms (${messages?.length || 0} rows)`);

    // Test 3: Groups query
    const start3 = Date.now();
    const { data: groups } = await client.from('group_chats').select('*').limit(10);
    testResults.groupsQuery = Date.now() - start3;
    console.log(`   📊 Groups query: ${testResults.groupsQuery}ms (${groups?.length || 0} rows)`);

    const averageTime = Object.values(testResults).reduce((a, b) => a + b, 0) / Object.values(testResults).length;
    console.log(`   ⚡ Average query time: ${averageTime.toFixed(2)}ms`);
    
    return { success: true, results: testResults, average: averageTime };
  } catch (error) {
    console.log(`   ❌ Test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function applyOptimizations(client) {
  console.log('🚀 Applying database optimizations...');
  
  try {
    // Read the optimization script
    const optimizationScriptPath = join(__dirname, 'config/database/rls-performance-optimization.sql');
    const optimizationSQL = readFileSync(optimizationScriptPath, 'utf8');

    // Split into individual statements and execute via direct DB connection
    const statements = optimizationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.toLowerCase().includes('begin') && !stmt.toLowerCase().includes('commit'));

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    console.log(`   📝 Executing ${statements.length} optimization statements...`);

    for (const statement of statements) {
      try {
        // Use raw SQL execution
        const { error } = await client.rpc('sql', { query: statement });
        if (error) {
          throw error;
        }
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Statement failed: ${error.message}`);
        console.log(`   ⚠️  Statement error: ${error.message.substring(0, 100)}...`);
      }
    }

    console.log(`   ✅ Optimization complete: ${successCount} successful, ${errorCount} errors`);
    if (errors.length > 0) {
      console.log(`   📋 First few errors:`);
      errors.slice(0, 3).forEach(err => console.log(`      - ${err.substring(0, 100)}...`));
    }

    return {
      success: errorCount === 0,
      successful: successCount,
      errors: errorCount,
      errorDetails: errors.slice(0, 5)
    };

  } catch (error) {
    console.log(`   ❌ Failed to apply optimizations: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runOptimization() {
  console.log('🏗️  LOCAL SUPABASE DATABASE OPTIMIZATION');
  console.log('========================================');
  
  // Step 1: Check if local Supabase is running
  console.log('\n📡 Checking local Supabase status...');
  const isRunning = await checkLocalInstance();
  
  if (!isRunning) {
    console.log('❌ Local Supabase is not running');
    console.log('💡 Please start it first with: ./supabase.bin start');
    return;
  }
  
  console.log('✅ Local Supabase is running');
  
  // Step 2: Connect to local instance
  console.log('\n🔌 Connecting to local instance...');
  const client = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  
  // Test connection
  try {
    const { data, error } = await client.from('profiles').select('count').limit(1);
    if (error) {
      console.log(`❌ Connection test failed: ${error.message}`);
      return;
    }
    console.log('✅ Successfully connected to local Supabase');
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return;
  }
  
  // Step 3: Test performance before optimization
  console.log('\n⏱️  Testing baseline performance...');
  const beforeTest = await testPerformance(client, 'baseline performance');
  
  // Step 4: Apply optimizations
  console.log('\n🔧 Applying database optimizations...');
  const optimizationResult = await applyOptimizations(client);
  
  // Step 5: Test performance after optimization (if successful)
  if (optimizationResult.successful > 0) {
    console.log('\n📈 Testing optimized performance...');
    const afterTest = await testPerformance(client, 'optimized performance');
    
    if (beforeTest.success && afterTest.success) {
      const improvement = ((beforeTest.average - afterTest.average) / beforeTest.average * 100);
      console.log(`\n🎯 Performance improvement: ${improvement.toFixed(1)}%`);
      console.log(`   📊 Before: ${beforeTest.average.toFixed(2)}ms average`);
      console.log(`   📊 After:  ${afterTest.average.toFixed(2)}ms average`);
    }
  }
  
  // Step 6: Environment summary
  console.log('\n🌍 Local Development Environment:');
  console.log(`   📍 API URL: ${LOCAL_SUPABASE_URL}`);
  console.log(`   🎨 Studio URL: http://127.0.0.1:8001`);
  console.log(`   🗄️  Database URL: postgresql://postgres:postgres@127.0.0.1:5432/postgres`);
  
  console.log('\n🎉 Database optimization complete!');
  console.log('💡 You can now test your application with the optimized database.');
}

// Run the optimization
runOptimization().catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
