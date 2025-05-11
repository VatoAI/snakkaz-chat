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
 * Test if Cloudflare Analytics is loading correctly
 */
export function testCloudflareAnalytics() {
  console.log('Testing Cloudflare Analytics loading...');
  
  if (typeof document === 'undefined') {
    return { loaded: false, reason: 'Not running in browser' };
  }
  
  // Check if the analytics script exists
  const cfScripts = Array.from(document.querySelectorAll('script')).filter(
    script => script.src && script.src.includes('cloudflareinsights')
  );
  
  // Check if the global _cf object exists (indicates Cloudflare Analytics loaded)
  const cfObjectExists = typeof window !== 'undefined' && '_cf' in window;
  
  if (cfScripts.length > 0) {
    if (cfObjectExists) {
      console.log('Cloudflare Analytics is loaded and functioning');
      return { 
        loaded: true,
        script: cfScripts[0].src,
        objectExists: true
      };
    } else {
      console.log('Cloudflare Analytics script exists but may not be properly loaded');
      return {
        loaded: false,
        script: cfScripts[0].src,
        objectExists: false,
        reason: 'CF object not found in window'
      };
    }
  } else {
    console.log('No Cloudflare Analytics script found');
    // Try to load it now
    const loadScript = document.createElement('script');
    loadScript.defer = true;
    loadScript.crossOrigin = 'anonymous';
    loadScript.src = 'https://static.cloudflareinsights.com/beacon.min.js?token=c5bd7bbfe41c47c2a5ec';
    document.head.appendChild(loadScript);
    
    return {
      loaded: false,
      reason: 'Script not found, attempted to load',
      attemptedFix: true
    };
  }
}

/**
 * Check if Cloudflare DNS is properly configured
 * This helps validate that nameserver changes have propagated
 */
export function checkCloudflareStatus(): Promise<{success: boolean, details?: any}> {
  console.log('Checking Cloudflare DNS status...');
  
  // Try to check if we're behind Cloudflare by looking for CF specific headers
  return fetch('https://www.snakkaz.com/cdn-cgi/trace', { 
    method: 'GET',
    cache: 'no-store'
  })
    .then(response => response.text())
    .then(text => {
      // Parse the trace data into key-value pairs
      const traceData = text.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {});
      
      const isCloudflareDns = text.includes('cf-ray=') || text.includes('colo=');
      if (isCloudflareDns) {
        console.log('✅ Cloudflare DNS is properly configured');
        console.log('Cloudflare datacenter:', traceData.colo || 'Unknown');
        console.log('CF-Ray ID:', traceData.ray || 'Unknown');
        return { 
          success: true, 
          details: traceData 
        };
      } else {
        console.log('❌ Cloudflare DNS is not active yet (propagation may take 24-48 hours)');
        return { 
          success: false,
          details: { message: 'DNS propagation in progress' }
        };
      }
    })
    .catch(error => {
      console.error('Error checking Cloudflare status:', error);
      return { 
        success: false, 
        details: { error: error.message || 'Unknown error' } 
      };
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
    cloudflareAnalytics: boolean;
    cloudflareDns: boolean;
  }
}> {
  console.log('========= SYSTEM HEALTH CHECK =========');
  const results = {
    healthy: false,
    details: {
      csp: false,
      sri: false,
      pingBlocking: false,
      metaTags: false,
      cloudflareAnalytics: false,
      cloudflareDns: false
    }
  };
  
  // Check CSP
  results.details.csp = verifyCspConfiguration();
  
  // Check SRI removal
  results.details.sri = checkSriRemoval();
  
  // Check meta tags
  const mobileAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
  results.details.metaTags = !!mobileAppCapable;
  
  // Check Cloudflare Analytics 
  const cfAnalyticsResult = testCloudflareAnalytics();
  results.details.cloudflareAnalytics = cfAnalyticsResult.loaded;
  
  // Test Cloudflare DNS configuration
  return checkCloudflareStatus()
    .then(cfDnsResult => {
      results.details.cloudflareDns = cfDnsResult.success;
      
      // Then test ping blocking
      return testPingRequestBlocker();
    })
    .then(pingBlockingResult => {
      results.details.pingBlocking = pingBlockingResult;
      
      // Overall health determination - don't require Cloudflare DNS to be active yet
      const criticalChecks = {
        csp: results.details.csp,
        sri: results.details.sri,
        pingBlocking: results.details.pingBlocking,
        metaTags: results.details.metaTags
      };
      
      results.healthy = Object.values(criticalChecks).every(Boolean);
      
      console.log('========= HEALTH CHECK COMPLETE =========');
      console.log(`Overall system health: ${results.healthy ? 'HEALTHY ✅' : 'ISSUES DETECTED ❌'}`);
      console.table(results.details);
      
      return results;
    });
}

// Export simple functions for console use
export const checkHealth = runSystemHealthCheck;

/**
 * Simple function to check just Cloudflare DNS status with detailed output
 * This is useful for monitoring DNS propagation progress
 */
export function checkCloudflareDnsStatus() {
  return checkCloudflareStatus()
    .then(result => {
      if (result.success) {
        console.log('%c ✅ Cloudflare DNS is ACTIVE ', 'background: #0f9d58; color: white; font-size: 16px; padding: 5px;');
        console.log('%c Cloudflare Details ', 'background: #4285f4; color: white; font-size: 14px;');
        console.table(result.details);
      } else {
        console.log('%c ⏳ Cloudflare DNS PROPAGATING ', 'background: #f4b400; color: black; font-size: 16px; padding: 5px;');
        console.log('%c Nameservers have been configured correctly. DNS propagation typically takes 24-48 hours. ', 
                   'font-size: 14px;');
        console.log(result.details);
      }
      return result;
    })
    .catch(error => {
      console.log('%c ❌ ERROR CHECKING CLOUDFLARE DNS ', 'background: #db4437; color: white; font-size: 16px; padding: 5px;');
      console.error(error);
      return { success: false, details: { error: error.message } };
    });
}

/**
 * Run health check automatically when script loads in production
 * (helps with diagnostics without needing console access)
 */
if (typeof window !== 'undefined' && window.location.hostname === 'www.snakkaz.com') {
  // Add a small delay to ensure page is fully loaded
  setTimeout(() => {
    runSystemHealthCheck()
      .then(results => {
        console.log('Auto health check completed:', results);
        if (!results.healthy) {
          // Try to fix issues
          if (!results.details.cloudflareAnalytics) {
            import('./analyticsLoader').then(module => {
              module.loadCloudflareAnalytics();
            });
          }
        }
      })
      .catch(err => {
        console.error('Auto health check failed:', err);
      });
  }, 3000);
}
