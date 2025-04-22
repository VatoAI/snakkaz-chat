
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";
import { useScreenshotPrevention } from "@/utils/security/screenshot-prevention";

interface SecureImageViewerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  expiresIn?: number | null;
  onExpired?: () => void;
}

export const SecureImageViewer = ({
  url,
  isOpen,
  onClose,
  expiresIn,
  onExpired
}: SecureImageViewerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(expiresIn || null);
  
  // Apply screenshot prevention
  useScreenshotPrevention({
    showToast: true,
    toastTitle: "Skjermdump deaktivert",
    toastMessage: "Av sikkerhetsgrunner er skjermdump deaktivert"
  });
  
  useEffect(() => {
    if (!isOpen || !expiresIn) return;
    
    setTimeLeft(expiresIn);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (onExpired) onExpired();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, expiresIn, onClose, onExpired]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] bg-cyberdark-950 border-cybergold-500/30">
        <div className="relative">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-0 right-0 z-10 text-white/70 hover:text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
          
          {timeLeft && (
            <div className="absolute top-2 left-2 bg-cyberdark-900/80 px-2 py-1 rounded-md flex items-center gap-1 text-xs text-cyberblue-300">
              <Clock className="h-3 w-3" />
              <span>{timeLeft}s</span>
            </div>
          )}
          
          <div className="flex items-center justify-center">
            <img 
              src={url} 
              alt="Secured image" 
              className="max-w-full max-h-[80vh] object-contain"
              onContextMenu={e => e.preventDefault()}
              draggable="false"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
