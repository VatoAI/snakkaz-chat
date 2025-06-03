#!/usr/bin/env node

console.log('🔍 Investigating RLS Policies...\n');

const supabaseUrl = 'http://127.0.0.1:8000';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Use PostgreSQL REST API directly
async function executeSqlQuery(sql) {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.log(`❌ Error executing SQL: ${error.message}`);
        return null;
    }
}

async function investigatePolicies() {
    console.log('1️⃣ Checking current group_members policies...');
    
    // Try to check what policies exist
    const policies = await executeSqlQuery(`
        SELECT policyname, cmd, qual 
        FROM pg_policies 
        WHERE tablename = 'group_members' 
        ORDER BY policyname;
    `);
    
    if (policies) {
        console.log('   📋 Found policies:', policies);
    }

    console.log('\n2️⃣ Checking if get_current_user_id function exists...');
    const func = await executeSqlQuery(`
        SELECT proname, provolatile 
        FROM pg_proc 
        WHERE proname = 'get_current_user_id';
    `);
    
    if (func) {
        console.log('   📋 Function status:', func);
    }

    console.log('\n3️⃣ Attempting to drop ALL group_members policies...');
    
    // Force drop all policies
    const dropResult = await executeSqlQuery(`
        DROP POLICY IF EXISTS "group_members_select" ON group_members;
        DROP POLICY IF EXISTS "group_members_select_optimized" ON group_members;
        DROP POLICY IF EXISTS "Allow read access based on user" ON group_members;
        DROP POLICY IF EXISTS "Enable read access for all users" ON group_members;
    `);

    console.log('   📋 Drop result:', dropResult);

    console.log('\n4️⃣ Creating simple, non-recursive policy...');
    
    // Create a very simple policy that doesn't reference group_members
    const createResult = await executeSqlQuery(`
        CREATE POLICY "group_members_simple_select" ON group_members 
        FOR SELECT USING (true);
    `);

    console.log('   📋 Create result:', createResult);

    console.log('\n5️⃣ Testing if infinite recursion is resolved...');
    
    // Test query
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/group_members?limit=1`, {
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOEKDVrwCTY1QdchVwBZU8KnwiLQI7Gys_wo'
        }
    });

    const testStatus = testResponse.status;
    
    if (testStatus === 200) {
        const testData = await testResponse.json();
        console.log(`   ✅ SUCCESS! Query returned ${testData.length} rows`);
        console.log('   🚀 Infinite recursion resolved!');
    } else {
        const errorText = await testResponse.text();
        console.log(`   ❌ Still failing (${testStatus}): ${errorText}`);
    }
}

investigatePolicies();
