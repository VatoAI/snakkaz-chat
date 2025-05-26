
import { useCallback } from 'react';
import { useAuth } from '../useAuth';
import { markMessageAsRead, markMessagesAsRead } from '../../utils/message-utils';

export const useMessageReadStatus = () => {
  const { user } = useAuth();

  const handleMarkAsRead = useCallback(async (messageId: string) => {
    if (!user || !user.id) return;
    await markMessageAsRead(messageId, user.id);
  }, [user]);

  const handleMarkMultipleAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || !user.id || !messageIds.length) return;
    await markMessagesAsRead(messageIds, user.id);
  }, [user]);

  return {
    markMessageAsRead: handleMarkAsRead,
    markMessagesAsRead: handleMarkMultipleAsRead,
  };
};
