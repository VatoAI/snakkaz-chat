
import { Globe } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabIndicator } from "./TabIndicator";

interface GlobalTabHeaderProps {
  unreadCount?: number;
  isActive: boolean;
}

export const GlobalTabHeader = ({ unreadCount = 0, isActive }: GlobalTabHeaderProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="global" 
          className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-300
                     ${isActive ? 'bg-cyberdark-800 shadow-neon-blue' : 'hover:bg-cyberblue-500/5'}
                     group data-[state=active]:bg-cyberdark-800`}
        >
          <div className="flex flex-col items-center">
            <Globe className="h-5 w-5 text-cyberblue-400" />
          </div>
          <TabIndicator unreadCount={unreadCount} isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Global Chat Room</p>
      </TooltipContent>
    </Tooltip>
  );
};
