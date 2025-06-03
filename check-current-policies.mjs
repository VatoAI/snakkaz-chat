#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:8000';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Checking RLS Policies...\n');

async function checkPolicies() {
    try {
        // Query pg_policies to see current policies
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'group_members');

        if (error) {
            console.log('❌ Error querying policies:', error.message);
            return;
        }

        console.log('📋 Current group_members policies:');
        if (data && data.length > 0) {
            data.forEach(policy => {
                console.log(`  🔹 ${policy.policyname} (${policy.cmd})`);
                console.log(`     ${policy.qual || 'No condition'}`);
            });
        } else {
            console.log('   ❌ No policies found or cannot access pg_policies');
        }

    } catch (error) {
        console.error('❌ Failed to check policies:', error);
    }
}

checkPolicies();
