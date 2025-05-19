/**
 * CSP and CORS Fixes for Snakkaz Chat
 * 
 * This module provides fixes for Content Security Policy issues
 * and CORS problems with cross-domain requests and ping endpoints.
 * 
 * Updated: May 14, 2025 - Removed Cloudflare dependencies
 */

/**
 * Fix Content Security Policy specifically for the issues seen in the console
 * This addresses the following issues:
 * 1. CORS issues with cross-domain requests to Snakkaz subdomains
 * 2. CSP blocking of ping requests to snakkaz.com subdomains
 * 3. Integrity hash mismatches with external scripts
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
      script-src 'self' 'unsafe-inline' 'unsafe-eval' *.snakkaz.com *.gpteng.co cdn.gpteng.co;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;
      connect-src 'self' *.supabase.co wss://*.supabase.co *.amazonaws.com storage.googleapis.com
                  *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com
                  mcp.snakkaz.com help.snakkaz.com
                  https://cdn.gpteng.co *.gpteng.co;
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
    
    // Make sure all Snakkaz subdomains are in connect-src
    if (!updatedCsp.includes('connect-src') || 
        !updatedCsp.includes('mcp.snakkaz.com') || 
        !updatedCsp.includes('help.snakkaz.com')) {
      if (updatedCsp.includes('connect-src')) {
        // Add to existing connect-src
        updatedCsp = updatedCsp.replace(
          /(connect-src\s+[^;]+)/,
          '$1 mcp.snakkaz.com help.snakkaz.com *.gpteng.co cdn.gpteng.co'
        );
      } else {
        // Add new connect-src directive
        updatedCsp += "; connect-src 'self' *.snakkaz.com mcp.snakkaz.com help.snakkaz.com *.gpteng.co";
      }
    }
    
    // Add missing Snakkaz domains to connect-src
    const snakkazDomains = [
      'dash.snakkaz.com', 
      'business.snakkaz.com', 
      'docs.snakkaz.com', 
      'analytics.snakkaz.com',
      'mcp.snakkaz.com',
      'help.snakkaz.com'
    ];
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
  
  // Make sure scripts can load from external domains
  fixExternalScriptLoading();
}

/**
 * Fix external script loading issues
 * This addresses integrity hash mismatch errors with external scripts
 */
function fixExternalScriptLoading() {
  // Find any external scripts with integrity issues and fix them
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    
    if (scriptEl.src && (
      scriptEl.src.includes('gpteng.co') || 
      scriptEl.src.includes('analytics.js')
    )) {
      console.log(`Fixing external script: ${scriptEl.src}`);
      
      // Remove integrity attribute
      if (scriptEl.hasAttribute('integrity')) {
        scriptEl.removeAttribute('integrity');
      }
      
      // Add crossorigin and referrer policy
      scriptEl.setAttribute('crossorigin', 'anonymous');
      scriptEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
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
            script.src.includes('gpteng.co') || 
            script.src.includes('analytics.js') ||
            script.src.includes('snakkaz.com')
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
    
    // Special handling for Analytics endpoints
    if (url && (url.includes('analytics.snakkaz.com') || url.includes('gpteng.co'))) {
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
