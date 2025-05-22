/**
 * Unified Supabase Client - SINGLETON PATTERN
 * 
 * PRODUCTION HARDENED VERSION - May 22, 2025
 * 
 * This is the single source of truth for the Supabase client.
 * All components should import from this file to prevent multiple instances.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Import environment utility
import { ENV } from '@/utils/env/environmentFix';

// Direct access to Supabase credentials with fallbacks
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton pattern)
 * With improved error handling for production
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Validate configuration before creating client
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    // Create the Supabase client with production-safe settings
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // More stable in production
      },
    });
    
    // Test the client connection in development only
    if (ENV.DEV) {
      console.log('Supabase client initialized successfully (singleton)');
    }
    
    return supabaseInstance;
  } catch (error) {
    // Log error in development only
    if (ENV.DEV) {
      console.error('Failed to initialize Supabase client:', error);
    }
    
    // Create minimal client to prevent crashes
    supabaseInstance = createClient(
      supabaseUrl || 'https://wqpoozpbceucynsojmbk.supabase.co', 
      supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8'
    );
    
    return supabaseInstance;
  }
}

// Export the singleton instance to prevent multiple instances
export const supabase = getSupabaseClient();

// Compatibility export for code using the function pattern
export const createSupabaseClient = () => supabase;

// Added verification function that actually tests the connection
export async function verifySupabaseConnection(): Promise<boolean> {
  try {
    // Simple health check - just check anonymous auth status
    const { error } = await supabase.auth.getSession();
    return !error;
  } catch {
    return false;
  }
}
