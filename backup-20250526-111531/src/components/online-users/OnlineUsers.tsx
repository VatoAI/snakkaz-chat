import { Users, MessageSquare, Clock } from "lucide-react";
import { UserPresence } from "@/types/presence";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useGlobalPresence } from "@/contexts/PresenceContext";

interface OnlineUsersProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  onStartChat?: (userId: string) => void;
  userProfiles?: Record<string, { username: string | null, avatar_url: string | null }>;
  activeConversations?: { userId: string, lastMessage: string, timestamp: string }[];
}

export const OnlineUsers = ({ 
  userPresence, 
  currentUserId, 
  onStartChat, 
  userProfiles = {},
  activeConversations = []
}: OnlineUsersProps) => {
  const onlineCount = Object.keys(userPresence).filter(id => 
    userPresence[id].status !== 'offline'
  ).length;
  
  const [activeTab, setActiveTab] = useState<string>("online");
  const [hovered, setHovered] = useState<string | null>(null);
  const { userStatuses } = useGlobalPresence();
  
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

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
      // Clear unread count
      setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
    }
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-2 transition-all duration-300">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-8 bg-cyberdark-900">
            <TabsTrigger 
              value="online" 
              className="text-xs h-7 data-[state=active]:bg-cyberdark-800"
            >
              <Users className="w-3.5 h-3.5 mr-1" />
              {onlineCount}
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="text-xs h-7 data-[state=active]:bg-cyberdark-800"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              Samtaler
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="online" className="pt-2 mt-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {Object.entries(userPresence)
                .filter(([userId, presence]) => presence.status !== 'offline')
                .map(([userId, presence]) => {
                  const isCurrentUser = userId === currentUserId;
                  const hasUnread = !isCurrentUser && unreadCounts[userId] && unreadCounts[userId] > 0;
                  const userProfile = userProfiles[userId] || { username: null, avatar_url: null };
                  const displayName = userProfile.username || userId.substring(0, 8);
                  const initials = displayName.substring(0, 2).toUpperCase();
                  
                  return (
                    <div 
                      key={userId}
                      className={cn(
                        "flex items-center justify-between py-1 px-2 rounded-md transition-all duration-200",
                        hasUnread ? "bg-cyberdark-800 border border-cybergold-500/30" : "hover:bg-cyberdark-900",
                        isCurrentUser ? "text-cybergold-400" : "text-white cursor-pointer"
                      )}
                      onClick={() => !isCurrentUser && handleStartChat(userId)}
                      onMouseEnter={() => setHovered(userId)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="relative">
                          <Avatar className="h-5 w-5">
                            {userProfile.avatar_url ? (
                              <AvatarImage src={supabase.storage.from('avatars').getPublicUrl(userProfile.avatar_url).data.publicUrl} />
                            ) : (
                              <AvatarFallback className="text-[10px] bg-cyberdark-800 border border-cybergold-500/30">
                                {initials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-cyberdark-950",
                            getStatusColor(presence.status)
                          )} />
                        </div>
                        
                        <span className="text-xs truncate max-w-[80px]">
                          {isCurrentUser ? 'Du' : displayName}
                        </span>
                      </div>
                      
                      {hasUnread && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="bg-cybergold-500 text-cyberdark-900 rounded-full text-[10px] px-1 min-w-[1rem] text-center">
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
          </TabsContent>
          
          <TabsContent value="messages" className="pt-2 mt-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {/* Mocked active conversations for now - will be replaced with real data */}
              {[...Array(5)].map((_, i) => {
                const mockId = `user-${i+1}`;
                const mockName = `Bruker ${i+1}`;
                const mockStatus = i % 3 === 0 ? 'online' : (i % 3 === 1 ? 'busy' : 'offline');
                const mockUnread = i % 2 === 0 ? i+1 : 0;
                const mockTime = new Date(Date.now() - (i * 30 * 60 * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                return (
                  <div 
                    key={mockId}
                    className={cn(
                      "flex items-center justify-between py-1 px-2 rounded-md transition-all",
                      mockUnread > 0 ? "bg-cyberdark-800 border border-cybergold-500/30" : "hover:bg-cyberdark-900",
                      "cursor-pointer text-white"
                    )}
                    onClick={() => handleStartChat(mockId)}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-cyberdark-800 border border-cybergold-500/30">
                            {mockName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-cyberdark-950",
                          getStatusColor(mockStatus)
                        )} />
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-xs truncate max-w-[70px]">
                            {mockName}
                          </span>
                          <span className="text-[9px] text-cyberdark-400 ml-1">
                            {mockTime}
                          </span>
                        </div>
                        <span className="text-[9px] text-cyberdark-300 truncate max-w-[90px]">
                          {i % 2 === 0 ? 'Hei, hvordan går det?' : 'Kan vi snakkes senere?'}
                        </span>
                      </div>
                    </div>
                    
                    {mockUnread > 0 && (
                      <div className="bg-cybergold-500 text-cyberdark-900 rounded-full text-[10px] px-1 min-w-[1rem] text-center">
                        {mockUnread}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
