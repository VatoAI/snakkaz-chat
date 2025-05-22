// Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning
import { supabase } from '@/lib/supabase-singleton';
import { environment } from '@/config/environment';

// Use custom domain if available, otherwise fall back to standard URL
const supabaseUrl = environment.supabase.customDomain 
  ? `https://${environment.supabase.customDomain}/api` 
  : (ENV.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co');

const supabaseAnonKey = ENV.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

// Legg til logging kun i utviklingsmiljøet
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Using custom domain:', environment.supabase.customDomain ? 'Yes' : 'No');
  console.log('Supabase Key (første 10 tegn):', supabaseAnonKey?.substring(0, 10) + '...');
}

// Check for placeholder values that were not replaced
const isPlaceholderUrl = false; // Direct values set, not using placeholders anymore
const isPlaceholderKey = false;

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
    onAuthStateChange: (callback: (event: unknown, session: unknown) => void) => {
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

// Forbedrede klientinnstillinger for ytelse og sikkerhet
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Støtter automatisk håndtering av auth-callback
      storage: {
        // Bruk sikker storage når tilgjengelig
        getItem: (key) => {
          try {
            return Promise.resolve(localStorage.getItem(key));
          } catch (error) {
            // Fallback til sessionStorage hvis localStorage ikke er tilgjengelig
            try {
              return Promise.resolve(sessionStorage.getItem(key));
            } catch {
              return Promise.resolve(null);
            }
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
            return Promise.resolve();
          } catch (error) {
            try {
              sessionStorage.setItem(key, value);
              return Promise.resolve();
            } catch {
              return Promise.resolve();
            }
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
            return Promise.resolve();
          } catch (error) {
            try {
              sessionStorage.removeItem(key);
              return Promise.resolve();
            } catch {
              return Promise.resolve();
            }
          }
        }
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    // Forbedring: Legg til global feilhåndtering
    global: {
      fetch: (url, options) => {
        const controller = new AbortController();
        const { signal } = controller;
        
        // Timeout på 30 sekunder for alle forespørsler
        const timeout = setTimeout(() => {
          controller.abort();
        }, 30000);
        
        return fetch(url, { ...options, signal })
          .finally(() => clearTimeout(timeout));
      }
    }
  });

  // Test tilkoblingen kun i utviklingsmiljø
  if (import.meta.env.DEV) {
    supabaseClient.auth.getSession()
      .then(response => {
        if (response.error) {
          console.error('Supabase connection test failed:', response.error.message);
          if (response.error.message.includes('invalid key')) {
            console.error('%c⚠️ API NØKKELFEIL: Den oppgitte API-nøkkelen er ugyldig! ⚠️', 'font-size: 16px; color: red;');
            console.error('Vennligst sjekk at du bruker den korrekte "anon" eller "public" nøkkelen fra Supabase-dashbordet.');
          }
        } else {
          console.log('Supabase connection test succeeded!', response.data ? 'Session exists' : 'No session');
        }
      })
      .catch(err => {
        console.error('Supabase connection test error:', err);
      });
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  supabaseClient = null;
}

// Export the client or mock if creation failed
export const supabase = supabaseClient || createMockClient();

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
} else if (!supabaseClient && import.meta.env.DEV) {
  console.warn('Supabase client was not initialized properly.');

  // Create a more visible error message in the browser console
  if (typeof window !== 'undefined') {
    console.error('%c⚠️ Supabase Connection Error ⚠️', 'font-size: 20px; font-weight: bold; color: red;');
    console.error('%cCould not connect to Supabase. Please check your environment variables.', 'font-size: 16px;');
    console.error('%c1. Ensure .env file has valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', 'font-size: 14px;');
    console.error('%c2. Restart your dev server after making changes', 'font-size: 14px;');
    console.error('%c3. Try getting new API keys from your Supabase dashboard', 'font-size: 14px;');
  }
}

// Utility for service-level API access (should only be used on secure server contexts)
export const createServiceClient = (serviceKey: string) => {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL for service client');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
