
import { MessageSquare, X } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Friend } from "@/components/chat/friends/types";
import { Button } from "@/components/ui/button";
import { TabIndicator } from "./TabIndicator";

interface DirectTabHeaderProps {
  friend: Friend;
  onClose: () => void;
  isActive: boolean;
}

export const DirectTabHeader = ({ friend, onClose, isActive }: DirectTabHeaderProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="direct" 
          className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-300
                     ${isActive ? 'bg-cyberdark-800 shadow-neon-red' : 'hover:bg-cyberred-500/5'}
                     group data-[state=active]:bg-cyberdark-800`}
        >
          <div className="flex flex-col items-center">
            <MessageSquare className="h-5 w-5 text-cyberred-400" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-cyberdark-900 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <TabIndicator isActive={isActive} />
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{friend.profile?.username || 'Direct Message'}</p>
      </TooltipContent>
    </Tooltip>
  );
};
