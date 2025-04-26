
import { useState } from "react";
import { Shield } from "lucide-react";

interface VideoMediaProps {
  url: string;
  mediaType: string;
  maxHeight?: number;
}

export const VideoMedia = ({ 
  url, 
  mediaType,
  maxHeight = 300
}: VideoMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative mt-2">
      <video
        src={url}
        className="w-full max-w-full rounded-lg border border-cyberblue-500/20 object-contain"
        controls
        onLoadedData={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{ maxHeight: `${maxHeight}px` }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-900/50 rounded-lg">
          <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-sm flex items-center gap-1">
        <Shield className="h-3 w-3 text-cyberblue-400" />
        <span className="text-xs text-cyberblue-300">Secure</span>
      </div>
    </div>
  );
};
