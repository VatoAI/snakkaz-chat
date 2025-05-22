/**
 * Environment Variable Patch for Browser Compatibility - v4
 * 
 * PRODUCTION HARDENED VERSION - May 22, 2025
 * 
 * This script ensures that environment variables work correctly
 * in both development and production environments.
 * 
 * V4 improvements:
 * 1. Added fallback values for critical environment variables
 * 2. Improved error handling and recovery
 * 3. Silent fail in production to prevent crashes
 * 4. Direct export of critical environment variables with defaults
 */

// Flag to track if environment patch has been applied
let envPatchApplied = false;

// Hard-coded fallback values for critical variables (ONLY used if env vars are missing)
const FALLBACK_VALUES = {
  SUPABASE_URL: 'https://wqpoozpbceucynsojmbk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8'
};

// Define a partial Process type for the browser environment
declare global {
  interface Window {
    process?: Partial<NodeJS.Process> & {
      env?: Record<string, any>;
      [key: string]: any;
    };
  }
}

// Apply global shim for process.env to prevent errors in browser
function applyEnvironmentPatch() {
  if (envPatchApplied) {
    return; // Don't apply patch multiple times
  }

  try {
    if (typeof window !== 'undefined') {
      // Create a safe process object if it doesn't exist
      if (!window.process) {
        window.process = { env: {} } as any;
      }
      // Create a safe env object if it doesn't exist
      if (!window.process.env) {
        window.process.env = {};
      }
      
      // Set NODE_ENV based on Vite mode
      window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
      
      // First, add critical environment variables with fallbacks
      window.process.env.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_VALUES.SUPABASE_URL;
      window.process.env.SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_VALUES.SUPABASE_ANON_KEY;
      
      // Then try to map all other environment variables
      try {
        // Map all VITE_ environment variables to process.env.*
        Object.entries(import.meta.env).forEach(([key, value]) => {
          try {
            // Skip undefined or circular references that cause build failures
            if (value !== undefined && typeof value !== 'object') {
              if (key.startsWith('VITE_')) {
                window.process.env[key.replace('VITE_', '')] = value;
              }
              // Also map the original VITE_ variables to process.env
              window.process.env[key] = value;
            }
          } catch {
            // Silently ignore any errors for individual vars
          }
        });
      } catch (err) {
        // Log in development, silent in production
        if (import.meta.env.DEV) {
          console.warn('Could not map all environment variables:', err);
        }
      }
      
      // Log that patch is activated in development environment
      if (import.meta.env.DEV) {
        console.log('✅ Environment compatibility patch applied: process.env is now available');
      }
      
      // Mark patch as applied
      envPatchApplied = true;
    }
  } catch (err) {
    // Only log in development to avoid exposing details in production
    if (import.meta.env.DEV) {
      console.error('Failed to apply environment patch:', err);
    }
    
    // Create minimal environment to prevent crashes
    if (typeof window !== 'undefined') {
      try {
        // Ensure minimal process.env structure exists
        if (!window.process) window.process = { env: {} } as any;
        if (!window.process.env) window.process.env = {};
        
        // Set critical values using fallbacks
        window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
        window.process.env.SUPABASE_URL = FALLBACK_VALUES.SUPABASE_URL;
        window.process.env.SUPABASE_ANON_KEY = FALLBACK_VALUES.SUPABASE_ANON_KEY;
      } catch {
        // Final silent fail - nothing more we can do
      }
    }
  }
}

// Apply the patch immediately
applyEnvironmentPatch();

// Export utility for environment variables with fallbacks
export const ENV = {
  // Core environment
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  DEV: import.meta.env.DEV === true,
  PROD: import.meta.env.PROD === true,
  
  // Supabase variables with fallbacks
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string || FALLBACK_VALUES.SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string || FALLBACK_VALUES.SUPABASE_ANON_KEY,
  
  // Helper method to get any environment variable with fallback
  get: (key: string, fallback: string = ''): string => {
    try {
      // Try getting from import.meta.env first (preferred method)
      const viteValue = (import.meta.env as Record<string, any>)[key];
      if (viteValue !== undefined) return viteValue;
      
      // Try with VITE_ prefix
      const viteWithPrefix = (import.meta.env as Record<string, any>)[`VITE_${key}`];
      if (viteWithPrefix !== undefined) return viteWithPrefix;
      
      // Check fallback values for critical keys
      if (key in FALLBACK_VALUES) {
        return (FALLBACK_VALUES as Record<string, string>)[key];
      }
      
      // Try process.env as last resort
      if (typeof process !== 'undefined' && process.env) {
        const processValue = (process.env as Record<string, any>)[key];
        if (processValue !== undefined) return processValue;
      }
      
      // Final fallback
      return fallback;
    } catch {
      // Silent fail with fallback value
      return fallback;
    }
  }
};

// Re-export for backwards compatibility
export const ensureEnvironmentPatch = applyEnvironmentPatch;
