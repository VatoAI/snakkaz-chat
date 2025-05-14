/**
 * CSP Configuration
 * 
 * Defines and applies Content Security Policy for the application.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Apply the configured CSP policy to the document
 */
export function applyCspPolicy(): void {
  // Skip if not in browser context
  if (typeof document === 'undefined') return;

  // Define the CSP directives
  const cspDirectives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.amazonaws.com', 'storage.googleapis.com', '*.supabase.co', '*.supabase.in'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'", 
      '*.supabase.co', 
      '*.supabase.in',  
      'wss://*.supabase.co', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.snakkaz.com', 
      'dash.snakkaz.com', 
      'business.snakkaz.com', 
      'docs.snakkaz.com', 
      'analytics.snakkaz.com',
      'cdn.gpteng.co',
      'https://cdn.gpteng.co'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:']
  };

  // Build CSP string
  let cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  try {
    // Check if there's an existing CSP meta tag
    const existingMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (existingMetaTag) {
      // Update existing tag
      existingMetaTag.setAttribute('content', cspString);
    } else {
      // Create a new meta tag for CSP
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Security-Policy';
      metaTag.content = cspString;
      
      // Insert at the beginning of the head element
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head.firstChild) {
        head.insertBefore(metaTag, head.firstChild);
      } else {
        head.appendChild(metaTag);
      }
    }
    
    console.log('CSP policy applied successfully');
  } catch (error) {
    console.error('Failed to apply CSP policy:', error);
  }
}
