/**
 * Supabase Client Configuration Patch
 * 
 * This module provides corrected configuration for the Supabase client
 * to resolve CORS and API connection issues.
 * 
 * HOW TO USE:
 * 1. Copy the corrected client setup from this file
 * 2. Replace the existing client setup in src/integrations/supabase/client.ts
 * 3. Ensure environment variables are properly set
 */

import { createClient } from '@supabase/supabase-js';

// For configuration diagnostics
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const ENV_CHECK = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;

// Helper to log config issues during development
if (process.env.NODE_ENV === 'development' && !ENV_CHECK) {
  console.warn(
    'Supabase configuration issue detected! Ensure you have set the following environment variables:\n' +
    '- SUPABASE_URL\n' + 
    '- SUPABASE_ANON_KEY\n\n' +
    'Add these to your .env file or environment variables.'
  );
}

// Initialize the Supabase client with better config and error handling
export const createSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    
    // Validate config
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing. Check your environment variables.');
    }
    
    // Create client with custom fetch options for CORS handling
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      // Set headers needed for CORS
      global: {
        headers: {
          'X-Client-Info': 'snakkaz-chat',
          'Content-Type': 'application/json'
        },
        fetch: (url, options) => {
          // Add credentials mode for CORS
          return fetch(url, {
            ...options,
            credentials: 'include' // This is important for CORS with cookies
          });
        }
      }
    });
    
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Provide a fallback client that logs errors but doesn't crash the app
    return createFallbackClient();
  }
};

// Create a fallback client that logs errors instead of crashing
function createFallbackClient() {
  const errorHandler = () => {
    const error = new Error('Supabase client not properly initialized');
    console.error('Supabase API call failed:', error);
    return Promise.reject(error);
  };
  
  // This is a mock client that logs errors for all operations
  return {
    from: () => ({ 
      select: errorHandler,
      insert: errorHandler,
      update: errorHandler,
      delete: errorHandler,
      eq: errorHandler,
      // ...other query methods
    }),
    auth: {
      getUser: errorHandler,
      getSession: errorHandler,
      signIn: errorHandler,
      signOut: errorHandler,
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } }
      })
    },
    storage: { from: () => ({ 
      upload: errorHandler, 
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    }) },
    function: { invoke: errorHandler },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({})
    }),
    removeChannel: () => {}
  };
}

// Export the configured client
export const supabase = createSupabaseClient();

// Export a utility to test the connection
export const testConnection = async () => {
  try {
    // Use getUser instead of getSession for better compatibility
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check your network connection, CORS configuration, and Supabase project settings.'
    };
  }
};
