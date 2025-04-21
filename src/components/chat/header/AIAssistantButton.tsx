import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { AIAgentChat } from "@/components/chat/AIAgentChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AIAssistantButtonProps {
  currentUserId: string;
}

export const AIAssistantButton = ({ currentUserId }: AIAssistantButtonProps) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <Sheet open={isAIOpen} onOpenChange={setIsAIOpen}>
      <TooltipTrigger asChild>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            className={`bg-cyberdark-800/90 border-cyberred-400/50 text-cyberred-400 
                       hover:bg-cyberdark-700 hover:border-cyberred-400 
                       hover:text-cyberred-300 shadow-neon-red transition-all duration-300
                       ${isMobile ? 'w-10 h-10 p-0' : ''}`}
          >
            <Bot className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
          </Button>
        </SheetTrigger>
      </TooltipTrigger>
      <SheetContent 
        className="w-full sm:w-[500px] bg-cyberdark-950/95 border-cyberred-500/30 backdrop-blur-xl"
        side={isMobile ? "bottom" : "right"}
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyberred-400/50 flex items-center justify-center bg-cyberdark-800">
              <Bot className="h-5 w-5 text-cyberred-400" />
            </div>
            <SheetTitle className="cyber-text text-xl text-cyberred-100">AI Assistent</SheetTitle>
          </div>
        </SheetHeader>
        <div className={`mt-4 ${isMobile ? 'h-[80vh]' : 'h-[calc(100vh-120px)]'}`}>
          <AIAgentChat currentUserId={currentUserId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
