import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';
import { Eye, EyeOff, Download, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecureMediaDisplayProps {
  encryptedUrl: string;
  encryptionKey: string;
  fileType: string;
  messageId: string;
  ttl?: number | null;
  expiresAt?: string | null;
  isScreenProtected?: boolean;
}

export const SecureMediaDisplay: React.FC<SecureMediaDisplayProps> = ({
  encryptedUrl,
  encryptionKey,
  fileType,
  messageId,
  ttl,
  expiresAt,
  isScreenProtected = false
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  
  const { screenCaptureProtection } = useAppEncryption();
  const { toast } = useToast();
  
  // Calculate and format time remaining until media expires
  useEffect(() => {
    if (!expiresAt) return;
    
    const updateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        if (decryptedUrl) {
          URL.revokeObjectURL(decryptedUrl);
          setDecryptedUrl(null);
        }
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
  }, [expiresAt, decryptedUrl]);
  
  const decryptMedia = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would fetch the encrypted content and decrypt it
      // For demo purposes, we'll use a placeholder image with a timeout to simulate decryption
      
      // Simulated decryption process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would decrypt the media like this:
      // const encryptedBlob = await fetchEncryptedMedia(encryptedUrl);
      // const decryptedBlob = await decryptMediaBlob(encryptedBlob, encryptionKey);
      // const url = URL.createObjectURL(decryptedBlob);
      
      // For demo, just return the encrypted URL directly
      setDecryptedUrl(encryptedUrl);
      setIsFailed(false);
    } catch (error) {
      console.error('Failed to decrypt media:', error);
      setIsFailed(true);
      toast({
        title: "Dekryptering mislyktes",
        description: "Kunne ikke dekryptere mediafilen. Prøv igjen senere.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [encryptedUrl, toast]);
  
  useEffect(() => {
    if (isVisible && !decryptedUrl && !isFailed) {
      decryptMedia();
    }
    
    // Apply screen capture protection if needed
    if (isScreenProtected && isVisible) {
      screenCaptureProtection.enable();
    } else if (isScreenProtected && !isVisible) {
      screenCaptureProtection.disable();
    }
    
    // Clean up object URL when component unmounts
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
      if (isScreenProtected) {
        screenCaptureProtection.disable();
      }
    };
  }, [isVisible, decryptedUrl, isScreenProtected, decryptMedia, isFailed, screenCaptureProtection]);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  const downloadMedia = () => {
    if (!decryptedUrl) return;
    
    const link = document.createElement('a');
    link.href = decryptedUrl;
    link.download = `secure-media-${messageId.substring(0, 8)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Nedlastning startet",
      description: "Mediafilen blir lastet ned til enheten din.",
      variant: "default"
    });
  };
  
  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');
  
  return (
    <div className="relative rounded-md overflow-hidden bg-cyberdark-900 border border-cyberdark-700">
      {isScreenProtected && (
        <div className="absolute top-2 right-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
          <ShieldAlert size={12} className="text-cyberred-500 mr-1" />
          <span className="text-xs text-cyberred-500">Skjermbeskyttet</span>
        </div>
      )}
      
      {timeLeft && (
        <div className="absolute top-2 left-2 z-20 flex items-center bg-cyberdark-900/70 px-2 py-1 rounded-md">
          <AlertTriangle size={12} className="text-cyberyellow-500 mr-1" />
          <span className="text-xs text-cyberyellow-500">Utløper om {timeLeft}</span>
        </div>
      )}
      
      {!isVisible ? (
        <div 
          className="flex flex-col items-center justify-center h-48 bg-cyberdark-800 cursor-pointer"
          onClick={toggleVisibility}
        >
          <EyeOff className="h-12 w-12 text-cyberdark-400 mb-2" />
          <p className="text-sm text-cyberdark-300">
            Kryptert {isImage ? 'bilde' : isVideo ? 'video' : 'fil'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 bg-cyberdark-700 hover:bg-cyberdark-600"
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility();
            }}
          >
            <Eye size={14} className="mr-2" />
            Vis innhold
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 bg-cyberdark-800">
          <div className="h-8 w-8 border-2 border-cybergold-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-cyberdark-300">Dekrypterer...</p>
        </div>
      ) : isFailed ? (
        <div className="flex flex-col items-center justify-center h-48 bg-cyberdark-800">
          <AlertTriangle className="h-12 w-12 text-cyberred-500 mb-2" />
          <p className="text-sm text-cyberred-300">Dekryptering mislyktes</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 bg-cyberdark-700 hover:bg-cyberdark-600"
            onClick={() => decryptMedia()}
          >
            Prøv igjen
          </Button>
        </div>
      ) : (
        <div className="relative">
          {isImage && decryptedUrl && (
            <img 
              src={decryptedUrl} 
              alt="Encrypted media" 
              className="max-w-full w-full object-contain max-h-96"
              onError={() => setIsFailed(true)}
            />
          )}
          
          {isVideo && decryptedUrl && (
            <video 
              src={decryptedUrl} 
              controls
              className="max-w-full w-full max-h-96"
              onError={() => setIsFailed(true)}
            />
          )}
          
          {!isImage && !isVideo && (
            <div className="flex flex-col items-center justify-center h-48 bg-cyberdark-800">
              <AlertTriangle className="h-8 w-8 text-cyberyellow-500 mb-2" />
              <p className="text-sm text-cyberdark-300">Filtype ikke støttet for forhåndsvisning</p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-black/30"
              onClick={toggleVisibility}
            >
              <EyeOff size={16} className="mr-2" />
              Skjul
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-black/30"
              onClick={downloadMedia}
            >
              <Download size={16} className="mr-2" />
              Last ned
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};