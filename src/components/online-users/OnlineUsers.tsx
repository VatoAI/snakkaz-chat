
import { Users } from "lucide-react";
import { UserPresence } from "@/types/presence";
import { UnreadCounter } from "@/components/message-list/UnreadCounter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OnlineUsersProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  onStartChat?: (userId: string) => void;
}

export const OnlineUsers = ({ userPresence, currentUserId, onStartChat }: OnlineUsersProps) => {
  const onlineCount = Object.keys(userPresence).length;
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  
  // For this demo, let's assume we have some unread messages
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  // Simulate getting unread counts - in a real app, this would come from props
  useEffect(() => {
    const randomUnread = () => {
      const counts: Record<string, number> = {};
      Object.keys(userPresence).forEach(userId => {
        if (userId !== currentUserId && Math.random() > 0.7) {
          counts[userId] = Math.floor(Math.random() * 5) + 1;
        }
      });
      return counts;
    };
    
    setUnreadCounts(randomUnread());
  }, [userPresence, currentUserId]);
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'brb': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Opptatt';
      case 'brb': return 'Straks tilbake';
      default: return 'Offline';
    }
  };

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
      // Clear unread count
      setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
    }
  };
  
  return (
    <TooltipProvider>
      <div 
        className="space-y-4 transition-all duration-300"
        onMouseEnter={() => setCollapsed(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cybergold-400" />
            <span className="text-cybergold-200">{onlineCount} pålogget</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '+' : '-'}
          </Button>
        </div>
        
        {!collapsed && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {Object.entries(userPresence).map(([userId, presence]) => {
              const isCurrentUser = userId === currentUserId;
              const hasUnread = !isCurrentUser && unreadCounts[userId] && unreadCounts[userId] > 0;
              
              return (
                <div 
                  key={userId}
                  className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                    hasUnread 
                      ? 'bg-cyberdark-800/80 border border-cybergold-500/30' 
                      : 'hover:bg-cyberdark-900'
                  } ${
                    isCurrentUser ? 'text-cybergold-400' : 'text-white cursor-pointer'
                  }`}
                  onClick={() => !isCurrentUser && handleStartChat(userId)}
                  onMouseEnter={() => setHovered(userId)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-cyberdark-800 border border-cybergold-500/30">
                          {userId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-cyberdark-950 ${
                        getStatusColor(presence.status)
                      }`} />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm truncate max-w-[120px]">
                        {isCurrentUser ? 'Du' : userId}
                      </span>
                      
                      {(hovered === userId || hasUnread) && (
                        <span className="text-xs text-cybergold-500">
                          {getStatusText(presence.status)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {hasUnread && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-cybergold-500 text-cyberdark-900 rounded-full text-xs px-1.5 min-w-[1.25rem] text-center">
                          {unreadCounts[userId]}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{unreadCounts[userId]} uleste meldinger</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
