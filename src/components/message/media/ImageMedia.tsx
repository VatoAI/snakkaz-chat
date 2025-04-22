
import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureImageViewer } from "./SecureImageViewer";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
  onExpired?: () => void;
}

export const ImageMedia = ({ url, ttl, onExpired }: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="relative group mt-2">
      <div className="relative hover:opacity-90 transition-opacity cursor-zoom-in">
        <img 
          src={url} 
          alt="Sikret bilde" 
          className="w-full h-auto rounded-lg max-h-[300px] object-contain shadow-lg shadow-cyberdark-900/30"
          onContextMenu={e => e.preventDefault()}
          draggable="false"
          onClick={() => setIsViewerOpen(true)}
          loading="lazy"
        />
        <SecureMediaIcon position="top-right" size="sm" />
      </div>
      
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
            {ttl && (
              <p className="text-xs text-cyberblue-300">Automatisk sletting aktivert</p>
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
