/**
 * Cloudflare Analytics Integration Helper
 * 
 * This utility helps ensure proper integration with Cloudflare Analytics
 * by fixing common issues with CSP, CORS and integrity checks.
 */

/**
 * Fix Cloudflare Analytics integration issues
 */
export function fixCloudflareAnalyticsIntegration() {
  if (typeof document === 'undefined') return;
  
  console.log('Applying Cloudflare Analytics integration fixes...');

  // Remove all existing Cloudflare scripts first - they might be problematic
  const existingCfScripts = document.querySelectorAll('script[src*="cloudflare"]');
  existingCfScripts.forEach(script => {
    console.log(`Removing potentially problematic Cloudflare script: ${(script as HTMLScriptElement).src}`);
    script.parentNode?.removeChild(script);
  });

  // Manually inject a fresh Cloudflare Analytics script
  const newScript = document.createElement('script');
  newScript.defer = true;
  newScript.crossOrigin = 'anonymous';
  newScript.referrerPolicy = 'no-referrer-when-downgrade';
  newScript.src = 'https://static.cloudflareinsights.com/beacon.min.js?token=c5bd7bbfe41c47c2a5ec';
  newScript.setAttribute('data-cf-beacon', '{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0","spa":true}');
  document.head.appendChild(newScript);
  
  // Find and fix any remaining or newly added Cloudflare scripts
  const cfScripts = document.querySelectorAll('script[src*="cloudflare"]');
  cfScripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    
    // Remove any integrity checks
    if (scriptEl.hasAttribute('integrity')) {
      console.log(`Removing integrity check for Cloudflare script: ${scriptEl.src}`);
      scriptEl.removeAttribute('integrity');
    }
    
    // Ensure crossorigin is set to anonymous
    if (!scriptEl.hasAttribute('crossorigin')) {
      scriptEl.crossOrigin = 'anonymous';
      console.log(`Adding crossorigin attribute for Cloudflare script: ${scriptEl.src}`);
    }
    
    // Add referrer policy
    if (!scriptEl.hasAttribute('referrerpolicy')) {
      scriptEl.referrerPolicy = 'no-referrer-when-downgrade';
    }
  });
  
  // Add a global fetch interceptor for Cloudflare requests
  const originalFetch = window.fetch;
  window.fetch = function(resource, options = {}) {
    const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';
    
    // If this is a Cloudflare request
    if (url && (url.includes('cloudflare') || url.includes('cloudflareinsights.com'))) {
      options = options || {};
      options.mode = 'cors';
      options.credentials = 'omit';
      
      const headers = options.headers || {};
      options.headers = {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': window.location.origin
      };
    }
    
    return originalFetch.call(this, resource, options);
  };
  
  // Create and update CSP if needed
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspTag) {
    const cspContent = cspTag.getAttribute('content') || '';
    
    // Check if Cloudflare domains are missing from connect-src
    if (!cspContent.includes('cloudflareinsights.com') || 
        !cspContent.includes('static.cloudflareinsights.com')) {
      
      // Add Cloudflare domains to connect-src
      const newCspContent = cspContent.replace(
        /connect-src\s+([^;]+)/, 
        'connect-src $1 https://static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com'
      );
      
      if (newCspContent !== cspContent) {
        cspTag.setAttribute('content', newCspContent);
        console.log('Updated CSP meta tag to include Cloudflare Insights');
      }
    }
  }
  
  console.log('Cloudflare Analytics integration fixes applied');
}
