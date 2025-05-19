/**
 * CSP Configuration - Simplified for stability
 * 
 * This file configures the Content Security Policy for the Snakkaz Chat application.
 * The configuration is designed to be secure while minimizing runtime errors.
 */

/**
 * Apply the Content Security Policy to the document
 */
export function applyCspPolicy(): void {
  try {
    // Skip if no document or window (server-side rendering)
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    
    // Only apply CSP if not already set
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCsp) {
      // CSP already exists in the HTML, don't duplicate
      console.log('Using existing CSP from HTML meta tag');
      return;
    }
    
    // Create and set the CSP meta tag
    const cspContent = buildCspPolicy();
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspContent;
    
    // Add to head
    document.head.appendChild(meta);
    console.log('CSP policy applied dynamically');
  } catch (error) {
    console.error('Failed to apply CSP policy:', error);
  }
}

/**
 * Build a secure but permissive CSP string
 */
function buildCspPolicy(): string {
  // Basic secure defaults
  const policy = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.gpteng.co"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:", "*.amazonaws.com", "storage.googleapis.com", "*.supabase.co", "*.supabase.in"],
    'font-src': ["'self'", "data:"],
    'connect-src': [
      "'self'", 
      "*.supabase.co", 
      "*.supabase.in", 
      "wss://*.supabase.co", 
      "*.amazonaws.com", 
      "storage.googleapis.com", 
      "*.snakkaz.com", 
      "cdn.gpteng.co"
    ],
    'media-src': ["'self'", "blob:"],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", "blob:"]
  };
  
  // Convert policy object to CSP string
  return Object.entries(policy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Apply emergency fixes for CSP-related issues
 */
export function applyCspEmergencyFixes(): void {
  try {
    // Find any duplicate CSP meta tags
    const cspMetaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    if (cspMetaTags.length > 1) {
      // Keep only the first one
      for (let i = 1; i < cspMetaTags.length; i++) {
        cspMetaTags[i].remove();
      }
      console.log('Removed duplicate CSP meta tags');
    }
    
    // Fix legacy report-uri directives
    cspMetaTags.forEach(tag => {
      const content = tag.getAttribute('content');
      if (content && content.includes('report-uri')) {
        // Replace report-uri with report-to
        const newContent = content.replace(/report-uri[^;]+;?/g, '');
        tag.setAttribute('content', newContent);
        console.log('Removed deprecated report-uri directive');
      }
    });
  } catch (error) {
    console.error('Failed to apply CSP emergency fixes:', error);
  }
}
