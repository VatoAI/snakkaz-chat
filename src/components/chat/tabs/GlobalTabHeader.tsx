
import { Globe } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabBadge } from "./TabBadge";
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
          className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3
                     transition-all duration-300 hover:bg-cyberblue-500/5
                     rounded-md group data-[state=active]:bg-cyberdark-800"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Global Room</span>
              <TabBadge variant="global">Public</TabBadge>
            </div>
            <span className="hidden sm:block text-xs text-cyberblue-400/60 font-normal">
              Ctrl+1
            </span>
          </div>
          <TabIndicator unreadCount={unreadCount} isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>Public chat room with message history. Press Ctrl+1 to switch.</p>
      </TooltipContent>
    </Tooltip>
  );
};
