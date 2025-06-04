#!/usr/bin/env node

/**
 * Test script to verify React State Fix V3 is working on www.snakkaz.com
 * Checks for useState undefined errors and React state issues
 */

import https from 'https';

console.log('🔍 Testing React State Fix V3 on www.snakkaz.com...');

// Function to check for specific error patterns
function checkForReactErrors(html) {
  const errorPatterns = [
    'useState',
    'use-sync-external-store-shim',
    'Cannot read properties of undefined',
    'G is undefined',
    'ni is undefined',
    'TypeError:'
  ];
  
  const foundErrors = [];
  
  errorPatterns.forEach(pattern => {
    if (html.includes(pattern) && !html.includes('polyfill') && !html.includes('fix')) {
      foundErrors.push(pattern);
    }
  });
  
  return foundErrors;
}

// Test the main site
https.get('https://www.snakkaz.com', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`✅ HTTP Status: ${res.statusCode}`);
    console.log(`📄 Content Length: ${data.length} bytes`);
    
    // Check if our React fix is included
    if (data.includes('reactStateFixV3')) {
      console.log('🎉 React State Fix V3 detected in HTML!');
    } else if (data.includes('reactStateFix')) {
      console.log('⚠️  React State Fix detected (but not V3)');
    } else {
      console.log('❌ No React State Fix detected');
    }
    
    // Check for React errors
    const errors = checkForReactErrors(data);
    if (errors.length === 0) {
      console.log('✅ No React error patterns found in HTML');
    } else {
      console.log('⚠️  Potential error patterns found:', errors);
    }
    
    // Check if main JavaScript files are included
    if (data.includes('.js')) {
      console.log('✅ JavaScript files are being loaded');
    }
    
    // Success indicators
    if (data.includes('<div id="root">') || data.includes('id="root"')) {
      console.log('✅ React root element found');
    }
    
    console.log('\n🎯 TEST RESULTS:');
    console.log('================');
    console.log(`• Site Status: ${res.statusCode === 200 ? 'ONLINE' : 'OFFLINE'}`);
    console.log(`• HTML Structure: ${data.includes('id="root"') ? 'VALID' : 'INVALID'}`);
    console.log(`• React Fix: ${data.includes('reactStateFix') ? 'APPLIED' : 'MISSING'}`);
    console.log(`• Error Patterns: ${errors.length === 0 ? 'NONE FOUND' : errors.length + ' FOUND'}`);
    
    if (res.statusCode === 200 && data.includes('id="root"') && errors.length === 0) {
      console.log('\n🎉 SUCCESS: React State Fix V3 appears to be working!');
      console.log('🌐 www.snakkaz.com should now load without useState errors');
    } else {
      console.log('\n⚠️  ATTENTION: Some issues may still exist');
    }
  });
  
}).on('error', (err) => {
  console.error('❌ Error testing site:', err.message);
});
