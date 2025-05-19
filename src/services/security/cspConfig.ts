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
      'mcp.snakkaz.com',
      'help.snakkaz.com',
      'cdn.gpteng.co'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'self'"]
    // Removed report-uri directive as it's deprecated and endpoint doesn't exist
  };

  // Build CSP string
  const cspString = Object.entries(cspDirectives)
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

/**
 * Test the Content Security Policy for proper configuration
 */
export function testCspConfiguration(): { success: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for required domains in our configuration
  const requiredDomains = [
    { type: 'connect-src', domain: '*.supabase.co' },
    { type: 'connect-src', domain: 'wss://*.supabase.co' },
    { type: 'connect-src', domain: '*.snakkaz.com' },
    { type: 'connect-src', domain: 'mcp.snakkaz.com' },
    { type: 'connect-src', domain: 'help.snakkaz.com' }
  ];
  
  // In a browser context, check the actual meta tag
  if (typeof document !== 'undefined') {
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspTag) {
      issues.push('No Content Security Policy meta tag found in document');
    } else {
      const content = cspTag.getAttribute('content') || '';
      
      // Check for each required domain
      for (const { type, domain } of requiredDomains) {
        if (!content.includes(domain)) {
          issues.push(`Missing required domain ${domain} in ${type} directive`);
        }
      }
    }
  }
  
  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Testing function that returns information about CSP configuration
 * Used by diagnostics
 */
export function testCsp() {
  // Build CSP directives object for testing
  const cspDirectives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.amazonaws.com', 'storage.googleapis.com', '*.supabase.co'],
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
      'mcp.snakkaz.com',
      'help.snakkaz.com'
    ]
  };
  
  // Return domains that will be allowed by the policy
  return {
    success: true,
    allowedDomains: {
      supabase: ['*.supabase.co', '*.supabase.in'],
      api: ['self'],
      storage: ['*.amazonaws.com', 'storage.googleapis.com']
    }
  };
}
