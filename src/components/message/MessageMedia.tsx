
import { useState, useEffect } from "react";
import { getMediaUrl, checkMediaExists } from '@/integrations/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecryptedMessage } from "@/types/message";
import { SecureMediaMessage } from "./SecureMediaMessage";

interface MessageMediaProps {
  message: DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ message, onMediaExpired }: MessageMediaProps) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [retries, setRetries] = useState(0);
  const { toast } = useToast();

  // Check if the media exists in storage
  useEffect(() => {
    const verifyMedia = async () => {
      if (!message.media_url) return;
      
      try {
        const mediaExists = await checkMediaExists(message.media_url);
        setExists(mediaExists);
        
        if (!mediaExists) {
          toast({
            title: "Media Not Found",
            description: "The media file could not be found",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error verifying media:', err);
      }
    };
    
    verifyMedia();
  }, [message.media_url, toast, retries]);

  const handleRetry = async () => {
    setRetries(prev => prev + 1);
  };

  if (!message.media_url) return null;

  // Handle missing media file
  if (exists === false) {
    return (
      <div className="flex items-center gap-3 p-3 bg-cyberdark-800 rounded-lg border border-cyberred-800/30 mt-2">
        <AlertCircle className="w-5 h-5 text-cyberred-500" />
        <span className="text-sm text-cyberred-300">Media not available</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRetry}
          className="ml-auto text-cyberblue-500 hover:text-cyberblue-400"
        >
          <RefreshCcw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  // Now use the SecureMediaMessage component for encrypted media
  if (message.media_encryption_key || message.encryption_key) {
    return (
      <SecureMediaMessage 
        message={message} 
        onMediaExpired={onMediaExpired} 
      />
    );
  }

  // Fallback for non-encrypted media
  const publicUrl = getMediaUrl(message.media_url);

  if (message.media_type?.startsWith('image/')) {
    return (
      <div className="relative mt-2">
        <img
          src={publicUrl}
          alt="Message attachment"
          className="max-w-full rounded-lg border border-cyberblue-500/20"
          onError={handleRetry}
          style={{ maxHeight: '300px', objectFit: 'contain' }}
        />
      </div>
    );
  }

  if (message.media_type?.startsWith('video/')) {
    return (
      <div className="relative mt-2">
        <video
          src={publicUrl}
          controls
          className="max-w-full rounded-lg border border-cyberblue-500/20"
          onError={handleRetry}
          style={{ maxHeight: '300px' }}
        />
      </div>
    );
  }
  
  if (message.media_type?.startsWith('audio/')) {
    return (
      <div className="relative mt-2">
        <audio
          src={publicUrl}
          controls
          className="w-full rounded-lg bg-cyberdark-800 p-2 border border-cyberblue-500/20"
          onError={handleRetry}
        />
      </div>
    );
  }

  // For other media types, show a generic file link
  return (
    <div className="flex items-center gap-3 p-3 bg-cyberdark-800 rounded-lg border border-cyberblue-500/20 mt-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-cyberdark-700">
        <span className="text-xs uppercase text-cyberblue-500">
          {message.media_type?.split('/')[1] || 'File'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate text-cyberblue-300">
          {message.media_url.split('/').pop() || 'Attachment'}
        </p>
        <p className="text-xs text-cyberblue-500/70">{message.media_type}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="ml-auto text-cyberblue-500 hover:text-cyberblue-400"
      >
        <a href={publicUrl} target="_blank" rel="noopener noreferrer" download>
          Download
        </a>
      </Button>
    </div>
  );
};
