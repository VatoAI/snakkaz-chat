
import { useState, useEffect, useRef } from "react";
import { IconArrowsMaximize, IconExclamationCircle, IconRefresh } from "@tabler/icons-react";
import { ExpiringMediaContainer } from "./ExpiringMediaContainer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  retryDecryption?: () => void;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageMedia = ({
  url,
  ttl = null,
  onExpired,
  retryDecryption,
  maxWidth = 400,
  maxHeight = 300
}: ImageMediaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();
  
  // Load image and get dimensions
  useEffect(() => {
    if (!url) return;
    
    const img = new window.Image();
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
      setDimensions({ width: img.width, height: img.height });
      console.log(`Image loaded successfully: ${img.width}x${img.height}`);
    };
    
    img.onerror = (e) => {
      console.error("Failed to load image:", e);
      setHasError(true);
      setIsLoaded(false);
    };
    
    // Set source after adding event handlers
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  const handleImageClick = () => {
    setIsFullscreen(true);
    // Lock scrolling on body when fullscreen is active
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    // Restore scrolling
    document.body.style.overflow = "";
  };

  const handleRetry = () => {
    setHasError(false);
    if (retryDecryption) {
      retryDecryption();
    }
  };

  // Calculate optimal size for the image based on dimensions
  const calculateImageSize = () => {
    if (!dimensions.width || !dimensions.height) {
      return {};
    }

    // Default sizes
    const defaultMaxWidth = isMobile ? Math.min(280, window.innerWidth - 60) : maxWidth;
    const defaultMaxHeight = maxHeight;

    // Calculate scale ratio
    const widthRatio = defaultMaxWidth / dimensions.width;
    const heightRatio = defaultMaxHeight / dimensions.height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    // Calculate scaled dimensions
    const scaledWidth = Math.floor(dimensions.width * ratio);
    const scaledHeight = Math.floor(dimensions.height * ratio);

    return {
      width: scaledWidth > 0 ? scaledWidth : 'auto',
      height: scaledHeight > 0 ? scaledHeight : 'auto',
    };
  };

  const imageSize = calculateImageSize();

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
        {!isLoaded && (
          <div className="rounded-lg bg-cyberdark-800/50 flex items-center justify-center"
            style={{
              height: 150,
              width: isMobile ? '100%' : 300,
              maxWidth: '100%'
            }}>
            <div className="h-5 w-5 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
          </div>
        )}
        
        {url && (
          <div className="relative overflow-hidden rounded-lg shadow-lg"
            style={{
              backgroundColor: 'rgba(13, 17, 23, 0.3)',
              maxWidth: isMobile ? '100%' : maxWidth,
              margin: '0 auto',
              display: isLoaded ? 'block' : 'none'
            }}>
            <img
              ref={imageRef}
              src={url}
              alt="Encrypted message attachment"
              className={`object-contain rounded-lg ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
              onClick={handleImageClick}
              style={{
                ...imageSize,
                maxWidth: '100%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                display: 'block',
                margin: '0 auto'
              }}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
          </div>
        )}

        {isLoaded && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-cyberdark-900/80 hover:bg-cyberdark-800 p-1.5 rounded-md text-cyberblue-400 shadow-lg"
              onClick={handleImageClick}
              title="View full size"
            >
              <IconArrowsMaximize size={16} />
            </button>
          </div>
        )}

        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={handleCloseFullscreen}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={url}
                alt="Fullscreen view"
                className="max-w-[95vw] max-h-[90vh] object-contain"
                style={{
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
                }}
              />
              <button
                className="absolute top-4 right-4 bg-cyberdark-900/80 hover:bg-cyberdark-800 p-2 rounded-full text-white shadow-glow-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFullscreen();
                }}
                style={{
                  boxShadow: '0 0 10px rgba(26, 157, 255, 0.5)'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </ExpiringMediaContainer>
  );
};
