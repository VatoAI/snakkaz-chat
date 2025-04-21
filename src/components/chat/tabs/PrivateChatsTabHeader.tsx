
import { MessageSquare } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabIndicator } from "./TabIndicator";

interface PrivateChatsTabHeaderProps {
  unreadCount?: number;
  isActive: boolean;
}

export const PrivateChatsTabHeader = ({ unreadCount = 0, isActive }: PrivateChatsTabHeaderProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="private" 
          className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-300
                     ${isActive ? 'bg-cyberdark-800 shadow-neon-gold' : 'hover:bg-cybergold-500/5'}
                     group data-[state=active]:bg-cyberdark-800`}
        >
          <div className="flex flex-col items-center">
            <MessageSquare className="h-5 w-5 text-cybergold-400" />
          </div>
          <TabIndicator unreadCount={unreadCount} isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Private Chats</p>
      </TooltipContent>
    </Tooltip>
  );
};
