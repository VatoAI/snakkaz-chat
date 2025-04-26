
import { useState, useEffect } from "react";
import { EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureImageViewer } from "./SecureImageViewer";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  maxHeight?: number;
  maxWidth?: number;
}

export const ImageMedia = ({ 
  url, 
  ttl, 
  onExpired,
  maxHeight = 300,
  maxWidth = 400
}: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Calculate responsive dimensions preserving aspect ratio
  useEffect(() => {
    if (isLoaded && dimensions.width > 0 && dimensions.height > 0) {
      const aspectRatio = dimensions.width / dimensions.height;
      
      let finalWidth = dimensions.width;
      let finalHeight = dimensions.height;
      
      // Constrain by width
      if (finalWidth > maxWidth) {
        finalWidth = maxWidth;
        finalHeight = finalWidth / aspectRatio;
      }
      
      // Further constrain by height if needed
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * aspectRatio;
      }
      
      setDimensions({
        width: finalWidth,
        height: finalHeight
      });
    }
  }, [isLoaded, maxHeight, maxWidth]);

  // Handle image preloading to get dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setIsLoaded(true);
    };
    img.onerror = () => setLoadError(true);
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

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
        <div className="flex items-center justify-center h-32 bg-cyberdark-800/50 rounded-lg">
          <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="relative hover:opacity-90 transition-opacity cursor-zoom-in">
        <img 
          src={url} 
          alt="Secure media" 
          className="w-full h-auto rounded-lg object-contain shadow-lg shadow-cyberdark-900/30"
          onContextMenu={e => e.preventDefault()}
          draggable="false"
          onClick={() => setIsViewerOpen(true)}
          onLoad={() => setIsLoaded(true)}
          onError={() => setLoadError(true)}
          loading="lazy"
          style={{ 
            display: isLoaded ? 'block' : 'none',
            maxHeight: `${maxHeight}px`,
            maxWidth: `${maxWidth}px`,
          }}
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
            {ttl && ttl > 0 && (
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
