import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Mark a message as read
 * @param messageId The ID of the message to mark as read
 * @param currentUserId The ID of the user who read the message
 */
export async function markMessageAsRead(messageId: string, currentUserId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ 
        read_at: new Date().toISOString(),
        is_delivered: true
      })
      .match({ 
        id: messageId,
        receiver_id: currentUserId,
        read_at: null
      });

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception when marking message as read:', err);
    return false;
  }
}

/**
 * Mark multiple messages as read
 * @param messageIds Array of message IDs to mark as read
 * @param currentUserId The ID of the user who read the messages
 */
export async function markMessagesAsRead(messageIds: string[], currentUserId: string): Promise<boolean> {
  try {
    if (!messageIds.length) return true;

    const { error } = await supabase
      .from('messages')
      .update({ 
        read_at: new Date().toISOString(),
        is_delivered: true
      })
      .in('id', messageIds)
      .eq('receiver_id', currentUserId)
      .is('read_at', null);

    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception when marking messages as read:', err);
    return false;
  }
}

// Other message utility functions
export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const isMessageExpired = (message: any): boolean => {
  if (!message.ephemeral_ttl) return false;
  
  const createdAt = new Date(message.created_at).getTime();
  const expiryTime = createdAt + (message.ephemeral_ttl * 1000);
  return Date.now() > expiryTime;
};

export const getMessageExpiryTime = (message: any): number | null => {
  if (!message.ephemeral_ttl) return null;
  
  const createdAt = new Date(message.created_at).getTime();
  const expiryTime = createdAt + (message.ephemeral_ttl * 1000);
  return expiryTime;
};
