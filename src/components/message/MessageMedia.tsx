import { useState, useEffect } from "react";
import { IconFile, IconFileText, IconLock, IconShieldLock, IconClockHour4 } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaDecryption } from "./media/useMediaDecryption";
import { Button } from "@/components/ui/button";
import { VideoMedia } from "./media/VideoMedia";
import { ImageMedia } from "./media/ImageMedia";
import { FileMedia } from "./media/FileMedia";
import { DecryptedMessage } from "@/types/message";
import { ExpiringMediaContainer } from "./media/ExpiringMediaContainer";
import { useAppEncryption } from "@/contexts/AppEncryptionContext";
import { Download, Eye, EyeOff, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageMediaProps {
  encryptedUrl?: string;
  encryptionKey?: string;
  fileType?: string;
  messageId?: string;
  ttl?: number | null;
  onDelete?: () => void;
  onShowDeleteConfirm?: () => void;
  message?: DecryptedMessage;
  onMediaExpired?: () => void;
}

export const MessageMedia = ({ 
  encryptedUrl, 
  encryptionKey, 
  fileType,
  messageId,
  ttl,
  onDelete,
  onShowDeleteConfirm,
  message,
  onMediaExpired
}: MessageMediaProps) => {
  const [decryptFailed, setDecryptFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const { screenCaptureProtection } = useAppEncryption();
  
  // Extract values from message prop if provided
  const mediaUrl = message?.media_url || encryptedUrl || '';
  const mediaKey = message?.media_encryption_key || encryptionKey || '';
  const mediaType = message?.media_type || fileType || '';
  const mediaTtl = message?.ephemeral_ttl || ttl;
  const messageIdToUse = message?.id || messageId;
  const preventScreenshot = message?.prevent_screenshot || false;
  // Calculate expiresAt based on message timestamp and ephemeral_ttl if it exists
  const expiresAt = message?.timestamp && message?.ephemeral_ttl 
    ? new Date(new Date(message.timestamp).getTime() + message.ephemeral_ttl * 1000).toISOString()
    : null;
  
  // Use our media decryption hook
  const {
    decryptedURL,
    isLoading,
    error,
    retry
  } = useMediaDecryption(mediaUrl, mediaKey, message?.media_iv || '', mediaType);

  // Handle media expiration
  const handleMediaExpired = () => {
    if (onDelete) {
      onDelete();
      toast({
        title: "Media Expired",
        description: "This media has reached its time limit and been deleted.",
        variant: "warning",
      });
    } else if (onMediaExpired) {
      onMediaExpired();
    }
  };

  // Calculate time left until expiration
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  
  useEffect(() => {
    if (!expiresAt) return;
    
    const updateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        if (decryptedURL) {
          URL.revokeObjectURL(decryptedURL);
        }
        handleMediaExpired();
        return;
      }
      
      // Format the remaining time
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [expiresAt, decryptedURL]);

  // Effect to check for decryption failures
  useEffect(() => {
    if (error) {
      setDecryptFailed(true);
      console.error('Media decryption failed:', error);
    } else {
      setDecryptFailed(false);
    }
  }, [error]);
  
  // Apply or remove screenshot protection based on visibility
  useEffect(() => {
    if (preventScreenshot && isVisible) {
      screenCaptureProtection.enable();
    } else if (preventScreenshot && !isVisible) {
      screenCaptureProtection.disable();
    }
    
    return () => {
      if (preventScreenshot) {
        screenCaptureProtection.disable();
      }
    };
  }, [isVisible, preventScreenshot, screenCaptureProtection]);
  
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };
  
  const downloadMedia = () => {
    if (!decryptedURL) return;
    
    const link = document.createElement('a');
    link.href = decryptedURL;
    link.download = `secure-media-${messageIdToUse?.substring(0, 8) || 'file'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Nedlastning startet",
      description: "Mediafilen blir lastet ned til enheten din.",
      variant: "default"
    });
  };
  
  // If user hasn't chosen to view yet, show a privacy shield
  if (!isVisible) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-cyberdark-800/70 border border-cyberdark-700 rounded-lg p-4 min-h-[120px] max-w-md cursor-pointer"
        onClick={toggleVisibility}
      >
        {preventScreenshot && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
                  <ShieldAlert size={12} className="text-cyberred-500 mr-1" />
                  <span className="text-xs text-cyberred-500">Skjermbeskyttet</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Dette medieinnholdet er beskyttet mot skjermdumper</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {timeLeft && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 left-2 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
                  <IconClockHour4 size={12} className="text-cyberyellow-500 mr-1" />
                  <span className="text-xs text-cyberyellow-500">Utløper om {timeLeft}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Dette innholdet vil bli slettet etter en viss tid</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <IconShieldLock className="text-cybergold-400 mb-2" size={28} />
        <p className="text-sm text-cyberdark-200 mb-1">
          {mediaType.startsWith("image/") ? 'Kryptert bilde' : 
           mediaType.startsWith("video/") ? 'Kryptert video' : 'Kryptert fil'}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 bg-cyberdark-700 hover:bg-cyberdark-600"
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility();
          }}
        >
          <Eye size={14} className="mr-2" />
          Vis innhold
        </Button>
      </div>
    );
  }
  
  if (isLoading || (!decryptedURL && !error && !decryptFailed)) {
    return (
      <div className="flex flex-col items-center justify-center bg-cyberdark-800/50 rounded-lg p-4 min-h-[150px] w-full max-w-md shadow-md border border-cyberdark-700">
        <IconLock className="text-cyberblue-400 mb-2" size={24} />
        <div className="h-6 w-6 border-2 border-t-transparent border-cyberblue-400 rounded-full animate-spin mb-2"></div>
        <p className="text-xs text-cyberdark-200">Dekrypterer...</p>
      </div>
    );
  }

  if (error || decryptFailed) {
    return (
      <div className="bg-cyberdark-800/80 p-4 rounded-md flex flex-col items-center max-w-md border border-cyberred-800/30">
        <IconLock className="text-cyberred-400 mb-2" size={24} />
        <p className="text-cyberred-400 text-sm">Kunne ikke dekryptere media</p>
        <p className="text-cyberdark-300 text-xs my-1">Krypteringsnøkkelen kan være ugyldig eller filen er korrupt</p>
        
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => retry()}
            className="text-xs border-cyberblue-700 bg-cyberdark-900 hover:bg-cyberdark-800"
          >
            Prøv igjen
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={toggleVisibility}
            className="text-xs text-cyberdark-300"
          >
            <EyeOff size={14} className="mr-1" />
            Skjul
          </Button>
        </div>
      </div>
    );
  }

  if (mediaType.startsWith("image/") && decryptedURL) {
    return (
      <div className="relative rounded-md overflow-hidden border border-cyberdark-700">
        {preventScreenshot && (
          <div className="absolute top-2 right-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <ShieldAlert size={12} className="text-cyberred-500 mr-1" />
            <span className="text-xs text-cyberred-500">Skjermbeskyttet</span>
          </div>
        )}
        
        {timeLeft && (
          <div className="absolute top-2 left-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <IconClockHour4 size={12} className="text-cyberyellow-500 mr-1" />
            <span className="text-xs text-cyberyellow-500">Utløper om {timeLeft}</span>
          </div>
        )}
        
        <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
          <div className="relative">
            <ImageMedia 
              url={decryptedURL} 
              retryDecryption={retry}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-black/30"
                onClick={toggleVisibility}
              >
                <EyeOff size={14} className="mr-1" />
                Skjul
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-black/30"
                onClick={downloadMedia}
              >
                <Download size={14} className="mr-1" />
                Last ned
              </Button>
            </div>
          </div>
        </ExpiringMediaContainer>
      </div>
    );
  }
  
  if (mediaType.startsWith("video/") && decryptedURL) {
    return (
      <div className="relative rounded-md overflow-hidden border border-cyberdark-700">
        {preventScreenshot && (
          <div className="absolute top-2 right-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <ShieldAlert size={12} className="text-cyberred-500 mr-1" />
            <span className="text-xs text-cyberred-500">Skjermbeskyttet</span>
          </div>
        )}
        
        {timeLeft && (
          <div className="absolute top-2 left-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <IconClockHour4 size={12} className="text-cyberyellow-500 mr-1" />
            <span className="text-xs text-cyberyellow-500">Utløper om {timeLeft}</span>
          </div>
        )}
        
        <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
          <div className="relative">
            <VideoMedia 
              url={decryptedURL}
              type={mediaType}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-black/30"
                onClick={toggleVisibility}
              >
                <EyeOff size={14} className="mr-1" />
                Skjul
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-black/30"
                onClick={downloadMedia}
              >
                <Download size={14} className="mr-1" />
                Last ned
              </Button>
            </div>
          </div>
        </ExpiringMediaContainer>
      </div>
    );
  }
  
  // For files like PDF, documents, etc.
  if (decryptedURL) {
    return (
      <div className="relative rounded-md overflow-hidden border border-cyberdark-700">
        {preventScreenshot && (
          <div className="absolute top-2 right-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <ShieldAlert size={12} className="text-cyberred-500 mr-1" />
            <span className="text-xs text-cyberred-500">Skjermbeskyttet</span>
          </div>
        )}
        
        {timeLeft && (
          <div className="absolute top-2 left-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
            <IconClockHour4 size={12} className="text-cyberyellow-500 mr-1" />
            <span className="text-xs text-cyberyellow-500">Utløper om {timeLeft}</span>
          </div>
        )}
        
        <ExpiringMediaContainer ttl={mediaTtl} onExpired={handleMediaExpired}>
          <div className="relative">
            <FileMedia 
              url={decryptedURL}
              type={mediaType}
              filename={messageIdToUse || "secure-file"}
            />
            
            <div className="mt-2 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-cyberdark-300 hover:bg-cyberdark-800"
                onClick={toggleVisibility}
              >
                <EyeOff size={14} className="mr-1" />
                Skjul
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-cyberdark-300 hover:bg-cyberdark-800"
                onClick={downloadMedia}
              >
                <Download size={14} className="mr-1" />
                Last ned
              </Button>
            </div>
          </div>
        </ExpiringMediaContainer>
      </div>
    );
  }
  
  // Fallback if we somehow get here
  return (
    <div className="bg-cyberdark-800/80 p-4 rounded-md mt-2 flex items-center gap-2 border border-cyberdark-700">
      <IconFileText className="text-cyberblue-400" size={24} />
      <div>
        <p className="text-sm">Vedlegg</p>
        <p className="text-xs text-cyberdark-300">Kan ikke vise media</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-auto text-cyberdark-300"
        onClick={toggleVisibility}
      >
        <EyeOff size={14} className="mr-1" />
        Skjul
      </Button>
    </div>
  );
};
