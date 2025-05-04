import { useState, useEffect, useRef, useCallback } from "react";
import { IconArrowsMaximize, IconExclamationCircle, IconRefresh, IconDownload } from "@tabler/icons-react";
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
  const [loadAttempts, setLoadAttempts] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  // Forbedret bildelastingsfunksjon med flere forsøk
  const loadImage = useCallback(() => {
    if (!url) return;

    const img = new window.Image();
    const timeoutId: number = window.setTimeout(() => {
      if (!isLoaded) {
        img.src = ""; // Avbryter gjeldende lasting
        if (loadAttempts < 2) {
          setLoadAttempts(prev => prev + 1);
        } else {
          setHasError(true);
        }
      }
    }, 15000); // 15 sekunder timeout

    img.onload = () => {
      clearTimeout(timeoutId);
      setIsLoaded(true);
      setHasError(false);
      setDimensions({ width: img.width, height: img.height });
      console.log(`Image loaded successfully: ${img.width}x${img.height}`);
    };

    img.onerror = (e) => {
      console.error("Failed to load image:", e);
      if (loadAttempts < 2) {
        // Automatisk nytt forsøk med forsinkelse
        setTimeout(() => {
          setLoadAttempts(prev => prev + 1);
        }, 1000);
      } else {
        setHasError(true);
        setIsLoaded(false);
      }
    };

    // Set source after adding event handlers
    img.src = url;

    return () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [url, loadAttempts, isLoaded]);

  // Kjør bildelastingen
  useEffect(() => {
    return loadImage();
  }, [url, loadAttempts, loadImage]);

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
    setLoadAttempts(0); // Nullstill forsøk
    if (retryDecryption) {
      retryDecryption();
    }
  };

  // Funksjon for å laste ned bildet i full oppløsning
  const handleDownload = () => {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = `encrypted-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate optimal size for the image based on dimensions - Forbedret for å beholde høy kvalitet
  const calculateImageSize = () => {
    if (!dimensions.width || !dimensions.height) {
      return {};
    }

    // Default sizes - Økt maks bredde for bedre kvalitet
    const defaultMaxWidth = isMobile ? Math.min(320, window.innerWidth - 40) : maxWidth;
    const defaultMaxHeight = maxHeight;

    // Calculate scale ratio
    const widthRatio = defaultMaxWidth / dimensions.width;
    const heightRatio = defaultMaxHeight / dimensions.height;

    // Aldri skaler opp små bilder
    const ratio = Math.min(widthRatio, heightRatio, 1);

    // Calculate scaled dimensions - Behold original oppløsning når mulig
    const scaledWidth = Math.floor(dimensions.width * ratio);
    const scaledHeight = Math.floor(dimensions.height * ratio);

    return {
      width: scaledWidth > 0 ? scaledWidth : 'auto',
      height: scaledHeight > 0 ? scaledHeight : 'auto',
    };
  };

  const imageSize = calculateImageSize();

  // Vis lastefeil med bedre feilhåndtering
  if (hasError) {
    return (
      <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex flex-col items-center max-w-md">
        <IconExclamationCircle className="text-cyberred-400 mb-2" size={24} />
        <p className="text-cyberred-400 text-sm">Kunne ikke laste bildet</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-cyberblue-800 hover:bg-cyberblue-700 rounded-md text-xs flex items-center gap-1 transition-colors"
          >
            <IconRefresh size={14} />
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExpiringMediaContainer ttl={ttl} onExpired={onExpired}>
      <div className="mt-2 relative group">
        {/* Forbedret lastindikator med pulserende effekt */}
        {!isLoaded && (
          <div className="rounded-lg bg-cyberdark-800/50 flex items-center justify-center"
            style={{
              height: 150,
              width: isMobile ? '100%' : 300,
              maxWidth: '100%'
            }}>
            <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
          </div>
        )}

        {url && (
          <div className="relative overflow-hidden rounded-lg shadow-neon-blue"
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

        {/* Forbedrete kontroller med knapper for nedlasting og forstørring */}
        {isLoaded && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              className="bg-cyberdark-900/80 hover:bg-cyberdark-800 p-1.5 rounded-md text-cyberblue-400 shadow-lg"
              onClick={handleDownload}
              title="Last ned"
            >
              <IconDownload size={16} />
            </button>
            <button
              className="bg-cyberdark-900/80 hover:bg-cyberdark-800 p-1.5 rounded-md text-cyberblue-400 shadow-lg"
              onClick={handleImageClick}
              title="Vis full størrelse"
            >
              <IconArrowsMaximize size={16} />
            </button>
          </div>
        )}

        {/* Forbedret fullskjermvisning med zoom-funksjonalitet */}
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
                className="absolute top-4 right-4 bg-cyberdark-900/80 hover:bg-cyberdark-800 p-2 rounded-full text-white shadow-neon-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFullscreen();
                }}
              >
                ✕
              </button>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  className="bg-cyberdark-900/80 hover:bg-cyberdark-800 p-2 rounded-md text-white shadow-neon-blue flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <IconDownload size={18} />
                  <span className="text-sm">Last ned</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExpiringMediaContainer>
  );
};
