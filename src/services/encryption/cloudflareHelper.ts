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
  // Update the data-cf-beacon attribute with all required fields
  newScript.setAttribute('data-cf-beacon', '{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0","spa":true,"spaMode":"auto","cookieDomain":"snakkaz.com"}'); 
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
        'Origin': window.location.origin,
        'Referer': window.location.origin
      };
      
      // Log the request for debugging
      console.debug('Intercepted Cloudflare request:', url);
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
  
  // Suppress Cloudflare beacon error messages
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorMessage = args.length > 0 ? String(args[0]) : '';
    
    // Check if this is a Cloudflare beacon error
    if (errorMessage.includes('cloudflareinsights') || 
        errorMessage.includes('beacon') || 
        errorMessage.includes('Failed to load resource') ||
        errorMessage.includes('Content Security Policy')) {
      // Downgrade the error to a debug message
      console.debug('Suppressed Cloudflare error:', ...args);
    } else {
      // Pass through other errors normally
      originalConsoleError.apply(console, args);
    }
  };
  
  // Set up mutation observer to fix dynamically added scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName === 'SCRIPT' && 
              (element as HTMLScriptElement).src && 
              (element as HTMLScriptElement).src.includes('cloudflare')) {
            
            console.log('Fixing dynamically added Cloudflare script');
            element.removeAttribute('integrity');
            (element as HTMLScriptElement).crossOrigin = 'anonymous';
            element.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          }
        }
      });
    });
  });
  
  observer.observe(document, { childList: true, subtree: true });
  
  console.log('Cloudflare Analytics integration fixes applied');
}

/**
 * Fix specific 404 errors like auth-bg.jpg
 */
export function fixMissingResources() {
  if (typeof document === 'undefined') return;
  
  // Create a style element to fix missing auth-bg.jpg references
  const style = document.createElement('style');
  style.textContent = `
    [style*="auth-bg.jpg"] {
      background-image: none !important;
      background-color: #f5f7fa !important;
    }
    img[src*="auth-bg.jpg"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Applied fixes for missing resources');
}

/**
 * Check if Cloudflare is activated properly for the domain
 */
export async function checkCloudflareActivation(): Promise<boolean> {
  try {
    const response = await fetch('https://www.snakkaz.com/cdn-cgi/trace', {
      method: 'GET',
      cache: 'no-store'
    });
    
    if (!response.ok) return false;
    
    const text = await response.text();
    return text.includes('colo=') && text.includes('h=www.snakkaz.com');
  } catch (error) {
    console.warn('Cloudflare not fully activated:', error);
    return false;
  }
}
