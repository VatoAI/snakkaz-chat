/**
 * Content Security Policy (CSP) Configuration
 * 
 * This utility provides a CSP configuration that allows Supabase and other required
 * resources while maintaining security best practices.
 * 
 * HOW TO USE:
 * 1. Import this module in your main entry file (e.g., index.js, _app.js)
 * 2. Call applyCspPolicy() early in your application initialization
 */

/**
 * Apply CSP to document head via meta tag for development
 * In production, you should configure CSP via server headers
 */
export function applyCspPolicy() {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Skip if CSP is already defined
  if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) return;
  
  // Define a secure CSP that allows Supabase connections
  const cspContent = buildCspPolicy();
  
  // Apply CSP via meta tag
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = 'Content-Security-Policy';
  metaTag.content = cspContent;
  document.head.appendChild(metaTag);
  
  console.log('Applied Content Security Policy for Snakkaz Chat');
}

/**
 * Build CSP string with appropriate directives
 */
export function buildCspPolicy() {
  // Extract domain from environment or use default
  const supabaseUrl = getSupabaseDomain();
  
  // List of domains needed for the application
  const domains = {
    supabase: [supabaseUrl, '*.supabase.co', '*.supabase.in'],
    storage: ['*.amazonaws.com', 'storage.googleapis.com'], // Common storage providers
  };
  
  // Build CSP
  return [
    // Default restrictions
    "default-src 'self'",
    
    // Scripts - limit to self and trusted CDNs if needed
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Consider removing unsafe-* in production
    
    // Styles
    "style-src 'self' 'unsafe-inline'",
    
    // Images
    `img-src 'self' data: blob: ${domains.storage.join(' ')} ${domains.supabase.join(' ')}`,
    
    // Fonts
    "font-src 'self' data:",
    
    // Connect (API calls) - critical for Supabase
    `connect-src 'self' ${domains.supabase.join(' ')} ${domains.storage.join(' ')} wss://*.supabase.co`,
    
    // Media
    "media-src 'self' blob:",
    
    // Object/embed restrictions
    "object-src 'none'",
    
    // Frame restrictions
    "frame-src 'self'",
    
    // Worker restrictions
    "worker-src 'self' blob:",
    
    // Form submissions
    "form-action 'self'",
    
    // Base URI restriction
    "base-uri 'self'",
    
    // Frame ancestors (prevents clickjacking)
    "frame-ancestors 'self'"
  ].join('; ');
}

/**
 * Get Supabase domain from environment variables or defaults
 */
function getSupabaseDomain() {
  // Try to extract from environment
  const envUrl = typeof window !== 'undefined' && 
    window['env'] && 
    window['env'].SUPABASE_URL;
    
  if (envUrl) {
    try {
      const url = new URL(envUrl);
      return url.hostname;
    } catch (e) {
      console.warn('Invalid Supabase URL format in environment variables');
    }
  }
  
  // Default to wildcard
  return '*.supabase.co';
}

// Export a testing function
export function testCsp() {
  console.log('CSP Policy:', buildCspPolicy());
  
  // Return domains that will be allowed by the policy
  return {
    allowedDomains: {
      supabase: ['*.supabase.co', '*.supabase.in', getSupabaseDomain()],
      api: ['self', getSupabaseDomain()],
      storage: ['*.amazonaws.com', 'storage.googleapis.com']
    }
  };
}
