
import { MessageSquare, X } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Friend } from "@/components/chat/friends/types";
import { Button } from "@/components/ui/button";

interface DirectTabHeaderProps {
  friend: Friend;
  onClose: () => void;
}

export const DirectTabHeader = ({ friend, onClose }: DirectTabHeaderProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger 
          value="direct" 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                     data-[state=active]:bg-cyberred-500/10 
                     data-[state=active]:text-cyberred-400 
                     data-[state=active]:shadow-[inset_0_0_12px_rgba(230,0,0,0.2)]
                     transition-all duration-300 hover:bg-cyberred-500/5 
                     relative group rounded-md hover:scale-105"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{friend.profile?.username || 'Direct Message'}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>End-to-end encrypted private chat</p>
      </TooltipContent>
    </Tooltip>
  );
};
