/**
 * Snakkaz Chat App Initialization - Production Hardened Version
 * 
 * May 22, 2025 - Fixed to prevent production runtime errors
 */

import { applyCspPolicy, applyCspEmergencyFixes } from './security/simplifiedCspConfig';

// Track initialization state
let isInitialized = false;
let initializationAttempted = false;

/**
 * Initialize Snakkaz Chat application with improved error handling
 */
export function initializeSnakkazChat() {
  // Prevent double initialization
  if (isInitialized) {
    return;
  }
  
  // If we already tried to initialize but failed, don't retry
  // This prevents infinite initialization loops
  if (initializationAttempted) {
    console.warn('Skipping initialization - previous attempt failed');
    return;
  }
  
  initializationAttempted = true;
  
  try {
    if (import.meta.env.DEV) {
      console.log('Initializing Snakkaz Chat with production-hardened security...');
    }
    
    // Apply the security features in order of importance
    setTimeout(() => {
      try {
        applyCspEmergencyFixes();
        applyCspPolicy();
        
        // Mark as successfully initialized
        isInitialized = true;
        
        if (import.meta.env.DEV) {
          console.log('Snakkaz Chat initialization complete');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed during delayed initialization:', error);
        }
      }
    }, 0);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to initialize Snakkaz Chat:', error);
    }
    
    // Still mark as initialized to prevent retries
    isInitialized = true;
  }
}

/**
 * Apply all emergency CSP fixes
 * This is exported for use in other modules
 */
export function applyAllCspFixes() {
  try {
    // Apply emergency fixes
    applyCspEmergencyFixes();
    
    // Apply regular policy
    applyCspPolicy();
    
    if (import.meta.env.DEV) {
      console.log('All CSP fixes have been applied');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to apply CSP fixes:', error);
    }
  }
}
