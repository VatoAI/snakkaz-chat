/**
 * Meta Tag Fixes
 * 
 * This module fixes various meta tag issues and warnings
 * that might appear in the browser console.
 */

/**
 * Fix deprecated meta tags with modern alternatives
 */
export function fixDeprecatedMetaTags() {
  // Don't run in server environment
  if (typeof document === 'undefined') return;
  
  // Fix apple-mobile-web-app-capable
  const appleCapableTag = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  if (appleCapableTag && !document.querySelector('meta[name="mobile-web-app-capable"]')) {
    const mobileCapableTag = document.createElement('meta');
    mobileCapableTag.setAttribute('name', 'mobile-web-app-capable');
    mobileCapableTag.setAttribute('content', appleCapableTag.getAttribute('content') || 'yes');
    document.head.appendChild(mobileCapableTag);
    console.log('Added mobile-web-app-capable meta tag');
  }
  
  // Add CORS meta tag to help with some third-party resources
  if (!document.querySelector('meta[name="crossorigin"]')) {
    const corsTag = document.createElement('meta');
    corsTag.setAttribute('name', 'crossorigin');
    corsTag.setAttribute('content', 'anonymous');
    document.head.appendChild(corsTag);
  }
  
  // Fix Content-Security-Policy meta tag if it exists but doesn't include cloudflareinsights
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspTag) {
    const cspContent = cspTag.getAttribute('content') || '';
    
    if (!cspContent.includes('cloudflareinsights.com')) {
      try {
        // Add cloudflareinsights.com to connect-src if it's missing
        const newCspContent = cspContent.replace(
          /(connect-src\s+[^;]+)/, 
          '$1 https://static.cloudflareinsights.com'
        );
        
        // Only update if it actually changed
        if (newCspContent !== cspContent) {
          cspTag.setAttribute('content', newCspContent);
          console.log('Updated CSP meta tag to include Cloudflare Insights');
        }
      } catch (error) {
        console.warn('Failed to update CSP meta tag:', error);
      }
    }
  }
}
