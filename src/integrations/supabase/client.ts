/**
 * Supabase Client using Singleton Pattern
 * 
 * UPDATED - May 22, 2025
 * This file re-exports the singleton instance from @/lib/supabaseClient
 * which itself uses the underlying supabase-singleton.ts implementation.
 * 
 * IMPORTANT: This file is kept for backward compatibility.
 * New code should import from @/lib/supabaseClient directly.
 */
import { createClient } from '@supabase/supabase-js';
import { supabase, getSession, getUser } from '@/lib/supabaseClient'; // Import from the standard location

// Re-export the Supabase client instance for backward compatibility
export { supabase, getSession, getUser };
import { environment } from '@/config/environment';
import { ENV } from '@/utils/env/environmentFix';

// Use custom domain if available, otherwise fall back to standard URL
const supabaseUrl = environment.supabase.customDomain 
  ? `https://${environment.supabase.customDomain}/api` 
  : (ENV.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co');

const supabaseAnonKey = ENV.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

// Logging only in development environment
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Using custom domain:', environment.supabase.customDomain ? 'Yes' : 'No');
  console.log('Supabase Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');
}

/**
 * Create a typed mock client for testing and fallback purposes
 * This is only used for development and testing scenarios
 */
function createMockClient() {
  console.warn('Using mock Supabase client. Application will have limited functionality.');
  
  // Create a proper mock for auth functionality
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: { user: null, session: null }, error: { message: 'Mock auth: Cannot sign in' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Mock auth: Cannot sign up' } }),
    signOut: async () => ({ error: null }),
    // Critical fix for onAuthStateChange
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
      console.warn('Mock Supabase: onAuthStateChange registered but will not trigger events');
      // Return an object with a subscription that can be unsubscribed
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.warn('Mock Supabase: unsubscribe called on mock auth listener');
            }
          }
        }
      };
    }
  };

  // Create basic mocks for commonly used Supabase methods
  const mockFrom = (table: string) => {
    const mockQuery = {
      select: () => mockQuery,
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: () => mockQuery,
      neq: () => mockQuery,
      in: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (callback: (result: { data: unknown[], error: null }) => unknown) => 
        Promise.resolve(callback({ data: [], error: null })),
    };
    return mockQuery;
  };

  // Main mock client
  return {
    auth: mockAuth,
    from: (table: string) => mockFrom(table),
    channel: (name: string) => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({})
    }),
  };
}

// Print debug info in development mode
if (import.meta.env.DEV) {
  console.log('Using Supabase singleton instance');
  
  // Test connection in development
  supabase.auth.getSession()
    .then(response => {
      if (response.error) {
        console.error('Supabase connection test failed:', response.error.message);
        if (response.error.message.includes('invalid key')) {
          console.error('%c⚠️ API KEY ERROR: The provided API key is invalid! ⚠️', 'font-size: 16px; color: red;');
          console.error('Please check that you are using the correct "anon" or "public" key from the Supabase dashboard.');
        }
      } else {
        console.log('Supabase connection test succeeded!', response.data ? 'Session exists' : 'No session');
      }
    })
    .catch(err => {
      console.error('Supabase connection test error:', err);
    });
}

// Add enhanced logging for debugging only in development
if (import.meta.env.DEV && supabase && typeof supabase.channel === 'function') {
  try {
    const channel = supabase.channel('console_logging');
    channel.on('*', (event) => {
      console.log('Supabase Debug Event:', event);
    });
    channel.subscribe();
    console.log('Supabase debugging enabled');
  } catch (e) {
    console.warn('Could not enable Supabase debug logging:', e);
  }
}

/**
 * Create a service client with admin privileges
 * IMPORTANT: This should only be used in secure server contexts
 * @param serviceKey The Supabase service role key
 * @returns A new Supabase client with admin privileges
 */
export const createServiceClient = (serviceKey: string) => {
  // Import SUPABASE_URL from the singleton implementation to ensure consistency
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co';
  
  if (!SUPABASE_URL) {
    throw new Error('Missing Supabase URL for service client');
  }
  
  return createClient(SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
