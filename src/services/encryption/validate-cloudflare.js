#!/usr/bin/env node

/**
 * Cloudflare System Status Validator
 * 
 * This script provides a comprehensive validation of Cloudflare integration
 * for the Snakkaz Chat application.
 */

import https from 'https';

/**
 * Simple fetch implementation for Node.js
 */
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          headers: response.headers,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        req.destroy();
        reject(new Error(`Request timed out after ${options.timeout}ms`));
      });
    }

    req.end();
  });
}

/**
 * Check Cloudflare DNS status
 */
async function checkCloudflareStatus() {
  console.log('Checking Cloudflare DNS status...');
  
  try {
    const response = await fetch('https://www.snakkaz.com/cdn-cgi/trace', { 
      timeout: 5000
    });
    const text = await response.text();
    
    // Parse the trace data into key-value pairs
    const traceData = text.split('\n').reduce((acc, line) => {
      const [key, value] = line.split('=');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});
    
    const isCloudflareDns = text.includes('cf-ray=') || text.includes('colo=');
    
    if (isCloudflareDns) {
      console.log('✅ Cloudflare DNS is ACTIVE');
      console.log('Cloudflare datacenter:', traceData.colo || 'Unknown');
      console.log('CF-Ray ID:', traceData.ray || 'Unknown');
      console.log('IP:', traceData.ip || 'Unknown');
      console.log('Location:', traceData.loc || 'Unknown');
      return { success: true, details: traceData };
    } else {
      console.log('⏳ Cloudflare DNS is still PROPAGATING');
      return { success: false, details: { message: 'DNS propagation in progress' } };
    }
  } catch (error) {
    console.error('❌ Error checking Cloudflare status:', error.message);
    return { success: false, details: { error: error.message } };
  }
}

/**
 * Check if Cloudflare Analytics loads
 */
async function checkCloudflareAnalytics() {
  console.log('Checking Cloudflare Analytics availability...');
  
  try {
    // Try to fetch the beacon script
    const response = await fetch('https://static.cloudflareinsights.com/beacon.min.js', { 
      timeout: 5000
    });
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ Cloudflare Analytics script is accessible');
      return { success: true };
    } else {
      console.log('❌ Cloudflare Analytics script returned status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('❌ Error accessing Cloudflare Analytics:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check CSP headers
 */
async function checkCspHeaders() {
  console.log('Checking Content Security Policy headers...');
  
  try {
    const response = await fetch('https://www.snakkaz.com', { 
      timeout: 5000
    });
    
    const cspHeader = response.headers['content-security-policy'];
    
    if (cspHeader) {
      console.log('✅ CSP header found');
      
      // Check for important domains
      const importantDomains = [
        'dash.snakkaz.com',
        'static.cloudflareinsights.com'
      ];
      
      const missingDomains = importantDomains.filter(domain => !cspHeader.includes(domain));
      
      if (missingDomains.length === 0) {
        console.log('✅ All important domains are included in CSP');
        return { success: true, csp: cspHeader };
      } else {
        console.log('❌ CSP is missing important domains:', missingDomains);
        return { success: false, missingDomains, csp: cspHeader };
      }
    } else {
      console.log('❌ No CSP header found');
      return { success: false, error: 'No CSP header' };
    }
  } catch (error) {
    console.error('❌ Error checking CSP headers:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Run all checks
 */
async function runSystemChecks() {
  console.log('\n=== Cloudflare Integration Validator ===');
  console.log(`Time: ${new Date().toLocaleString()}\n`);
  
  const cloudflareDns = await checkCloudflareStatus();
  console.log();
  
  const cloudflareAnalytics = await checkCloudflareAnalytics();
  console.log();
  
  // Only check CSP if Cloudflare DNS is active
  let csp = { success: false, reason: 'Skipped because Cloudflare DNS is not active' };
  if (cloudflareDns.success) {
    csp = await checkCspHeaders();
  }
  
  // Summarize results
  console.log('\n=== Summary ===');
  console.log(`Cloudflare DNS: ${cloudflareDns.success ? '✅ ACTIVE' : '⏳ PROPAGATING'}`);
  console.log(`Cloudflare Analytics: ${cloudflareAnalytics.success ? '✅ ACCESSIBLE' : '❌ INACCESSIBLE'}`);
  console.log(`Content Security Policy: ${csp.success ? '✅ CONFIGURED CORRECTLY' : '⚠️ ISSUES DETECTED'}`);
  
  // Calculate overall status
  const overallSuccess = cloudflareDns.success && cloudflareAnalytics.success;
  console.log(`\nOverall Status: ${overallSuccess ? '✅ GOOD' : '⚠️ NEEDS ATTENTION'}`);
  
  return {
    timestamp: new Date().toISOString(),
    cloudflareDns,
    cloudflareAnalytics,
    csp,
    overallSuccess
  };
}

// Run the checks
runSystemChecks()
  .then(results => {
    console.log('\nDetailed results:', JSON.stringify(results, null, 2));
  })
  .catch(error => {
    console.error('Error running system checks:', error);
  });
