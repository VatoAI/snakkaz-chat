/**
 * UNIFIED SUPABASE CLIENT - SINGLETON PATTERN
 * 
 * Version 2.0.0 - May 22, 2025
 * 
 * This is the single source of truth for the Supabase client.
 * All components should import the supabase client from this file
 * to prevent the "Multiple GoTrueClient instances" warning.
 */
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Environment values with fallbacks for production stability
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

// Log configuration in development only
if (import.meta.env.DEV) {
  console.log('Supabase Singleton: Initializing with URL:', SUPABASE_URL);
}

/**
 * Singleton Supabase Client
 * Using module pattern to ensure only one instance is created
 */
class SupabaseSingleton {
  private static instance: SupabaseClient | null = null;
  
  /**
   * Get the Supabase client instance
   * Creates it if it doesn't exist yet
   */
  public static getInstance(): SupabaseClient {
    if (!this.instance) {
      // Create the client with production-safe settings
      this.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false, // More stable in production
        },
        global: {
          headers: {
            'X-Client-Info': 'snakkaz-chat',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
      });
      
      if (import.meta.env.DEV) {
        console.log('Supabase Singleton: Client instance created successfully');
      }
    }
    
    return this.instance;
  }
  
  /**
   * Reset the instance (primarily for testing)
   */
  public static resetInstance(): void {
    this.instance = null;
  }
}

// Export the singleton instance
export const supabase = SupabaseSingleton.getInstance();

// Export typed helper functions
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user || null, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session || null, error };
};
