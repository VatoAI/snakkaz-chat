
import { useState } from "react";
import { Lock, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useScreenshotPrevention } from "@/utils/security/screenshot-prevention";

interface VideoMediaProps {
  url: string;
  mediaType: string;
}

export const VideoMedia = ({ url, mediaType }: VideoMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Use screenshot prevention
  useScreenshotPrevention({
    onScreenshotAttempt: () => {
      if (isViewerOpen) {
        setIsViewerOpen(false);
      }
    }
  });

  return (
    <div className="relative group mt-2">
      <div 
        className="relative cursor-pointer hover:opacity-90 transition-opacity bg-cyberdark-900/50 rounded-lg"
        onClick={() => setIsViewerOpen(true)}
      >
        <div className="flex items-center justify-center h-[150px] rounded-lg border border-cyberblue-500/20">
          <div className="bg-cyberdark-900/80 p-2 rounded-lg border border-cyberblue-500/30 flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-xs text-white">Klikk for å spille av video</span>
          </div>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
            <Lock className="h-3 w-3 text-green-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">Ende-til-ende kryptert media</p>
        </TooltipContent>
      </Tooltip>

      <div className="absolute bottom-2 right-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-cyberdark-900/80 p-1 rounded text-xs flex items-center gap-1">
              <EyeOff className="h-3 w-3 text-cyberred-400" />
              <span className="text-cyberred-300">Sikret</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xs">Screenshot og deling er deaktivert</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-screen-lg p-0 bg-cyberdark-950 border-cyberblue-500/30">
          <div className="relative flex flex-col">
            <div className="flex justify-between items-center p-3 bg-cyberdark-900 border-b border-cyberblue-500/30">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyberblue-400" />
                <span className="text-sm text-cyberblue-300">Sikker videoavspilling</span>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            
            <div className="p-4 flex items-center justify-center">
              <video 
                controls 
                className="max-w-full h-auto rounded-lg max-h-[500px]"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={url} type={mediaType} />
                Your browser doesn't support video playback.
              </video>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
