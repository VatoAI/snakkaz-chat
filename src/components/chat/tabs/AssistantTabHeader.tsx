
import { Bot } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabBadge } from "./TabBadge";

export const AssistantTabHeader = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="assistant" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     data-[state=active]:bg-cybergold-500/10 
                     data-[state=active]:text-cybergold-400 
                     data-[state=active]:shadow-[inset_0_0_12px_rgba(230,179,0,0.2)]
                     transition-all duration-300 hover:bg-cybergold-500/5
                     rounded-md hover:scale-105 group"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
              <TabBadge variant="ai">Private</TabBadge>
            </div>
            <span className="text-xs text-cybergold-400/60 font-normal">
              Get help from our AI assistant
            </span>
          </div>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>Private chat with our AI assistant. Get help with tasks, questions, and more.</p>
      </TooltipContent>
    </Tooltip>
  );
};
