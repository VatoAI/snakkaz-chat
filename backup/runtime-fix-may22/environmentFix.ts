/**
 * Environment Variable Patch for Browser Compatibility - v3
 * 
 * This script ensures that environment variables work correctly
 * in both development and production, regardless of whether
 * the code is running on a server or in a browser.
 * 
 * Major improvements in v3:
 * 1. Handles circular references that can cause build failures
 * 2. More robust error catching during initialization
 * 3. Improved TypeScript type definitions
 * 4. Added diagnostic logging in development mode
 */

// Flag to track if environment patch has been applied
let envPatchApplied = false;

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
        } catch (err) {
          console.warn(`Could not map env var ${key}:`, err);
        }
      });
      
      // Add key Supabase env vars explicitly to ensure they're always available
      window.process.env.SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      window.process.env.SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Log that patch is activated in development environment
      if (import.meta.env.DEV) {
        console.log('✅ Environment compatibility patch applied: process.env is now available');
      }
      
      // Mark patch as applied
      envPatchApplied = true;
    }
  } catch (err) {
    console.error('Failed to apply environment patch:', err);
    // Create minimal environment to prevent crashes
    if (typeof window !== 'undefined' && window.process && window.process.env) {
      window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
    }
  }
}

// Apply the patch immediately
applyEnvironmentPatch();

// Export a utility function to get environment variables
export const ENV = {
  // Core environment
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  DEV: import.meta.env.DEV === true,
  PROD: import.meta.env.PROD === true,
  
  // Supabase variables
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  
  // Helper method to get any environment variable
  get: (key: string): string => {
    // Try getting from import.meta.env first (preferred method)
    const viteValue = (import.meta.env as Record<string, any>)[key];
    if (viteValue !== undefined) return viteValue;
    
    // Try with VITE_ prefix
    const viteWithPrefix = (import.meta.env as Record<string, any>)[`VITE_${key}`];
    if (viteWithPrefix !== undefined) return viteWithPrefix;
    
    // Fallback to process.env if available
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as Record<string, any>)[key] || '';
    }
    
    return '';
  }
};

// Export the patch function in case it needs to be applied later
export const ensureEnvironmentPatch = applyEnvironmentPatch;
