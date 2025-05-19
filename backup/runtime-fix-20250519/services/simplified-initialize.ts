/**
 * Snakkaz Chat App Initialization - Highly Simplified Version
 * 
 * This is a simplified version of the initialization to prevent runtime errors
 */

import { applyCspPolicy, applyCspEmergencyFixes } from './security/simplifiedCspConfig';

// Track initialization state
let isInitialized = false;

/**
 * Initialize Snakkaz Chat application - ultra simple version
 */
export function initializeSnakkazChat() {
  // Prevent double initialization
  if (isInitialized) {
    console.log('Snakkaz Chat already initialized');
    return;
  }
  
  try {
    console.log('Initializing Snakkaz Chat with simplified security...');
    
    // Apply emergency fixes first
    applyCspEmergencyFixes();
    
    // Then apply the regular policy
    applyCspPolicy();
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('Snakkaz Chat initialization complete');
  } catch (error) {
    console.error('Failed to initialize Snakkaz Chat:', error);
    
    // Try minimal initialization as fallback
    try {
      console.warn('Attempting minimal initialization as fallback...');
      // Do nothing - just let the app run with default security
    } catch (e) {
      // Completely silent fail - we don't want to break the app
    }
  }
}

/**
 * Apply all emergency CSP fixes
 * This is exported for use in other modules
 */
export function applyAllCspFixes() {
  console.log('Applying emergency CSP fixes...');
  
  try {
    // Apply emergency fixes
    applyCspEmergencyFixes();
    
    // Apply regular policy
    applyCspPolicy();
    
    console.log('All CSP fixes have been applied');
  } catch (error) {
    console.error('Failed to apply CSP fixes:', error);
  }
}
