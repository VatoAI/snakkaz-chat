import { supabase } from '@/integrations/supabase/client';

/**
 * This function tests the connection to Supabase
 * Run this function to verify that your Supabase connection is working
 */
export async function testSupabaseConnection() {
  try {
    // Test the connection by attempting to get the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        error
      };
    }
    
    // Try to make a simple query to test database access
    const { data: healthCheck, error: dbError } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
      
    if (dbError) {
      console.error('Supabase database access error:', dbError.message);
      return {
        success: false,
        message: `Database access failed: ${dbError.message}`,
        error: dbError
      };
    }
    
    return {
      success: true,
      message: 'Supabase connection established successfully!',
      sessionData: data,
      healthCheck
    };
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return {
      success: false,
      message: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      error: err
    };
  }
}