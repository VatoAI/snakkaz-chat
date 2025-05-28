#!/usr/bin/env node

/**
 * Quick Subdomain Status Check for Snakkaz Chat
 */

const https = require('https');

const SUBDOMAINS = ['dash', 'business', 'docs', 'analytics', 'mcp', 'help'];

function testUrl(url) {
  console.log(`Testing ${url}...`);
  
  return new Promise((resolve) => {
    const request = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isSnakkazApp = data.includes('Snakkaz Chat') || data.includes('<title>Snakkaz') || data.includes('snakkaz-chat');
        const isDirectoryListing = data.includes('Index of') || data.includes('LiteSpeed Web Server') || data.includes('Directory Listing');
        
        resolve({
          url,
          status: res.statusCode,
          isSnakkazApp,
          isDirectoryListing,
          contentLength: data.length
        });
      });
    });
    
    request.on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({ url, status: 'TIMEOUT' });
    });
  });
}

async function main() {
  console.log('🧪 Snakkaz Chat Subdomain Status Check');
  console.log('=====================================\n');
  
  // Test main domain
  console.log('🏠 Main Domain:');
  const mainResult = await testUrl('https://www.snakkaz.com');
  console.log(`   ✅ ${mainResult.status} - ${mainResult.isSnakkazApp ? 'Snakkaz app detected' : 'Generic content'}\n`);
  
  // Test subdomains
  console.log('🌐 Subdomains:');
  const results = [];
  
  for (const subdomain of SUBDOMAINS) {
    const result = await testUrl(`https://${subdomain}.snakkaz.com`);
    results.push(result);
    
    if (result.status === 200) {
      if (result.isSnakkazApp) {
        console.log(`   ✅ ${subdomain}: Snakkaz app running - PERFECT!`);
      } else if (result.isDirectoryListing) {
        console.log(`   📁 ${subdomain}: Directory listing - needs hosting config`);
      } else {
        console.log(`   📄 ${subdomain}: Generic HTML content`);
      }
    } else {
      console.log(`   ❌ ${subdomain}: ${result.status}`);
    }
  }
  
  // Summary
  const working = results.filter(r => r.status === 200).length;
  const withSnakkaz = results.filter(r => r.isSnakkazApp).length;
  
  console.log('\n📊 Summary:');
  console.log(`   Responding: ${working}/${SUBDOMAINS.length}`);
  console.log(`   With Snakkaz app: ${withSnakkaz}/${SUBDOMAINS.length}`);
  
  if (withSnakkaz === SUBDOMAINS.length) {
    console.log('\n🎉 ALL PERFECT! All subdomains serving Snakkaz app!');
  } else if (working === SUBDOMAINS.length) {
    console.log('\n🔧 NEXT STEP: Configure hosting provider to serve apps instead of directory listings');
  }
}

main().catch(console.error);
