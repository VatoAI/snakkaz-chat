import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { encryptMedia } from "@/utils/encryption/media";
import { base64ToArrayBuffer } from "@/utils/encryption/data-conversion";
import { ensureMessageColumnsExist, showUploadToast, uploadMediaFile } from "./utils/message-db-utils";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";

export const useMessageSender = (
  userId: string | null,
  newMessage: string,
  setNewMessage: (message: string) => void,
  ttl: number | null,
  setIsLoading: (loading: boolean) => void,
  toast: any
) => {
  const handleSendMessage = useCallback(async (webRTCManager: any, onlineUsers: Set<string>, mediaFile?: File, receiverId?: string, groupId?: string) => {
    if ((!newMessage.trim() && !mediaFile) || !userId) {
      console.log("Ingen melding eller fil å sende, eller bruker ikke pålogget");
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

      // --- GLOBAL ROOM E2EE PATCH ---
      // Use shared global key for all crypto in "global" room
      const isGlobalRoom = !receiverId && !groupId;

      let globalE2eeKey: string | undefined;
      let globalE2eeIv: string | undefined;
      if (isGlobalRoom) {
        globalE2eeKey = GLOBAL_E2EE_KEY;
        globalE2eeIv = btoa(GLOBAL_E2EE_IV); // encode string as base64
      }
      // --- END PATCH ---

      let mediaUrl = null;
      let mediaType = null;
      let encryptionKey = null;
      let iv = null;
      let mediaMetadata = null;

      if (mediaFile) {
        console.log("Starting media file upload process:", mediaFile.name, mediaFile.type, mediaFile.size);
        toastId = showUploadToast(toast, 'uploading');

        try {
          // --- encryptMedia: allow override key/iv for global room
          const encryptedMedia = await encryptMedia(mediaFile, globalE2eeKey && globalE2eeIv ? {
            encryptionKey: globalE2eeKey,
            iv: globalE2eeIv
          } : undefined);

          console.log("Media encrypted successfully", encryptedMedia);

          const encryptedData = encryptedMedia.encryptedData;
          const encryptedBlob = new Blob(
            [encryptedData instanceof ArrayBuffer 
              ? encryptedData 
              : base64ToArrayBuffer(encryptedData as string)
            ], 
            { type: 'application/octet-stream' }
          );
          const encryptedFile = new File(
            [encryptedBlob], 
            `${Date.now()}_encrypted.bin`, 
            { type: 'application/octet-stream' }
          );
          console.log("Uploading encrypted file to Supabase storage");
          const mediaData = await uploadMediaFile(encryptedFile);

          mediaUrl = mediaData.mediaUrl;
          mediaType = encryptedMedia.mediaType;
          encryptionKey = encryptedMedia.encryptionKey;
          iv = encryptedMedia.iv;
          mediaMetadata = encryptedMedia.metadata;

          console.log("Media upload successful:", mediaUrl);
          showUploadToast(toast, 'success', "Sender melding med kryptert vedlegg...");
        } catch (uploadError: any) {
          console.error("Error during media upload:", uploadError);

          toast({
            title: "Feil ved opplasting",
            description: (uploadError instanceof Error ? uploadError.message : "Kunne ikke laste opp filen"),
            variant: "destructive",
          });

          setIsLoading(false);
          return;
        }
      }

      let p2pDeliveryCount = 0;
      
      if (webRTCManager && !receiverId && !groupId) {
        const peerPromises: Promise<boolean>[] = [];
        const peerErrors: Record<string, string> = {};
        
        for (const peerId of onlineUsers) {
          if (peerId !== userId) {
            const timeoutPromise = new Promise<boolean>((resolve) => {
              setTimeout(() => resolve(false), 10000);
            });
            
            const sendPromise = new Promise<boolean>(async (resolve) => {
              try {
                const isReady = await webRTCManager.ensurePeerReady(peerId);
                
                if (isReady) {
                  await webRTCManager.sendMessage(peerId, newMessage.trim());
                  resolve(true);
                } else {
                  peerErrors[peerId] = 'Peer not ready';
                  resolve(false);
                }
              } catch (error) {
                console.error(`Error sending message to peer ${peerId}:`, error);
                peerErrors[peerId] = error instanceof Error ? error.message : 'Unknown error';
                resolve(false);
              }
            });
            
            peerPromises.push(Promise.race([sendPromise, timeoutPromise]));
          }
        }
        
        const results = await Promise.all(peerPromises);
        p2pDeliveryCount = results.filter(result => result).length;
        
        if (p2pDeliveryCount === 0 && onlineUsers.size > 1) {
          console.warn('Failed to deliver message to any peers:', peerErrors);
        }
      }

      // --- ENCRYPT MESSAGE TEXT (override key/iv for global) ---
      let encryptedContent, key, messageIv;
      if (isGlobalRoom && globalE2eeKey && globalE2eeIv) {
        // Use our static key/iv
        const encMod = await import("@/utils/encryption/message-encryption");
        const importedKey = await encMod.importEncryptionKey(globalE2eeKey);
        const enc = await window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: new Uint8Array(atob(globalE2eeIv).split("").map(c => c.charCodeAt(0)))
          },
          importedKey,
          new TextEncoder().encode(newMessage.trim())
        );
        encryptedContent = btoa(String.fromCharCode(...new Uint8Array(enc)));
        key = globalE2eeKey;
        messageIv = globalE2eeIv;
      } else {
        // normal
        const encRes = await encryptMessage(newMessage.trim());
        encryptedContent = encRes.encryptedContent;
        key = encRes.key;
        messageIv = encRes.iv;
      }

      const defaultTtl = 86400;
      const messageTtl = ttl || defaultTtl;

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: messageIv,
          ephemeral_ttl: messageTtl,
          media_url: mediaUrl,
          media_type: mediaType,
          receiver_id: receiverId,
          group_id: groupId ? true : null,
          is_edited: false,
          is_deleted: false,
          media_encryption_key: encryptionKey,
          media_iv: iv,
          media_metadata: mediaMetadata ? JSON.stringify(mediaMetadata) : null
        });

      if (error) {
        console.error('Send message error:', error);
        toast({
          title: "Feil",
          description: "Kunne ikke sende melding: " + error.message,
          variant: "destructive",
        });
      } else {
        console.log("Melding sendt vellykket");

        if (toastId) {
          toast({
            id: toastId,
            title: "Melding sendt",
            description: mediaFile ? "Melding med kryptert vedlegg ble sendt" : "Melding ble sendt",
          });
        }

        setNewMessage("");
      }
    } catch (error: any) {
      console.error('Error sending message (outer catch):', error);

      toast({
        title: "Feil",
        description: "Kunne ikke sende melding: " + (error instanceof Error ? error.message : 'Ukjent feil'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, userId, ttl, setNewMessage, setIsLoading, toast]);

  return { handleSendMessage };
};
