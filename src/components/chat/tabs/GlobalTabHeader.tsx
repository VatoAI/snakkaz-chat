
import { Globe } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const GlobalTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="global" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     data-[state=active]:bg-cyberblue-500/10 
                     data-[state=active]:text-cyberblue-400 
                     data-[state=active]:shadow-[inset_0_0_12px_rgba(0,136,255,0.2)]
                     transition-all duration-300 hover:bg-cyberblue-500/5
                     rounded-md hover:scale-105"
        >
          <Globe className="h-4 w-4" />
          <span>Global Room</span>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>Public chat room with message history</p>
      </TooltipContent>
    </Tooltip>
  );
};
