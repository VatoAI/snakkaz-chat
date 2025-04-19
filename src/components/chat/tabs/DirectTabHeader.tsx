
import { MessageSquare } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Friend } from "@/components/chat/friends/types";

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
          className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cybergold-400 rounded-none flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{friend.profile?.username || 'Direktemelding'}</span>
          <button 
            onClick={onClose}
            className="ml-2 text-xs text-cybergold-400 hover:text-cybergold-300"
          >
            ✕
          </button>
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>End-to-end encrypted private chat</p>
      </TooltipContent>
    </Tooltip>
  );
};
