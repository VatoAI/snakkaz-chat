
import { useState, useEffect } from "react";
import { getMediaUrl, checkMediaExists } from '@/integrations/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecryptedMessage } from "@/types/message";

interface MessageMediaProps {
  message: DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ message, onMediaExpired }: MessageMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [retries, setRetries] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const verifyMedia = async () => {
      if (!message.media_url) return;
      
      try {
        const mediaExists = await checkMediaExists(message.media_url);
        setExists(mediaExists);
        
        if (!mediaExists) {
          setError('Media file not found');
          setIsLoading(false);
          toast({
            title: "Media Error",
            description: "Could not find the media file",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error verifying media:', err);
        setExists(false);
        setError('Could not verify media');
        setIsLoading(false);
      }
    };
    
    verifyMedia();
  }, [message.media_url, toast, retries]);

  const handleError = () => {
    setError('Failed to load media');
    setIsLoading(false);
    toast({
      title: "Error",
      description: "Failed to load media content",
      variant: "destructive"
    });
  };

  const handleRetry = async () => {
    setError(null);
    setIsLoading(true);
    setRetries(prev => prev + 1);
  };

  if (!message.media_url) return null;

  if (error) {
    return (
      <div className="flex items-center gap-3 p-3 bg-cyberdark-800 rounded-lg border border-cyberred-800/30">
        <AlertCircle className="w-5 h-5 text-cyberred-500" />
        <span className="text-sm text-cyberred-300">{error}</span>
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

  if (exists === false) {
    return (
      <div className="flex items-center gap-3 p-3 bg-cyberdark-800 rounded-lg border border-cyberred-800/30">
        <AlertCircle className="w-5 h-5 text-cyberred-500" />
        <span className="text-sm text-cyberred-300">Media not available</span>
      </div>
    );
  }

  const publicUrl = getMediaUrl(message.media_url);

  if (message.media_type?.startsWith('image/')) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-cyberblue-500" />
          </div>
        )}
        <img
          src={publicUrl}
          alt="Message attachment"
          className="max-w-full rounded-lg border border-cybergold-500/20"
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          style={{ maxHeight: '300px', objectFit: 'contain' }}
        />
      </div>
    );
  }

  if (message.media_type?.startsWith('video/')) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-cyberblue-500" />
          </div>
        )}
        <video
          src={publicUrl}
          controls
          className="max-w-full rounded-lg border border-cybergold-500/20"
          onLoadedData={() => setIsLoading(false)}
          onError={handleError}
          style={{ maxHeight: '300px' }}
        />
      </div>
    );
  }
  
  if (message.media_type?.startsWith('audio/')) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-800/50 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-cyberblue-500" />
          </div>
        )}
        <audio
          src={publicUrl}
          controls
          className="w-full rounded-lg bg-cyberdark-800 p-2 border border-cybergold-500/20"
          onLoadedData={() => setIsLoading(false)}
          onError={handleError}
        />
      </div>
    );
  }

  // For other media types, show a generic file link
  return (
    <div className="flex items-center gap-3 p-3 bg-cyberdark-800 rounded-lg border border-cybergold-500/20">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-cyberdark-700">
        <span className="text-xs uppercase text-cyberblue-500">
          {message.media_type?.split('/')[1] || 'File'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate text-cybergold-300">
          {message.media_url.split('/').pop() || 'Attachment'}
        </p>
        <p className="text-xs text-cybergold-500/70">{message.media_type}</p>
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
