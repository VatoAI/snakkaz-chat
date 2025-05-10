/**
 * Snakkaz Chat App Initialization
 * 
 * This file handles essential setup tasks that must run early in the application lifecycle.
 * It includes CSP configuration, asset fallbacks, and error handling for critical resources.
 */

import { applyCspPolicy } from './cspConfig';
import { registerAssetFallbackHandlers, preloadLocalAssets } from './assetFallback';
import { runDiagnosticTest } from './diagnosticTest';
import { unblockPingRequests } from './corsTest';
import { applyBrowserCompatibilityFixes, fixModuleImportIssues } from './browserFixes';

/**
 * Initialize Snakkaz Chat application
 * Should be called at the start of your application
 */
export function initializeSnakkazChat() {
  // Apply CSP early
  applyCspPolicy();
  
  // Apply browser compatibility fixes
  applyBrowserCompatibilityFixes();
  
  // Fix module import issues in older browsers
  fixModuleImportIssues();
  
  // Register asset fallback handlers
  registerAssetFallbackHandlers();
  
  // Unblock ping requests that cause CSP errors
  unblockPingRequests();
  
  // Preload local assets for faster fallbacks
  preloadLocalAssets();
  
  // Add global error handler for critical network resources
  addNetworkErrorHandling();
  
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
