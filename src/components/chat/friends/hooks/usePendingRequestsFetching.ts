
import { useState, useCallback } from 'react';
import { Friend } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const usePendingRequestsFetching = (currentUserId: string) => {
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);

  const fetchPendingRequests = useCallback(async () => {
    if (!currentUserId) return [];

    try {
      const { data: pendingData, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('friend_id', currentUserId)
        .eq('status', 'pending');
        
      if (pendingError) throw pendingError;
      
      const formattedRequests: Friend[] = [];
      
      for (const request of pendingData || []) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', request.user_id)
          .single();
          
        if (!profileError && profileData) {
          formattedRequests.push({
            id: request.id,
            user_id: request.user_id,
            friend_id: request.friend_id,
            status: request.status,
            created_at: request.created_at,
            profile: profileData
          });
        }
      }
      
      setPendingRequests(formattedRequests);
      return formattedRequests;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }, [currentUserId]);

  return { pendingRequests, fetchPendingRequests };
};
