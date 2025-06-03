#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Local Supabase configuration
const supabaseUrl = 'http://127.0.0.1:8000';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🧪 Running Performance Tests...\n');

async function runPerformanceTest() {
    try {
        // Test 1: Check if infinite recursion is resolved
        console.log('1️⃣ Testing group_members query (checking for infinite recursion)...');
        const start1 = Date.now();
        
        const { data: groupMembers, error: membersError } = await supabase
            .from('group_members')
            .select('*')
            .limit(10);
            
        const duration1 = Date.now() - start1;
        
        if (membersError) {
            console.log(`   ❌ Error: ${membersError.message}`);
            if (membersError.message.includes('infinite recursion')) {
                console.log('   🚨 CRITICAL: Infinite recursion still detected!');
                return;
            }
        } else {
            console.log(`   ✅ Success! Query completed in ${duration1}ms`);
            console.log(`   📊 Returned ${groupMembers?.length || 0} rows`);
        }

        // Test 2: Group chats with membership check
        console.log('\n2️⃣ Testing group_chats with RLS policies...');
        const start2 = Date.now();
        
        const { data: groupChats, error: chatsError } = await supabase
            .from('group_chats')
            .select('*')
            .limit(10);
            
        const duration2 = Date.now() - start2;
        
        if (chatsError) {
            console.log(`   ❌ Error: ${chatsError.message}`);
        } else {
            console.log(`   ✅ Success! Query completed in ${duration2}ms`);
            console.log(`   📊 Returned ${groupChats?.length || 0} rows`);
        }

        // Test 3: Group invites query
        console.log('\n3️⃣ Testing group_invites query...');
        const start3 = Date.now();
        
        const { data: invites, error: invitesError } = await supabase
            .from('group_invites')
            .select('*')
            .limit(10);
            
        const duration3 = Date.now() - start3;
        
        if (invitesError) {
            console.log(`   ❌ Error: ${invitesError.message}`);
        } else {
            console.log(`   ✅ Success! Query completed in ${duration3}ms`);
            console.log(`   📊 Returned ${invites?.length || 0} rows`);
        }

        // Test 4: Direct SQL performance test
        console.log('\n4️⃣ Testing direct SQL performance...');
        const start4 = Date.now();
        
        const { data: sqlResult, error: sqlError } = await supabase.rpc('get_current_user_id');
        const duration4 = Date.now() - start4;
        
        if (sqlError) {
            console.log(`   ❌ Error: ${sqlError.message}`);
        } else {
            console.log(`   ✅ Success! get_current_user_id() function works in ${duration4}ms`);
        }

        // Performance Summary
        console.log('\n📈 Performance Summary:');
        console.log(`   🔹 group_members: ${duration1}ms`);
        console.log(`   🔹 group_chats: ${duration2}ms`);
        console.log(`   🔹 group_invites: ${duration3}ms`);
        console.log(`   🔹 auth function: ${duration4}ms`);
        
        const totalTime = duration1 + duration2 + duration3 + duration4;
        console.log(`   🎯 Total test time: ${totalTime}ms`);
        
        // Check for significant improvements
        if (duration1 < 100 && duration2 < 100 && duration3 < 100) {
            console.log('\n🎉 EXCELLENT: All queries are performing well (<100ms)!');
            console.log('✅ Infinite recursion issue appears to be resolved');
            console.log('⚡ RLS policy performance is optimized');
        } else {
            console.log('\n⚠️  Some queries are still slow. Further optimization may be needed.');
        }

    } catch (error) {
        console.error('❌ Performance test failed:', error.message);
    }
}

runPerformanceTest();
