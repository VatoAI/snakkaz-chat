
import { useEffect } from 'react';
import { Friend } from '../types';
import { useFriendFetching } from './useFriendFetching';
import { useFriendSubscription } from './useFriendSubscription';

export const useFriendRequests = (currentUserId: string) => {
  const { friends, pendingRequests, fetchFriends } = useFriendFetching(currentUserId);
  
  useFriendSubscription(currentUserId, fetchFriends);

  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
    }
  }, [currentUserId, fetchFriends]);

  return { friends, pendingRequests };
};
