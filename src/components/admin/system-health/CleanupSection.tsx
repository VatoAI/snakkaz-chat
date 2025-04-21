
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash, Loader2, Settings } from "lucide-react";

interface CleanupSectionProps {
  onCleanup: () => Promise<void>;
}

export const CleanupSection = ({ onCleanup }: CleanupSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await onCleanup();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            className="flex-1 bg-cyberdark-800 hover:bg-cyberdark-700 border border-gray-700"
            onClick={handleCleanup}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2" size={16} />
            )}
            Kjør Opprydning
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Fjerner gamle signaldata og tilstedeværelse</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400"
          >
            <Settings size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Systemminnstillinger</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
