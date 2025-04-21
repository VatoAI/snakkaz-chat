
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, UserCheck, Clock, Loader2 } from "lucide-react";
import { StatusIcon } from "./StatusIcons";
import { UserStatus } from "@/types/presence";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AdminBadge } from "@/components/chat/header/AdminBadge";

interface UserItemProps {
  id: string;
  username: string;
  isOnline: boolean;
  status: UserStatus | null;
  isFriend: boolean;
  isPending?: boolean;
  isAdmin?: boolean;
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
  currentUserIsAdmin?: boolean;
}

export const UserItem = ({ 
  id, 
  username, 
  isOnline, 
  status, 
  isFriend,
  isPending,
  isAdmin,
  onSendFriendRequest,
  onStartChat,
  currentUserIsAdmin
}: UserItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md"
    >
      <div className="flex items-center gap-2">
        {isOnline && status ? (
          <div className="relative">
            <StatusIcon status={status} size={3} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>
        ) : (
          <StatusIcon status="offline" size={3} />
        )}
        <span className="text-cybergold-200 truncate flex items-center gap-2">
          {username}
          {isAdmin && <AdminBadge />}
        </span>
      </div>
      
      <div className="flex gap-1">
        {(!isFriend && !isPending && !currentUserIsAdmin) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSendFriendRequest(id)}
                className="h-7 w-7 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send venneforespørsel</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isPending && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="h-7 w-7 text-cybergold-400"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Venneforespørsel sendt</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {(isFriend || currentUserIsAdmin) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartChat(id)}
                className={cn(
                  "h-7 w-7 hover:bg-cyberdark-700",
                  currentUserIsAdmin ? "text-cyberblue-400 hover:text-cyberblue-300" : "text-cybergold-400 hover:text-cybergold-300"
                )}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send melding</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
