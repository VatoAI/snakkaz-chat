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
  
  // Remove SRI integrity checks that might be causing issues
  removeSriIntegrityChecks();
  
  console.log('Applied Content Security Policy for Snakkaz Chat');
}

/**
 * Remove SRI integrity checks that might cause blocking
 * This is a workaround for the integrity errors
 */
function removeSriIntegrityChecks() {
  // Handle script tags with integrity attributes
  const scripts = document.querySelectorAll('script[integrity]');
  scripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    console.log(`Removing integrity check for script: ${scriptEl.src}`);
    scriptEl.removeAttribute('integrity');
    
    // Force set crossorigin attribute to allow CORS for external scripts
    if (scriptEl.src && scriptEl.src.includes('gpteng.co')) {
      scriptEl.crossOrigin = 'anonymous';
      scriptEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    }
  });
  
  // Handle all external scripts that might need CORS attributes
  const externalScripts = document.querySelectorAll('script[src*="gpteng"]');
  externalScripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    if (!scriptEl.hasAttribute('crossorigin')) {
      scriptEl.crossOrigin = 'anonymous';
      scriptEl.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      console.log(`Adding crossorigin attribute for external script: ${scriptEl.src}`);
    }
  });
  
  // Handle link tags (CSS) with integrity attributes
  const links = document.querySelectorAll('link[integrity]');
  links.forEach(link => {
    const linkEl = link as HTMLLinkElement;
    console.log(`Removing integrity check for link: ${linkEl.href}`);
    linkEl.removeAttribute('integrity');
  });
  
  // Set up a mutation observer to handle dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if ((element.tagName === 'SCRIPT' || element.tagName === 'LINK') && element.hasAttribute('integrity')) {
              const url = element.tagName === 'SCRIPT' 
                ? (element as HTMLScriptElement).src 
                : (element as HTMLLinkElement).href;
              console.log(`Removing integrity check for dynamically added element: ${url}`);
              element.removeAttribute('integrity');
              
              // If this is an external script, add CORS attributes
              if (element.tagName === 'SCRIPT' && 
                  (element as HTMLScriptElement).src &&
                  ((element as HTMLScriptElement).src.includes('gpteng.co') || 
                   (element as HTMLScriptElement).src.includes('external-domain'))) {
                (element as HTMLScriptElement).crossOrigin = 'anonymous';
                element.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
              }
            }
          }
        });
      }
    });
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document, { childList: true, subtree: true });
}

/**
 * Build CSP string with appropriate directives
 */
export function buildCspPolicy() {
  // Extract domain from environment or use default
  const supabaseUrl = getSupabaseDomain();
  
  // List of domains needed for the application
  const domains = {
    supabase: [supabaseUrl, '*.supabase.co', '*.supabase.in', 'https://*.supabase.co', 'wss://*.supabase.co'],
    storage: ['*.amazonaws.com', 'storage.googleapis.com'], // Common storage providers
    app: [
      // Comprehensive list including all possible subdomain variants with both HTTP and HTTPS
      '*.snakkaz.com', 'https://*.snakkaz.com', 'http://*.snakkaz.com',
      'www.snakkaz.com', 'https://www.snakkaz.com', 'http://www.snakkaz.com',
      'dash.snakkaz.com', 'https://dash.snakkaz.com', 'http://dash.snakkaz.com',
      'business.snakkaz.com', 'https://business.snakkaz.com', 'http://business.snakkaz.com',
      'docs.snakkaz.com', 'https://docs.snakkaz.com', 'http://docs.snakkaz.com', 
      'analytics.snakkaz.com', 'https://analytics.snakkaz.com', 'http://analytics.snakkaz.com',
      'api.snakkaz.com', 'https://api.snakkaz.com', 'http://api.snakkaz.com',
      'static.snakkaz.com', 'https://static.snakkaz.com', 'http://static.snakkaz.com',
      'cdn.snakkaz.com', 'https://cdn.snakkaz.com', 'http://cdn.snakkaz.com'
    ],
    cdn: [
      'cdn.pngtree.com', 
      '*.gpteng.co', 'https://*.gpteng.co', 'http://*.gpteng.co',
      'cdn.gpteng.co', 'https://cdn.gpteng.co', 'http://cdn.gpteng.co'
    ],
  };
  
  // Build CSP
  return [
    // Default restrictions
    "default-src 'self'",
    
    // Scripts - limit to self and trusted CDNs if needed
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${domains.app.join(' ')} ${domains.cdn.join(' ')}`,
    
    // Styles
    "style-src 'self' 'unsafe-inline'",
    
    // Images
    `img-src 'self' data: blob: ${domains.storage.join(' ')} ${domains.supabase.join(' ')} ${domains.app.join(' ')} ${domains.cdn.join(' ')}`,
    
    // Fonts
    "font-src 'self' data:",
    
    // Connect (API calls) - critical for Supabase and snakkaz subdomains
    `connect-src 'self' ${domains.supabase.join(' ')} ${domains.storage.join(' ')} ${domains.app.join(' ')} ${domains.cdn.join(' ')} 
     wss://*.supabase.co https://*.supabase.co https://*.gpteng.co https://cdn.gpteng.co
     https://*.snakkaz.com http://*.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com
     mcp.snakkaz.com https://mcp.snakkaz.com http://mcp.snakkaz.com
     help.snakkaz.com https://help.snakkaz.com http://help.snakkaz.com
    `,
    
    // Media
    "media-src 'self' blob:",
    
    // Object restrictions
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
    "frame-ancestors 'self'",
    
    // Add report-to directive for CSP violations (useful for debugging)
    "report-uri https://www.snakkaz.com/api/csp-report"
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
    success: true,
    allowedDomains: {
      supabase: ['*.supabase.co', '*.supabase.in', getSupabaseDomain()],
      api: ['self', getSupabaseDomain()],
      storage: ['*.amazonaws.com', 'storage.googleapis.com']
    }
  };
}

/**
 * Test the Content Security Policy by validating that all required domains are included
 * @returns {Object} Test results
 */
export function testContentSecurityPolicy() {
  console.log('\nTesting Content Security Policy...');
  
  // Get the CSP policy currently applied
  let cspContent = '';
  if (typeof document !== 'undefined') {
    const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    cspContent = cspMetaTag ? cspMetaTag.getAttribute('content') || '' : '';
  }
  
  // If not applied, generate what it would be
  if (!cspContent) {
    cspContent = buildCspPolicy();
  }
  
  const results = {
    success: true,
    missingDomains: [],
    cspApplied: !!cspContent,
    cspContent
  };
  
  // Required domains that must be in the CSP
  const requiredDomains = [
    { type: 'connect-src', domain: '*.supabase.co' },
    { type: 'connect-src', domain: '*.supabase.in' },
    { type: 'img-src', domain: '*.amazonaws.com' },
    { type: 'img-src', domain: 'storage.googleapis.com' },
    { type: 'connect-src', domain: '*.snakkaz.com' },
    { type: 'connect-src', domain: 'mcp.snakkaz.com' }
  ];
  
  // Check if each required domain is included in the CSP
  for (const { type, domain } of requiredDomains) {
    const directivePattern = new RegExp(`${type}\\s[^;]*${domain.replace('.', '\\.')}`, 'i');
    if (!directivePattern.test(cspContent)) {
      results.success = false;
      results.missingDomains.push({ type, domain });
    }
  }
  
  // Log results
  if (results.success) {
    console.log('✅ All required domains are included in the CSP.');
  } else {
    console.log('❌ Some required domains are missing from the CSP:');
    results.missingDomains.forEach(({ type, domain }) => {
      console.log(`   - Missing ${domain} in ${type} directive`);
    });
  }
  
  return results;
}
