
import { useCallback } from 'react';
import { useAcceptedFriendsFetching } from './useAcceptedFriendsFetching';
import { usePendingRequestsFetching } from './usePendingRequestsFetching';

export const useFriendFetching = (currentUserId: string) => {
  const { friends, fetchAcceptedFriends } = useAcceptedFriendsFetching(currentUserId);
  const { pendingRequests, fetchPendingRequests } = usePendingRequestsFetching(currentUserId);

  const fetchFriends = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      await Promise.all([
        fetchAcceptedFriends(),
        fetchPendingRequests()
      ]);
    } catch (error) {
      console.error('Error fetching friends and requests:', error);
    }
  }, [currentUserId, fetchAcceptedFriends, fetchPendingRequests]);

  return { friends, pendingRequests, fetchFriends };
};
