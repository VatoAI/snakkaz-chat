#!/usr/bin/env node

/**
 * Comprehensive Subdomain Testing Script for Snakkaz
 * Tests all subdomains and services requested by user
 */

import https from 'https';
import http from 'http';
import fs from 'fs';

const SUBDOMAINS_TO_TEST = [
  'www.snakkaz.com',
  'snakkaz.com',
  'mcp.snakkaz.com',
  'api.snakkaz.com', 
  'mail.snakkaz.com',
  'webmail.snakkaz.com',
  'dash.snakkaz.com',
  'dashboard.snakkaz.com',
  'admin.snakkaz.com',
  'business.snakkaz.com',
  'docs.snakkaz.com',
  'analytics.snakkaz.com',
  'cdn.snakkaz.com',
  'static.snakkaz.com',
  'assets.snakkaz.com',
  'chat.snakkaz.com',
  'ai.snakkaz.com',
  'memory.snakkaz.com',
  'support.snakkaz.com',
  'help.snakkaz.com'
];

console.log('🌐 SNAKKAZ SUBDOMAIN TESTING - Comprehensive Report');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log('=' .repeat(70));

async function testDomain(domain) {
  return new Promise((resolve) => {
    const url = `https://${domain}`;
    
    const request = https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Snakkaz-Subdomain-Tester/1.0'
      }
    }, (response) => {
      resolve({
        domain,
        status: response.statusCode,
        headers: response.headers,
        success: true,
        protocol: 'https'
      });
    });
    
    request.on('error', (error) => {
      // Try HTTP if HTTPS fails
      const httpRequest = http.get(`http://${domain}`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Snakkaz-Subdomain-Tester/1.0'
        }
      }, (response) => {
        resolve({
          domain,
          status: response.statusCode,
          headers: response.headers,
          success: true,
          protocol: 'http',
          note: 'HTTPS failed, HTTP working'
        });
      });
      
      httpRequest.on('error', () => {
        resolve({
          domain,
          success: false,
          error: error.message,
          protocol: 'none'
        });
      });
      
      httpRequest.setTimeout(5000, () => {
        httpRequest.destroy();
        resolve({
          domain,
          success: false,
          error: 'Timeout',
          protocol: 'none'
        });
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        domain,
        success: false,
        error: 'HTTPS Timeout',
        protocol: 'none'
      });
    });
  });
}

async function testAllSubdomains() {
  console.log('🔍 Testing all Snakkaz subdomains...\n');
  
  const results = [];
  const workingDomains = [];
  const failedDomains = [];
  
  for (const domain of SUBDOMAINS_TO_TEST) {
    console.log(`Testing ${domain}...`);
    const result = await testDomain(domain);
    results.push(result);
    
    if (result.success) {
      const icon = result.status === 200 ? '✅' : result.status < 400 ? '⚠️' : '❌';
      const note = result.note ? ` (${result.note})` : '';
      console.log(`  ${icon} ${domain}: ${result.status} - ${result.protocol.toUpperCase()}${note}`);
      
      if (result.headers['content-type']) {
        console.log(`     Content-Type: ${result.headers['content-type']}`);
      }
      if (result.headers['server']) {
        console.log(`     Server: ${result.headers['server']}`);
      }
      
      workingDomains.push(result);
    } else {
      console.log(`  ❌ ${domain}: ${result.error}`);
      failedDomains.push(result);
    }
    console.log('');
  }
  
  // Summary Report
  console.log('=' .repeat(70));
  console.log('📊 SUBDOMAIN TEST SUMMARY');
  console.log('=' .repeat(70));
  
  console.log(`✅ Working Domains: ${workingDomains.length}/${SUBDOMAINS_TO_TEST.length}`);
  console.log(`❌ Failed Domains: ${failedDomains.length}/${SUBDOMAINS_TO_TEST.length}`);
  
  console.log('\n🟢 WORKING DOMAINS:');
  workingDomains.forEach(domain => {
    const statusIcon = domain.status === 200 ? '✅' : domain.status < 400 ? '⚠️' : '❌';
    console.log(`  ${statusIcon} ${domain.domain} (${domain.status}) - ${domain.protocol.toUpperCase()}`);
  });
  
  if (failedDomains.length > 0) {
    console.log('\n🔴 FAILED DOMAINS:');
    failedDomains.forEach(domain => {
      console.log(`  ❌ ${domain.domain} - ${domain.error}`);
    });
  }
  
  // Specific checks
  console.log('\n🔧 SPECIFIC SERVICE ANALYSIS:');
  
  const mainSite = results.find(r => r.domain === 'www.snakkaz.com');
  if (mainSite && mainSite.success) {
    console.log(`✅ Main Site (www.snakkaz.com): Operational`);
  } else {
    console.log(`❌ Main Site (www.snakkaz.com): NOT WORKING`);
  }
  
  const mcpDomain = results.find(r => r.domain === 'mcp.snakkaz.com');
  if (mcpDomain && mcpDomain.success) {
    console.log(`✅ MCP Server (mcp.snakkaz.com): ${mcpDomain.status === 200 ? 'Operational' : 'Responds but may need setup'}`);
  } else {
    console.log(`❌ MCP Server (mcp.snakkaz.com): Not configured`);
  }
  
  const mailDomains = results.filter(r => r.domain.includes('mail') && r.success);
  if (mailDomains.length > 0) {
    console.log(`📧 Mail Services: ${mailDomains.length} working domains`);
    mailDomains.forEach(m => console.log(`     - ${m.domain}: ${m.status}`));
  } else {
    console.log(`❌ Mail Services: Need configuration`);
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (failedDomains.length > 0) {
    console.log(`📝 Set up ${failedDomains.length} missing subdomains in cPanel`);
  }
  
  const nonHttpsDomains = workingDomains.filter(d => d.protocol === 'http');
  if (nonHttpsDomains.length > 0) {
    console.log(`🔒 Enable SSL certificates for ${nonHttpsDomains.length} domains`);
  }
  
  const redirectNeeded = workingDomains.filter(d => d.status >= 300 && d.status < 400);
  if (redirectNeeded.length > 0) {
    console.log(`🔄 Configure proper redirects for ${redirectNeeded.length} domains`);
  }
  
  console.log('\n🎯 NEXT STEPS FOR MCP.SNAKKAZ.COM:');
  if (!mcpDomain || !mcpDomain.success) {
    console.log('1. Create mcp.snakkaz.com subdomain in cPanel');
    console.log('2. Deploy MCP memory server to subdomain');
    console.log('3. Configure SSL certificate');
    console.log('4. Update DNS records if needed');
  } else {
    console.log('1. MCP subdomain exists - ready for server deployment');
    console.log('2. Deploy Python MCP server application');
    console.log('3. Configure memory service endpoints');
  }
  
  // Save results
  const report = {
    timestamp: new Date().toISOString(),
    total_tested: SUBDOMAINS_TO_TEST.length,
    working: workingDomains.length,
    failed: failedDomains.length,
    results: results,
    recommendations: {
      ssl_needed: nonHttpsDomains.length,
      redirects_needed: redirectNeeded.length,
      subdomains_to_create: failedDomains.length
    }
  };
  
  fs.writeFileSync('subdomain-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Full report saved to: subdomain-test-report.json');
}

// Run the tests
testAllSubdomains().catch(console.error);
