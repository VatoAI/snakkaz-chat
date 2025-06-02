#!/usr/bin/env node

/**
 * Production Deployment Verification Script
 * Verifies that Snakkaz Chat with Memory Integration is working correctly
 */

const https = require('https');
const fs = require('fs');

const SITE_URL = 'https://www.snakkaz.com';
const TEST_ROUTES = [
  '/',
  '/chat',
  '/memory',
  '/settings',
  '/dashboard'
];

const REQUIRED_ASSETS = [
  '/assets/js/index-SfdXmTJW.js',
  '/assets/css/index-viU7akcw.css',
  '/icons/snakkaz-icon-192.png'
];

console.log('🔍 Starting Production Deployment Verification');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log(`🌐 Testing: ${SITE_URL}`);
console.log('=' .repeat(60));

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
          url: url
        });
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testRoute(route) {
  try {
    const response = await makeRequest(`${SITE_URL}${route}`);
    const isSuccess = response.statusCode === 200;
    
    console.log(`${isSuccess ? '✅' : '❌'} Route ${route}: ${response.statusCode}`);
    
    if (route === '/') {
      // Test main page specific content
      const hasReactRoot = response.body.includes('<div id="root">');
      const hasMainScript = response.body.includes('index-SfdXmTJW.js');
      console.log(`  ${hasReactRoot ? '✅' : '❌'} React root div found`);
      console.log(`  ${hasMainScript ? '✅' : '❌'} Main script bundle found`);
    }
    
    return isSuccess;
  } catch (error) {
    console.log(`❌ Route ${route}: Error - ${error.message}`);
    return false;
  }
}

async function testAsset(assetPath) {
  try {
    const response = await makeRequest(`${SITE_URL}${assetPath}`);
    const isSuccess = response.statusCode === 200;
    const contentType = response.headers['content-type'] || '';
    
    console.log(`${isSuccess ? '✅' : '❌'} Asset ${assetPath}: ${response.statusCode} (${contentType})`);
    return isSuccess;
  } catch (error) {
    console.log(`❌ Asset ${assetPath}: Error - ${error.message}`);
    return false;
  }
}

async function testSecurityHeaders() {
  try {
    const response = await makeRequest(SITE_URL);
    const headers = response.headers;
    
    console.log('\n🔒 Security Headers Check:');
    
    const securityChecks = [
      { name: 'Content-Type', header: 'content-type', expected: 'text/html' },
      { name: 'X-Content-Type-Options', header: 'x-content-type-options', expected: 'nosniff' },
      { name: 'Cache-Control', header: 'cache-control', required: false }
    ];
    
    securityChecks.forEach(check => {
      const value = headers[check.header];
      const hasHeader = !!value;
      const meetsExpected = check.expected ? value?.includes(check.expected) : true;
      
      console.log(`  ${hasHeader && meetsExpected ? '✅' : '❌'} ${check.name}: ${value || 'Not set'}`);
    });
    
  } catch (error) {
    console.log(`❌ Security headers test failed: ${error.message}`);
  }
}

async function runVerification() {
  console.log('🧪 Testing Routes...');
  let routesPassed = 0;
  for (const route of TEST_ROUTES) {
    if (await testRoute(route)) {
      routesPassed++;
    }
  }
  
  console.log('\n📦 Testing Assets...');
  let assetsPassed = 0;
  for (const asset of REQUIRED_ASSETS) {
    if (await testAsset(asset)) {
      assetsPassed++;
    }
  }
  
  await testSecurityHeaders();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 VERIFICATION RESULTS:');
  console.log(`🛣️  Routes: ${routesPassed}/${TEST_ROUTES.length} passed`);
  console.log(`📦 Assets: ${assetsPassed}/${REQUIRED_ASSETS.length} passed`);
  
  const allPassed = routesPassed === TEST_ROUTES.length && assetsPassed === REQUIRED_ASSETS.length;
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Deployment is successful.');
    console.log('🚀 Snakkaz Chat with Memory Integration is live and working!');
    console.log(`🌐 Visit: ${SITE_URL}`);
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
  }
  
  // Create verification report
  const report = {
    timestamp: new Date().toISOString(),
    site: SITE_URL,
    routes: {
      tested: TEST_ROUTES.length,
      passed: routesPassed,
      details: TEST_ROUTES
    },
    assets: {
      tested: REQUIRED_ASSETS.length,
      passed: assetsPassed,
      details: REQUIRED_ASSETS
    },
    overall: allPassed ? 'PASSED' : 'FAILED'
  };
  
  fs.writeFileSync('verification-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Verification report saved to: verification-report.json');
}

// Run the verification
runVerification().catch(console.error);
