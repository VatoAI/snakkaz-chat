/**
 * Snakkaz Chat App Initialization
 * 
 * This file handles essential setup tasks that must run early in the application lifecycle.
 * It includes CSP configuration, asset fallbacks, and error handling for critical resources.
 */

import { applyCspPolicy } from './cspConfig';
import { registerAssetFallbackHandlers, preloadLocalAssets } from './assetFallback';
import { runDiagnosticTest } from './diagnosticTest';
import { unblockPingRequests, fixCloudflareCorsSecurity } from './corsTest';
import { applyBrowserCompatibilityFixes, fixModuleImportIssues } from './browserFixes';
import { initializeAnalytics, triggerCloudflarePageview } from './analyticsLoader';
import { fixDeprecatedMetaTags } from './metaTagFixes';
import { fixCloudflareAnalyticsIntegration, fixMissingResources, checkCloudflareActivation } from './cloudflareHelper';
import { initCspReporting } from './cspReporting';

// Track initialization state
let isInitialized = false;

/**
 * Initialize Snakkaz Chat application
 * Should be called at the start of your application
 */
export function initializeSnakkazChat() {
  // Prevent double initialization
  if (isInitialized) {
    console.log('Snakkaz Chat already initialized');
    return;
  }
  
  // Apply immediate fixes for critical issues
  console.log('Initializing Snakkaz Chat security and compatibility fixes...');
  
  try {
    // Import the emergency fixes from cspFixes.ts
    import('./cspFixes').then(module => {
      console.log('Applying emergency CSP fixes...');
      module.applyAllCspFixes();
    }).catch(err => {
      console.error('Failed to apply emergency CSP fixes:', err);
      // Fall back to standard fixes if the import fails
      applyCspPolicy();
      unblockPingRequests();
      fixCloudflareCorsSecurity();
    });
  } catch (error) {
    console.error('Error importing emergency fixes:', error);
    // Apply traditional fixes as fallback
    applyCspPolicy();
  }
  
  // Fix missing resources (like auth-bg.jpg)
  fixMissingResources();
  
  // Register asset fallback handlers - must come early to catch any loading errors
  registerAssetFallbackHandlers();
  
  // Preload critical assets to prevent 404 errors
  preloadLocalAssets();
  
  // Apply browser compatibility fixes
  applyBrowserCompatibilityFixes();
  
  // Fix deprecated meta tags
  fixDeprecatedMetaTags();
  
  // Unblock ping requests that cause CSP errors - critical for subdomain access
  unblockPingRequests();
  
  // Fix module import issues in older browsers
  fixModuleImportIssues();
  
  // Fix Cloudflare Analytics integration specifically - this is a critical fix
  fixCloudflareAnalyticsIntegration();
  
  // Initialize analytics after fixing integration issues
  initializeAnalytics();
  
  // Check Cloudflare activation status - helps diagnose DNS propagation issues
  checkCloudflareActivation().then(active => {
    if (!active) {
      console.warn('Cloudflare is not fully active yet - some features may be limited until DNS propagation completes');
    } else {
      console.log('Cloudflare integration is active and working');
    }
  });
  
  // Preload local assets for faster fallbacks
  preloadLocalAssets();
  
  // Add global error handler for critical network resources
  addNetworkErrorHandling();
  
  // Initialize analytics safely
  setTimeout(() => {
    // Check Cloudflare activation first
    checkCloudflareActivation().then(active => {
      if (active) {
        console.log('Cloudflare is active, initializing analytics');
        initializeAnalytics();
      } else {
        console.log('Cloudflare not active yet, deferring analytics initialization');
        // Retry after 1 minute
        setTimeout(initializeAnalytics, 60 * 1000);
      }
    });
  }, 1500);
  
  // Multiple re-application of fixes to catch any dynamic DOM changes
  const reapplyFixes = () => {
    console.log('Re-applying security fixes for dynamic content...');
    
    // Apply CSP again to catch any dynamic modifications
    applyCspPolicy();
    
    // Fix meta tags again
    fixDeprecatedMetaTags();
    
    // Fix Cloudflare CORS security issues again
    fixCloudflareCorsSecurity();
    
    // Fix Cloudflare Analytics integration specifically
    fixCloudflareAnalyticsIntegration();
    
    // Re-unblock ping requests in case new event handlers were added
    unblockPingRequests();
    
    // Fix missing resources again
    fixMissingResources();
  };
  
  // Initialize CSP reporting
  try {
    console.log('Initializing CSP violation reporting...');
    initCspReporting({
      reportToEndpoint: '', // Removed non-existent endpoint
      logToConsole: true,
      logToAnalytics: false
    });
  } catch (error) {
    console.error('Failed to initialize CSP reporting:', error);
  }
  
  // Apply fixes after initial render
  setTimeout(reapplyFixes, 500);
  
  // Apply fixes again after full page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reapplyFixes);
  }
  
  // Apply fixes one more time after all resources are loaded
  window.addEventListener('load', () => {
    reapplyFixes();
    // Trigger manual Cloudflare pageview
    triggerCloudflarePageview();
    
    // Add our CSP testing tools to the window object for debugging
    if (process.env.NODE_ENV !== 'production') {
      import('./cspTests').then(module => {
        // @ts-expect-error - Dynamically adding to window object
        window.runSnakkazTests = module.default || module.runSnakkazTests;
        console.log('CSP testing tools available. Run window.runSnakkazTests() to test CSP configuration');
      }).catch(err => {
        console.error('Failed to load CSP testing tools:', err);
      });
    }
  });
  
  // Set up a mutation observer to detect dynamic script additions
  const observer = new MutationObserver((mutations) => {
    let hasNewScripts = false;
    let hasNewLinks = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any scripts or links were added
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            if (element.tagName === 'SCRIPT') {
              hasNewScripts = true;
              // Handle script immediately
              if (element.hasAttribute('integrity')) {
                element.removeAttribute('integrity');
              }
              if ((element as HTMLScriptElement).src && 
                  (element as HTMLScriptElement).src.includes('cloudflare')) {
                (element as HTMLScriptElement).crossOrigin = 'anonymous';
                element.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
              }
            }
            
            if (element.tagName === 'LINK' && element.hasAttribute('integrity')) {
              hasNewLinks = true;
              element.removeAttribute('integrity');
            }
          }
        }
      }
    }
    
    // Only re-apply full fixes if necessary
    if (hasNewScripts || hasNewLinks) {
      console.log('New scripts or links detected, re-applying fixes');
      reapplyFixes();
    }
  });
  
  // Observe the document for added scripts
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Track route changes for SPA to trigger analytics events
  if (typeof window !== 'undefined' && 'history' in window) {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      triggerCloudflarePageview();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      triggerCloudflarePageview();
    };
    
    window.addEventListener('popstate', () => {
      triggerCloudflarePageview();
    });
  }
  
  // Mark as initialized
  isInitialized = true;
  
  // Log initialization complete
  console.log('Snakkaz Chat initialized with security and fallback solutions');
}

/**
 * Helper function to safely get the URL from various HTML elements
 */
function getResourceUrl(element: HTMLElement): string {
  if (element instanceof HTMLScriptElement) {
    return element.src;
  } else if (element instanceof HTMLLinkElement) {
    return element.href;
  } else if (element instanceof HTMLImageElement) {
    return element.src;
  } else {
    return '';
  }
}

/**
 * Add global error handling for network resource loading
 */
function addNetworkErrorHandling() {
  // Global error handling for failed resources
  window.addEventListener('error', (event) => {
    // Check if this is a resource loading error
    if (event.target && (
        event.target instanceof HTMLScriptElement || 
        event.target instanceof HTMLLinkElement ||
        event.target instanceof HTMLImageElement
    )) {
      // Get source URL based on element type
      const resourceUrl = getResourceUrl(event.target);
      console.warn('Resource failed to load:', resourceUrl);
      
      // Check specifically for Cloudflare insights errors
      if (resourceUrl && resourceUrl.includes('cloudflareinsights.com')) {
        console.log('Cloudflare Insights failed to load - this is non-critical');
        // Prevent error from propagating
        event.preventDefault();
        return true;
      }
      
      // Check for auth-bg.jpg which is known to 404
      if (resourceUrl && resourceUrl.includes('auth-bg.jpg')) {
        console.log('auth-bg.jpg failed to load - hiding element');
        if (event.target instanceof HTMLImageElement) {
          event.target.style.display = 'none';
        }
        event.preventDefault();
        return true;
      }
      
      // Check for Supabase client errors
      if (resourceUrl && resourceUrl.includes('supabase-client')) {
        console.log('Supabase client failed to load - attempting fallback');
        // Let the assetFallback handler take over
      }
    }
  }, true);
}

/**
 * Run diagnostic tests for the application
 * Can be called from developer console or a debug menu
 */
export function runDiagnostics() {
  console.log('Running Snakkaz Chat diagnostics...');
  return runDiagnosticTest();
}

// Export key components for direct use
export { 
  applyCspPolicy, 
  registerAssetFallbackHandlers, 
  runDiagnosticTest 
};
