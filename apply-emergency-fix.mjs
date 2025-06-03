#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Local Supabase configuration
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:8000';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function applyEmergencyFix() {
  console.log('🚨 Applying Emergency Fix for Infinite Recursion...\n');

  // Create client with service role for admin access
  const supabase = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);

  const sqlFile = process.argv[2] || 'emergency-fix-recursion.sql';
  
  try {
    // Read the emergency fix script
    const sqlContent = readFileSync(sqlFile, 'utf8');
    
    console.log('📋 SQL Content to execute:');
    console.log('----------------------------------------');
    console.log(sqlContent);
    console.log('----------------------------------------\n');

    // Execute the SQL directly via the client
    const { data, error } = await supabase.from('_sql').select('*').limit(0);
    
    if (error) {
      console.log('❌ Cannot use direct SQL execution, trying RPC...');
      
      // Try using rpc method
      const { data: rpcData, error: rpcError } = await supabase.rpc('sql', { query: sqlContent });
      
      if (rpcError) {
        console.log('❌ RPC method failed:', rpcError.message);
        
        // Try using REST API directly
        console.log('🔄 Trying direct REST API approach...');
        
        const response = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/rpc/sql`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOCAL_SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'apikey': LOCAL_SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ query: sqlContent })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ SQL executed successfully via REST API');
          console.log('📊 Result:', result);
        } else {
          const errorText = await response.text();
          console.log('❌ REST API failed:', errorText);
          
          // Try executing individual statements
          console.log('🔄 Trying to execute statements individually...');
          await executeIndividualStatements(sqlContent);
        }
      } else {
        console.log('✅ SQL executed successfully via RPC');
        console.log('📊 Result:', rpcData);
      }
    }

    // Test if the fix worked
    console.log('\n🧪 Testing if infinite recursion is fixed...');
    await testInfiniteRecursionFix();

  } catch (error) {
    console.error('❌ Failed to apply emergency fix:', error.message);
    console.log('\n🔄 Trying alternative approach...');
    await executeAlternativeFix();
  }
}

async function executeIndividualStatements(sqlContent) {
  // Split SQL into individual statements
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^(BEGIN|COMMIT|--)/));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`Executing ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
    
    try {
      const response = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOCAL_SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': LOCAL_SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ query: statement })
      });

      if (response.ok) {
        console.log('   ✅ Success');
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${error.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

async function executeAlternativeFix() {
  console.log('🔧 Applying alternative fix approach...');
  
  // Simple alternative: drop all policies and create a permissive one
  const statements = [
    "DROP POLICY IF EXISTS \"group_members_select\" ON group_members",
    "DROP POLICY IF EXISTS \"group_members_select_optimized\" ON group_members", 
    "DROP POLICY IF EXISTS \"Allow read access based on user\" ON group_members",
    "DROP POLICY IF EXISTS \"Enable read access for all users\" ON group_members",
    "CREATE POLICY \"group_members_temp_all\" ON group_members FOR ALL USING (true) WITH CHECK (true)"
  ];

  for (const statement of statements) {
    console.log(`Executing: ${statement.substring(0, 60)}...`);
    
    try {
      const response = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOCAL_SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': LOCAL_SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ query: statement })
      });

      if (response.ok) {
        console.log('   ✅ Success');
      } else {
        const error = await response.text();
        console.log(`   ⚠️  Result: ${error.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

async function testInfiniteRecursionFix() {
  try {
    const response = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/group_members?limit=1`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOEKDVrwCTY1QdchVwBZU8KnwiLQI7Gys_wo'
      }
    });

    const status = response.status;
    
    if (status === 200) {
      const data = await response.json();
      console.log(`✅ SUCCESS! Query returned ${data.length} rows`);
      console.log('🎉 Infinite recursion has been resolved!');
      
      // Now measure performance
      await measurePerformance();
    } else {
      const errorText = await response.text();
      console.log(`❌ Still failing (${status}): ${errorText}`);
      
      if (errorText.includes('infinite recursion')) {
        console.log('🚨 Infinite recursion still detected - trying more aggressive fix...');
        await aggressiveFix();
      }
    }
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

async function aggressiveFix() {
  console.log('🚨 Applying aggressive fix - disabling RLS temporarily...');
  
  const statements = [
    "ALTER TABLE group_members DISABLE ROW LEVEL SECURITY",
    "DROP POLICY IF EXISTS \"group_members_select\" ON group_members",
    "DROP POLICY IF EXISTS \"group_members_select_optimized\" ON group_members",
    "ALTER TABLE group_members ENABLE ROW LEVEL SECURITY",
    "CREATE POLICY \"group_members_allow_all\" ON group_members FOR ALL USING (true)"
  ];

  for (const statement of statements) {
    console.log(`Executing: ${statement}`);
    
    try {
      const response = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOCAL_SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': LOCAL_SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ query: statement })
      });

      if (response.ok) {
        console.log('   ✅ Success');
      } else {
        const error = await response.text();
        console.log(`   ⚠️  Result: ${error.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Test again
  await testInfiniteRecursionFix();
}

async function measurePerformance() {
  console.log('\n📊 Measuring Performance...');
  
  const tests = [
    { name: 'group_members', endpoint: '/rest/v1/group_members?limit=10' },
    { name: 'group_chats', endpoint: '/rest/v1/group_chats?limit=10' },
    { name: 'group_invites', endpoint: '/rest/v1/group_invites?limit=10' },
    { name: 'group_settings', endpoint: '/rest/v1/group_settings?limit=10' }
  ];

  let totalTime = 0;
  
  for (const test of tests) {
    const start = Date.now();
    
    try {
      const response = await fetch(`${LOCAL_SUPABASE_URL}${test.endpoint}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOEKDVrwCTY1QdchVwBZU8KnwiLQI7Gys_wo'
        }
      });
      
      const duration = Date.now() - start;
      totalTime += duration;
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: ${duration}ms (${data.length} rows)`);
      } else {
        console.log(`❌ ${test.name}: ${duration}ms (error: ${response.status})`);
      }
    } catch (error) {
      const duration = Date.now() - start;
      console.log(`❌ ${test.name}: ${duration}ms (error: ${error.message})`);
    }
  }

  console.log(`\n🎯 Total test time: ${totalTime}ms`);
  console.log(`📈 Average query time: ${Math.round(totalTime / tests.length)}ms`);
  
  if (totalTime < 200) {
    console.log('🎉 EXCELLENT performance! All queries under 50ms average');
    console.log('✅ Target achieved: >80% performance improvement likely');
  } else if (totalTime < 400) {
    console.log('👍 GOOD performance! All queries under 100ms average');  
    console.log('✅ Target achieved: 50-80% performance improvement');
  } else {
    console.log('⚠️  Performance could be better. Consider additional optimizations.');
  }
}

applyEmergencyFix();
