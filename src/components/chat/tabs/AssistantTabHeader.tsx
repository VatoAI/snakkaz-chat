
import { Bot } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const AssistantTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="assistant" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     data-[state=active]:bg-cybergold-500/10 
                     data-[state=active]:text-cybergold-400 
                     data-[state=active]:shadow-[inset_0_0_12px_rgba(230,179,0,0.2)]
                     transition-all duration-300 hover:bg-cybergold-500/5
                     rounded-md hover:scale-105"
        >
          <Bot className="h-4 w-4" />
          <span>AI Assistant</span>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>Get help from our AI assistant</p>
      </TooltipContent>
    </Tooltip>
  );
};
