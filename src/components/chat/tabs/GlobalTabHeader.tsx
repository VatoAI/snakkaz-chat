
import { Globe } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabBadge } from "./TabBadge";

export const GlobalTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="global" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     data-[state=active]:bg-cyberblue-500/10 
                     data-[state=active]:text-cyberblue-400 
                     data-[state=active]:shadow-[inset_0_0_12px_rgba(0,136,255,0.2)]
                     transition-all duration-300 hover:bg-cyberblue-500/5
                     rounded-md hover:scale-105 group relative"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Global Room</span>
              <TabBadge variant="global">Public</TabBadge>
            </div>
            <span className="text-xs text-cyberblue-400/60 font-normal">
              Chat with everyone in the room
            </span>
          </div>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>Public chat room with message history. Everyone can see and respond to messages.</p>
      </TooltipContent>
    </Tooltip>
  );
};
