
import { useState, useEffect } from "react";
import { IconFile, IconFileText, IconLock } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaDecryption } from "./media/useMediaDecryption";
import { Button } from "@/components/ui/button";
import { VideoMedia } from "./media/VideoMedia";
import { ImageMedia } from "./media/ImageMedia";
import { FileMedia } from "./media/FileMedia";
import { DecryptedMessage } from "@/types/message";
import { ExpiringMediaContainer } from "./media/ExpiringMediaContainer";

interface MessageMediaProps {
  encryptedUrl?: string;
  encryptionKey?: string;
  fileType?: string;
  messageId?: string;
  ttl?: number | null;
  onDelete?: () => void;
  onShowDeleteConfirm?: () => void;
  message?: DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ 
  encryptedUrl, 
  encryptionKey, 
  fileType,
  messageId,
  ttl,
  onDelete,
  onShowDeleteConfirm,
  message,
  onMediaExpired
}: MessageMediaProps) => {
  const [decryptFailed, setDecryptFailed] = useState(false);
  const { toast } = useToast();
  
  // Extract values from message prop if provided
  const mediaUrl = message?.media_url || encryptedUrl || '';
  const mediaKey = message?.media_encryption_key || encryptionKey || '';
  const mediaType = message?.media_type || fileType || '';
  const mediaTtl = message?.ephemeral_ttl || ttl;
  const messageIdToUse = message?.id || messageId;
  
  // Use our media decryption hook
  const {
    decryptedURL,
    isLoading,
    error,
    retry
  } = useMediaDecryption(mediaUrl, mediaKey, message?.media_iv || '', mediaType);

  // Handle media expiration
  const handleMediaExpired = () => {
    if (onDelete) {
      onDelete();
      toast({
        title: "Media Expired",
        description: "This media has reached its time limit and been deleted.",
        variant: "warning",
      });
    } else if (onMediaExpired) {
      onMediaExpired();
    }
  };

  // Effect to check for decryption failures
  useEffect(() => {
    if (error) {
      setDecryptFailed(true);
      console.error('Media decryption failed:', error);
    } else {
      setDecryptFailed(false);
    }
  }, [error]);
  
  if (isLoading || (!decryptedURL && !error && !decryptFailed)) {
    return (
      <div className="flex flex-col items-center justify-center bg-cyberdark-800/50 rounded-lg p-4 min-h-[150px] w-full max-w-md mt-2 shadow-md">
        <IconLock className="text-cyberblue-400 mb-2" size={24} />
        <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin mb-2"></div>
        <p className="text-xs text-cyberdark-200">Decrypting media...</p>
      </div>
    );
  }

  if (error || decryptFailed) {
    return (
      <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex flex-col items-center max-w-md">
        <IconLock className="text-cyberred-400 mb-2" size={24} />
        <p className="text-cyberred-400 text-sm">Failed to decrypt media</p>
        <p className="text-cyberdark-300 text-xs my-1">The encryption key may be invalid or the file is corrupted</p>
        
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => retry()}
            className="text-xs border-cyberblue-700 bg-cyberdark-900 hover:bg-cyberdark-800"
          >
            Retry Decryption
          </Button>
        </div>
      </div>
    );
  }

  if (mediaType.startsWith("image/") && decryptedURL) {
    return (
      <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
        <ImageMedia 
          url={decryptedURL} 
          retryDecryption={retry}
        />
      </ExpiringMediaContainer>
    );
  }
  
  if (mediaType.startsWith("video/") && decryptedURL) {
    return (
      <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
        <VideoMedia 
          url={decryptedURL}
          type={mediaType}
        />
      </ExpiringMediaContainer>
    );
  }
  
  // For files like PDF, documents, etc.
  if (decryptedURL) {
    return (
      <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
        <FileMedia 
          url={decryptedURL}
          type={mediaType}
          filename={messageIdToUse || "secure-file"}
        />
      </ExpiringMediaContainer>
    );
  }
  
  // Fallback if we somehow get here
  return (
    <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex items-center gap-2">
      <IconFileText className="text-cyberblue-400" size={24} />
      <div>
        <p className="text-sm">Attachment</p>
        <p className="text-xs text-cyberdark-300">Unable to display media</p>
      </div>
    </div>
  );
};
