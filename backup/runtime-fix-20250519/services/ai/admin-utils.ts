import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for admin operations
 */

/**
 * Fetches a user's email address securely
 * Can only be called by users with admin role
 * 
 * @param userId - The ID of the user whose email should be retrieved
 * @returns Promise resolving to the user's email or an error message
 */
export const fetchUserEmail = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_user_email', { 
      userid: userId 
    });
    
    if (error) throw error;
    return data || 'E-post utilgjengelig';
  } catch (error) {
    console.error('Error fetching user email:', error);
    return 'Feil ved henting av e-post';
  }
};

/**
 * Checks if the current user has admin privileges
 * 
 * @returns Promise resolving to a boolean indicating if the user is an admin
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    if (!session) return false;
    
    const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
      user_id: session.user.id,
      role: 'admin'
    });
    
    if (roleError || hasAdminRole === null) {
      return false;
    }
    
    return Boolean(hasAdminRole);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
