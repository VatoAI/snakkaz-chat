
import { Users } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TabBadge } from "./TabBadge";
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     transition-all duration-300 hover:bg-cyberblue-500/5
                     rounded-md hover:scale-105 group relative"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Private Chats</span>
              <TabBadge variant="direct">End-to-End</TabBadge>
            </div>
            <span className="hidden sm:block text-xs text-cyberblue-400/60 font-normal">
              Ctrl+2
            </span>
          </div>
          <TabIndicator unreadCount={unreadCount} isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>Your private conversations with friends and groups. End-to-end encrypted.</p>
      </TooltipContent>
    </Tooltip>
  );
};
