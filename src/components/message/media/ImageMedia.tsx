
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageMediaProps {
  url: string;
}

export const ImageMedia = ({ url }: ImageMediaProps) => {
  return (
    <div className="relative group mt-2">
      <img 
        src={url} 
        alt="Image" 
        className="max-w-full h-auto rounded-lg max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(url, '_blank')}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
            <Lock className="h-3 w-3 text-green-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">End-to-end encrypted media</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
