
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
    // First try the direct admin API method
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (!userError && userData?.user?.email) {
      return userData.user.email;
    }
    
    // Fall back to the RPC function
    const { data: emailData, error: rpcError } = await supabase.rpc('get_user_email', {
      user_id: userId
    });
    
    if (rpcError) {
      console.error('Error fetching user email via RPC:', rpcError);
      
      // Final fallback - try the Edge Function
      try {
        const { data: edgeFnData, error: edgeFnError } = await supabase.functions.invoke('get-user-email', {
          body: { userId }
        });
        
        if (edgeFnError) {
          console.error('Error fetching user email via Edge Function:', edgeFnError);
          return 'E-post utilgjengelig';
        }
        
        return edgeFnData as string || 'E-post utilgjengelig';
      } catch (edgeError) {
        console.error('Error calling edge function:', edgeError);
        return 'E-post utilgjengelig';
      }
    }
    
    return emailData as string || 'E-post ikke funnet';
  } catch (error) {
    console.error('Error in fetchUserEmail:', error);
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
      user_id: session.user.id,
      role: 'admin'
    });
    
    if (roleError || !hasAdminRole) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
