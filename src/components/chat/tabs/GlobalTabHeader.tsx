
import { Globe } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const GlobalTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="global" 
          className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cyberblue-400 rounded-none flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span>Global Room</span>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>Public chat room with message history and editing</p>
      </TooltipContent>
    </Tooltip>
  );
};
