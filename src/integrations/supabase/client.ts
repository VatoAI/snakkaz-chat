import { createClient } from '@supabase/supabase-js';

// Set default values for local development if environment variables are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://localhost';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

// Check for placeholder values that were not replaced
const isPlaceholderUrl = supabaseUrl?.includes('your-project-id') || supabaseUrl === 'https://localhost';
const isPlaceholderKey = supabaseAnonKey?.includes('your-anon-key') || supabaseAnonKey === 'placeholder_key';

// Validate required environment variables
if (!supabaseUrl || isPlaceholderUrl) {
  console.error('ERROR: Supabase URL is missing or using placeholder value.');
  console.error('Please update your .env file with your actual Supabase URL from your Supabase dashboard (Project Settings > API).');
}

if (!supabaseAnonKey || isPlaceholderKey) {
  console.error('ERROR: Supabase Anonymous Key is missing or using placeholder value.');
  console.error('Please update your .env file with your actual anon/public key from your Supabase dashboard (Project Settings > API).');
}

// Create a mock client to prevent app crashes when credentials are missing
const createMockClient = () => {
  // Create a proper mock for auth functionality
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: { user: null, session: null }, error: { message: 'Mock auth: Cannot sign in' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Mock auth: Cannot sign up' } }),
    signOut: async () => ({ error: null }),
    // Critical fix for onAuthStateChange
    onAuthStateChange: (callback: any) => {
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
      then: (callback: any) => Promise.resolve(callback({ data: [], error: null })),
    };
    return mockQuery;
  };
  
  // Main mock client
  const mockClient = {
    auth: mockAuth,
    from: (table: string) => mockFrom(table),
    channel: (name: string) => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({})
    }),
    // Add any other methods your app commonly uses
  };
  
  return mockClient;
};

// Create the client only if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey && !isPlaceholderUrl && !isPlaceholderKey;

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createMockClient(); 

// Add enhanced logging for debugging - safely check if the method exists
if (supabase && typeof supabase.channel === 'function') {
  // For newer Supabase versions that don't have .on() directly
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
} else if (hasValidCredentials && !supabase) {
  console.warn('Supabase client was not initialized properly.');
  
  // Create a more visible error message in the browser console
  if (typeof window !== 'undefined') {
    console.error('%c⚠️ Supabase Connection Error ⚠️', 'font-size: 20px; font-weight: bold; color: red;');
    console.error('%cCould not connect to Supabase. Please check your environment variables.', 'font-size: 16px;');
    console.error('%c1. Ensure .env file has valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', 'font-size: 14px;');
    console.error('%c2. Restart your dev server after making changes', 'font-size: 14px;');
  }
}
