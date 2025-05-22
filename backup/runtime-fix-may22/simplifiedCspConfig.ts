/**
 * CSP Configuration - Production Hardened Version
 * 
 * May 22, 2025 - Fixed for production runtime errors
 */

/**
 * Apply the Content Security Policy to the document
 */
export function applyCspPolicy(): void {
  try {
    // Skip if no document (server-side rendering)
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    
    // First, remove all existing CSP meta tags to avoid conflicts
    document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(tag => {
      tag.remove();
    });
    
    // Create and set a new CSP meta tag with production-friendly settings
    const cspContent = buildCspPolicy();
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspContent;
    
    // Add to head
    document.head.appendChild(meta);
  } catch (error) {
    // Silently fail in production to prevent crashes
    if (import.meta.env.DEV) {
      console.error('Failed to apply CSP policy:', error);
    }
  }
}

/**
 * Build a production-safe CSP string
 * This is deliberately more permissive to avoid blocking resources
 */
function buildCspPolicy(): string {
  // Production-friendly CSP policies
  const policy = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.gpteng.co", "*.snakkaz.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:", "*.amazonaws.com", "storage.googleapis.com", 
               "*.supabase.co", "*.supabase.in", "*.snakkaz.com"],
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
  // Skip if no document (server-side rendering)
  if (typeof document === 'undefined') {
    return;
  }
  
  try {
    // Find any CSP meta tags
    const cspMetaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    if (cspMetaTags.length > 0) {
      // Remove all CSP tags - we'll create a new one in applyCspPolicy
      cspMetaTags.forEach(tag => {
        tag.remove();
      });
    }
  } catch (error) {
    // Silent fail
  }
}
