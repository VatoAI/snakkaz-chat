
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";

export const useMessageSend = (
  userId: string | null,
  newMessage: string,
  setNewMessage: (message: string) => void,
  ttl: number | null,
  setIsLoading: (loading: boolean) => void,
  toast: any
) => {
  const handleSendMessage = useCallback(async (webRTCManager: any, onlineUsers: Set<string>, mediaFile?: File, receiverId?: string) => {
    if ((!newMessage.trim() && !mediaFile) || !userId) {
      console.log("Ingen melding eller fil å sende, eller bruker ikke pålogget");
      return;
    }

    setIsLoading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        try {
          console.log("Forbereder opplasting av mediafil:", mediaFile.name);
          const fileExt = mediaFile.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;

          console.log("Laster opp til path:", filePath);
          const { error: uploadError, data } = await supabase.storage
            .from('chat-media')
            .upload(filePath, mediaFile);

          if (uploadError) {
            console.error("Opplastingsfeil:", uploadError);
            throw new Error(`Feil ved opplasting av fil: ${uploadError.message}`);
          }

          console.log("Opplasting vellykket:", data);
          mediaUrl = filePath;
          mediaType = mediaFile.type;
        } catch (mediaError: any) {
          console.error("Mediafeil:", mediaError);
          throw new Error(`Mediafeil: ${mediaError.message}`);
        }
      }

      // WebRTC sending (peer-to-peer)
      if (webRTCManager && !receiverId) {
        try {
          console.log("Forsøker å sende via WebRTC til", Array.from(onlineUsers).filter(id => id !== userId));
          onlineUsers.forEach(peerId => {
            if (peerId !== userId) {
              webRTCManager.sendMessage(peerId, newMessage.trim());
            }
          });
        } catch (webrtcError: any) {
          console.error("WebRTC sendingsfeil:", webrtcError);
          // Continue with server send even if WebRTC fails
        }
      }

      // Server sending (encrypted)
      try {
        console.log("Krypterer melding...");
        const { encryptedContent, key, iv } = await encryptMessage(newMessage.trim());
        
        console.log("Sender melding til server...");
        const { error } = await supabase
          .from('messages')
          .insert({
            encrypted_content: encryptedContent,
            encryption_key: key,
            iv: iv,
            sender_id: userId,
            ephemeral_ttl: ttl,
            media_url: mediaUrl,
            media_type: mediaType,
            receiver_id: receiverId
          });

        if (error) {
          console.error('Send message error:', error);
          throw new Error(`Kunne ikke sende melding: ${error.message}`);
        } else {
          console.log("Melding sendt vellykket");
          setNewMessage("");
        }
      } catch (serverError: any) {
        console.error('Error sending to server:', serverError);
        throw new Error(`Serverfeil: ${serverError.message}`);
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
  }, [newMessage, userId, ttl, setNewMessage, setIsLoading, toast]);

  return { handleSendMessage };
};
