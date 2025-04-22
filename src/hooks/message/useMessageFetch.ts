import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { decryptMessage } from "@/utils/encryption";

export const useMessageFetch = (
  userId: string | null, 
  setMessages: (updater: React.SetStateAction<DecryptedMessage[]>) => void,
  toast: any,
  receiverId?: string,
  groupId?: string
) => {
  const fetchMessages = useCallback(async () => {
    if (!userId) {
      console.log("User not authenticated");
      return;
    }

    try {
      // First, check if necessary columns exist
      try {
        await supabase.rpc('check_and_add_columns', { 
          p_table_name: 'messages', 
          column_names: ['is_edited', 'edited_at', 'is_deleted', 'deleted_at', 'group_id', 'read_at', 'is_delivered'] as any
        });
      } catch (error) {
        console.log('Error checking columns, continuing anyway:', error);
      }

      // Now we can fetch the messages
      let query = supabase
        .from('messages')
        .select(`
          id,
          encrypted_content,
          encryption_key,
          iv,
          created_at,
          ephemeral_ttl,
          media_url,
          media_type,
          receiver_id,
          is_edited,
          edited_at,
          is_deleted,
          deleted_at,
          group_id,
          read_at,
          is_delivered,
          sender:sender_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true });

      // If receiverId is specified, only fetch messages between user and receiver
      if (receiverId) {
        query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`);
      } 
      // If groupId is specified, only fetch messages for that group
      else if (groupId) {
        // Now using string for group_id
        query = query.eq('group_id', groupId);
      } 
      // Otherwise, fetch global messages (null receiver and null group)
      else {
        query = query.is('receiver_id', null).is('group_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Decrypt messages
      const decryptedMessages: (DecryptedMessage | null)[] = await Promise.all(
        (data || []).map(async (message: any) => {
          try {
            // Check if message has expired
            if (message.ephemeral_ttl) {
              const createdAt = new Date(message.created_at).getTime();
              const expiresAt = createdAt + (message.ephemeral_ttl * 1000);
              if (Date.now() > expiresAt) {
                // Skip expired messages
                return null;
              }
            }

            const content = await decryptMessage(
              message.encrypted_content,
              message.encryption_key,
              message.iv
            );

            return {
              id: message.id,
              content,
              sender: message.sender,
              created_at: message.created_at,
              encryption_key: message.encryption_key,
              iv: message.iv,
              ephemeral_ttl: message.ephemeral_ttl,
              media_url: message.media_url,
              media_type: message.media_type,
              is_edited: message.is_edited || false,
              edited_at: message.edited_at || null,
              is_deleted: message.is_deleted || false,
              deleted_at: message.deleted_at || null,
              receiver_id: message.receiver_id,
              group_id: message.group_id,
              read_at: message.read_at,
              is_delivered: message.is_delivered || false
            };
          } catch (decryptError) {
            console.error("Error decrypting message:", decryptError);
            return null;
          }
        })
      );

      // Filter out null messages (expired or decrypt failed)
      const validMessages = decryptedMessages.filter(msg => msg !== null) as DecryptedMessage[];
      
      setMessages(validMessages);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente meldinger",
        variant: "destructive",
      });
    }
  }, [userId, setMessages, toast, receiverId, groupId]);

  return { fetchMessages };
};
