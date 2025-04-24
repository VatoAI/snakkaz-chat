
import { useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface VideoMediaProps {
  url: string;
  mediaType: string;
}

export const VideoMedia = ({ url, mediaType }: VideoMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleError = () => {
    setError("Failed to load video");
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="mt-2 p-3 bg-cyberdark-800/60 rounded-md text-center">
        <p className="text-cyberred-400 text-sm">{error}</p>
        <button 
          className="text-cyberblue-400 text-xs mt-1 hover:underline"
          onClick={() => window.open(url, '_blank')}
        >
          Try opening directly
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 relative rounded-md overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-800/80">
          <div className="h-8 w-8 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="relative">
        <video
          className="w-full max-h-[300px] rounded-md"
          controls
          muted={isMuted}
          onLoadedData={() => setIsLoading(false)}
          onError={handleError}
          controlsList="nodownload"
          onContextMenu={e => e.preventDefault()}
          playsInline
        >
          <source src={url} type={mediaType} />
          Your browser does not support video playback.
        </video>
        
        <button
          className="absolute bottom-2 left-2 bg-cyberdark-900/80 p-1.5 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
          type="button"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-cybergold-400" />
          ) : (
            <Volume2 className="h-4 w-4 text-cybergold-400" />
          )}
        </button>
      </div>
    </div>
  );
};
