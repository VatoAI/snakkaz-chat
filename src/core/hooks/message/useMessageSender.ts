import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { useMediaHandler } from "./useMessageSender/useMediaHandler";
import { useP2PDelivery } from "./useMessageSender/useP2PDelivery";
import { globalEncryptMessage } from "./useMessageSender/globalEncryption";
import { getGlobalE2EEKey } from "@/utils/encryption/global-e2ee";

// Ensure message columns exist in the database
const ensureMessageColumnsExist = async () => {
  try {
    await supabase.rpc('ensure_message_columns');
    return true;
  } catch (error) {
    console.error('Error ensuring message columns exist:', error);
    return false;
  }
};

export const useMessageSender = (
  userId: string | null,
  newMessage: string,
  setNewMessage: (message: string) => void,
  ttl: number | null,
  setIsLoading: (loading: boolean) => void,
  toast: any
) => {
  const { handleMediaUpload } = useMediaHandler();
  const { handleP2PDelivery } = useP2PDelivery();
  const [globalKey, setGlobalKey] = useState<string | null>(null);

  // Fetch the secure global encryption key on startup
  useEffect(() => {
    const loadGlobalKey = async () => {
      try {
        const key = await getGlobalE2EEKey();
        setGlobalKey(key);
      } catch (error) {
        console.error('Error loading global encryption key:', error);
      }
    };

    loadGlobalKey();
  }, []);

  const handleSendMessage = useCallback(async (
    webRTCManager: any,
    onlineUsers: Set<string>,
    mediaFile?: File,
    receiverId?: string,
    groupId?: string,
    onProgress?: (progress: number) => void
  ) => {
    if ((!newMessage.trim() && !mediaFile) || !userId) {
      toast({
        title: "Feil",
        description: "Du må skrive en melding eller legge ved en fil før du kan sende.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    let toastId = null;
    try {
      await ensureMessageColumnsExist();
      const isGlobalRoom = !receiverId && !groupId;
      let globalE2eeKey: string | undefined;
      let globalE2eeIv: string | undefined;

      if (isGlobalRoom) {
        // Use the secure global key
        globalE2eeKey = globalKey || await getGlobalE2EEKey();

        // Generate a new secure IV for each message
        const secureIv = window.crypto.getRandomValues(new Uint8Array(12));
        globalE2eeIv = btoa(String.fromCharCode.apply(null, Array.from(secureIv)));
      }

      // Handle media file upload/encryption if provided
      let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;
      if (mediaFile) {
        // Fixed: Pass correct parameters to handleMediaUpload
        const globalOverride = globalE2eeKey && globalE2eeIv ?
          { encryptionKey: globalE2eeKey, iv: globalE2eeIv } : undefined;

        const result = await handleMediaUpload(mediaFile, toast, globalOverride, onProgress);
        mediaUrl = result.mediaUrl;
        mediaType = result.mediaType;
        encryptionKey = result.encryptionKey;
        iv = result.iv;
        mediaMetadata = result.mediaMetadata;
        toastId = result.toastId;
      }

      // P2P delivery (if global room)
      let p2pDeliveryCount = 0;
      if (webRTCManager && isGlobalRoom) {
        p2pDeliveryCount = await handleP2PDelivery(webRTCManager, onlineUsers, userId, newMessage);
      }

      // P2P delivery for direct messages
      if (webRTCManager && receiverId && !groupId) {
        try {
          // Only attempt P2P if the other user is online
          if (onlineUsers.has(receiverId)) {
            await webRTCManager.sendDirectMessage(receiverId, newMessage);
            console.log('Direct message sent via P2P successfully');
          }
        } catch (p2pError) {
          console.error('P2P direct message failed, falling back to server:', p2pError);
        }
      }

      // Encrypt message text (override key/iv for global)
      let encryptedContent, key, messageIv;
      if (isGlobalRoom && globalE2eeKey && globalE2eeIv) {
        const encryptionResult = await globalEncryptMessage(globalE2eeKey, globalE2eeIv, newMessage.trim());
        encryptedContent = encryptionResult.encryptedContent;
        key = encryptionResult.key;
        messageIv = encryptionResult.iv;
      } else {
        const encryptionResult = await encryptMessage(newMessage.trim());
        encryptedContent = encryptionResult.encryptedContent;
        key = encryptionResult.key;
        messageIv = encryptionResult.iv;
      }

      // Always store message on server for persistence
      console.log('Sending encrypted message to server...');
      const { error } = await supabase
        .from('messages')
        .insert({
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: messageIv,
          sender_id: userId,
          ephemeral_ttl: ttl,
          media_url: mediaUrl,
          media_type: mediaType,
          media_encryption_key: encryptionKey,
          media_iv: iv,
          media_metadata: mediaMetadata,
          receiver_id: receiverId,
          group_id: groupId,
          p2p_delivery_count: p2pDeliveryCount > 0 ? p2pDeliveryCount : null
        });

      if (error) {
        console.error('Send message error:', error);
        throw new Error(`Could not send message: ${error.message}`);
      } else {
        console.log('Message sent successfully');
        setNewMessage('');
        
        // Close toast notification if media upload was successful
        if (toastId) {
          toast({
            id: toastId,
            title: 'Opplasting fullført',
            description: 'Mediet ble lastet opp og sendt.',
            variant: 'success'
          });
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke sende melding. Sjekk nettverksforbindelsen din.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, userId, ttl, setNewMessage, setIsLoading, toast, globalKey, handleMediaUpload, handleP2PDelivery]);

  return { handleSendMessage };
};
