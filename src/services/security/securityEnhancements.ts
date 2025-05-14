/**
 * Security Enhancements
 * 
 * Implements various security enhancements for the application.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Apply additional security enhancements
 */
export function applySecurityEnhancements(): void {
  // Skip if not in browser context
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    // Apply security enhancement functions
    preventClickjacking();
    applyContentTypeOptions();
    applyXSSProtection();
    applyReferrerPolicy();
    detectInSecureContext();
    
    console.log('Applied security enhancements');
  } catch (error) {
    console.error('Failed to apply security enhancements:', error);
  }
}

/**
 * Prevent clickjacking attacks by setting X-Frame-Options header
 */
function preventClickjacking(): void {
  try {
    // Create a style element to prevent framing
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent clickjacking */
      html { display: none; }
    `;
    document.head.appendChild(style);
    
    // Only display the page if it's not framed or is framed with permission
    if (self === top || isAllowedParentFrame()) {
      const htmlElement = document.getElementsByTagName('html')[0];
      htmlElement.style.display = 'block';
    } else {
      // Redirect to the actual page if framed without permission
      top!.location.href = self.location.href;
    }
  } catch (error) {
    // If we got an error, it might be because we can't access top due to CORS
    // In that case, we're likely being framed without permission
    console.warn('Possible clickjacking attempt detected');
  }
}

/**
 * Check if the parent frame is allowed to frame this page
 */
function isAllowedParentFrame(): boolean {
  try {
    // Check if parent is from the same origin or allowed domains
    const allowedDomains = ['snakkaz.com', 'dash.snakkaz.com', 'business.snakkaz.com'];
    
    const parentHost = new URL(parent.location.href).hostname;
    return allowedDomains.some(domain => parentHost.endsWith(domain));
  } catch (error) {
    // If we can't access parent location, assume it's not allowed
    return false;
  }
}

/**
 * Apply Content-Type options to prevent MIME type sniffing
 */
function applyContentTypeOptions(): void {
  // This would normally be handled by the server (X-Content-Type-Options: nosniff)
  // We can't set HTTP headers from the client, but we can check them
  
  // For resources loaded through fetch, we can set the right headers
  const originalFetch = window.fetch;
  
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Add content-type header for our own requests when appropriate
    if (init && typeof input === 'string' && input.includes('snakkaz.com')) {
      init = {
        ...init,
        headers: {
          ...(init.headers || {}),
          'X-Content-Type-Options': 'nosniff',
        }
      };
    }
    
    return originalFetch(input, init);
  };
}

/**
 * Apply XSS protection enhancements
 */
function applyXSSProtection(): void {
  // Modern browsers use CSP instead of X-XSS-Protection
  // But we can add some additional protections
  
  // Sanitize any dynamic content before insertion
  const originalSetInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')?.set;
  
  if (originalSetInnerHTML) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set(value: string) {
        // Only sanitize strings, not empty values
        if (typeof value === 'string' && value.trim()) {
          // Simple sanitization - replace script tags and other dangerous content
          value = value
            .replace(/<\s*script[^>]*>.*?<\/\s*script\s*>/gi, '')
            .replace(/<\s*script[^>]*>/gi, '')
            .replace(/<\s*iframe[^>]*>.*?<\/\s*iframe\s*>/gi, '')
            .replace(/javascript:/gi, 'blocked:')
            .replace(/data:/gi, 'blocked:')
            .replace(/on\w+(\s*=)/gi, 'blocked$1');
        }
        
        originalSetInnerHTML.call(this, value);
      }
    });
  }
  
  // Also secure innerHTML-like properties
  secureProperty('outerHTML');
  secureProperty('insertAdjacentHTML');
}

/**
 * Secure DOM properties that can inject HTML
 */
function secureProperty(prop: string): void {
  if (prop === 'insertAdjacentHTML') {
    // Special handling for insertAdjacentHTML
    const original = Element.prototype.insertAdjacentHTML;
    
    if (original) {
      Element.prototype.insertAdjacentHTML = function(position: InsertPosition, text: string): void {
        // Sanitize the HTML
        if (typeof text === 'string' && text.trim()) {
          text = text
            .replace(/<\s*script[^>]*>.*?<\/\s*script\s*>/gi, '')
            .replace(/<\s*script[^>]*>/gi, '')
            .replace(/<\s*iframe[^>]*>.*?<\/\s*iframe\s*>/gi, '')
            .replace(/javascript:/gi, 'blocked:')
            .replace(/data:/gi, 'blocked:')
            .replace(/on\w+(\s*=)/gi, 'blocked$1');
        }
        
        return original.call(this, position, text);
      };
    }
  } else {
    // For other properties like outerHTML
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, prop);
    
    if (descriptor && descriptor.set) {
      const originalSetter = descriptor.set;
      
      Object.defineProperty(Element.prototype, prop, {
        ...descriptor,
        set(value: string) {
          // Sanitize the HTML
          if (typeof value === 'string' && value.trim()) {
            value = value
              .replace(/<\s*script[^>]*>.*?<\/\s*script\s*>/gi, '')
              .replace(/<\s*script[^>]*>/gi, '')
              .replace(/<\s*iframe[^>]*>.*?<\/\s*iframe\s*>/gi, '')
              .replace(/javascript:/gi, 'blocked:')
              .replace(/data:/gi, 'blocked:')
              .replace(/on\w+(\s*=)/gi, 'blocked$1');
          }
          
          originalSetter.call(this, value);
        }
      });
    }
  }
}

/**
 * Apply a strict referrer policy
 */
function applyReferrerPolicy(): void {
  // Check if there's already a referrer policy
  let metaReferrer = document.querySelector('meta[name="referrer"]');
  
  if (!metaReferrer) {
    // Create and add a referrer policy meta tag
    metaReferrer = document.createElement('meta');
    metaReferrer.setAttribute('name', 'referrer');
    metaReferrer.setAttribute('content', 'strict-origin-when-cross-origin');
    document.head.appendChild(metaReferrer);
  } else {
    // Ensure the policy is secure
    const currentPolicy = metaReferrer.getAttribute('content');
    if (currentPolicy === 'no-referrer-when-downgrade' || 
        currentPolicy === 'unsafe-url' || 
        currentPolicy === 'origin') {
      // Update to a more secure policy
      metaReferrer.setAttribute('content', 'strict-origin-when-cross-origin');
    }
  }
  
  // Also secure links
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && !link.getAttribute('rel')?.includes('noreferrer')) {
      // Add noreferrer for cross-origin links
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) {
          let rel = link.getAttribute('rel') || '';
          
          if (rel) {
            if (!rel.includes('noreferrer')) {
              rel += ' noreferrer';
            }
          } else {
            rel = 'noreferrer';
          }
          
          link.setAttribute('rel', rel);
          
          // Also add noopener for security
          if (!rel.includes('noopener')) {
            link.setAttribute('rel', rel + ' noopener');
          }
        }
      } catch (error) {
        // Invalid URL, ignore
      }
    }
  }, false);
}

/**
 * Detect if we're running in a secure context
 */
function detectInSecureContext(): void {
  if (window.isSecureContext === false) {
    console.warn('Application is not running in a secure context. Some security features may be unavailable.');
    
    // Add a warning for users
    const warningBanner = document.createElement('div');
    warningBanner.style.background = '#ffe0e0';
    warningBanner.style.color = 'red';
    warningBanner.style.padding = '10px';
    warningBanner.style.textAlign = 'center';
    warningBanner.style.fontWeight = 'bold';
    warningBanner.textContent = 'Warning: This site is not being served over HTTPS. Your communications may not be secure.';
    
    document.body.insertBefore(warningBanner, document.body.firstChild);
  }
}
