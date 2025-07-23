/**
 * Snakkaz Chat App Initialization - Simplified Version
 * 
 * This is a simplified version of the initialization to fix runtime errors
 */

import { applyCspPolicy } from './cspConfig';
import { fixDeprecatedMetaTags } from './metaTagFixes';
import { initCspReporting } from './cspReporting';

// Track initialization state
let isInitialized = false;

/**
 * Initialize Snakkaz Chat application - simplified version
 */
export function initializeSnakkazChat() {
  // Prevent double initialization
  if (isInitialized) {
    console.log('Snakkaz Chat already initialized');
    return;
  }
  
  console.log('Initializing Snakkaz Chat security and compatibility fixes...');
  
  try {
    // Apply CSP policy
    applyCspPolicy();
    
    // Fix deprecated meta tags
    fixDeprecatedMetaTags();
    
    // Initialize CSP reporting
    initCspReporting();
    
    console.log('Applied security enhancements');
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('Snakkaz Chat initialization complete');
  } catch (error) {
    console.error('Failed to initialize Snakkaz Chat:', error);
  }
}

/**
 * Apply all emergency CSP fixes
 * This is exported for use in other modules
 */
export function applyAllCspFixes() {
  console.log('Applying emergency CSP fixes...');
  
  // Basic CSP policy application
  applyCspPolicy();
  
  // Fix meta tags
  fixDeprecatedMetaTags();
  
  console.log('All CSP and CORS fixes have been applied');
}
