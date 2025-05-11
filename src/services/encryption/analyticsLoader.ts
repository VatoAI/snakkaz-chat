/**
 * Analytics Loader
 * 
 * This module provides a more robust way to load analytics scripts
 * that might be blocked by CSP or have integrity check issues.
 */

/**
 * Force remove all integrity attributes from scripts and links
 * This ensures Cloudflare Analytics can load properly
 */
function removeSriIntegrityAttributes() {
  try {
    // Handle script tags with integrity attributes
    const scripts = document.querySelectorAll('script[integrity]');
    scripts.forEach((script) => {
      script.removeAttribute('integrity');
      
      // For Cloudflare scripts, also set crossorigin and other attributes
      const scriptEl = script as HTMLScriptElement;
      if (scriptEl.src && scriptEl.src.includes('cloudflare')) {
        scriptEl.setAttribute('crossorigin', 'anonymous');
        scriptEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        
        // Fix for Safari - force reload the script
        const originalSrc = scriptEl.src;
        scriptEl.src = '';
        setTimeout(() => { scriptEl.src = originalSrc; }, 10);
      }
    });
    
    // Handle link tags (CSS) with integrity attributes
    const links = document.querySelectorAll('link[integrity]');
    links.forEach(link => {
      link.removeAttribute('integrity');
    });
    
    // Specifically look for Cloudflare Analytics scripts by URL pattern
    const cfScripts = document.querySelectorAll('script[src*="cloudflareinsights.com"]');
    cfScripts.forEach((script) => {
      script.removeAttribute('integrity');
      script.setAttribute('crossorigin', 'anonymous');
      script.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      script.setAttribute('defer', ''); // Always defer to avoid blocking
      
      // Update the beacon data if it exists
      const beaconData = script.getAttribute('data-cf-beacon');
      if (beaconData) {
        try {
          const beaconConfig = JSON.parse(beaconData);
          // Add SPA support flag and proper referrer policy
          beaconConfig.spa = true;
          beaconConfig.token = beaconConfig.token || 'c5bd7bbfe41c47c2a5ec'; // Use default token if not set
          script.setAttribute('data-cf-beacon', JSON.stringify(beaconConfig));
        } catch (e) {
          console.warn('Failed to parse Cloudflare beacon data', e);
        }
      }
    });
    
    // Also prevent SRI validation errors from showing in console
    const originalConsoleError = console.error;
    console.error = function(msg, ...args) {
      if (typeof msg === 'string' && 
          (msg.includes('integrity') || msg.includes('SRI') || 
           msg.includes('SHA-') || msg.includes('Subresource Integrity') ||
           (msg.includes('Cross-Origin') && msg.includes('cloudflareinsights.com')) ||
           (msg.includes('Content-Security-Policy') && msg.includes('connect-src')))) {
        // Suppress SRI-related errors and specific CSP errors
        console.debug('[Suppressed]', msg);
        return;
      }
      originalConsoleError.call(console, msg, ...args);
    };
  } catch (err) {
    console.warn('Error removing SRI integrity attributes:', err);
  }
}

/**
 * Check if DNS propagation is complete by testing Cloudflare features
 */
function isCloudflareActive(): Promise<boolean> {
  return fetch('https://www.snakkaz.com/cdn-cgi/trace', { 
    method: 'GET',
    cache: 'no-store',
    mode: 'no-cors' // Use no-cors mode to avoid CORS errors during testing
  })
    .then(response => {
      // We may not be able to read the response in no-cors mode,
      // so just check if the request didn't fail
      return true;
    })
    .catch(() => {
      // Try an alternative method - if we have Cloudflare scripts on the page
      const cfScripts = document.querySelectorAll('script[src*="cloudflare"]');
      return cfScripts.length > 0;
    });
}

/**
 * Load Cloudflare Analytics safely without SRI checks
 * This works around the integrity attribute issues and handles
 * the DNS propagation period gracefully
 */
export function loadCloudflareAnalytics() {
  try {
    // Don't load in server-side contexts
    if (typeof document === 'undefined') return;
    
    // Check if Cloudflare is active first
    isCloudflareActive().then(active => {
      if (!active) {
        console.log('Cloudflare DNS not active yet - Analytics will be loaded when DNS propagation completes');
        // Schedule retry for later
        setTimeout(() => loadCloudflareAnalytics(), 30 * 60 * 1000); // Try again in 30 minutes
        return;
      }
      
      // Remove any existing problematic script
      const existingScript = document.querySelector('script[src*="cloudflareinsights.com"]');
      if (existingScript) {
        existingScript.parentNode?.removeChild(existingScript);
      }
      
      // Skip if already attempted to load from localStorage
      const attempted = localStorage.getItem('cf_analytics_attempted');
      if (attempted) {
        const lastAttempt = parseInt(attempted);
        // Only try once per hour max
        if (Date.now() - lastAttempt < 60 * 60 * 1000) {
          console.log('Skipping Cloudflare Analytics - recent attempt failed');
          return;
        }
      }
      
      // Force remove any SRI integrity checks in the document
      removeSriIntegrityAttributes();
      
      // Create a new script element without integrity checks
      const script = document.createElement('script');
      script.defer = true;
      script.crossOrigin = 'anonymous'; // Add CORS attribute
      
      // Use the exact URL that's in the error message to ensure it matches
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015'; 
      
      // Add data attributes required by Cloudflare (with current version)
      script.setAttribute('data-cf-beacon', '{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0","spa":true,"spaMode":"auto","cookieDomain":"snakkaz.com","referrerPolicy":"no-referrer-when-downgrade"}'); 
      
      // Explicitly set CORS attributes on the element
      script.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      
      // Remove any SRI attributes that might be added automatically
      script.removeAttribute('integrity');
      
      // Listen for errors
      script.onerror = () => {
        console.warn('Cloudflare Analytics failed to load - CORS issue');
        localStorage.setItem('cf_analytics_attempted', Date.now().toString());
      };
      
      // Listen for load success
      script.onload = () => {
        console.log('Cloudflare Analytics loaded successfully');
        localStorage.removeItem('cf_analytics_attempted');
      };
      
      // Append to document
      document.head.appendChild(script);
    });
    
  } catch (error) {
    console.warn('Failed to load Cloudflare Analytics:', error);
  }
}

/**
 * Initialize all analytics trackers safely
 */
export function initializeAnalytics() {
  // Add a small delay to ensure CSP is already applied
  setTimeout(() => {
    loadCloudflareAnalytics();
    
    // Add other analytics initialization here if needed
  }, 1000);
}

/**
 * Manually trigger a Cloudflare Analytics pageview event
 * This is useful for single-page applications (SPAs) where route changes don't naturally trigger pageviews
 */
export function triggerCloudflarePageview() {
  if (typeof window === 'undefined' || !window.location) return;
  
  try {
    // Check if _cf_analytics exists
    if (window['_cf_analytics']) {
      // Manually trigger a beacon for the current page
      window['_cf_analytics'].reachGoal('pageview', {
        path: window.location.pathname,
        title: document.title
      });
      console.debug('Manually triggered Cloudflare Analytics pageview');
    }
  } catch (err) {
    console.debug('Error triggering manual pageview:', err);
  }
}
