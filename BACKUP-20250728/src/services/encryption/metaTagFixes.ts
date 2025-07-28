/**
 * Meta Tag Fixes
 * 
 * This module fixes various meta tag issues and warnings
 * that might appear in the browser console.
 * 
 * Updated: May 14, 2025 - Updated to remove Cloudflare dependencies
 * and ensure all Snakkaz subdomains are properly included.
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
  } else if (!appleCapableTag && !document.querySelector('meta[name="mobile-web-app-capable"]')) {
    // Add both tags if neither exists
    const appleTag = document.createElement('meta');
    appleTag.setAttribute('name', 'apple-mobile-web-app-capable');
    appleTag.setAttribute('content', 'yes');
    document.head.appendChild(appleTag);
    
    const mobileTag = document.createElement('meta');
    mobileTag.setAttribute('name', 'mobile-web-app-capable');
    mobileTag.setAttribute('content', 'yes');
    document.head.appendChild(mobileTag);
    console.log('Added both mobile-web-app-capable meta tags');
  }
  
  // Add CORS meta tag to help with some third-party resources
  if (!document.querySelector('meta[name="crossorigin"]')) {
    const corsTag = document.createElement('meta');
    corsTag.setAttribute('name', 'crossorigin');
    corsTag.setAttribute('content', 'anonymous');
    document.head.appendChild(corsTag);
  }
  
  // Fix Content-Security-Policy meta tag if it exists but doesn't include new subdomains
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspTag) {
    const cspContent = cspTag.getAttribute('content') || '';
    
    if (!cspContent.includes('mcp.snakkaz.com') || !cspContent.includes('help.snakkaz.com')) {
      try {
        // Add missing Snakkaz subdomains to connect-src
        const newCspContent = cspContent.replace(
          /(connect-src\s+[^;]+)/, 
          '$1 mcp.snakkaz.com https://mcp.snakkaz.com help.snakkaz.com https://help.snakkaz.com'
        );
        
        // Only update if it actually changed
        if (newCspContent !== cspContent) {
          cspTag.setAttribute('content', newCspContent);
          console.log('Updated CSP meta tag to include all Snakkaz subdomains');
        }
      } catch (error) {
        console.warn('Failed to update CSP meta tag:', error);
      }
    }
  }
}
