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
import { initializeAnalytics } from './analyticsLoader';
import { fixDeprecatedMetaTags } from './metaTagFixes';
import { fixCloudflareAnalyticsIntegration } from './cloudflareHelper';

/**
 * Initialize Snakkaz Chat application
 * Should be called at the start of your application
 */
export function initializeSnakkazChat() {
  // Apply immediate fixes for critical issues
  console.log('Initializing Snakkaz Chat security and compatibility fixes...');
  
  // Apply CSP early
  applyCspPolicy();
  
  // Apply browser compatibility fixes
  applyBrowserCompatibilityFixes();
  
  // Fix deprecated meta tags
  fixDeprecatedMetaTags();
  
  // Unblock ping requests that cause CSP errors - critical for subdomain access
  unblockPingRequests();
  
  // Fix Cloudflare CORS security issues
  fixCloudflareCorsSecurity();
  
  // Fix module import issues in older browsers
  fixModuleImportIssues();
  
  // Register asset fallback handlers
  registerAssetFallbackHandlers();
  
  // Fix Cloudflare Analytics integration specifically - this is a critical fix
  fixCloudflareAnalyticsIntegration();
  
  // Preload local assets for faster fallbacks
  preloadLocalAssets();
  
  // Add global error handler for critical network resources
  addNetworkErrorHandling();
  
  // Initialize analytics safely
  initializeAnalytics();
  
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
  };
  
  // Apply fixes after initial render
  setTimeout(reapplyFixes, 500);
  
  // Apply fixes again after full page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reapplyFixes);
  }
  
  // Apply fixes one more time after all resources are loaded
  window.addEventListener('load', reapplyFixes);
  
  // Set up a mutation observer to detect dynamic script additions
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any scripts were added
        const hasNewScripts = Array.from(mutation.addedNodes).some(
          node => node.nodeName === 'SCRIPT' || node.nodeName === 'LINK'
        );
        
        if (hasNewScripts) {
          reapplyFixes();
          break;
        }
      }
    }
  });
  
  // Observe the document for added scripts
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
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
