
import { useState, useEffect } from "react";
import { IconFile, IconFileText, IconLock } from "@tabler/icons-react";
import { decryptMediaMetadata } from "@/utils/encryption/media/metadata-extractor";
import { useMediaDecryption } from "@/utils/encryption/media/useMediaDecryption";
import { VideoMedia } from "./media/VideoMedia";
import { ImageMedia } from "./media/ImageMedia";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileMedia } from "./media/FileMedia";
import { useToast } from "@/hooks/use-toast";
import { DecryptedMessage } from "@/types/message";

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
  const [metadata, setMetadata] = useState<any>(null);
  const { toast } = useToast();
  
  // Extract values from message prop if provided
  const mediaUrl = message?.media_url || encryptedUrl || '';
  const mediaKey = message?.media_encryption_key || encryptionKey || '';
  const mediaType = message?.media_type || fileType || '';
  const mediaTtl = message?.ephemeral_ttl || ttl;
  const messageIdToUse = message?.id || messageId;
  
  const {
    decryptedDataUrl,
    isLoading,
    error,
    retry
  } = useMediaDecryption(mediaUrl, mediaKey);
  
  // Try to extract metadata
  useEffect(() => {
    const extractMetadata = async () => {
      try {
        if (mediaKey) {
          const meta = await decryptMediaMetadata(mediaUrl, mediaKey);
          if (meta) {
            setMetadata(meta);
          }
        }
      } catch (err) {
        console.error("Failed to extract metadata:", err);
      }
    };
    
    extractMetadata();
  }, [mediaUrl, mediaKey]);

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
  
  if (isLoading || (!decryptedDataUrl && !error)) {
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

  if (mediaType.startsWith("image/")) {
    return (
      <ImageMedia 
        url={decryptedDataUrl} 
        ttl={mediaTtl}
        onExpired={handleMediaExpired}
        retryDecryption={retry}
      />
    );
  }
  
  if (mediaType.startsWith("video/")) {
    return (
      <VideoMedia 
        url={decryptedDataUrl}
        type={mediaType}  // Changed from mimeType to type
        ttl={mediaTtl}
        onExpired={handleMediaExpired}
      />
    );
  }
  
  // For files like PDF, documents, etc.
  return (
    <FileMedia 
      url={decryptedDataUrl}
      type={mediaType}  // Changed from fileType to type
      filename={metadata?.filename || "secured-file"}
      ttl={mediaTtl}
      onExpired={handleMediaExpired}
    />
  );
};
