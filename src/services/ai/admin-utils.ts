
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
    
    // Fall back to the RPC function - using direct fetch to avoid RPC name issues
    try {
      const { data, error } = await supabase.functions.invoke('get-user-email', {
        body: { userId }
      });
      
      if (error) throw error;
      return data || 'E-post utilgjengelig';
    } catch (rpcError) {
      console.error('Error fetching user email via functions:', rpcError);
      
      // Final fallback - try the Edge Function with direct fetch
      try {
        const sessionData = await supabase.auth.getSession();
        const accessToken = sessionData.data?.session?.access_token;
        
        if (!accessToken) {
          return 'E-post utilgjengelig - no authentication';
        }
        
        // Using custom fetch instead of directly invoking to avoid type issues
        const response = await fetch(`https://wqpoozpbceucynsojmbk.supabase.co/functions/v1/get-user-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ userId })
        });
        
        if (!response.ok) {
          console.error('Error fetching user email via Edge Function:', response.statusText);
          return 'E-post utilgjengelig';
        }
        
        const data = await response.text();
        return data || 'E-post utilgjengelig';
      } catch (edgeError) {
        console.error('Error calling edge function:', edgeError);
        return 'E-post utilgjengelig';
      }
    }
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
