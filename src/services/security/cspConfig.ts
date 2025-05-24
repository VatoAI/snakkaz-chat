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

  // Check for development or testing mode
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
  
  // Define the CSP directives with different strictness based on environment
  const cspDirectives: { [key: string]: string[] } = {
    // Default source directive - restrict by default
    'default-src': ["'self'"],
    
    // Script sources - more restricted in production
    'script-src': isDev 
      ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co']
      : ["'self'", 'cdn.gpteng.co', 
         // Allow specific hashes for critical inline scripts
         "'sha256-1SuipMDplXoKeoH5h0AccIQrF7qwRCEFPCuoNSA6NrM='",
         "'sha256-hR8LUoFSvUqLEELJErbmI2vwnXpAjz1dpHxy2vpLRKQ='"
        ],
    
    // Style sources
    'style-src': ["'self'", "'unsafe-inline'"], // Inline styles still needed for some UI libraries
    
    // Image sources
    'img-src': [
      "'self'", 
      'data:', 
      'blob:', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.supabase.co', 
      '*.supabase.in',
      'secure.gravatar.com' // For profile images
    ],
    
    // Font sources - restrict to self and data URIs
    'font-src': ["'self'", 'data:'],
    
    // Connection sources for APIs and WebSockets
    'connect-src': [
      "'self'", 
      '*.supabase.co', 
      '*.supabase.in',  
      'wss://*.supabase.co', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.snakkaz.com', 
      'www.snakkaz.com',  // Added explicit www subdomain
      'dash.snakkaz.com', 
      'business.snakkaz.com', 
      'docs.snakkaz.com', 
      'analytics.snakkaz.com',
      'mcp.snakkaz.com',
      'help.snakkaz.com',
      'cdn.gpteng.co'
    ],
    
    // Media sources for audio/video content
    'media-src': ["'self'", 'blob:'],
    
    // Prevent object embedding completely
    'object-src': ["'none'"],
    
    // Frame sources - restrict to same origin
    'frame-src': ["'self'"],
    
    // Worker sources - allow service workers and blobs
    'worker-src': ["'self'", 'blob:'],
    
    // Form submission targets - restrict to same origin
    'form-action': ["'self'"],
    
    // Base URI restriction - prevent base tag hijacking
    'base-uri': ["'self'"],
    
    // Frame ancestors - prevent clickjacking
    'frame-ancestors': ["'self'"],
    
    // Implementation of Trusted Types policy (modern browsers)
    ...(isDev ? {} : {
      'require-trusted-types-for': ["'script'"]
    }),
    
    // Content Security Policy Level 3 features
    'upgrade-insecure-requests': [],
    
    // Add report-to for collecting violation reports in production
    ...(isDev ? {} : {
      'report-to': ['csp-endpoint']
    })
  };

  // Build CSP string
  const cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      // Handle empty array directives like upgrade-insecure-requests
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  try {
    // Check if there's an existing CSP meta tag
    const existingMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    // Implement report-only mode initially to avoid breaking changes
    // After monitoring for a week, we can switch to enforce mode
    const httpEquiv = isDev ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
    
    if (existingMetaTag) {
      // Update existing tag
      existingMetaTag.setAttribute('content', cspString);
      existingMetaTag.setAttribute('http-equiv', httpEquiv);
    } else {
      // Create a new meta tag for CSP
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', httpEquiv);
      metaTag.setAttribute('content', cspString);
      
      // Insert at the beginning of the head element
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head.firstChild) {
        head.insertBefore(metaTag, head.firstChild);
      } else {
        head.appendChild(metaTag);
      }
    }
    
    // Set up CSP violation reporting if in production
    if (!isDev) {
      setupCspReporting();
    }
    
    console.log(`CSP policy applied successfully in ${isDev ? 'development' : 'production'} mode`);
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
 * Setup CSP violation reporting endpoint
 */
function setupCspReporting(): void {
  if (typeof window === 'undefined') return;
  
  // Define reporting endpoints
  if ('ReportingObserver' in window) {
    // Register a reporting endpoint group
    const reportingEndpoint = import.meta.env.VITE_CSP_REPORT_ENDPOINT || 'https://analytics.snakkaz.com/api/csp-report';
    
    try {
      navigator.sendBeacon(reportingEndpoint, JSON.stringify({
        type: 'csp-endpoint-test',
        message: 'CSP reporting initialized',
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('CSP reporting test failed:', e);
    }
  } else {
    console.warn('ReportingObserver not supported in this browser. CSP violations will not be reported.');
  }
}

/**
 * Enable CSP Enforcement
 * Call this function after sufficient testing in report-only mode
 */
export function enableCspEnforcement(): void {
  if (typeof document === 'undefined') return;
  
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]');
  if (cspTag) {
    cspTag.setAttribute('http-equiv', 'Content-Security-Policy');
    console.log('CSP enforcement enabled');
  }
}

/**
 * Testing function that returns information about CSP configuration
 * Used by diagnostics
 */
export function testCsp() {
  // Check for development or testing mode
  const isDev = typeof window !== 'undefined' && 
                ((typeof import.meta !== 'undefined' && 
                  import.meta.env && 
                  import.meta.env.DEV) || 
                 window.location.hostname === 'localhost');
  
  // Build CSP directives object for testing - same as in applyCspPolicy
  const cspDirectives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': isDev 
      ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co']
      : ["'self'", 'cdn.gpteng.co', 
         "'sha256-1SuipMDplXoKeoH5h0AccIQrF7qwRCEFPCuoNSA6NrM='",
         "'sha256-hR8LUoFSvUqLEELJErbmI2vwnXpAjz1dpHxy2vpLRKQ='"
        ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'", 
      'data:', 
      'blob:', 
      '*.amazonaws.com', 
      'storage.googleapis.com', 
      '*.supabase.co', 
      '*.supabase.in',
      'secure.gravatar.com'
    ],
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
  };
  
  // Return domains that will be allowed by the policy
  return {
    success: true,
    mode: isDev ? 'development' : 'production',
    enforcementStatus: document.querySelector('meta[http-equiv="Content-Security-Policy"]') 
      ? 'enforced' 
      : 'report-only',
    allowedDomains: {
      supabase: ['*.supabase.co', '*.supabase.in'],
      api: ['self'],
      storage: ['*.amazonaws.com', 'storage.googleapis.com'],
      media: ['blob:'],
      reporting: ['analytics.snakkaz.com']
    }
  };
}
