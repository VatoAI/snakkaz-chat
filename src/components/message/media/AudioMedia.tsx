
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AudioMediaProps {
  url: string;
  mediaType: string;
}

export const AudioMedia = ({ url, mediaType }: AudioMediaProps) => {
  return (
    <div className="relative group mt-2">
      <audio 
        controls 
        className="max-w-full w-full mt-2"
      >
        <source src={url} type={mediaType} />
        Your browser doesn't support audio playback.
      </audio>
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
