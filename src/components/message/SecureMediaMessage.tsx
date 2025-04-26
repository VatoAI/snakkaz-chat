
import { useState, useEffect } from "react";
import { DecryptedMessage } from "@/types/message";
import { getMediaUrl } from "@/integrations/supabase/storage";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaDecryption } from "./media/useMediaDecryption";
import { ImageMedia } from "./media/ImageMedia";
import { VideoMedia } from "./media/VideoMedia";

interface SecureMediaMessageProps {
  message: DecryptedMessage;
  onMediaExpired?: () => void;
  maxHeight?: number;
  maxWidth?: number;
}

export const SecureMediaMessage = ({ 
  message, 
  onMediaExpired,
  maxHeight = 300,
  maxWidth = 400
}: SecureMediaMessageProps) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const publicUrl = message.media_url ? getMediaUrl(message.media_url) : '';
  
  const {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    decryptAttempts
  } = useMediaDecryption(message);
  
  // Trigger decryption when component mounts
  useEffect(() => {
    if (message.media_url && publicUrl) {
      handleDecryptMedia(publicUrl);
    }
  }, [message.media_url, publicUrl]);
  
  // Handle error states
  useEffect(() => {
    if (decryptError) {
      setError(`Failed to decrypt: ${decryptError}`);
    }
  }, [decryptError]);
  
  // Determine media type
  const isImage = message.media_type?.startsWith('image/');
  const isVideo = message.media_type?.startsWith('video/');
  const isAudio = message.media_type?.startsWith('audio/');
  
  // Calculate when media will expire
  const calculateTimeRemaining = () => {
    const createdAt = new Date(message.created_at).getTime();
    const ttl = message.ephemeral_ttl || 86400; // Default to 24 hours
    const expiresAt = createdAt + (ttl * 1000);
    return Math.max(0, expiresAt - new Date().getTime());
  };
  
  // Format TTL for display
  const formatTTL = () => {
    const ttl = message.ephemeral_ttl || 86400; // Default to 24 hours
    const hours = Math.floor(ttl / 3600);
    const minutes = Math.floor((ttl % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  if (!message.media_url) {
    return null;
  }
  
  if (error) {
    return (
      <div className="mt-2 p-3 bg-cyberdark-800/60 rounded-md text-center">
        <div className="flex items-center justify-center gap-2 text-cyberred-400">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleDecryptMedia(publicUrl)}
          className="mt-2 text-cyberblue-400 hover:text-cyberblue-300"
        >
          <RefreshCcw className="h-3 w-3 mr-1" />
          Retry Decryption
        </Button>
      </div>
    );
  }
  
  if (isDecrypting) {
    return (
      <div className="mt-2 p-6 bg-cyberdark-800/60 rounded-md flex flex-col items-center justify-center">
        <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin mb-2"></div>
        <p className="text-xs text-cyberblue-400">Decrypting secure media...</p>
      </div>
    );
  }
  
  // Render different media types
  if (isImage && decryptedUrl) {
    return (
      <ImageMedia 
        url={decryptedUrl} 
        ttl={calculateTimeRemaining() / 1000}
        onExpired={onMediaExpired}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
      />
    );
  }
  
  if (isVideo && decryptedUrl) {
    return (
      <VideoMedia 
        url={decryptedUrl} 
        mediaType={message.media_type || 'video/mp4'}
        maxHeight={maxHeight}
      />
    );
  }
  
  if (isAudio && decryptedUrl) {
    return (
      <div className="mt-2 relative">
        <audio
          src={decryptedUrl}
          controls
          className="w-full rounded-md bg-cyberdark-800 p-2"
        />
        <div className="absolute top-0 right-0 bg-cyberdark-900/80 p-1 rounded text-xs flex items-center">
          <Shield className="h-3 w-3 text-cyberblue-500 mr-1" />
          <span className="text-cyberblue-400">Secure</span>
        </div>
      </div>
    );
  }
  
  // For other file types
  return (
    <div className="mt-2 p-3 bg-cyberdark-800/60 rounded-md">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center bg-cyberdark-900 rounded">
          <Shield className="h-5 w-5 text-cyberblue-500" />
        </div>
        <div>
          <p className="text-sm text-cyberblue-100">Encrypted File</p>
          <p className="text-xs text-cyberblue-400">{message.media_type}</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="ml-auto bg-cyberdark-900/80 p-1 rounded text-xs flex items-center">
              <Shield className="h-3 w-3 text-cyberblue-500 mr-1" />
              <span className="text-cyberblue-400">Auto-delete: {formatTTL()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">This media will be deleted automatically</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {decryptedUrl && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 text-cyberblue-400 hover:text-cyberblue-300 w-full"
          onClick={() => window.open(decryptedUrl, '_blank')}
        >
          View File
        </Button>
      )}
    </div>
  );
};
