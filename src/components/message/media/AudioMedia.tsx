
import { useState } from "react";
import { Music } from "lucide-react";

interface AudioMediaProps {
  url: string;
  mediaType: string;
}

export const AudioMedia = ({ url, mediaType }: AudioMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = () => {
    setError("Failed to load audio");
    setIsLoading(false);
  };

  return (
    <div className="mt-2 rounded-md overflow-hidden bg-cyberdark-800/40 p-2">
      {isLoading && (
        <div className="flex justify-center p-2">
          <div className="h-5 w-5 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {error ? (
        <div className="p-2 text-center">
          <p className="text-cyberred-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-cyberdark-700 p-2 rounded-full">
            <Music className="h-4 w-4 text-cyberblue-400" />
          </div>
          
          <audio
            className="w-full"
            controls
            onLoadedData={() => setIsLoading(false)}
            onError={handleError}
            controlsList="nodownload"
          >
            <source src={url} type={mediaType} />
            Your browser does not support audio playback.
          </audio>
        </div>
      )}
    </div>
  );
};
