import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";
import { encryptGroupMessage } from "@/utils/encryption/group-e2ee";

export const useGroupMessageSender = (
  currentUserId: string,
  groupId: string,
  memberIds: string[],
  onNewMessage: (message: DecryptedMessage) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { toast } = useToast();
  const errorResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<string[]>([]);
  const processingQueue = useRef<boolean>(false);

  const clearSendError = useCallback(() => {
    setSendError(null);
    if (errorResetTimeout.current) {
      clearTimeout(errorResetTimeout.current);
      errorResetTimeout.current = null;
    }
  }, []);

  // Send melding til gruppe via server med forbedret kryptering
  const sendGroupMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!currentUserId || !groupId) {
      console.log('Group message failed: Missing currentUserId or groupId', { currentUserId, groupId });
      return false;
    }
    
    try {
      console.log('Krypterer melding med gruppespesifikk kryptering...');
      
      // Bruk gruppespesifikk kryptering istedenfor standard kryptering
      const { encryptedContent, key, iv } = await encryptGroupMessage(groupId, message.trim());
      
      console.log('Sender melding til gruppe...');
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          group_id: groupId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_encrypted: true,
          read_at: null,
          is_deleted: false,
        });
      
      if (error) {
        console.error('Error fra server ved sending av gruppemelding:', error);
        throw error;
      }
      
      console.log('Melding sendt til gruppe med forbedret ende-til-ende-kryptering');
      return true;
    } catch (error) {
      console.error('Group message failed:', error);
      throw error;
    }
  }, [currentUserId, groupId]);

  // Process the message queue
  const processMessageQueue = useCallback(async () => {
    if (processingQueue.current || messageQueue.current.length === 0) {
      return;
    }
    
    processingQueue.current = true;
    
    try {
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current[0];
        const success = await sendGroupMessage(message);
        
        if (success) {
          // Remove the message from the queue if sent successfully
          messageQueue.current.shift();
          
          // Create a local message representation for UI update
          const timestamp = new Date().toISOString();
          const localMessage: DecryptedMessage = {
            id: `local-${Date.now()}`,
            content: message,
            sender: {
              id: currentUserId,
              username: null,
              full_name: null
            },
            receiver_id: null,
            group_id: groupId,
            created_at: timestamp,
            encryption_key: '',
            iv: '',
            is_encrypted: true,
            is_deleted: false,
            deleted_at: null
          };
          
          // Update UI with the local message
          onNewMessage(localMessage);
        } else {
          // Leave message in queue for retry
          break;
        }
      }
    } catch (error) {
      console.error('Error processing group message queue:', error);
    } finally {
      processingQueue.current = false;
    }
  }, [currentUserId, groupId, sendGroupMessage, onNewMessage]);

  const handleSendMessage = useCallback(async (e: React.FormEvent, message: string) => {
    e.preventDefault();
    if (!message.trim() || !groupId || !currentUserId) {
      console.log('Group message sending aborted: empty message or missing IDs', { 
        messageEmpty: !message.trim(), 
        groupId, 
        currentUserId 
      });
      return false;
    }
    
    console.log('Starting group message send process...');
    setIsLoading(true);
    clearSendError();
    
    try {
      // Add message to queue
      messageQueue.current.push(message);
      
      // Start processing the queue if not already processing
      await processMessageQueue();
      
      return true;
    } catch (error) {
      console.error('Error sending group message:', error);
      setSendError('Kunne ikke sende melding til gruppen. Prøv igjen senere.');
      
      toast({
        title: "Feil",
        description: "Kunne ikke sende gruppemelding. Prøv igjen senere.",
        variant: "destructive",
      });
      
      // Auto-clear error after 5 seconds
      errorResetTimeout.current = setTimeout(() => {
        setSendError(null);
      }, 5000);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, groupId, clearSendError, processMessageQueue, toast]);

  return {
    isLoading,
    sendError,
    handleSendMessage,
    clearSendError
  };
};
