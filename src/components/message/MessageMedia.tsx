
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DecryptedMessage } from "@/types/message";
import { useEffect, useCallback } from "react";
import { useMediaDecryption } from "./media/useMediaDecryption";
import { DeletedMedia } from "./media/DeletedMedia";
import { ImageMedia } from "./media/ImageMedia";
import { VideoMedia } from "./media/VideoMedia";
import { AudioMedia } from "./media/AudioMedia";
import { FileMedia } from "./media/FileMedia";
import { DecryptingMedia } from "./media/DecryptingMedia";

interface MessageMediaProps {
  message: import("@/types/message").DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ message, onMediaExpired }: MessageMediaProps) => {
  // No changes needed here because useMediaDecryption now handles all cases
  const {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError
  } = useMediaDecryption(message);
  
  if (!message.media_url) return null;

  if (message.is_deleted) {
    return <DeletedMedia />;
  }
  
  const storageUrl = supabase.storage.from('chat-media').getPublicUrl(message.media_url).data.publicUrl;
  
  useEffect(() => {
    handleDecryptMedia(storageUrl);
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [message.media_url]);
  
  if (isDecrypting) {
    return <DecryptingMedia />;
  }
  
  if (decryptError) {
    return (
      <div className="mt-2 p-3 border border-cyberred-800/50 rounded-lg bg-cyberred-950/30 flex items-center">
        <ShieldAlert className="h-5 w-5 text-cyberred-400 mr-2" />
        <div className="flex-1">
          <p className="text-cyberred-300 text-sm">Failed to decrypt media</p>
          <p className="text-xs text-cyberred-400/70">{decryptError}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDecryptMedia(storageUrl)}
          className="text-cyberred-300 hover:text-cyberred-200 ml-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  // When the image is expired (timer run out in SecureImageViewer), callback triggers onMediaExpired (delete).
  if (message.media_type?.startsWith('image/')) {
    return (
      <ImageMedia
        url={decryptedUrl || storageUrl}
        ttl={message.ephemeral_ttl || 30}
        onExpired={onMediaExpired}
      />
    );
  }
  
  if (message.media_type?.startsWith('video/')) {
    return <VideoMedia url={decryptedUrl || storageUrl} mediaType={message.media_type} />;
  }
  
  if (message.media_type?.startsWith('audio/')) {
    return <AudioMedia url={decryptedUrl || storageUrl} mediaType={message.media_type} />;
  }
  
  return (
    <FileMedia
      url={decryptedUrl || storageUrl}
      fileName={message.media_url.split('/').pop() || 'File'}
      mediaType={message.media_type || 'Document'}
    />
  );
};
