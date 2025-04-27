import { useState, useEffect, useRef } from "react";
import { IconArrowsMaximize, IconExclamationCircle, IconRefresh } from "@tabler/icons-react";
import { ExpiringMediaContainer } from "./ExpiringMediaContainer";
import CryptoJS from "crypto-js";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  retryDecryption?: () => void;
  encryptionKey?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageMedia = ({
  url,
  ttl = null,
  onExpired,
  retryDecryption,
  encryptionKey,
  maxWidth = 400,
  maxHeight = 300
}: ImageMediaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();

  // Dekrypter bildet hvis det er kryptert
  useEffect(() => {
    let revoked = false;
    async function decryptImage() {
      if (!encryptionKey) {
        setDecryptedUrl(url);
        return;
      }
      setIsDecrypting(true);
      setHasError(false);
      try {
        const resp = await fetch(url);
        const encryptedText = await resp.text();
        const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
        const wordArray = decrypted;
        // Konverter til Uint8Array
        const uint8 = new Uint8Array(wordArray.sigBytes);
        for (let i = 0; i < wordArray.sigBytes; i++) {
          uint8[i] = (wordArray.words[Math.floor(i / 4)] >> (24 - 8 * (i % 4))) & 0xff;
        }
        const blob = new Blob([uint8], { type: "image/webp" });
        const objectUrl = URL.createObjectURL(blob);
        if (!revoked) setDecryptedUrl(objectUrl);
      } catch (e) {
        setHasError(true);
      } finally {
        setIsDecrypting(false);
      }
    }
    decryptImage();
    return () => {
      revoked = true;
      if (decryptedUrl) URL.revokeObjectURL(decryptedUrl);
    };
    // eslint-disable-next-line
  }, [url, encryptionKey]);

  useEffect(() => {
    if (!decryptedUrl) return;
    const img = new window.Image();
    img.src = decryptedUrl;
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
      setDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [decryptedUrl]);

  const handleImageClick = () => {
    setIsFullscreen(true);
    // Lås scrolling på body når fullskjerm er aktiv
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    // Gjenopprett scrolling
    document.body.style.overflow = "";
  };

  const handleRetry = () => {
    setHasError(false);
    if (retryDecryption) {
      retryDecryption();
    }
  };

  // Beregn optimal størrelse for bildet basert på dimensjonene
  const calculateImageSize = () => {
    if (!dimensions.width || !dimensions.height) {
      return {};
    }

    // Standardstørrelser
    const defaultMaxWidth = isMobile ? Math.min(280, window.innerWidth - 60) : maxWidth;
    const defaultMaxHeight = maxHeight;

    // Beregn skaleringsforhold
    const widthRatio = defaultMaxWidth / dimensions.width;
    const heightRatio = defaultMaxHeight / dimensions.height;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    // Beregn skalerte dimensjoner
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
        {isDecrypting && (
          <div className="flex items-center justify-center min-h-[120px] bg-cyberdark-800/30 rounded-lg">
            <div className="h-7 w-7 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
            <span className="ml-2 text-xs text-cyberblue-300">Dekrypterer bilde...</span>
          </div>
        )}
        {decryptedUrl && (
          <div className="relative overflow-hidden rounded-lg shadow-lg"
            style={{
              backgroundColor: 'rgba(13, 17, 23, 0.3)',
              maxWidth: isMobile ? '100%' : maxWidth,
              margin: '0 auto'
            }}>
            <img
              ref={imageRef}
              src={decryptedUrl}
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

        {!isLoaded && !isDecrypting && (
          <div className="rounded-lg bg-cyberdark-800/50 flex items-center justify-center"
            style={{
              height: 150,
              width: isMobile ? '100%' : 300,
              maxWidth: '100%'
            }}>
            <div className="h-5 w-5 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
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
                src={decryptedUrl || url}
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
