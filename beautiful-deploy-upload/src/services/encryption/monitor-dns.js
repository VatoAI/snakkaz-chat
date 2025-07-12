#!/usr/bin/env node

/**
 * Cloudflare DNS Monitor
 * 
 * This script checks the Cloudflare DNS propagation status for snakkaz.com.
 * Run it periodically to monitor when DNS changes have fully propagated.
 * 
 * Usage:
 *   node monitor-dns.js
 */

// Simple fetch polyfill for Node.js
import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          text: () => Promise.resolve(data)
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Check if Cloudflare DNS is active for snakkaz.com
 */
async function checkCloudflareStatus() {
  console.log('Checking Cloudflare DNS status for snakkaz.com...');
  
  try {
    // Try to check if we're behind Cloudflare by looking for CF specific headers
    const response = await fetch('https://www.snakkaz.com/cdn-cgi/trace');
    const text = await response.text();
    
    // Parse the trace data into key-value pairs
    const traceData = text.split('\n').reduce((acc, line) => {
      const [key, value] = line.split('=');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});
    
    const isCloudflareDns = text.includes('cf-ray=') || text.includes('colo=');
    
    if (isCloudflareDns) {
      console.log('✅ Cloudflare DNS is ACTIVE for snakkaz.com');
      console.log('Cloudflare datacenter:', traceData.colo || 'Unknown');
      console.log('CF-Ray ID:', traceData.ray || 'Unknown');
      console.log('IP:', traceData.ip || 'Unknown');
      console.log('Location:', traceData.loc || 'Unknown');
      return { success: true, details: traceData };
    } else {
      console.log('⏳ Cloudflare DNS is still PROPAGATING for snakkaz.com');
      console.log('DNS propagation typically takes 24-48 hours.');
      console.log('Try running this check again in a few hours.');
      return { success: false, details: { message: 'DNS propagation in progress' } };
    }
  } catch (error) {
    console.error('❌ Error checking Cloudflare status:', error.message);
    return { success: false, details: { error: error.message } };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n=== Cloudflare DNS Monitor ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  await checkCloudflareStatus();
  console.log('\nTo re-check status, run this script again.');
}

// Run the main function
main();
