
import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureImageViewer } from "./SecureImageViewer";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
}

export const ImageMedia = ({ url, ttl, onExpired }: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  if (loadError) {
    return (
      <div className="bg-cyberdark-800/80 p-3 rounded-md mt-2 text-center">
        <p className="text-cyberred-400 text-sm">Failed to load image</p>
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
    <div className="relative group mt-2">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-800/50 rounded-lg">
          <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="relative hover:opacity-90 transition-opacity cursor-zoom-in">
        <img 
          src={url} 
          alt="Secure media" 
          className="w-full h-auto rounded-lg max-h-[300px] object-contain shadow-lg shadow-cyberdark-900/30"
          onContextMenu={e => e.preventDefault()}
          draggable="false"
          onClick={() => setIsViewerOpen(true)}
          onLoad={() => setIsLoaded(true)}
          onError={() => setLoadError(true)}
          loading="lazy"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
        <SecureMediaIcon position="top-right" size="sm" />
      </div>
      
      <div className="absolute bottom-2 right-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-cyberdark-900/80 p-1 rounded text-xs flex items-center gap-1">
              <EyeOff className="h-3 w-3 text-cyberred-400" />
              <span className="text-cyberred-300">Secure</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Screenshot and sharing is disabled</p>
            {ttl && (
              <p className="text-xs text-cyberblue-300">Auto-deletion enabled</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>

      <SecureImageViewer 
        url={url}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        expiresIn={ttl}
        onExpired={onExpired}
      />
    </div>
  );
};
