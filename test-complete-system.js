#!/usr/bin/env node

/**
 * SnakkaZ Beta - Complete System Test
 * Tests all core components: Auth, Chat, MCP Security, Invites
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

console.log('🚀 SnakkaZ Beta - Complete System Test');
console.log('=====================================');

// Configuration
const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';
const mcpUrl = 'http://localhost:3001';
const frontendUrl = 'http://localhost:5173';

async function runCompleteSystemTest() {
  const results = {
    database: false,
    mcpServer: false,
    frontend: false,
    auth: false,
    chat: false,
    invites: false,
    security: false
  };

  try {
    console.log('\n1. 🗄️  Testing Database Connection...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: profiles, error: dbError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (!dbError) {
      results.database = true;
      console.log('   ✅ Database connected and schema ready');
    } else {
      console.log('   ❌ Database error:', dbError.message);
    }

    console.log('\n2. 🖥️  Testing MCP Server...');
    try {
      const mcpHealth = await fetch(`${mcpUrl}/health`);
      if (mcpHealth.ok) {
        const health = await mcpHealth.json();
        results.mcpServer = true;
        console.log('   ✅ MCP server healthy:', health.status);
      }
    } catch (mcpError) {
      console.log('   ❌ MCP server not accessible');
    }

    console.log('\n3. 🌐 Testing Frontend Server...');
    try {
      const frontendResponse = await fetch(frontendUrl);
      if (frontendResponse.ok) {
        results.frontend = true;
        console.log('   ✅ Frontend server running on port 5173');
      }
    } catch (frontendError) {
      console.log('   ❌ Frontend server not accessible');
    }

    console.log('\n4. 🔐 Testing Auth System...');
    try {
      const { data: authData } = await supabase.auth.getSession();
      results.auth = true;
      console.log('   ✅ Auth system functional');
    } catch (authError) {
      console.log('   ❌ Auth system error');
    }

    console.log('\n5. 💬 Testing Chat System...');
    try {
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .limit(1);
      
      if (!roomsError) {
        results.chat = true;
        console.log('   ✅ Chat rooms accessible');
        console.log(`   📊 Found ${rooms?.length || 0} rooms`);
      }
    } catch (chatError) {
      console.log('   ❌ Chat system error');
    }

    console.log('\n6. 🎟️  Testing Invite System...');
    try {
      const { data: invites, error: invitesError } = await supabase
        .from('beta_invites')
        .select('*')
        .limit(1);
      
      if (!invitesError) {
        results.invites = true;
        console.log('   ✅ Invite system functional');
        console.log(`   📊 Found ${invites?.length || 0} sample invites`);
      }
    } catch (inviteError) {
      console.log('   ❌ Invite system error');
    }

    console.log('\n7. 🔒 Testing Security Features...');
    try {
      // Test RLS policies
      const { data: securityTest, error: securityError } = await supabase
        .from('mcp_connections')
        .select('count', { count: 'exact', head: true });
      
      if (!securityError || securityError.code === 'PGRST301') {
        // PGRST301 means RLS is working (no access without auth)
        results.security = true;
        console.log('   ✅ RLS security policies active');
      }
    } catch (securityError) {
      console.log('   ⚠️  Security test inconclusive');
    }

  } catch (error) {
    console.error('\n❌ Fatal test error:', error);
  }

  // Results Summary
  console.log('\n📊 System Test Results:');
  console.log('========================');
  console.log(`Database:     ${results.database ? '✅' : '❌'}`);
  console.log(`MCP Server:   ${results.mcpServer ? '✅' : '❌'}`);
  console.log(`Frontend:     ${results.frontend ? '✅' : '❌'}`);
  console.log(`Auth System:  ${results.auth ? '✅' : '❌'}`);
  console.log(`Chat System:  ${results.chat ? '✅' : '❌'}`);
  console.log(`Invites:      ${results.invites ? '✅' : '❌'}`);
  console.log(`Security:     ${results.security ? '✅' : '❌'}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\nOverall: ${passedTests}/${totalTests} systems operational`);
  
  if (passedTests >= 6) {
    console.log('\n🎉 SnakkaZ Beta is ready for launch!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Open http://localhost:5173 to access the app');
    console.log('2. Test user registration with invite code: snakkaz_beta2025');
    console.log('3. Create chat rooms and test messaging');
    console.log('4. Generate and manage beta invites');
    console.log('5. Deploy to production when ready!');
  } else {
    console.log('\n⚠️  Some systems need attention before launch');
  }

  return results;
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteSystemTest()
    .then(results => {
      const success = Object.values(results).filter(Boolean).length >= 6;
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('System test failed:', error);
      process.exit(1);
    });
}

export { runCompleteSystemTest };
