import { ShieldAlert, RefreshCw, LinkBroken } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DecryptedMessage } from "@/types/message";
import { useEffect, useState, useCallback } from "react";
import { useMediaDecryption } from "./media/useMediaDecryption";
import { DeletedMedia } from "./media/DeletedMedia";
import { ImageMedia } from "./media/ImageMedia";
import { VideoMedia } from "./media/VideoMedia";
import { AudioMedia } from "./media/AudioMedia";
import { FileMedia } from "./media/FileMedia";
import { DecryptingMedia } from "./media/DecryptingMedia";
import { useToast } from "@/components/ui/use-toast";

interface MessageMediaProps {
  message: DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ message, onMediaExpired }: MessageMediaProps) => {
  const {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError,
    decryptAttempts
  } = useMediaDecryption(message);
  
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get the storage URL and decrypt the media
  const initMedia = useCallback(async () => {
    if (!message.media_url) return;
    
    try {
      setStorageError(null);
      const { data } = supabase.storage
        .from('chat-media')
        .getPublicUrl(message.media_url);
        
      if (!data?.publicUrl) {
        throw new Error("Kunne ikke få tilgang til media URL");
      }
      
      setStorageUrl(data.publicUrl);
      console.log("MessageMedia: Starting decryption for:", message.media_url);
      handleDecryptMedia(data.publicUrl);
    } catch (error) {
      console.error("Error getting storage URL:", error);
      setStorageError("Kunne ikke få tilgang til mediafilen");
    }
  }, [message.media_url, handleDecryptMedia]);
  
  // Initialize when message media changes
  useEffect(() => {
    if (message.media_url) {
      initMedia();
    }
    
    // Clean up resources when component unmounts
    return () => {
      setStorageUrl(null);
      setStorageError(null);
    };
  }, [message.media_url, initMedia]);
  
  if (!message.media_url) return null;

  if (message.is_deleted) {
    return <DeletedMedia />;
  }
  
  // Handle storage access errors
  if (storageError) {
    return (
      <div className="mt-2 p-3 border border-cyberred-800/50 rounded-lg bg-cyberred-950/30 flex items-center gap-2">
        <LinkBroken className="h-5 w-5 text-cyberred-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-cyberred-300 text-sm">Mediafil utilgjengelig</p>
          <p className="text-xs text-cyberred-400/70">{storageError}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => initMedia()}
          className="ml-2 border-cyberred-700 bg-cyberdark-900 hover:bg-cyberdark-800"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Prøv igjen
        </Button>
      </div>
    );
  }
  
  // Show loading state while getting storage URL
  if (!storageUrl) {
    return <DecryptingMedia />;
  }
  
  // Show decrypting state
  if (isDecrypting) {
    return <DecryptingMedia />;
  }
  
  // Handle decryption errors
  if (decryptError) {
    return (
      <div className="mt-2 p-3 border border-cyberred-800/50 rounded-lg bg-cyberred-950/30 flex items-center">
        <ShieldAlert className="h-5 w-5 text-cyberred-400 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-cyberred-300 text-sm">Kunne ikke dekryptere media</p>
          <p className="text-xs text-cyberred-400/70 truncate max-w-xs">{decryptError}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (decryptAttempts > 3) {
              toast({
                title: "Forsøker igjen",
                description: "Henter og dekrypterer mediafilen på nytt...",
              });
            }
            handleDecryptMedia(storageUrl);
          }}
          className="ml-2 border-cyberred-700 bg-cyberdark-900 hover:bg-cyberdark-800 whitespace-nowrap"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Prøv igjen
        </Button>
      </div>
    );
  }

  // Render appropriate media component based on media type
  try {
    // Extract media type from either direct media_type or from metadata if available
    let mediaType = message.media_type || 'application/octet-stream';
    let originalName: string | undefined;
    
    try {
      if (message.media_metadata) {
        const metadata = typeof message.media_metadata === 'string' 
          ? JSON.parse(message.media_metadata) 
          : message.media_metadata;
          
        if (metadata.originalType) {
          mediaType = metadata.originalType;
        }
        
        if (metadata.originalName) {
          originalName = metadata.originalName;
        }
      }
    } catch (e) {
      console.error("Error parsing media metadata:", e);
    }
    
    if (mediaType.startsWith('image/')) {
      return (
        <ImageMedia
          url={decryptedUrl || ''}
          ttl={message.ephemeral_ttl || null}
          onExpired={onMediaExpired}
          retryDecryption={() => storageUrl && handleDecryptMedia(storageUrl)}
        />
      );
    }
    
    if (mediaType.startsWith('video/')) {
      return <VideoMedia 
        url={decryptedUrl || ''} 
        mediaType={mediaType} 
        retryDecryption={() => storageUrl && handleDecryptMedia(storageUrl)}
      />;
    }
    
    if (mediaType.startsWith('audio/')) {
      return <AudioMedia 
        url={decryptedUrl || ''} 
        mediaType={mediaType}
        retryDecryption={() => storageUrl && handleDecryptMedia(storageUrl)}
      />;
    }
    
    return (
      <FileMedia
        url={decryptedUrl || ''}
        fileName={originalName || message.media_url.split('/').pop() || 'File'}
        mediaType={mediaType}
        retryDecryption={() => storageUrl && handleDecryptMedia(storageUrl)}
      />
    );
  } catch (error) {
    console.error("Error rendering media:", error);
    return (
      <div className="mt-2 p-3 border border-cyberred-800/50 rounded-lg bg-cyberred-950/30 flex items-center">
        <ShieldAlert className="h-5 w-5 text-cyberred-400 mr-2" />
        <div className="flex-1">
          <p className="text-cyberred-300 text-sm">Mediafil utilgjengelig</p>
          <p className="text-xs text-cyberred-400/70">Feil ved visning av media</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={initMedia}
          className="ml-2 border-cyberred-700 bg-cyberdark-900 hover:bg-cyberdark-800"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Prøv igjen
        </Button>
      </div>
    );
  }
};
