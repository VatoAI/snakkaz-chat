/**
 * Emergency CSP fixes for Snakkaz Chat
 * 
 * This file contains emergency fixes for Content Security Policy issues
 * that may prevent the application from working properly.
 * Updated version without Cloudflare dependencies.
 */

/**
 * Applies all critical CSP fixes to ensure application functionality
 */
export function applyAllCspFixes() {
  try {
    // Apply fixes in order of importance
    fixInlineCspHeaders();
    fixMetaTagCsp();
    addMissingCspSources();
    detectAndFixCspBlockedResources();
    
    console.log('All CSP emergency fixes applied successfully');
  } catch (error) {
    console.error('Error applying CSP fixes:', error);
  }
}

/**
 * Fixes CSP headers that might be set incorrectly by the server
 */
function fixInlineCspHeaders() {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;
  
  try {
    // Create a MutationObserver to detect and fix CSP headers in HTTP headers
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
          for (const tag of metaTags) {
            const content = tag.getAttribute('content');
            if (content && !content.includes("'unsafe-inline'")) {
              // Fix the CSP to allow inline scripts (necessary for our app)
              tag.setAttribute('content', content + " 'unsafe-inline'");
              console.log('Fixed CSP meta tag to allow inline scripts');
            }
          }
        }
      }
    });
    
    // Start observing the document with the configured observer
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // Clean up after 5 seconds (after page has likely loaded)
    setTimeout(() => observer.disconnect(), 5000);
  } catch (error) {
    console.error('Error fixing inline CSP headers:', error);
  }
}

/**
 * Fixes CSP meta tags in the document
 */
function fixMetaTagCsp() {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;
  
  try {
    // Fix existing CSP meta tags
    const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    
    if (metaTags.length === 0) {
      // If no CSP meta tag exists, create one with safe defaults
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co; style-src 'self' 'unsafe-inline'; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com cdn.gpteng.co;");
      
      // Insert at the beginning of head
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head.firstChild) {
        head.insertBefore(meta, head.firstChild);
      } else {
        head.appendChild(meta);
      }
      
      console.log('Created new CSP meta tag with safe defaults');
    } else {
      // Make sure the CSP allows our required sources
      for (const tag of metaTags) {
        const content = tag.getAttribute('content') || '';
        
        // Check if the CSP is missing critical sources
        let needsUpdate = false;
        let newContent = content;
        
        // Check and fix script-src
        if (!content.includes("script-src") || 
            !content.includes("'unsafe-inline'") || 
            !content.includes("'unsafe-eval'")) {
          
          if (!content.includes("script-src")) {
            newContent += "; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co";
          } else {
            newContent = newContent.replace(/(script-src[^;]*)(;|$)/, "$1 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co$2");
          }
          
          needsUpdate = true;
        }
        
        // Check and fix connect-src for Supabase and our own services
        if (!content.includes("connect-src") || 
            !content.includes("*.supabase.co") || 
            !content.includes("*.snakkaz.com")) {
          
          if (!content.includes("connect-src")) {
            newContent += "; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com";
          } else {
            newContent = newContent.replace(/(connect-src[^;]*)(;|$)/, "$1 *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com$2");
          }
          
          needsUpdate = true;
        }
        
        // Update the tag if needed
        if (needsUpdate) {
          tag.setAttribute('content', newContent);
          console.log('Updated CSP meta tag with required sources');
        }
      }
    }
  } catch (error) {
    console.error('Error fixing CSP meta tags:', error);
  }
}

/**
 * Adds any missing CSP sources that are required for the app to work
 */
function addMissingCspSources() {
  // This functionality is now integrated into fixMetaTagCsp()
  return;
}

/**
 * Detects and fixes any CSP-blocked resources
 */
function detectAndFixCspBlockedResources() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  try {
    // Listen for CSP violation reports
    window.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP violation detected:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy
      });
      
      // Here we could dynamically update the CSP, but this is risky
      // Instead, we'll log it for future updates to the CSP configuration
    });
  } catch (error) {
    console.error('Error setting up CSP violation detection:', error);
  }
}
