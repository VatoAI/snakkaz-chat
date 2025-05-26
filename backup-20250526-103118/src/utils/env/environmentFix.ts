/**
 * Environment Variable Patch for Browser Compatibility - v5
 * 
 * ULTRA-SIMPLIFIED VERSION - May 22, 2025
 * All values hardcoded for maximum stability in production
 */

// Default environment from Vite
export const MODE = import.meta.env?.MODE || 'production';
export const DEV = MODE === 'development';
export const PROD = MODE === 'production';

// Hard-coded fallback values (used in production)
const FALLBACK_VALUES = {
  SUPABASE_URL: 'https://wqpoozpbceucynsojmbk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8'
};

// Define simple global types
declare global {
  interface Window {
    process?: any;
  }
}

// Create minimal process.env that always works
try {
  if (typeof window !== 'undefined') {
    window.process = { env: {} };
    window.process.env.NODE_ENV = PROD ? 'production' : 'development';
    window.process.env.SUPABASE_URL = FALLBACK_VALUES.SUPABASE_URL;
    window.process.env.SUPABASE_ANON_KEY = FALLBACK_VALUES.SUPABASE_ANON_KEY;
  }
} catch (e) {
  // Silent fail
}

// Export simple ENV object with hardcoded values for maximum stability
export const ENV = {
  // Core environment
  NODE_ENV: PROD ? 'production' : 'development',
  DEV,
  PROD,
  
  // Supabase variables with hardcoded fallbacks for production
  SUPABASE_URL: FALLBACK_VALUES.SUPABASE_URL,
  SUPABASE_ANON_KEY: FALLBACK_VALUES.SUPABASE_ANON_KEY,
  
  // Simple getter with hardcoded fallbacks
  get: (key: string, fallback: string = ''): string => {
    if (key === 'SUPABASE_URL') return FALLBACK_VALUES.SUPABASE_URL;
    if (key === 'SUPABASE_ANON_KEY') return FALLBACK_VALUES.SUPABASE_ANON_KEY;
    if (key === 'NODE_ENV') return PROD ? 'production' : 'development';
    return fallback;
  }
};

// No-op function for backward compatibility
export const ensureEnvironmentPatch = () => {};
