
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentConversation {
  userId: string;
  username: string;
  unreadCount: number;
  lastActive: string;
}

interface RecentGroup {
  id: string;
  name: string;
  unreadCount: number;
  lastActive: string;
}

interface RecentChatsProps {
  recentConversations: RecentConversation[];
  recentGroups: RecentGroup[];
  onStartChat?: (userId: string) => void;
}

export const RecentChats = ({ 
  recentConversations, 
  recentGroups, 
  onStartChat 
}: RecentChatsProps) => {
  const navigate = useNavigate();

  // Sort by most recently active
  const sortedConversations = [...recentConversations].sort(
    (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  ).slice(0, 3); // Show at most 3

  const sortedGroups = [...recentGroups].sort(
    (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  ).slice(0, 3); // Show at most 3

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-cybergold-400">Nylige samtaler</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-cybergold-300"
            onClick={() => navigate('/chat')}
          >
            Alle
          </Button>
        </div>

        {sortedConversations.length > 0 ? (
          <div className="space-y-2">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.userId}
                className="flex items-center justify-between p-2 bg-cyberdark-800/70 rounded-md hover:bg-cyberdark-700/80 transition-all cursor-pointer border border-cybergold-500/10"
                onClick={() => onStartChat?.(conversation.userId)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cybergold-300" />
                  <span className="text-xs text-cybergold-200 truncate max-w-[100px]">
                    {conversation.username}
                  </span>
                </div>
                {conversation.unreadCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-cybergold-500 text-cyberdark-900 text-xs h-5 min-w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{conversation.unreadCount} uleste meldinger</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {conversation.unreadCount === 0 && (
                  <ArrowRightCircle className="h-4 w-4 text-cybergold-500/50" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-cybergold-500/70 p-2">
            Ingen nylige samtaler
          </div>
        )}

        {recentGroups.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-cybergold-400 mt-4">Aktive grupper</h3>
            <div className="space-y-2">
              {sortedGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-2 bg-cyberdark-800/70 rounded-md hover:bg-cyberdark-700/80 transition-all cursor-pointer border border-cybergold-500/10"
                  onClick={() => navigate(`/chat/group/${group.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cybergold-300" />
                    <span className="text-xs text-cybergold-200 truncate max-w-[100px]">
                      {group.name}
                    </span>
                  </div>
                  {group.unreadCount > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-cybergold-500 text-cyberdark-900 text-xs h-5 min-w-5 flex items-center justify-center">
                          {group.unreadCount}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{group.unreadCount} uleste meldinger</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {group.unreadCount === 0 && (
                    <ArrowRightCircle className="h-4 w-4 text-cybergold-500/50" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};
