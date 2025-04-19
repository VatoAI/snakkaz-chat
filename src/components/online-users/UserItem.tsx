
import { Button } from "@/components/ui/button";
import { Circle, MessageSquare, UserPlus, Loader2 } from "lucide-react";
import { StatusIcon } from "./StatusIcons";
import { UserStatus } from "@/types/presence";

interface UserItemProps {
  id: string;
  username: string;
  isOnline: boolean;
  status: UserStatus | null;
  isFriend: boolean;
  isPending: boolean;
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
}

export const UserItem = ({ 
  id, 
  username, 
  isOnline, 
  status, 
  isFriend,
  isPending,
  onSendFriendRequest,
  onStartChat
}: UserItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md"
    >
      <div className="flex items-center gap-2">
        {isOnline && status ? (
          <StatusIcon status={status} size={3} />
        ) : (
          <Circle className="w-3 h-3 text-gray-500" />
        )}
        <span className="text-cybergold-200 truncate">
          {username}
        </span>
      </div>
      
      <div className="flex gap-1">
        {!isFriend && !isPending && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSendFriendRequest(id)}
            className="h-7 w-7 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
            title="Legg til venn"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        )}

        {isPending && (
          <Button
            variant="ghost"
            size="icon"
            disabled
            className="h-7 w-7 text-cybergold-400"
            title="Venneforespørsel sendt"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        )}
        
        {isFriend && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStartChat(id)}
            className="h-7 w-7 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
            title="Send melding"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
