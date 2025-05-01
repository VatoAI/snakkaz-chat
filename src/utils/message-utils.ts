
import { supabase } from '../lib/supabaseClient';

/**
 * Mark a message as read
 * @param messageId The ID of the message to mark as read
 * @param userId The ID of the user who read the message
 */
export const markMessageAsRead = async (messageId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('message_reads')
      .upsert(
        { 
          message_id: messageId, 
          user_id: userId, 
          read_at: new Date().toISOString() 
        },
        { onConflict: 'message_id,user_id' }
      );
    
    if (error) {
      console.error('Error marking message as read:', error);
    }
  } catch (error) {
    console.error('Failed to mark message as read:', error);
  }
};

/**
 * Mark multiple messages as read
 * @param messageIds Array of message IDs to mark as read
 * @param userId The ID of the user who read the messages
 */
export const markMessagesAsRead = async (messageIds: string[], userId: string) => {
  try {
    if (!messageIds.length) return;
    
    const readRecords = messageIds.map(messageId => ({
      message_id: messageId,
      user_id: userId,
      read_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('message_reads')
      .upsert(readRecords, { onConflict: 'message_id,user_id' });

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
  }
};
