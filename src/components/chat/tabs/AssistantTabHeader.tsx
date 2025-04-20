
import { Bot } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabBadge } from "./TabBadge";
import { TabIndicator } from "./TabIndicator";

interface AssistantTabHeaderProps {
  isActive: boolean;
}

export const AssistantTabHeader = ({ isActive }: AssistantTabHeaderProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="assistant" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     transition-all duration-300 hover:bg-cybergold-500/5
                     rounded-md hover:scale-105 group relative"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
              <TabBadge variant="ai">Private</TabBadge>
            </div>
            <span className="hidden sm:block text-xs text-cybergold-400/60 font-normal">
              Ctrl+2
            </span>
          </div>
          <TabIndicator isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>Private chat with our AI assistant. Get help with tasks, questions, and more.</p>
      </TooltipContent>
    </Tooltip>
  );
};
