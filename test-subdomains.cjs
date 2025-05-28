#!/usr/bin/env node

/**
 * Comprehensive Subdomain Testing Script for Snakkaz Chat
 * Tests all subdomains: dash, business, docs, analytics, mcp, help
 * Checks HTTP status codes, redirects, and basic content validation
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
        const isSnakkazApp = data.includes('Snakkaz') || data.includes('snakkaz') || data.includes('Snakkaz Chat');
        const hasReactApp = data.includes('react') || data.includes('React') || data.includes('root');
        const hasIndex = data.includes('<html') || data.includes('<!DOCTYPE');
        const isDirectoryListing = data.includes('Index of') || data.includes('LiteSpeed') || data.includes('Directory Listing');
        
        resolve({
          url,
          status: res.statusCode,
          responseTime,
          isSnakkazApp,
          hasReactApp,
          hasIndex,
          isDirectoryListing,
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
    
    request.setTimeout(15000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        responseTime: 15000
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
        console.log(`      🎯 Snakkaz app detected - PERFECT!`);
      } else if (result.isDirectoryListing) {
        console.log(`      📁 Directory listing detected - NEEDS HOSTING CONFIG`);
      } else if (result.hasIndex) {
        console.log(`      📄 HTML page detected (${result.contentLength} bytes)`);
      } else {
        console.log(`      ⚠️  Unknown content type`);
      }
    } else if (result.status === 'ERROR') {
      console.log(`   ❌ ${subdomain}: ${result.error}`);
    } else if (result.status === 'TIMEOUT') {
      console.log(`   ⏰ ${subdomain}: Timeout after 15s`);
    } else {
      console.log(`   ⚠️  ${subdomain}: HTTP ${result.status}`);
    }
  }
  
  // Summary
  console.log('\n📊 COMPREHENSIVE SUMMARY');
  console.log('========================');
  const working = subdomainResults.filter(r => r.status === 200).length;
  const withSnakkaz = subdomainResults.filter(r => r.isSnakkazApp).length;
  const withDirectoryListing = subdomainResults.filter(r => r.isDirectoryListing).length;
  
  console.log(`Main domain: ${mainResult.status === 200 ? '✅ Working' : '❌ Issues'}`);
  console.log(`Subdomains responding: ${working}/${SUBDOMAINS.length}`);
  console.log(`With Snakkaz app: ${withSnakkaz}/${SUBDOMAINS.length}`);
  console.log(`With directory listing: ${withDirectoryListing}/${SUBDOMAINS.length}`);
  
  if (working === SUBDOMAINS.length && withSnakkaz === SUBDOMAINS.length) {
    console.log('\n🎉 ALL SUBDOMAINS WORKING PERFECTLY! 🎉');
    console.log('✅ DNS, SSL, hosting, and app serving all configured correctly');
  } else if (working === SUBDOMAINS.length && withDirectoryListing > 0) {
    console.log('\n🔧 HOSTING CONFIGURATION NEEDED');
    console.log('✅ DNS and SSL working perfectly');
    console.log('✅ Files deployed successfully');
    console.log('❌ Hosting provider needs to configure subdomain document roots');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Contact hosting provider or access cPanel');
    console.log('2. Configure subdomain document roots:');
    SUBDOMAINS.forEach(sub => {
      console.log(`   - ${sub}.snakkaz.com → /public_html/${sub}/`);
    });
  } else {
    console.log('\n🔧 Some subdomains need attention - check DNS/SSL configuration');
  }
  
  return {
    main: mainResult,
    subdomains: subdomainResults,
    summary: { working, withSnakkaz, withDirectoryListing, total: SUBDOMAINS.length }
  };
}

// Run the test
if (require.main === module) {
  testAllSubdomains().catch(console.error);
}

module.exports = { testAllSubdomains, testUrl };
