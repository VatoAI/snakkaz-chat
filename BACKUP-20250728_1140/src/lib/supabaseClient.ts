/**
 * Unified Supabase Client - SINGLETON PATTERN
 * 
 * PRODUCTION HARDENED VERSION - May 22, 2025
 * 
 * IMPORTANT: This file is now a wrapper around the new supabase-singleton.ts
 * Implementation moved to the new file to ensure consistency.
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as supabaseSingleton, getSession, getUser } from './supabase-singleton';

// Re-export from singleton to maintain compatibility
export const supabase = supabaseSingleton;

// Re-export helper functions
export { getSession, getUser };

/**
 * Backward compatibility function that just returns the singleton
 * @deprecated Use direct import from supabase-singleton instead
 */
function getSupabaseClient(): SupabaseClient {
  console.warn('getSupabaseClient is deprecated, import directly from supabase-singleton');
  return supabase;
}

// Export the function for backward compatibility
export { getSupabaseClient };

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
