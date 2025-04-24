
import { useState } from 'react';
import { getMediaUrl } from '@/integrations/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';

interface MessageMediaProps {
  mediaUrl: string;
  mediaType: string;
}

export const MessageMedia = ({ mediaUrl, mediaType }: MessageMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = () => {
    setError('Failed to load media');
    setIsLoading(false);
    toast({
      title: "Error",
      description: "Failed to load media content",
      variant: "destructive"
    });
  };

  const publicUrl = getMediaUrl(mediaUrl);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (mediaType.startsWith('image/')) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/50">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <img
          src={publicUrl}
          alt="Message attachment"
          className="max-w-full rounded-lg"
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      </div>
    );
  }

  // Add support for other media types here if needed
  return null;
};
