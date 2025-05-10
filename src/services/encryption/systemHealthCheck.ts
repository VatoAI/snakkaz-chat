/**
 * System Health Check
 * 
 * This module provides functionality to verify that all the fixes we've 
 * implemented are working correctly. It can be run from the console for debugging.
 */

import { buildCspPolicy } from './cspConfig';

/**
 * Verifies that the Content Security Policy includes all necessary domains
 * @returns {boolean} True if the CSP is correctly configured
 */
export function verifyCspConfiguration(): boolean {
  console.log('Verifying CSP configuration...');
  
  // Get current CSP from meta tag or generate it
  let currentCsp = '';
  if (typeof document !== 'undefined') {
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    currentCsp = cspTag ? cspTag.getAttribute('content') || '' : buildCspPolicy();
  } else {
    currentCsp = buildCspPolicy();
  }
  
  // Check for required domains
  const requiredDomains = [
    'dash.snakkaz.com',
    'business.snakkaz.com', 
    'docs.snakkaz.com',
    'analytics.snakkaz.com',
    'dash.snakkaz.com/ping',
    'business.snakkaz.com/ping',
    'docs.snakkaz.com/ping',
    'analytics.snakkaz.com/ping',
    '*.supabase.co',
    'cdn.gpteng.co',
    'static.cloudflareinsights.com'
  ];
  
  const missingDomains = [];
  
  for (const domain of requiredDomains) {
    const escapedDomain = domain.replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\//g, '\\/');
    const domainRegex = new RegExp(escapedDomain);
    
    if (!domainRegex.test(currentCsp)) {
      missingDomains.push(domain);
    }
  }
  
  if (missingDomains.length > 0) {
    console.error('CSP is missing the following domains:', missingDomains);
    return false;
  }
  
  console.log('CSP configuration looks good!');
  return true;
}

/**
 * Check if SRI integrity attributes are being properly removed
 */
export function checkSriRemoval(): boolean {
  console.log('Checking SRI removal functionality...');
  
  // Create a test script with integrity
  const testScript = document.createElement('script');
  testScript.src = 'https://example.com/test.js';
  testScript.integrity = 'sha256-test';
  document.head.appendChild(testScript);
  
  // Check if integrity attribute was removed
  const result = !testScript.hasAttribute('integrity');
  
  // Clean up
  document.head.removeChild(testScript);
  
  if (result) {
    console.log('SRI integrity removal is working correctly');
  } else {
    console.error('SRI integrity attributes are not being removed properly');
  }
  
  return result;
}

/**
 * Verify that ping request blocking works
 */
export function testPingRequestBlocker(): Promise<boolean> {
  console.log('Testing ping request interception...');
  
  return fetch('https://dash.snakkaz.com/ping')
    .then(response => {
      if (response.status === 200) {
        console.log('Ping request interception is working correctly');
        return true;
      } else {
        console.error('Ping request interception failed');
        return false;
      }
    })
    .catch(error => {
      console.error('Ping request interception test failed:', error);
      return false;
    });
}

/**
 * Run all health checks and return overall system status
 */
export function runSystemHealthCheck(): Promise<{
  healthy: boolean;
  details: {
    csp: boolean;
    sri: boolean;
    pingBlocking: boolean;
    metaTags: boolean;
  }
}> {
  console.log('========= SYSTEM HEALTH CHECK =========');
  const results = {
    healthy: false,
    details: {
      csp: false,
      sri: false,
      pingBlocking: false,
      metaTags: false
    }
  };
  
  // Check CSP
  results.details.csp = verifyCspConfiguration();
  
  // Check SRI removal
  results.details.sri = checkSriRemoval();
  
  // Check meta tags
  const mobileAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
  results.details.metaTags = !!mobileAppCapable;
  
  // Test ping blocking (async)
  return testPingRequestBlocker()
    .then(pingBlockingResult => {
      results.details.pingBlocking = pingBlockingResult;
      
      // Overall health determination
      results.healthy = Object.values(results.details).every(Boolean);
      
      console.log('========= HEALTH CHECK COMPLETE =========');
      console.log(`Overall system health: ${results.healthy ? 'HEALTHY ✅' : 'ISSUES DETECTED ❌'}`);
      console.table(results.details);
      
      return results;
    });
}

// Export a simple function for console use
export const checkHealth = runSystemHealthCheck;
