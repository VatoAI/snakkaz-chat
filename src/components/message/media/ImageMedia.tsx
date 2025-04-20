
import { useState } from "react";
import { Lock, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureImageViewer } from "./SecureImageViewer";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
}

export const ImageMedia = ({ url, ttl }: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);

  const handleOpenViewer = () => {
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    // Reset blur on close
    setIsBlurred(true);
  };

  return (
    <div className="relative group mt-2">
      <div 
        className={`relative cursor-pointer hover:opacity-90 transition-opacity ${isBlurred ? 'blur-md' : ''}`}
        onClick={handleOpenViewer}
      >
        <img 
          src={url} 
          alt="Image" 
          className="max-w-full h-auto rounded-lg max-h-[200px] object-contain"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-cyberdark-900/80 p-2 rounded-lg border border-cyberblue-500/30 flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-xs text-white">Trykk for å vise</span>
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

      <SecureImageViewer 
        url={url} 
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        expiresIn={ttl}
      />
    </div>
  );
};
