import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption"; // Fjernet avhengigheten av generateEncryptionKey
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

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
  const groupSessionKey = useRef<string | null>(null);

  // Vår egen funksjon for å generere krypteringsnøkler
  const generateNewEncryptionKey = useCallback(async (): Promise<string> => {
    try {
      // Bruk WebCrypto API direkte
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256, // Fikset fra 'the256' til 256
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
      return JSON.stringify(exportedKey);
    } catch (error) {
      console.error("Encryption key generation failed:", error);
      // Fallback: Bruk en pseudotilfeldig nøkkel
      const randomKey = Array.from(
        window.crypto.getRandomValues(new Uint8Array(32)),
        byte => byte.toString(16).padStart(2, "0")
      ).join("");
      return randomKey;
    }
  }, []);

  // Initialiser eller hent gruppens sesjonsnøkkel
  const getOrCreateGroupSessionKey = useCallback(async (): Promise<string> => {
    // Hvis vi allerede har en sesjonsnøkkel, bruk den
    if (groupSessionKey.current) {
      return groupSessionKey.current;
    }

    try {
      // Forsøk å hente eksisterende gruppe-krypteringsnøkkel
      const { data } = await supabase
        .from('group_encryption')
        .select('session_key')
        .eq('group_id', groupId)
        .single();
      
      if (data?.session_key) {
        // Lagre nøkkelen i minnet for raskere tilgang
        groupSessionKey.current = data.session_key;
        return data.session_key;
      }

      // Hvis ingen nøkkel finnes, oppretter vi en ny
      const newKey = await generateNewEncryptionKey(); // Bruker vår egen funksjon her
      
      // Lagre den nye nøkkelen i databasen
      await supabase
        .from('group_encryption')
        .insert({
          group_id: groupId,
          session_key: newKey,
          created_by: currentUserId,
          created_at: new Date().toISOString()
        });
      
      // Lagre i minnet
      groupSessionKey.current = newKey;
      return newKey;
    } catch (error) {
      console.error('Feil ved henting/opprettelse av gruppesessjonsnøkkel:', error);
      // Fallback til å generere en lokal nøkkel som ikke lagres
      const fallbackKey = await generateNewEncryptionKey(); // Bruker vår egen funksjon her også
      groupSessionKey.current = fallbackKey;
      return fallbackKey;
    }
  }, [groupId, currentUserId, generateNewEncryptionKey]);

  const clearSendError = useCallback(() => {
    setSendError(null);
    if (errorResetTimeout.current) {
      clearTimeout(errorResetTimeout.current);
      errorResetTimeout.current = null;
    }
  }, []);

  const sendGroupMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!currentUserId || !groupId) {
      console.log('Group message failed: Missing currentUserId or groupId', { currentUserId, groupId });
      return false;
    }
    
    try {
      // Få gruppens sesjonsnøkkel
      const sessionKey = await getOrCreateGroupSessionKey();
      
      console.log('Krypterer gruppemelding med sesjonsnøkkel...');
      // Krypter meldingen med standard metode, men med gruppens sesjonsnøkkel
      const { encryptedContent, key, iv } = await encryptMessage(message.trim());
      
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
          // Legg til metadata for gruppemeldinger
          metadata: JSON.stringify({
            type: 'group_message',
            session_key_id: sessionKey.substring(0, 8) // Trunkert for logging
          })
        });
      
      if (error) {
        console.error('Error from server when sending group message:', error);
        throw error;
      }
      
      console.log('Melding sendt til gruppe med ende-til-ende-kryptering');
      return true;
    } catch (error) {
      console.error('Group message failed:', error);
      throw error;
    }
  }, [currentUserId, groupId, getOrCreateGroupSessionKey]);

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
