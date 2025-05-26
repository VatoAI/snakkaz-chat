/**
 * DEPRECATED: This file is no longer used.
 * Please import Supabase client from '@/lib/supabaseClient' instead.
 * 
 * This file is kept for historical reference and will be removed in a future release.
 */

// Re-export the singleton client for backward compatibility
import { supabase as supabaseClient, getSession, getUser } from '@/lib/supabaseClient';

// Export the client for backward compatibility
export const supabase = supabaseClient;

// Log deprecation notice in development
if (import.meta.env.DEV) {
  console.warn(
    'The file src/integrations/supabase/client-fixed.ts is deprecated.\n' +
    'Please import the Supabase client from @/lib/supabaseClient instead.'
  );
}

// Export utility functions
export { getSession, getUser };

// Export a function to check if the client is properly connected
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabaseClient.auth.getSession();
    return !error;
  } catch (e) {
    console.error('Error checking Supabase connection:', e);
    return false;
  }
};

// Default export for ESM compatibility
export default supabaseClient;
