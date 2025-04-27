
import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { decryptMessage } from "@/utils/encryption";

export const useMessageRealtime = (
  userId: string | null, 
  setMessages: (updater: React.SetStateAction<DecryptedMessage[]>) => void,
  receiverId?: string,
  groupId?: string
) => {
  const activeChannelRef = useRef<any>(null);

  const setupRealtimeSubscription = useCallback(() => {
    if (!userId) {
      console.log("User not authenticated");
      return () => {};
    }

    // Clean up any existing subscription
    if (activeChannelRef.current) {
      console.log("Cleaning up existing subscription");
      supabase.removeChannel(activeChannelRef.current);
      activeChannelRef.current = null;
    }

    let channelFilter = "*";
    if (receiverId) {
      channelFilter = `and(or(sender_id:eq:${userId},sender_id:eq:${receiverId}),or(receiver_id:eq:${userId},receiver_id:eq:${receiverId}))`;
    } else if (groupId) {
      channelFilter = `group_id:eq:${groupId}`;
    } else {
      channelFilter = `and(receiver_id:is:null,group_id:is:null)`;
    }

    console.log("Setting up realtime subscription with filter:", channelFilter);

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          console.log("Realtime INSERT event received:", payload);
          const newMessage = payload.new as any;
          
          // Skip messages sent by this user (already in UI)
          if (newMessage.sender_id === userId) {
            return;
          }

          try {
            const { data: senderData, error: senderError } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', newMessage.sender_id)
              .single();

            if (senderError) {
              throw senderError;
            }

            // For private messages, only add if it's for this user
            if (newMessage.receiver_id && newMessage.receiver_id !== userId) {
              return;
            }
            
            const content = await decryptMessage(
              newMessage.encrypted_content,
              newMessage.encryption_key,
              newMessage.iv
            );

            const decryptedMessage: DecryptedMessage = {
              id: newMessage.id,
              content,
              sender: senderData,
              created_at: newMessage.created_at,
              encryption_key: newMessage.encryption_key,
              iv: newMessage.iv,
              ephemeral_ttl: newMessage.ephemeral_ttl,
              media_url: newMessage.media_url,
              media_type: newMessage.media_type,
              is_edited: newMessage.is_edited || false,
              edited_at: newMessage.edited_at || null,
              is_deleted: newMessage.is_deleted || false,
              deleted_at: newMessage.deleted_at || null,
              receiver_id: newMessage.receiver_id,
              group_id: newMessage.group_id || null,
              read_at: newMessage.read_at,
              is_delivered: newMessage.is_delivered || false,
              media_encryption_key: newMessage.media_encryption_key,
              media_iv: newMessage.media_iv,
              media_metadata: newMessage.media_metadata,
            };

            setMessages(prevMessages => [...prevMessages, decryptedMessage]);
          } catch (error) {
            console.error("Error processing realtime message:", error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          console.log("Realtime UPDATE event received:", payload);
          const updatedMessage = payload.new as any;
          
          // Use a more efficient update approach to avoid full re-renders
          setMessages(prevMessages => 
            prevMessages.map(msg => {
              if (msg.id === updatedMessage.id) {
                // Create a shallow copy for the update
                const updatedMsg = { ...msg };
                
                // Handle deletion status
                if (updatedMessage.is_deleted) {
                  updatedMsg.is_deleted = true;
                  updatedMsg.deleted_at = updatedMessage.deleted_at || new Date().toISOString();
                  return updatedMsg;
                }
                
                // Handle metadata updates without content changes
                if (!updatedMessage.encrypted_content || !updatedMessage.encryption_key || !updatedMessage.iv) {
                  // Only update the metadata properties
                  updatedMsg.is_edited = updatedMessage.is_edited || msg.is_edited;
                  updatedMsg.edited_at = updatedMessage.edited_at || msg.edited_at;
                  updatedMsg.read_at = updatedMessage.read_at || msg.read_at;
                  updatedMsg.is_delivered = updatedMessage.is_delivered || msg.is_delivered;
                  return updatedMsg;
                }
                
                // For content updates, avoid triggering a state update until the content is decrypted
                const originalMsg = msg;
                
                // Decrypt content in the background
                decryptMessage(
                  updatedMessage.encrypted_content,
                  updatedMessage.encryption_key,
                  updatedMessage.iv
                ).then(content => {
                  // Update the message with decrypted content in a separate state update
                  setMessages(prevMsgs => 
                    prevMsgs.map(m => 
                      m.id === updatedMessage.id 
                        ? {
                            ...m,
                            content,
                            is_edited: updatedMessage.is_edited || false,
                            edited_at: updatedMessage.edited_at || null,
                            is_deleted: updatedMessage.is_deleted || false,
                            deleted_at: updatedMessage.deleted_at || null,
                            read_at: updatedMessage.read_at,
                            is_delivered: updatedMessage.is_delivered || false
                          }
                        : m
                    )
                  );
                }).catch(err => {
                  console.error("Error decrypting updated message:", err);
                });
                
                // Return the original message for now
                return originalMsg;
              }
              return msg;
            })
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          console.log("Realtime DELETE event received:", payload);
          const deletedMessage = payload.old as any;
          
          // Remove the deleted message from the state
          setMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== deletedMessage.id)
          );
        }
      )
      .subscribe();

    // Save the channel reference for cleanup
    activeChannelRef.current = channel;

    console.log("Realtime subscription set up successfully");

    // Return a cleanup function
    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
      activeChannelRef.current = null;
    };
  }, [userId, receiverId, groupId, setMessages]);

  return { 
    setupRealtimeSubscription,
    activeChannel: activeChannelRef.current 
  };
};
