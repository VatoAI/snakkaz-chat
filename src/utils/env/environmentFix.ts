/**
 * Environment Variable Patch for Browser Compatibility
 * 
 * Dette skriptet sørger for at alle miljøvariabler fungerer korrekt
 * både i utviklingsmiljøet og i produksjon, uavhengig av om
 * koden kjører på server eller i nettleser.
 */

// Global shim for process.env to prevent errors in browser
// This will replace all process.env calls with import.meta.env
if (typeof window !== 'undefined') {
  // @ts-ignore - Ignoring TypeScript warnings here
  window.process = window.process || {
    env: {
      NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
      // Map all VITE_ environment variables to process.env.*
      ...Object.fromEntries(
        Object.entries(import.meta.env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [key.replace('VITE_', ''), value])
      )
    }
  };
  
  // Log that the patch is activated in development environment
  if (import.meta.env.DEV) {
    console.log('Environment compatibility patch applied: process.env is now available');
  }
}

// Export a utility function to get environment variables
export function getEnvironmentVariable(name: string, fallback: string = ''): string {
  if (typeof window !== 'undefined' && 'process' in window) {
    // @ts-ignore - Ignoring TypeScript warnings here
    return window.process.env[name] || import.meta.env['VITE_' + name] || fallback;
  }
  
  // Fallback to Vite's import.meta.env
  return import.meta.env['VITE_' + name] || fallback;
}

// Export an object with all environment variables for easier use
export const ENV = {
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  // Add more environment variables here as needed
};
