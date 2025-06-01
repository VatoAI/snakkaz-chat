#!/usr/bin/env node

/**
 * Quick 406 Error Test - Snakkaz Chat
 * Tests the exact HTTP request that's failing
 */

const https = require('https');

const options = {
  hostname: 'wqpoozpbceucynsojmbk.supabase.co',
  port: 443,
  path: '/rest/v1/subscriptions?select=*,subscription_plans(*)&user_id=eq.419b9a79-e1ee-4935-83e2-375ca5a3ac13&status=eq.active',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8'
  }
};

console.log('🧪 Testing 406 Error - Subscription Query');
console.log('==========================================');
console.log('URL:', `https://${options.hostname}${options.path}`);
console.log('');

const req = https.request(options, (res) => {
  console.log(`📊 Response Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('📋 Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('');
    console.log('📄 Response Body:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log(data);
    }
    
    console.log('');
    
    if (res.statusCode === 406) {
      console.log('❌ CONFIRMED: 406 Not Acceptable Error');
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('1. The join query is failing because of missing foreign key relationship');
      console.log('2. Run the SQL fix in Supabase SQL Editor');
      console.log('3. Link: https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql/new');
    } else {
      console.log('✅ Request successful - 406 error may be resolved');
    }
  });
});

req.on('error', (error) => {
  console.error('💥 Request failed:', error);
});

// Test a simpler query that should work
console.log('🧪 Testing simpler subscription query...');
const simpleOptions = {
  ...options,
  path: '/rest/v1/subscriptions?select=*&user_id=eq.419b9a79-e1ee-4935-83e2-375ca5a3ac13&status=eq.active'
};

setTimeout(() => {
  console.log('');
  console.log('🧪 Testing Simple Query (without join)');
  console.log('=====================================');
  
  const simpleReq = https.request(simpleOptions, (res) => {
    console.log(`📊 Simple Query Status: ${res.statusCode} ${res.statusMessage}`);
    
    let simpleData = '';
    res.on('data', (chunk) => {
      simpleData += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Simple Query Response:');
      try {
        const jsonData = JSON.parse(simpleData);
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log(simpleData);
      }
      
      if (res.statusCode === 200) {
        console.log('✅ Simple query works - issue is with the join');
        console.log('   The foreign key relationship is missing');
      }
    });
  });
  
  simpleReq.on('error', (error) => {
    console.error('💥 Simple request failed:', error);
  });
  
  simpleReq.end();
}, 2000);

req.end();
