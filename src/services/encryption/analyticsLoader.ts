/**
 * Analytics Loader
 * 
 * This module provides a more robust way to load analytics scripts
 * that might be blocked by CSP or have integrity check issues.
 */

/**
 * Load Cloudflare Analytics safely without SRI checks
 * This works around the integrity attribute issues
 */
export function loadCloudflareAnalytics() {
  try {
    // Don't load in server-side contexts
    if (typeof document === 'undefined') return;
    
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
    
    // Create a new script element without integrity checks
    const script = document.createElement('script');
    script.defer = true;
    script.crossOrigin = 'anonymous'; // Add CORS attribute
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    
    // Add data attributes required by Cloudflare
    script.setAttribute('data-cf-beacon', '{"token": "c5bd7bbfe41c47c2a5ec","version":"2022.4.0"}'); 
    
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
