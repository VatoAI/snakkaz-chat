import { useState, useEffect, useRef } from "react";
import { IconArrowsMaximize, IconExclamationCircle, IconRefresh } from "@tabler/icons-react";
import { ExpiringMediaContainer } from "./ExpiringMediaContainer";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  retryDecryption?: () => void;
}

export const ImageMedia = ({ 
  url, 
  ttl = null,
  onExpired,
  retryDecryption
}: ImageMediaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
      setDimensions({
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);
  
  const handleImageClick = () => {
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };
  
  const handleRetry = () => {
    setHasError(false);
    if (retryDecryption) {
      retryDecryption();
    }
  };

  // Calculate responsive size based on original dimensions
  const getResponsiveSize = () => {
    const maxWidth = 320;  // Maximum width for thumbnails
    const maxHeight = 240; // Maximum height for thumbnails
    
    if (dimensions.width === 0 || dimensions.height === 0) {
      return { width: 'auto', height: 'auto' };
    }
    
    // Calculate aspect ratio
    const aspectRatio = dimensions.width / dimensions.height;
    
    // Determine if width or height should be constrained
    if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
      if (aspectRatio > 1) {
        // Wider than tall, constrain width
        return {
          width: `${maxWidth}px`,
          height: `${Math.min(maxHeight, maxWidth / aspectRatio)}px`
        };
      } else {
        // Taller than wide, constrain height
        return {
          width: `${Math.min(maxWidth, maxHeight * aspectRatio)}px`,
          height: `${maxHeight}px`
        };
      }
    }
    
    // Image is already smaller than maximums
    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`
    };
  };

  const responsiveSize = getResponsiveSize();

  if (hasError) {
    return (
      <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex flex-col items-center max-w-md">
        <IconExclamationCircle className="text-cyberred-400 mb-2" size={24} />
        <p className="text-cyberred-400 text-sm">Failed to load image</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-3 py-1 bg-cyberblue-800 hover:bg-cyberblue-700 rounded-md text-xs flex items-center gap-1 transition-colors"
        >
          <IconRefresh size={14} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <ExpiringMediaContainer ttl={ttl} onExpired={onExpired}>
      <div className="mt-2 relative group">
        <img
          ref={imageRef}
          src={url}
          alt="Encrypted message attachment"
          className={`rounded-md ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 cursor-pointer object-contain`}
          onClick={handleImageClick}
          style={responsiveSize}
          onLoad={() => setIsLoaded(true)}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyberdark-800/50 rounded-md">
            <div className="h-5 w-5 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="bg-cyberdark-900/80 hover:bg-cyberdark-800 p-1.5 rounded-md text-cyberblue-400"
            onClick={handleImageClick}
            title="View full size"
          >
            <IconArrowsMaximize size={16} />
          </button>
        </div>
        
        {isFullscreen && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={handleCloseFullscreen}
          >
            <img 
              src={url}
              alt="Fullscreen view" 
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-cyberdark-900/80 hover:bg-cyberdark-800 p-2 rounded-full text-white"
              onClick={handleCloseFullscreen}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </ExpiringMediaContainer>
  );
};
