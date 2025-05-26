/**
 * CORS Configuration
 * 
 * Handles Cross-Origin Resource Sharing configuration and fixes.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Unblock requests that might be blocked by CORS
 */
export function unblockRequests(): void {
  // This function applies various fixes related to CORS issues
  // This is a simplified version that doesn't rely on Cloudflare
  
  // Only run in browser context
  if (typeof window === 'undefined') return;
  
  try {
    // Patch fetch for handling CORS errors more gracefully
    const originalFetch = window.fetch;
    
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      // Add missing CORS headers for our API endpoints
      if (init && 
          typeof input === 'string' && 
          (input.includes('snakkaz.com') || input.includes('supabase'))) {
        init = {
          ...init,
          credentials: 'include',
          mode: 'cors',
          headers: {
            ...(init.headers || {}),
            'Accept': '*/*',
          }
        };
      }
      
      return originalFetch(input, init).catch(error => {
        // Special handling for CORS errors
        if (error.message && error.message.includes('CORS')) {
          console.warn('CORS issue detected with request:', input);
          // Attempt to proxy the request through our own backend if it's a CORS issue
          if (typeof input === 'string' && !input.includes('snakkaz.com')) {
            const proxyUrl = `https://api.snakkaz.com/proxy?url=${encodeURIComponent(input)}`;
            return originalFetch(proxyUrl, init);
          }
        }
        
        // Re-throw the error if we can't handle it
        throw error;
      });
    };
    
    console.log('Applied CORS request unblocking');
  } catch (error) {
    console.error('Failed to apply CORS request unblocking:', error);
  }
}

/**
 * Fix CORS security issues
 * Removed Cloudflare specific code
 */
export function fixCorsSecurity(): void {
  try {
    // Add security headers to all outgoing XHR requests
    if (typeof XMLHttpRequest !== 'undefined') {
      const originalOpen = XMLHttpRequest.prototype.open;
      
      XMLHttpRequest.prototype.open = function(...args) {
        const result = originalOpen.apply(this, args as any);
        
        // Add security headers for our domains
        const url = args[1] as string;
        if (url.includes('snakkaz.com')) {
          this.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          this.setRequestHeader('X-Security-Headers', '1');
        }
        
        return result;
      };
    }
    
    console.log('Applied CORS security fixes');
  } catch (error) {
    console.error('Failed to apply CORS security fixes:', error);
  }
}
