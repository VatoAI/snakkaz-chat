
import { useEffect, useState } from "react";
import { X, Shield, Timer } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    expiresIn ? expiresIn : null
  );
  
  // Handle countdown timer if the media has TTL
  useEffect(() => {
    if (!isOpen || !expiresIn || !timeRemaining) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          onExpired?.();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, expiresIn, timeRemaining, onExpired, onClose]);
  
  // Format the remaining time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent 
        className="bg-cyberdark-950 border-cybergold-800/30 p-1 max-w-4xl w-[95vw]"
        onContextMenu={e => e.preventDefault()}
      >
        <div className="relative w-full">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            {timeRemaining !== null && (
              <div className={cn(
                "bg-cyberdark-900/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1",
                timeRemaining < 10 && "animate-pulse bg-cyberred-900/70"
              )}>
                <Timer className="h-3 w-3 text-cybergold-400" />
                <span className="text-xs text-cybergold-300">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-cyberdark-900/70 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-cyberdark-900/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
              <Shield className="h-3 w-3 text-cybergold-400" />
              <span className="text-xs text-cybergold-300">Secure media</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[50vh]">
            <img
              src={url}
              alt="Secure media"
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
