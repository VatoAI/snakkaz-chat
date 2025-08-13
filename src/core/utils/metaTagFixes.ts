/**
 * Meta Tag Fixes
 * 
 * Fixes and updates meta tags in the HTML document.
 * Updated version without Cloudflare dependencies.
 */

interface MetaTag {
  name?: string;
  httpEquiv?: string;
  content: string;
  property?: string;
}

/**
 * Fix deprecated or incorrect meta tags
 */
export function fixDeprecatedMetaTags(): void {
  // Skip if not in browser context
  if (typeof document === 'undefined') return;

  try {
    // Meta tags that should be present
    const requiredMetaTags: MetaTag[] = [
      // Viewport - critical for responsive layout
      { 
        name: 'viewport', 
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' 
      },
      // Description for SEO
      { 
        name: 'description', 
        content: 'Secure encrypted messaging for enterprise and personal use.' 
      },
      // Theme color for modern browsers
      { 
        name: 'theme-color', 
        content: '#0f172a' 
      },
      // Disable telephone detection on iOS
      { 
        name: 'format-detection', 
        content: 'telephone=no' 
      },
      // X-UA-Compatible for IE
      { 
        httpEquiv: 'X-UA-Compatible', 
        content: 'IE=edge' 
      },
      // Character encoding
      { 
        httpEquiv: 'Content-Type', 
        content: 'text/html; charset=UTF-8' 
      },
      // Open Graph tags for social sharing
      { 
        property: 'og:title', 
        content: 'Snakkaz Chat - Secure Messaging' 
      },
      { 
        property: 'og:description', 
        content: 'End-to-end encrypted secure messaging platform.' 
      },
      { 
        property: 'og:type', 
        content: 'website' 
      }
    ];
    
    // Check and fix each required meta tag
    for (const metaTagData of requiredMetaTags) {
      let selector = '';
      
      if (metaTagData.name) {
        selector = `meta[name="${metaTagData.name}"]`;
      } else if (metaTagData.httpEquiv) {
        selector = `meta[http-equiv="${metaTagData.httpEquiv}"]`;
      } else if (metaTagData.property) {
        selector = `meta[property="${metaTagData.property}"]`;
      }
      
      if (!selector) continue;
      
      // Check if the meta tag exists
      const existingTag = document.querySelector(selector);
      
      if (existingTag) {
        // Update content if needed
        if (existingTag.getAttribute('content') !== metaTagData.content) {
          existingTag.setAttribute('content', metaTagData.content);
        }
      } else {
        // Create new meta tag
        const newTag = document.createElement('meta');
        
        if (metaTagData.name) {
          newTag.setAttribute('name', metaTagData.name);
        } else if (metaTagData.httpEquiv) {
          newTag.setAttribute('http-equiv', metaTagData.httpEquiv);
        } else if (metaTagData.property) {
          newTag.setAttribute('property', metaTagData.property);
        }
        
        newTag.setAttribute('content', metaTagData.content);
        document.head.appendChild(newTag);
      }
    }
    
    // Remove deprecated meta tags
    const deprecatedTags = [
      'meta[name="cloudflare-app"]',
      'meta[name="cf-2fa-verify"]',
      'meta[name="cf-connecting-ip"]'
    ];
    
    for (const selector of deprecatedTags) {
      const tags = document.querySelectorAll(selector);
      for (const tag of tags) {
        tag.parentNode?.removeChild(tag);
      }
    }
    
    console.log('Fixed deprecated meta tags');
  } catch (error) {
    console.error('Failed to fix deprecated meta tags:', error);
  }
}
