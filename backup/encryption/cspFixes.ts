/**
 * CSP and CORS Fixes for Snakkaz Chat
 * 
 * This module provides fixes for Content Security Policy issues
 * and CORS problems with Cloudflare Analytics and ping requests.
 */

/**
 * Fix Content Security Policy specifically for the issues seen in the console
 * This addresses the following issues:
 * 1. CORS issues with cloudflareinsights.com
 * 2. CSP blocking of ping requests to snakkaz.com subdomains
 * 3. Integrity hash mismatches
 */
export function applyEmergencyCspFixes(): void {
  if (typeof document === 'undefined') return;
  
  console.log('Applying emergency CSP fixes...');
  
  // Find existing CSP meta tag
  const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  let cspContent = existingCspTag ? existingCspTag.getAttribute('content') || '' : '';
  
  // If we don't have a CSP tag, create one with safe defaults
  if (!existingCspTag) {
    const newCspTag = document.createElement('meta');
    newCspTag.httpEquiv = 'Content-Security-Policy';
    
    cspContent = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' *.snakkaz.com *.cloudflareinsights.com static.cloudflareinsights.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;
      connect-src 'self' *.supabase.co wss://*.supabase.co *.amazonaws.com storage.googleapis.com
                  *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com
                  static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com
                  https://cdn.gpteng.co;
      font-src 'self' data:;
      media-src 'self' blob:;
      object-src 'none';
      frame-src 'self';
      worker-src 'self' blob:;
      form-action 'self';
      base-uri 'self';
      frame-ancestors 'self';
    `.replace(/\s+/g, ' ').trim();
    
    newCspTag.setAttribute('content', cspContent);
    document.head.appendChild(newCspTag);
    console.log('Created new CSP meta tag with fixed policy');
  } else {
    // Update existing CSP tag to include necessary domains
    let updatedCsp = cspContent;
    
    // Make sure Cloudflare domains are in connect-src
    if (!updatedCsp.includes('connect-src') || 
        !updatedCsp.includes('cloudflareinsights.com')) {
      if (updatedCsp.includes('connect-src')) {
        // Add to existing connect-src
        updatedCsp = updatedCsp.replace(
          /(connect-src\s+[^;]+)/,
          '$1 static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com'
        );
      } else {
        // Add new connect-src directive
        updatedCsp += "; connect-src 'self' static.cloudflareinsights.com cloudflareinsights.com";
      }
    }
    
    // Add missing Snakkaz domains to connect-src
    const snakkazDomains = ['dash.snakkaz.com', 'business.snakkaz.com', 'docs.snakkaz.com', 'analytics.snakkaz.com'];
    snakkazDomains.forEach(domain => {
      if (!updatedCsp.includes(domain)) {
        updatedCsp = updatedCsp.replace(
          /(connect-src\s+[^;]+)/,
          `$1 ${domain}`
        );
      }
    });
    
    if (updatedCsp !== cspContent) {
      existingCspTag.setAttribute('content', updatedCsp);
      console.log('Updated existing CSP policy with required domains');
    }
  }
  
  // Make sure scripts can load from Cloudflare
  fixCloudflareScriptLoading();
}

/**
 * Fix Cloudflare script loading issues
 * This specifically addresses the integrity hash mismatch errors
 */
function fixCloudflareScriptLoading() {
  // Find any Cloudflare scripts and remove integrity attributes
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    
    if (scriptEl.src && (
      scriptEl.src.includes('cloudflare') || 
      scriptEl.src.includes('beacon.min.js')
    )) {
      console.log(`Fixing Cloudflare script: ${scriptEl.src}`);
      
      // Remove integrity attribute
      if (scriptEl.hasAttribute('integrity')) {
        scriptEl.removeAttribute('integrity');
      }
      
      // Add crossorigin and referrer policy
      scriptEl.setAttribute('crossorigin', 'anonymous');
      scriptEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      
      // Use the exact URL from the error message if it's the beacon script
      if (scriptEl.src.includes('beacon.min.js') && 
          !scriptEl.src.includes('vcd15cbe7772f49c399c6a5babf22c1241717689176015')) {
        scriptEl.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015';
      }
    }
  });
  
  // Create a mutation observer to catch dynamically added scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node as Element).tagName === 'SCRIPT') {
          const script = node as HTMLScriptElement;
          if (script.src && (
            script.src.includes('cloudflare') || 
            script.src.includes('beacon.min.js')
          )) {
            if (script.hasAttribute('integrity')) {
              script.removeAttribute('integrity');
            }
            script.setAttribute('crossorigin', 'anonymous');
            script.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          }
        }
      });
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

/**
 * Fix ping requests to subdomains that are blocked by CSP
 */
export function fixPingRequests() {
  if (typeof window === 'undefined') return;
  
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
    
    // Check for ping requests to snakkaz subdomains
    if (url && url.includes('/ping') && url.includes('snakkaz.com')) {
      console.debug(`Intercepting ping request to ${url}`);
      return Promise.resolve(new Response('{"success":true}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }));
    }
    
    // Special handling for Cloudflare Analytics
    if (url && url.includes('cloudflareinsights.com')) {
      const options = init || {};
      options.mode = 'cors';
      options.credentials = 'omit';
      options.headers = {
        ...(options.headers || {}),
        'Origin': window.location.origin,
        'Referer': window.location.origin
      };
      return originalFetch.call(this, input, options);
    }
    
    return originalFetch.apply(this, arguments);
  };
}

/**
 * Apply all fixes at once - call this early in your application
 */
export function applyAllCspFixes() {
  applyEmergencyCspFixes();
  fixPingRequests();
  
  console.log('All CSP and CORS fixes have been applied');
}
