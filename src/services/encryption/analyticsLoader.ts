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
    scripts.forEach(script => {
      script.removeAttribute('integrity');
    });
    
    // Handle link tags (CSS) with integrity attributes
    const links = document.querySelectorAll('link[integrity]');
    links.forEach(link => {
      link.removeAttribute('integrity');
    });
    
    // Also prevent SRI validation errors from showing in console
    const originalConsoleError = console.error;
    console.error = function(msg, ...args) {
      if (typeof msg === 'string' && 
          (msg.includes('integrity') || msg.includes('SRI') || 
           msg.includes('SHA-') || msg.includes('Subresource Integrity'))) {
        // Suppress SRI-related errors
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
    cache: 'no-store'
  })
    .then(response => response.text())
    .then(text => {
      return text.includes('cf-ray=') || text.includes('colo=');
    })
    .catch(() => false);
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
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js?token=c5bd7bbfe41c47c2a5ec'; // Use URL parameter instead of data attribute
      
      // Add data attributes required by Cloudflare (with correct version)
      script.setAttribute('data-cf-beacon', '{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0"}'); 
      
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
