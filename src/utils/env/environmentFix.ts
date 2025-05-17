/**
 * Environment Variable Patch for Browser Compatibility - v2
 * 
 * This script ensures that environment variables work correctly
 * in both development and production, regardless of whether
 * the code is running on a server or in a browser.
 * 
 * The key improvements in this version:
 * 1. More robust window.process detection and configuration
 * 2. Better error handling for environment variable access
 * 3. Safe initialization to prevent multiple patching
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

  if (typeof window !== 'undefined') {
    // Create a safe process object if it doesn't exist
    if (!window.process) {
      window.process = { env: {} } as unknown as Window['process'];
    }
    // Create a safe env object if it doesn't exist
    if (!window.process.env) {
      window.process.env = {};
    }
    // Set NODE_ENV based on Vite mode
    window.process.env.NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
    // Map all VITE_ environment variables to process.env.*
    Object.entries(import.meta.env).forEach(([key, value]) => {
      if (key.startsWith('VITE_')) {
        window.process.env[key.replace('VITE_', '')] = value;
      }
    });
    // Also map the original VITE_ variables to process.env
    Object.entries(import.meta.env).forEach(([key, value]) => {
      window.process.env[key] = value;
    });
    // Log that patch is activated in development environment
    if (import.meta.env.DEV) {
      console.log('✅ Environment compatibility patch applied: process.env is now available');
    }
    // Mark patch as applied
    envPatchApplied = true;
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
