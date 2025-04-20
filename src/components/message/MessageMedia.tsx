
import { File, Lock, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DecryptedMessage } from "@/types/message";
import { useState, useEffect } from "react";
import { decryptMedia } from "@/utils/encryption/media-encryption";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageMediaProps {
  message: DecryptedMessage;
}

export const MessageMedia = ({ message }: MessageMediaProps) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  
  // Check if the message has media
  if (!message.media_url) return null;

  // Handle deleted media
  if (message.is_deleted) {
    return (
      <div className="mt-2 p-3 border border-cyberdark-700 rounded-lg bg-cyberdark-900/50 text-center">
        <p className="text-cyberdark-400 text-sm italic">Media deleted</p>
      </div>
    );
  }
  
  // Get the storage URL for the media
  const storageUrl = supabase.storage.from('chat-media').getPublicUrl(message.media_url).data.publicUrl;
  
  // Helper function to handle media decryption
  const handleDecryptMedia = async () => {
    if (decryptedUrl) return; // Already decrypted
    
    setIsDecrypting(true);
    setDecryptError(null);
    
    try {
      // Fetch the encrypted media
      const response = await fetch(storageUrl);
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const encryptedData = await response.arrayBuffer();
      
      // Check if we have encryption metadata
      if (!message.encryption_key || !message.iv) {
        throw new Error('Missing encryption metadata');
      }
      
      // Decrypt the media
      const decryptedBlob = await decryptMedia({
        encryptedData: encryptedData,
        encryptionKey: message.encryption_key,
        iv: message.iv,
        mediaType: message.media_type || 'application/octet-stream'
      });
      
      // Create a local URL for the decrypted blob
      const localUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedUrl(localUrl);
    } catch (error) {
      console.error('Failed to decrypt media:', error);
      setDecryptError('Failed to decrypt media');
    } finally {
      setIsDecrypting(false);
    }
  };
  
  // Auto-decrypt when component mounts
  useEffect(() => {
    handleDecryptMedia();
    
    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [message.media_url]);
  
  // Render content based on media type and decryption state
  if (isDecrypting) {
    return (
      <div className="mt-2 flex items-center space-x-2">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Lock className="h-8 w-8 text-cybergold-400 animate-pulse" />
            <p className="text-xs mt-2 text-cybergold-300">Decrypting media...</p>
          </div>
        </div>
      </div>
    );
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
          onClick={handleDecryptMedia}
          className="text-cyberred-300 hover:text-cyberred-200 ml-2"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // Display different content based on media type
  if (message.media_type?.startsWith('image/')) {
    return (
      <div className="relative group mt-2">
        <img 
          src={decryptedUrl || storageUrl} 
          alt="Image" 
          className="max-w-full h-auto rounded-lg max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(decryptedUrl || storageUrl, '_blank')}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
              <Lock className="h-3 w-3 text-green-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">End-to-end encrypted media</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  } else if (message.media_type?.startsWith('video/')) {
    return (
      <div className="relative group mt-2">
        <video 
          controls 
          className="max-w-full h-auto rounded-lg mt-2 max-h-[300px]"
        >
          <source src={decryptedUrl || storageUrl} type={message.media_type} />
          Your browser doesn't support video playback.
        </video>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
              <Lock className="h-3 w-3 text-green-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">End-to-end encrypted media</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  } else if (message.media_type?.startsWith('audio/')) {
    return (
      <div className="relative group mt-2">
        <audio 
          controls 
          className="max-w-full w-full mt-2"
        >
          <source src={decryptedUrl || storageUrl} type={message.media_type} />
          Your browser doesn't support audio playback.
        </audio>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
              <Lock className="h-3 w-3 text-green-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">End-to-end encrypted media</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  } else {
    // For documents and other files
    return (
      <div className="mt-2 p-3 border border-cyberdark-700 rounded-lg bg-cyberdark-900/50 flex items-center relative group">
        <File className="h-6 w-6 text-cybergold-400 mr-3" />
        <div className="flex-1 min-w-0">
          <p className="text-cybergold-200 text-sm truncate">
            {message.media_url.split('/').pop()}
          </p>
          <p className="text-xs text-cyberdark-400">
            {message.media_type || "Document"}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-cybergold-300 hover:text-cybergold-200"
          onClick={() => window.open(decryptedUrl || storageUrl, '_blank')}
        >
          Open
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
              <Lock className="h-3 w-3 text-green-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">End-to-end encrypted media</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
};
