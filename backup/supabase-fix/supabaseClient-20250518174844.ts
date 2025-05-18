/**
 * Unified Supabase Client - SINGLETON PATTERN
 * 
 * This is the single source of truth for the Supabase client.
 * All components should import from this file to prevent multiple instances.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@/config/environment';

// Use environment configuration or fallback to direct env variables
const supabaseUrl = environment.supabase.url || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = environment.supabase.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase configuration missing. Check your environment variables or config/environment.ts');
}

// Create a singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton pattern)
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Only create a new instance if one doesn't exist
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'snakkaz-chat',
        },
      },
    });
    
    // Log success in development mode
    if (import.meta.env.DEV) {
      console.log('Supabase client initialized successfully (singleton)');
    }
    
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
}

// Export the singleton instance getter
export const supabase = getSupabaseClient();

// Also export as default
export default supabase;
