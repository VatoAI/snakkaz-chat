
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { useMediaHandler } from "./useMessageSender/useMediaHandler";

export const useMessageSend = (
  userId: string | null,
  newMessage: string,
  setNewMessage: (message: string) => void,
  ttl: number | null,
  setIsLoading: (loading: boolean) => void,
  toast: any
) => {
  const { handleMediaUpload } = useMediaHandler();

  const handleSendMessage = useCallback(async (
    webRTCManager: any, 
    onlineUsers: Set<string>, 
    mediaFile?: File, 
    receiverId?: string,
    groupId?: string
  ) => {
    if ((!newMessage.trim() && !mediaFile) || !userId) {
      toast({
        title: "Error",
        description: "Please enter a message or select a file to send.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    let toastId = null;
    try {
      // Handle media file upload/encryption if provided
      let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;
      if (mediaFile) {
        const result = await handleMediaUpload(mediaFile, toast);
        ({ mediaUrl, mediaType, encryptionKey, iv, mediaMetadata, toastId } = result);
      }

      // Try P2P delivery first for direct messages
      let p2pDeliverySuccess = false;
      if (webRTCManager && receiverId) {
        try {
          await webRTCManager.sendDirectMessage(receiverId, newMessage.trim());
          p2pDeliverySuccess = true;
        } catch (p2pError) {
          console.log("P2P delivery failed, falling back to server:", p2pError);
        }
      }

      // Server-side message storage (always do this for persistence)
      const { encryptedContent, key, iv: messageIv } = await encryptMessage(newMessage.trim());
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: messageIv,
          ephemeral_ttl: ttl,
          media_url: mediaUrl,
          media_type: mediaType,
          media_encryption_key: encryptionKey,
          media_iv: iv,
          media_metadata: mediaMetadata,
          receiver_id: receiverId,
          group_id: groupId,
          is_delivered: p2pDeliverySuccess
        });

      if (error) throw error;

      if (toastId) {
        toast({
          id: toastId,
          title: "Success",
          description: mediaFile ? "Message with media sent successfully" : "Message sent successfully",
        });
      }
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, userId, ttl, setNewMessage, setIsLoading, toast, handleMediaUpload]);

  return { handleSendMessage };
};
