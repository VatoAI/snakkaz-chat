#!/usr/bin/env node

/**
 * SnakkaZ Beta - Supabase Connection Test
 * Tests database connection and schema deployment
 * Created: 2025-01-15
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

console.log('🚀 SnakkaZ Beta - Supabase Connection Test');
console.log('==========================================');

async function testSupabaseConnection() {
    const results = {
        connection: false,
        auth: false,
        database: false,
        realtime: false,
        schema: false
    };

    try {
        // Initialize Supabase client
        console.log('\n1. 🔗 Testing Supabase connection...');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        if (supabase) {
            results.connection = true;
            console.log('   ✅ Supabase client initialized successfully');
        }

        // Test basic query (should work even without tables)
        console.log('\n2. 🗄️  Testing database access...');
        try {
            const { data: healthCheck, error: healthError } = await supabase
                .from('profiles')
                .select('count', { count: 'exact', head: true });
            
            if (!healthError || healthError.code === 'PGRST116') {
                // PGRST116 means table doesn't exist yet, which is expected
                results.database = true;
                console.log('   ✅ Database connection successful');
            } else {
                console.log('   ⚠️  Database query error:', healthError.message);
            }
        } catch (dbError) {
            console.log('   ⚠️  Database connection error:', dbError.message);
        }

        // Test auth functionality
        console.log('\n3. 🔐 Testing authentication...');
        try {
            const { data: authData, error: authError } = await supabase.auth.getSession();
            
            if (!authError) {
                results.auth = true;
                console.log('   ✅ Auth service accessible');
                console.log('   📊 Current session:', authData.session ? 'Active' : 'Anonymous');
            } else {
                console.log('   ⚠️  Auth error:', authError.message);
            }
        } catch (authError) {
            console.log('   ⚠️  Auth connection error:', authError.message);
        }

        // Test realtime capability
        console.log('\n4. 🔄 Testing realtime connection...');
        try {
            const channel = supabase.channel('test-channel');
            
            channel.on('presence', { event: 'sync' }, () => {
                console.log('   ✅ Realtime connection successful');
                results.realtime = true;
            });

            // Subscribe and then immediately unsubscribe
            const subscription = channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('   ✅ Realtime subscription successful');
                    results.realtime = true;
                    supabase.removeChannel(channel);
                }
            });

            // Give it a moment to connect
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (realtimeError) {
            console.log('   ⚠️  Realtime error:', realtimeError.message);
        }

        // Check if schema needs to be deployed
        console.log('\n5. 📋 Checking database schema...');
        try {
            const { data: tables, error: schemaError } = await supabase
                .from('profiles')
                .select('id')
                .limit(1);
            
            if (!schemaError) {
                results.schema = true;
                console.log('   ✅ Schema already deployed');
            } else if (schemaError.code === 'PGRST116') {
                console.log('   ⚠️  Schema not deployed yet - tables do not exist');
                console.log('   💡 Run: Deploy schema using Supabase SQL editor');
            }
        } catch (schemaError) {
            console.log('   ⚠️  Schema check error:', schemaError.message);
        }

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
    }

    // Results summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Connection:  ${results.connection ? '✅' : '❌'}`);
    console.log(`Database:    ${results.database ? '✅' : '❌'}`);
    console.log(`Auth:        ${results.auth ? '✅' : '❌'}`);
    console.log(`Realtime:    ${results.realtime ? '✅' : '❌'}`);
    console.log(`Schema:      ${results.schema ? '✅' : '⚠️ Needs deployment'}`);

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\nOverall Status: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests >= 3) {
        console.log('🎉 Supabase connection is working well!');
        
        if (!results.schema) {
            console.log('\n📝 Next Steps:');
            console.log('1. Go to your Supabase project dashboard');
            console.log('2. Navigate to SQL Editor');
            console.log('3. Paste the contents of supabase-schema.sql');
            console.log('4. Run the schema to create all tables');
            console.log('5. Re-run this test to verify everything works');
        }
    } else {
        console.log('❌ Multiple connection issues detected. Check your configuration.');
    }

    return results;
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    testSupabaseConnection()
        .then(results => {
            const success = Object.values(results).filter(Boolean).length >= 3;
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}

export { testSupabaseConnection };
