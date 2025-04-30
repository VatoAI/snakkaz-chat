import { useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";
import { WebRTCManager } from "@/utils/webrtc";
import { isP2PEnabled, activeCommunicationConfig } from "@/config/communication-config";

export const useDirectMessageSender = (
  currentUserId: string,
  friendId: string | undefined,
  onNewMessage: (message: DecryptedMessage) => void,
  webRTCManager?: WebRTCManager | null
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { toast } = useToast();
  const errorResetTimeout = useRef<NodeJS.Timeout | null>(null);

  const clearSendError = useCallback(() => {
    setSendError(null);
    if (errorResetTimeout.current) {
      clearTimeout(errorResetTimeout.current);
      errorResetTimeout.current = null;
    }
  }, []);

  /**
   * Send en melding til en venn
   * Vil forsøke P2P først hvis aktivert, og falle tilbake til server
   */
  const handleSendMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!message.trim() || !friendId || !currentUserId) {
      console.log('Message sending aborted: empty message or missing IDs', { 
        messageEmpty: !message.trim(), 
        friendId, 
        currentUserId 
      });
      return false;
    }

    setIsLoading(true);
    clearSendError();
    
    try {
      const useP2P = isP2PEnabled() && webRTCManager && webRTCManager.isPeerReady(friendId);
      let p2pSuccess = false;
      
      // Forsøk P2P først hvis det er aktivert og peeren er tilgjengelig
      if (useP2P) {
        try {
          console.log('Forsøker å sende melding via P2P til', friendId);
          await webRTCManager!.sendDirectMessage(friendId, message);
          p2pSuccess = true;
          console.log('Melding sendt via P2P');
        } catch (p2pError) {
          console.error('P2P sending feilet:', p2pError);
          // Fortsett til server-sending hvis P2P feiler og fallback er aktivert
          p2pSuccess = false;
        }
      }
      
      // Hvis P2P ikke er aktivert, ikke lyktes, eller vi alltid sender via server
      if (!p2pSuccess || activeCommunicationConfig.enableServer) {
        console.log('Sender melding via server til', friendId);
        // Krypter meldingen
        const { encryptedContent, key, iv } = await encryptMessage(message.trim());
        
        // Send til Supabase
        const { error } = await supabase.from('messages').insert({
          sender_id: currentUserId,
          receiver_id: friendId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_encrypted: true,
          created_at: new Date().toISOString()
        });

        if (error) {
          console.error('Server sending feilet:', error);
          throw error;
        }
        
        console.log('Melding sendt via server');
      }

      // For øyeblikkelig UI-oppdatering, lag en lokal representasjon av meldingen
      const timestamp = new Date().toISOString();
      const localMessage: DecryptedMessage = {
        id: `local-${Date.now()}`,
        content: message,
        sender: {
          id: currentUserId,
          username: null,  // Disse vil bli fylt inn av mottakeren
          full_name: null
        },
        receiver_id: friendId,
        created_at: timestamp,
        encryption_key: '',  // Ikke lagre krypteringsnøkler i minnet
        iv: '',
        is_encrypted: true,
        is_deleted: false,
        deleted_at: null
      };
      
      // Oppdater UI med den lokale meldingen
      onNewMessage(localMessage);
      
      return true;
    } catch (error) {
      console.error('Error sending direct message:', error);
      setSendError('Kunne ikke sende melding. Prøv igjen senere.');
      
      // Auto-clear error after 5 seconds
      errorResetTimeout.current = setTimeout(() => {
        setSendError(null);
      }, 5000);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, friendId, webRTCManager, clearSendError, onNewMessage]);

  return {
    isLoading,
    sendError,
    handleSendMessage,
    clearSendError
  };
};