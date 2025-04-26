import { useState, useEffect } from "react";
import { EyeOff, AlertCircle, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SecureImageViewer } from "./SecureImageViewer";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
  retryDecryption?: () => void;
}

export const ImageMedia = ({ url, ttl, onExpired, retryDecryption }: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [imageKey, setImageKey] = useState(`img-${Date.now()}`);

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoaded(false);
    setLoadError(false);
    setRetryAttempts(0);
    setImageKey(`img-${Date.now()}`);
  }, [url]);

  // Handle manual retry
  const handleRetry = () => {
    setIsLoaded(false);
    setLoadError(false);
    setRetryAttempts(prev => prev + 1);
    setImageKey(`img-${Date.now()}-retry-${retryAttempts + 1}`);
    
    // If a decryption retry function is provided, call it too
    if (retryDecryption) {
      retryDecryption();
    }
  };

  if (loadError) {
    return (
      <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-cyberred-400" />
          <p className="text-cyberred-400 text-sm">Kunne ikke laste bildet</p>
        </div>
        
        <div className="flex gap-2 mt-1">
          <Button 
            size="sm"
            variant="outline"
            onClick={handleRetry}
            className="text-xs border-cyberblue-700 bg-cyberdark-900 hover:bg-cyberdark-800"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Prøv igjen
          </Button>
          
          <Button 
            size="sm"
            variant="outline"
            onClick={() => window.open(url, '_blank')}
            className="text-xs border-cyberblue-700 bg-cyberdark-900 hover:bg-cyberdark-800"
          >
            Åpne direkte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group mt-2">
      {!isLoaded && (
        <div className="flex flex-col items-center justify-center bg-cyberdark-800/50 rounded-lg p-6 min-h-[120px]">
          <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-500 rounded-full animate-spin mb-2"></div>
          <p className="text-xs text-cyberdark-200">Laster media...</p>
        </div>
      )}
      
      <div className={`relative hover:opacity-90 transition-opacity cursor-zoom-in ${!isLoaded ? 'hidden' : ''}`}>
        <img 
          key={imageKey}
          src={url} 
          alt="Secure media" 
          className="w-full h-auto rounded-lg max-h-[300px] object-contain shadow-md shadow-cyberdark-900/30"
          onContextMenu={e => e.preventDefault()}
          draggable="false"
          onClick={() => setIsViewerOpen(true)}
          onLoad={() => setIsLoaded(true)}
          onError={() => setLoadError(true)}
          loading="lazy"
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
