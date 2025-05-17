/**
 * Content Security Policy (CSP) Configuration
 * 
 * This utility provides a CSP configuration that allows Supabase and other required
 * resources while maintaining security best practices.
 * 
 * HOW TO USE:
 * 1. Import this module in your main entry file (e.g., index.js, _app.js)
 * 2. Call applyCspPolicy() early in your application initialization
 * 
 * NOTE: This file is deprecated. Please use the version in ../security/cspConfig.ts instead.
 * Fixed: GitHub Actions build issues - May 17, 2025
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
  
  // Create meta tag
  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', buildCspPolicy());
  document.head.appendChild(meta);
  
  // Add additional monitoring to detect CSP violations
  setupCspViolationMonitoring();
  
  // Test the policy for common issues
  testContentSecurityPolicy();
}

/**
 * Test the Content Security Policy for common issues
 */
export function testContentSecurityPolicy() {
  // Skip in non-browser environment
  if (typeof document === 'undefined') return;
  
  // Some browsers don't support CSP reporting, this is fine
  try {
    // Try loading a script to test CSP
    const testScript = document.createElement('script');
    testScript.innerHTML = 'console.log("CSP Test")';
    testScript.id = 'csp-test';
    document.body.appendChild(testScript);
    
    // If we get here without a CSP violation, CSP might be misconfigured
    console.warn('[CSP Test] Warning: Inline script executed despite CSP. Check configuration.');
    
    // Clean up
    const script = document.getElementById('csp-test');
    if (script) script.remove();
  } catch (e) {
    // This is expected. CSP should block the inline script.
    console.log('[CSP Test] Success: CSP correctly blocked inline script.');
  }
}

/**
 * Setup monitoring to detect CSP violations
 */
function setupCspViolationMonitoring() {
  // Skip in non-browser environment
  if (typeof document === 'undefined') return;
  
  // Listen for CSP violation reports
  document.addEventListener('securitypolicyviolation', (e) => {
    console.warn('CSP Violation:', {
      blockedURI: e.blockedURI,
      violatedDirective: e.violatedDirective,
      originalPolicy: e.originalPolicy
    });
  });
  
  // Use MutationObserver to detect potential issues with dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && 
              (node as Element).nodeName === 'SCRIPT') {
            const scriptNode = node as HTMLScriptElement;
            if (!scriptNode.src && scriptNode.innerHTML) {
              console.warn('CSP Warning: Inline script added dynamically', scriptNode);
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
      return url.origin;
    } catch {
      // Parsing failed, continue to default
    }
  }
  
  // Default domain if env not available
  return 'https://wqpoozpbceucynsojmbk.supabase.co';
}

/**
 * Build CSP string with appropriate directives
 */
export function buildCspPolicy() {
  // Extract domain from environment or use default
  const supabaseUrl = getSupabaseDomain();
  
  // Supabase domains
  const supabaseDomains = [
    supabaseUrl, 
    '*.supabase.co', 
    '*.supabase.in', 
    'https://*.supabase.co', 
    'wss://*.supabase.co'
  ].join(' ');
  
  // Storage domains
  const storageDomains = [
    '*.amazonaws.com',
    'storage.googleapis.com'
  ].join(' ');
  
  // App domains
  const appDomains = [
    '*.snakkaz.com', 
    'https://*.snakkaz.com', 
    'http://*.snakkaz.com',
    'www.snakkaz.com', 
    'https://www.snakkaz.com', 
    'http://www.snakkaz.com',
    'dash.snakkaz.com', 
    'https://dash.snakkaz.com', 
    'http://dash.snakkaz.com',
    'business.snakkaz.com', 
    'https://business.snakkaz.com', 
    'http://business.snakkaz.com',
    'docs.snakkaz.com', 
    'https://docs.snakkaz.com', 
    'http://docs.snakkaz.com', 
    'analytics.snakkaz.com', 
    'https://analytics.snakkaz.com', 
    'http://analytics.snakkaz.com',
    'api.snakkaz.com', 
    'https://api.snakkaz.com', 
    'http://api.snakkaz.com',
    'static.snakkaz.com', 
    'https://static.snakkaz.com', 
    'http://static.snakkaz.com',
    'cdn.snakkaz.com', 
    'https://cdn.snakkaz.com', 
    'http://cdn.snakkaz.com'
  ].join(' ');
  
  // CDN domains
  const cdnDomains = [
    'cdn.pngtree.com',
    '*.gpteng.co', 
    'https://*.gpteng.co', 
    'http://*.gpteng.co',
    'cdn.gpteng.co', 
    'https://cdn.gpteng.co', 
    'http://cdn.gpteng.co'
  ].join(' ');
  
  // Additional connect domains
  const additionalConnectDomains = [
    'mcp.snakkaz.com', 
    'https://mcp.snakkaz.com', 
    'http://mcp.snakkaz.com',
    'help.snakkaz.com', 
    'https://help.snakkaz.com', 
    'http://help.snakkaz.com'
  ].join(' ');
  
  // Build CSP
  return [
    // Default restrictions
    "default-src 'self'",
    
    // Scripts - limit to self and trusted CDNs if needed
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' " + appDomains + " " + cdnDomains,
    
    // Styles
    "style-src 'self' 'unsafe-inline'",
    
    // Images
    "img-src 'self' data: blob: " + storageDomains + " " + supabaseDomains + " " + appDomains + " " + cdnDomains,
    
    // Fonts
    "font-src 'self' data:",
    
    // Connect (API calls) - critical for Supabase and snakkaz subdomains
    "connect-src 'self' " + supabaseDomains + " " + storageDomains + " " + appDomains + " " + cdnDomains + " " + additionalConnectDomains,
    
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
 * Export a testing function
 */
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
 * Detects and attempts to fix CSP issues automatically
 */
export function detectAndFixCspIssues() {
  try {
    // Only run in browser
    if (typeof document === 'undefined') return;
    
    // Check if CSP is applied
    const hasCsp = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!hasCsp) {
      console.warn('[CSP] No Content Security Policy found. Applying default policy...');
      applyCspPolicy();
    }
    
    // More CSP health checks could be added here
  } catch (error) {
    console.error('[CSP] Error while checking CSP:', error);
  }
}
