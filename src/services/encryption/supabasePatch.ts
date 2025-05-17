/**
 * Supabase Client Configuration Patch
 * 
 * This module provides corrected configuration for the Supabase client
 * to resolve CORS and API connection issues.
 * 
 * UPDATED: Now uses the singleton pattern to avoid multiple GoTrueClient instances
 */

import { supabase } from '@/lib/supabaseClient';

// For configuration diagnostics - use import.meta.env for consistency
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_CHECK = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to log config issues during development
if (import.meta.env.DEV && !ENV_CHECK) {
  console.warn(
    'Supabase configuration issue detected! Ensure you have set the following environment variables:\n' +
    '- VITE_SUPABASE_URL\n' + 
    '- VITE_SUPABASE_ANON_KEY\n\n' +
    'Add these to your .env file or environment variables.'
  );
}

// Export the singleton Supabase client - no need to create a new instance
export const supabaseClient = supabase;

// IMPORTANT: Export a function that returns the singleton to avoid breaking existing code
export const createSupabaseClient = () => {
  // Warn about deprecated usage in development
  if (import.meta.env.DEV) {
    console.warn(
      'The createSupabaseClient() function is deprecated and will be removed in a future version.\n' +
      'Please import the supabase client directly from @/lib/supabaseClient instead.'
    );
  }
  
  return supabase;
};

// Configuration verification function - useful for debugging
export const verifySupabaseConfig = () => {
  try {
    const isConfigValid = !!supabase && ENV_CHECK;
    
    if (import.meta.env.DEV) {
      console.log('Supabase config verification result:', isConfigValid ? 'Valid ✓' : 'Invalid ✗');
      
      if (!isConfigValid) {
        console.warn('Supabase configuration is incomplete or invalid. Check your environment variables.');
      }
    }
    
    return isConfigValid;
  } catch (error) {
    console.error('Error verifying Supabase configuration:', error);
    return false;
  }
};

// Security enhancement options
export const getEnhancedSupabaseOptions = () => ({
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'snakkaz-chat',
      'Content-Type': 'application/json'
    }
  }
});

// Call verification on import for early detection of issues
verifySupabaseConfig();
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
