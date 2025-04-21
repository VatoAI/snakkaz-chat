
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TTLSelectorProps {
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  isLoading: boolean;
  isRecording: boolean;
}

export const TTLSelector = ({ ttl, setTtl, isLoading, isRecording }: TTLSelectorProps) => {
  // Messages now always have a 24-hour TTL (86400 seconds)
  const defaultTtl = 86400;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
            disabled={isLoading || isRecording}
          >
            <Clock className="w-4 h-4" />
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-cyberdark-800 border-cybergold-500/30">
        <p className="text-xs">Alle meldinger slettes automatisk etter 24 timer</p>
      </TooltipContent>
    </Tooltip>
  );
};
