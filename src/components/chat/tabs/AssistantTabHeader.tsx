
import { Bot } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const AssistantTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="assistant" 
          className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cyberred-400 rounded-none flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          <span>AI Assistant</span>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>Get help and guidance from our AI assistant</p>
      </TooltipContent>
    </Tooltip>
  );
};
