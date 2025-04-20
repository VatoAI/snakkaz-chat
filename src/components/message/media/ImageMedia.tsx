
import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureImageViewer } from "./SecureImageViewer";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface ImageMediaProps {
  url: string;
  ttl?: number | null;
}

export const ImageMedia = ({ url, ttl }: ImageMediaProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  console.log("Rendering ImageMedia with URL:", url);

  return (
    <div className="relative group mt-2">
      <div className="relative hover:opacity-90 transition-opacity overflow-hidden rounded-lg shadow-lg shadow-cyberdark-900/30">
        <img 
          src={url} 
          alt="Sikret bilde" 
          className="max-w-full h-auto rounded-lg max-h-[300px] object-contain cursor-zoom-in"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
          onClick={() => setIsViewerOpen(true)}
          loading="lazy"
        />
        
        <SecureMediaIcon position="top-right" size="sm" />
        
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
      </div>

      <SecureImageViewer 
        url={url} 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        expiresIn={ttl}
      />
    </div>
  );
};
