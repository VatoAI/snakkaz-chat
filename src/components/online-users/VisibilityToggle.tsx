
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VisibilityToggleProps {
  hidden: boolean;
  onToggleHidden: () => void;
}

export const VisibilityToggle = ({ hidden, onToggleHidden }: VisibilityToggleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleHidden}
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700"
          >
            {hidden ? (
              <><EyeOff className="w-4 h-4 mr-2" /> Ikke synlig på brukerlisten</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" /> Synlig på brukerlisten</>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hidden ? 
            "Du er ikke synlig for andre brukere i listen" : 
            "Andre brukere kan se deg i listen"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
