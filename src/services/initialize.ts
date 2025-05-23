/**
 * Snakkaz Chat App Initialization
 * 
 * This file handles essential setup tasks that must run early in the application lifecycle.
 * It includes CSP configuration, asset fallbacks, and error handling for critical resources.
 * Updated version without Cloudflare dependencies.
 */

import { applyCspPolicy } from './security/cspConfig';
import { registerAssetFallbackHandlers, preloadLocalAssets } from '@/utils/assetFallback';
import { runDiagnosticTest } from './encryption/diagnosticTest';
import { unblockPingRequests } from './encryption/corsTest';
import { fixCorsSecurity } from './security/corsConfig';
import { applyBrowserCompatibilityFixes, fixModuleImportIssues } from './encryption/browserFixes';
import { fixDeprecatedMetaTags } from './encryption/metaTagFixes';
import { initCspReporting } from './encryption/cspReporting';
import { applySecurityEnhancements } from './security/securityEnhancements';

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
    import('./encryption/cspFixes').then(module => {
      console.log('Applying emergency CSP fixes...');
      module.applyAllCspFixes();
    }).catch(err => {
      console.error('Failed to apply emergency CSP fixes:', err);
      // Fall back to standard fixes if the import fails
      applyCspPolicy();
      unblockPingRequests();
      fixCorsSecurity();
    });
  } catch (error) {
    console.error('Error importing emergency fixes:', error);
    // Apply traditional fixes as fallback
    applyCspPolicy();
  }
  
  // Apply browser compatibility fixes
  try {
    applyBrowserCompatibilityFixes();
    fixModuleImportIssues();
  } catch (error) {
    console.error('Failed to apply browser compatibility fixes:', error);
  }
  
  // Set up CSP reporting (now without Cloudflare dependency)
  try {
    initCspReporting({
      reportToEndpoint: '', // Removed non-existent endpoint
      logToConsole: true,
      // Analytics logging disabled to remove Cloudflare dependency
      logToAnalytics: false
    });
  } catch (error) {
    console.error('Failed to initialize CSP reporting:', error);
  }
  
  // Fix deprecated meta tags
  try {
    fixDeprecatedMetaTags();
  } catch (error) {
    console.error('Failed to fix deprecated meta tags:', error);
  }
  
  // Preload assets and register fallbacks
  try {
    preloadLocalAssets();
    registerAssetFallbackHandlers();
  } catch (error) {
    console.error('Failed to set up asset fallbacks:', error);
  }
  
  // Apply additional security enhancements
  try {
    applySecurityEnhancements();
  } catch (error) {
    console.error('Failed to apply security enhancements:', error);
  }
  
  // Initialize notifications system
  try {
    import('./notification').then(module => {
      module.initializeNotifications();
    }).catch(err => {
      console.error('Failed to initialize notifications:', err);
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
  
  // Run diagnostics tests in development mode
  if (process.env.NODE_ENV === 'development') {
    runDiagnosticTest().then(results => {
      console.log('Diagnostic test results:', results);
    }).catch(error => {
      console.error('Diagnostic test failed:', error);
    });
  }
  
  // Mark as initialized
  isInitialized = true;
  console.log('Snakkaz Chat initialization complete');
}
