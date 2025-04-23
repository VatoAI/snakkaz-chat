
import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

export const useDirectMessageSender = (
  currentUserId: string,
  friendId: string | undefined,
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

  const sendMessageViaServer = useCallback(async (message: string): Promise<boolean> => {
    if (!currentUserId || !friendId) {
      console.log('Server message failed: Missing currentUserId or friendId', { currentUserId, friendId });
      return false;
    }
    
    try {
      console.log('Encrypting message for server delivery...');
      const { encryptedContent, key, iv } = await encryptMessage(message.trim());
      
      console.log('Sending message via server...');
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: friendId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_encrypted: true,
          read_at: null,
          is_deleted: false,
        });
      
      if (error) {
        console.error('Error from server when sending message:', error);
        throw error;
      }
      
      console.log('Message sent via server with end-to-end encryption');
      return true;
    } catch (error: any) {
      console.error('Server message failed:', error);
      throw new Error(error.message || 'Ukjent feil ved sending via server');
    }
  }, [currentUserId, friendId]);

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
              full_name: null
            },
            receiver_id: friendId,
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
    } catch (error: any) {
      console.error('Error processing message queue:', error);
      throw new Error(error.message || 'Feil ved behandling av meldingskø');
    } finally {
      processingQueue.current = false;
    }
  }, [currentUserId, friendId, sendMessageViaServer, onNewMessage]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract message from form event or use the stored newMessage state
    const form = e.target as HTMLFormElement;
    const messageInput = form.querySelector('textarea, input[type="text"]') as HTMLTextAreaElement | HTMLInputElement | null;
    const message = messageInput?.value || '';
    
    if (!message.trim() || !friendId || !currentUserId) {
      console.log('Message sending aborted: empty message or missing IDs', { 
        messageEmpty: !message.trim(), 
        friendId, 
        currentUserId 
      });
      return false;
    }
    
    console.log('Starting message send process...');
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
      console.error('Error sending message:', error);
      
      // Provide a more specific error message
      const errorMessage = error.message || 'Kunne ikke sende melding. Sjekk nettverksforbindelsen din.';
      setSendError(errorMessage);
      
      toast({
        title: "Feil ved sending av melding",
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
  }, [currentUserId, friendId, clearSendError, processMessageQueue, toast]);

  return {
    isLoading,
    sendError,
    handleSendMessage,
    clearSendError
  };
};
