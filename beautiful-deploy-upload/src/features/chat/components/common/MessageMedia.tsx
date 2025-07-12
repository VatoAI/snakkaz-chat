
import { useState, useEffect } from 'react';
import { getMediaUrl, checkMediaExists } from '@/integrations/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageMediaProps {
  mediaUrl: string;
  mediaType: string;
}

export const MessageMedia = ({ mediaUrl, mediaType }: MessageMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [retries, setRetries] = useState(0);
  const { toast } = useToast();

  // Check if media exists
  useEffect(() => {
    const verifyMedia = async () => {
      try {
        const mediaExists = await checkMediaExists(mediaUrl);
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
      }
    };
    
    verifyMedia();
  }, [mediaUrl, toast]);

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
    
    // Re-check if media exists
    try {
      const mediaExists = await checkMediaExists(mediaUrl);
      setExists(mediaExists);
      
      if (!mediaExists) {
        setError('Media file not found');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error verifying media on retry:', err);
      setError('Failed to verify media');
      setIsLoading(false);
    }
  };

  // Generate public URL
  const publicUrl = getMediaUrl(mediaUrl);

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

  if (mediaType.startsWith('image/')) {
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

  if (mediaType.startsWith('video/')) {
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
  
  if (mediaType.startsWith('audio/')) {
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
          {mediaType.split('/')[1] || 'File'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate text-cybergold-300">
          {mediaUrl.split('/').pop() || 'Attachment'}
        </p>
        <p className="text-xs text-cybergold-500/70">{mediaType}</p>
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
