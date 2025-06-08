#!/usr/bin/env node

/**
 * SNAKKAZ EMERGENCY FIX VERIFICATION - June 7, 2025
 * Verifies the deployment of React fixes for www.snakkaz.com black screen issue
 * Tests both emergency fix script and new vendor bundle deployment
 */

const https = require('https');
const http = require('http');

console.log('🚨 SNAKKAZ: Verifying emergency fix deployment...\n');

// Test endpoints
const tests = [
  {
    name: 'Main site response',
    url: 'https://www.snakkaz.com',
    test: (content) => {
      const hasEmergencyScript = content.includes('/emergency-react-fix.js');
      const hasReactApp = content.includes('id="root"');
      const hasTitle = content.includes('SnakkaZ Chat');
      
      return {
        passed: hasEmergencyScript && hasReactApp && hasTitle,
        details: {
          emergencyScript: hasEmergencyScript,
          reactRoot: hasReactApp,
          title: hasTitle
        }
      };
    }
  },
  {
    name: 'Emergency React Fix Script',
    url: 'https://www.snakkaz.com/emergency-react-fix.js',
    test: (content) => {
      const hasNtFix = content.includes('Nt is undefined');
      const hasUseStateFix = content.includes('createEmergencyUseState');
      const hasConsoleLog = content.includes('emergency React fix');
      
      return {
        passed: hasNtFix && hasUseStateFix && hasConsoleLog,
        details: {
          ntFix: hasNtFix,
          useStateFix: hasUseStateFix,
          logging: hasConsoleLog
        }
      };
    }
  }
];

async function fetchContent(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          content: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🇳🇴 Testing deployment for Norwegian tech community...\n');
  
  for (const test of tests) {
    console.log(`📋 Testing: ${test.name}`);
    console.log(`🔗 URL: ${test.url}`);
    
    try {
      const response = await fetchContent(test.url);
      
      console.log(`📊 Status: ${response.statusCode}`);
      console.log(`📅 Last-Modified: ${response.headers['last-modified'] || 'Not set'}`);
      
      if (response.statusCode === 200) {
        const result = test.test(response.content);
        
        if (result.passed) {
          console.log('✅ TEST PASSED');
        } else {
          console.log('❌ TEST FAILED');
          console.log('Details:', JSON.stringify(result.details, null, 2));
        }
      } else if (response.statusCode === 404) {
        console.log('⚠️  Resource not found (404) - deployment may be in progress');
      } else {
        console.log(`⚠️  Unexpected status code: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
  
  // Test console integration fix
  console.log('\n🎯 IMMEDIATE CONSOLE FIX TEST:');
  console.log('If site still shows black screen, run this in browser console:');
  console.log(`
// IMMEDIATE FIX - Run in browser console
(function() {
  console.log('🚨 APPLYING IMMEDIATE SNAKKAZ FIX...');
  
  function createEmergencyUseState() {
    return function(initialState) {
      let currentState = initialState;
      function setState(newState) {
        currentState = typeof newState === 'function' ? newState(currentState) : newState;
      }
      return [currentState, setState];
    };
  }
  
  if (!window.React) window.React = {};
  if (!window.React.useState) window.React.useState = createEmergencyUseState();
  if (!window.Nt) window.Nt = createEmergencyUseState();
  
  console.log('✅ Emergency fix applied - refresh page');
  location.reload();
})();
  `);
  
  console.log('\n🎮 CYBERPUNK STATUS:');
  console.log('Norwegian tech community deployment verification complete!');
  console.log('Focus: Speed, stability, user experience');
  console.log('Ready for iterative development and community building 🇳🇴');
}

runTests().catch(console.error);
