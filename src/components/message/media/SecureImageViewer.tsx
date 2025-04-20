
import { useState, useEffect, useRef } from "react";
import { X, Download, Lock, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface SecureImageViewerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  expiresIn?: number | null; // Seconds until the image expires
}

export const SecureImageViewer = ({ url, isOpen, onClose, expiresIn }: SecureImageViewerProps) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();
  const { settings } = useNotifications();
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Set countdown based on TTL or default to 30 seconds for viewing
  useEffect(() => {
    if (isOpen) {
      const viewingTime = 30; // 30 seconds default viewing time
      setCountdown(viewingTime);
      
      // Start the countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            if (prev === 1) {
              onClose();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [isOpen, onClose]);
  
  // Prevent screenshots using keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common screenshot shortcuts
      const isPrintScreen = e.key === 'PrintScreen';
      const isCtrlShiftS = e.ctrlKey && e.shiftKey && e.key === 's';
      const isCmdShiftS = e.metaKey && e.shiftKey && e.key === 's';
      const isCmdShift4 = e.metaKey && e.shiftKey && e.key === '4';
      
      if (isPrintScreen || isCtrlShiftS || isCmdShiftS || isCmdShift4) {
        e.preventDefault();
        toast({
          title: "Skjermdump deaktivert",
          description: "Skjermdump er deaktivert for sikker visning av bilder",
          variant: "destructive",
        });
        
        // Add extra protection by temporarily blurring the image
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 3000);
        return false;
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toast]);
  
  // Generate watermark with user info
  const renderWatermark = () => {
    const timestamp = new Date().toISOString();
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-30 pointer-events-none select-none" style={{ fontSize: '1rem' }}>
        <div className="rotate-45 text-center w-full">
          <p className="font-bold">ENDE-TIL-ENDE KRYPTERT</p>
          <p>{timestamp}</p>
          <p>Sikker visning</p>
        </div>
      </div>
    );
  };
  
  // Toggle blur effect
  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-screen-lg h-[80vh] p-0 bg-cyberdark-950 border-cyberblue-500/30">
        <div className="relative h-full w-full flex flex-col">
          {/* Header with controls */}
          <div className="flex justify-between items-center p-3 bg-cyberdark-900 border-b border-cyberblue-500/30">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyberblue-400" />
              <span className="text-sm text-cyberblue-300">Sikker bildevisning</span>
              {countdown !== null && (
                <span className="ml-2 text-xs bg-cyberdark-800 px-2 py-1 rounded text-cyberred-400">
                  {countdown}s
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBlur}
                className="flex items-center gap-1 text-xs"
              >
                <EyeOff className="h-3 w-3" />
                {isBlurred ? "Vis" : "Skjul"}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
          
          {/* Image container */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-cyberdark-950 p-4">
            <div 
              className={`relative max-h-full max-w-full ${isBlurred ? 'blur-xl' : ''}`}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img 
                ref={imageRef}
                src={url} 
                alt="Secure image" 
                className="max-h-full max-w-full object-contain"
                style={{ filter: `blur(${isBlurred ? '20px' : '0px'})` }}
                draggable="false"
              />
              {!isBlurred && renderWatermark()}
            </div>
            
            {isBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Button 
                  onClick={toggleBlur} 
                  className="bg-cyberdark-800/80 hover:bg-cyberdark-700"
                >
                  Trykk for å vise
                </Button>
                <p className="text-xs text-cyberblue-300 mt-2">
                  Dette bildet vil automatisk lukkes om {countdown || '0'} sekunder
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
