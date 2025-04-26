import { useState, useEffect, useRef } from "react";
import { IconArrowsMaximize, IconExclamationCircle, IconRefresh } from "@tabler/icons-react";
import { ExpiringMediaContainer } from "./ExpiringMediaContainer";
import CryptoJS from "crypto-js";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  retryDecryption?: () => void;
  encryptionKey?: string; // NYTT: nøkkel for dekryptering
}

export const ImageMedia = ({ 
  url, 
  ttl = null,
  onExpired,
  retryDecryption,
  encryptionKey
}: ImageMediaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

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

  // Responsive visning
  const responsiveSize = {
    maxWidth: '80vw',
    maxHeight: '40vh',
    width: 'auto',
    height: 'auto',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  };

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
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="h-7 w-7 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin"></div>
            <span className="ml-2 text-xs text-muted-foreground">Dekrypterer bilde...</span>
          </div>
        )}
        {decryptedUrl && (
          <img
            ref={imageRef}
            src={decryptedUrl}
            alt="Encrypted message attachment"
            className={`rounded-lg shadow-lg object-cover cursor-pointer ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            onClick={handleImageClick}
            style={responsiveSize}
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
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
              src={decryptedUrl || url}
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
