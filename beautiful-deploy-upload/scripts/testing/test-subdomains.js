#!/usr/bin/env node

/**
 * Snakkaz Chat Subdomain Status Tester
 * 
 * This script tests all subdomains and their functionality
 */

const https = require('https');
const { URL } = require('url');

// List of subdomains to test
const SUBDOMAINS = ['dash', 'business', 'docs', 'analytics', 'mcp', 'help'];
const MAIN_DOMAIN = 'www.snakkaz.com';

// Test function for a single URL
function testUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const request = https.get(url, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isSnakkazApp = data.includes('Snakkaz') || data.includes('snakkaz');
        const hasReactApp = data.includes('react') || data.includes('React');
        const hasIndex = data.includes('<html') || data.includes('<!DOCTYPE');
        
        resolve({
          url,
          status: res.statusCode,
          responseTime,
          isSnakkazApp,
          hasReactApp,
          hasIndex,
          contentLength: data.length,
          headers: {
            server: res.headers.server,
            contentType: res.headers['content-type'],
            lastModified: res.headers['last-modified']
          }
        });
      });
    });
    
    request.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message,
        responseTime: Date.now() - startTime
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        responseTime: 10000
      });
    });
  });
}

// Main test function
async function testAllSubdomains() {
  console.log('🧪 Testing Snakkaz Chat Subdomains');
  console.log('==================================\n');
  
  // Test main domain first
  console.log('🏠 Testing main domain...');
  const mainResult = await testUrl(`https://${MAIN_DOMAIN}`);
  console.log(`   ${MAIN_DOMAIN}: ${mainResult.status} (${mainResult.responseTime}ms)`);
  if (mainResult.isSnakkazApp) console.log('   ✅ Snakkaz app detected');
  if (mainResult.error) console.log(`   ❌ Error: ${mainResult.error}`);
  console.log('');
  
  // Test all subdomains
  console.log('🌐 Testing subdomains...');
  const subdomainResults = [];
  
  for (const subdomain of SUBDOMAINS) {
    const url = `https://${subdomain}.snakkaz.com`;
    console.log(`   Testing ${subdomain}.snakkaz.com...`);
    
    const result = await testUrl(url);
    subdomainResults.push(result);
    
    if (result.status === 200) {
      console.log(`   ✅ ${subdomain}: OK (${result.responseTime}ms)`);
      if (result.isSnakkazApp) {
        console.log(`      🎯 Snakkaz app detected`);
      } else if (result.hasIndex) {
        console.log(`      📄 HTML page detected (${result.contentLength} bytes)`);
      } else {
        console.log(`      ⚠️  Unknown content type`);
      }
    } else if (result.status === 'ERROR') {
      console.log(`   ❌ ${subdomain}: ${result.error}`);
    } else if (result.status === 'TIMEOUT') {
      console.log(`   ⏰ ${subdomain}: Timeout after 10s`);
    } else {
      console.log(`   ⚠️  ${subdomain}: HTTP ${result.status}`);
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('===========');
  const working = subdomainResults.filter(r => r.status === 200).length;
  const withSnakkaz = subdomainResults.filter(r => r.isSnakkazApp).length;
  
  console.log(`Main domain: ${mainResult.status === 200 ? '✅ Working' : '❌ Issues'}`);
  console.log(`Subdomains working: ${working}/${SUBDOMAINS.length}`);
  console.log(`Snakkaz app detected: ${withSnakkaz}/${SUBDOMAINS.length}`);
  
  if (working === SUBDOMAINS.length && withSnakkaz === SUBDOMAINS.length) {
    console.log('\n🎉 All subdomains are working perfectly!');
  } else if (working === SUBDOMAINS.length) {
    console.log('\n⚠️  All subdomains respond, but some may not have Snakkaz app yet');
  } else {
    console.log('\n🔧 Some subdomains need attention');
  }
  
  return {
    main: mainResult,
    subdomains: subdomainResults,
    summary: { working, withSnakkaz, total: SUBDOMAINS.length }
  };
}

// Run the test
if (require.main === module) {
  testAllSubdomains().catch(console.error);
}

module.exports = { testAllSubdomains, testUrl };
