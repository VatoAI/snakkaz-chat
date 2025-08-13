import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

export const useGroupMessageSender = (
  currentUserId: string,
  groupId: string | undefined,
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

  // Handle sending messages to the server
  const sendMessageViaServer = useCallback(async (message: string): Promise<boolean> => {
    if (!currentUserId || !groupId) {
      console.log('Group message failed: Missing currentUserId or groupId', { currentUserId, groupId });
      return false;
    }
    
    try {
      console.log('Encrypting group message...');
      const { encryptedContent, key, iv } = await encryptMessage(message.trim());
      
      console.log('Sending group message to server...');
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          group_id: groupId,
          receiver_id: null, // Group messages don't have a specific receiver
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_encrypted: true,
          read_at: null,
          is_deleted: false,
        });
      
      if (error) {
        console.error('Error from server when sending group message:', error);
        throw error;
      }
      
      console.log('Group message sent successfully with encryption');
      return true;
    } catch (error: any) {
      console.error('Group message failed:', error);
      throw new Error(error.message || 'Ukjent feil ved sending av gruppemelding');
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
        const success = await sendMessageViaServer(message);
        
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
              full_name: null,
              avatar_url: null // Add avatar_url with null value
            },
            receiver_id: null,
            group_id: groupId,
            created_at: timestamp,
            updated_at: timestamp,
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
    } catch (error: any) {
      console.error('Error processing group message queue:', error);
      throw new Error(error.message || 'Feil ved behandling av gruppemeldingskø');
    } finally {
      processingQueue.current = false;
    }
  }, [currentUserId, groupId, sendMessageViaServer, onNewMessage]);

  // Main function for sending messages
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract message from form event
    const form = e.target as HTMLFormElement;
    const messageInput = form.querySelector('textarea, input[type="text"]') as HTMLTextAreaElement | HTMLInputElement | null;
    const message = messageInput?.value || '';
    
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
      
      // Clear the input field after successful send
      if (messageInput) {
        messageInput.value = '';
      }
      
      return true;
    } catch (error: any) {
      console.error('Error sending group message:', error);
      
      // Provide a specific error message
      const errorMessage = error.message || 'Kunne ikke sende gruppemelding. Sjekk nettverksforbindelsen din.';
      setSendError(errorMessage);
      
      toast({
        title: "Feil ved sending av gruppemelding",
        description: errorMessage,
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
