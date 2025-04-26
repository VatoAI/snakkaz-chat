import { useState, useMemo, memo } from "react";
import { User, MessageSquare, RefreshCw, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Friend } from "./types";
import { DirectMessage } from "./DirectMessage";
import { WebRTCManager } from "@/utils/webrtc";
import { DecryptedMessage } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/presence";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FriendsListProps {
  friends: (Friend & { status?: UserStatus })[];
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat?: (friendId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
  loading?: boolean;
  onRefresh?: () => void;
  lastRefreshed?: Date;
}

// A memoized friend list item for better performance
const FriendItem = memo(({
  friend,
  currentUserId,
  unreadCount,
  lastMessage,
  isRecentMessage,
  onClick
}: {
  friend: Friend & { status?: UserStatus };
  currentUserId: string;
  unreadCount: number;
  lastMessage: DecryptedMessage | null;
  isRecentMessage: boolean;
  onClick: () => void;
}) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
  const friendProfile = friend.profile;
  const username = friendProfile?.username || 'Ukjent bruker';
  const avatarUrl = friendProfile?.avatar_url;
  
  // Get status info
  const status = friend.status || 'offline';
  const statusColor = {
    'online': 'bg-green-500',
    'busy': 'bg-red-500',
    'brb': 'bg-yellow-500',
    'offline': 'bg-gray-500'
  }[status];
  
  // Format time for last message
  const formattedTime = lastMessage ? (() => {
    const date = new Date(lastMessage.created_at);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  })() : null;

  return (
    <div
      className="flex items-center justify-between p-3 bg-cyberdark-850 border border-cybergold-500/20 rounded-md hover:bg-cyberdark-800 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-9 h-9 border border-cybergold-500/30">
            {avatarUrl ? (
              <AvatarImage 
                src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl} 
                alt={username}
              />
            ) : (
              <AvatarFallback className="bg-cyberdark-700 text-cybergold-300">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor} rounded-full border border-cyberdark-900`}></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-cybergold-200 font-medium text-sm">
              {username}
            </p>
            {formattedTime && (
              <p className="text-[10px] text-cyberdark-400 ml-2">
                {formattedTime}
              </p>
            )}
          </div>
          {lastMessage ? (
            <p className="text-xs text-cybergold-400 truncate w-full max-w-[150px]">
              {lastMessage.sender.id === currentUserId ? 'Du: ' : ''}
              {lastMessage.content}
            </p>
          ) : (
            <p className="text-xs text-cyberdark-500 italic">
              Ingen meldinger
            </p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-cybergold-950/20 text-cybergold-500 hover:text-cybergold-300 hover:bg-cybergold-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  // Voice call function would go here
                }}
              >
                <Phone className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Start samtale</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-cybergold-950/20 text-cybergold-500 hover:text-cybergold-300 hover:bg-cybergold-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  // Video call function would go here
                }}
              >
                <Video className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Start videosamtale</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {unreadCount > 0 && (
        <Badge 
          className="absolute top-2 right-2 bg-cybergold-500 text-cyberdark-900 px-1.5 min-w-[20px] h-5"
          variant="outline"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
});

FriendItem.displayName = "FriendItem";

// Skeleton loading component
const FriendItemSkeleton = () => (
  <div className="flex items-center justify-between p-3 bg-cyberdark-850 border border-cybergold-500/10 rounded-md">
    <div className="flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-full bg-cyberdark-700" />
      <div>
        <Skeleton className="h-4 w-24 mb-2 bg-cyberdark-700" />
        <Skeleton className="h-3 w-32 bg-cyberdark-700/80" />
      </div>
    </div>
    <Skeleton className="w-8 h-8 rounded-full bg-cyberdark-700/50" />
  </div>
);

export const EnhancedFriendsList = ({ 
  friends, 
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles = {},
  loading = false,
  onRefresh,
  lastRefreshed
}: FriendsListProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  // Optimize message filtering with memoization
  const messagesByFriend = useMemo(() => {
    const result: Record<string, DecryptedMessage[]> = {};
    
    directMessages.forEach(msg => {
      const friendId = msg.sender.id === currentUserId ? msg.receiver_id : msg.sender.id;
      if (!result[friendId]) {
        result[friendId] = [];
      }
      result[friendId].push(msg);
    });
    
    // Sort messages for each friend
    Object.keys(result).forEach(friendId => {
      result[friendId].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
    
    return result;
  }, [directMessages, currentUserId]);

  const handleSelectFriend = (friend: Friend) => {
    // Mark all messages from this friend as read
    const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
    const messagesFromFriend = directMessages.filter(msg => msg.sender.id === friendId);
    
    const newReadMessages = new Set(readMessages);
    messagesFromFriend.forEach(msg => newReadMessages.add(msg.id));
    
    setReadMessages(newReadMessages);
    
    if (onStartChat) {
      onStartChat(friendId);
    } else {
      setSelectedFriend(friend);
    }
  };

  if (selectedFriend && !onStartChat) {
    return (
      <DirectMessage 
        friend={selectedFriend}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={() => setSelectedFriend(null)}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-cybergold-300">Dine venner</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
            <RefreshCw className="h-4 w-4 animate-spin text-cybergold-500/50" />
          </Button>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <FriendItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center text-cybergold-500 py-6 bg-cyberdark-800/40 rounded-md p-4 border border-cybergold-500/10">
        <div className="mb-3 flex justify-center">
          <User className="h-10 w-10 text-cybergold-400/50" />
        </div>
        <p className="font-medium text-cybergold-300">Du har ingen venner ennå</p>
        <p className="text-sm mt-2 text-cybergold-400">
          Søk etter brukere og send venneforespørsler for å begynne å chatte
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 text-cybergold-400 border-cybergold-500/30 hover:bg-cybergold-900/20"
        >
          Finn venner
        </Button>
      </div>
    );
  }

  // Sort friends: online first, then by last message time
  const sortedFriends = [...friends].sort((a, b) => {
    // First by online status
    if ((a.status === 'online') && (b.status !== 'online')) return -1;
    if ((a.status !== 'online') && (b.status === 'online')) return 1;
    
    // Then by unread message count
    const aFriendId = a.user_id === currentUserId ? a.friend_id : a.user_id;
    const bFriendId = b.user_id === currentUserId ? b.friend_id : b.user_id;
    
    const aUnread = messagesByFriend[aFriendId]?.filter(
      msg => msg.sender.id === aFriendId && !readMessages.has(msg.id)
    ).length || 0;
    
    const bUnread = messagesByFriend[bFriendId]?.filter(
      msg => msg.sender.id === bFriendId && !readMessages.has(msg.id)
    ).length || 0;
    
    if (aUnread > bUnread) return -1;
    if (aUnread < bUnread) return 1;
    
    // Finally by most recent message
    const aLastMessage = messagesByFriend[aFriendId]?.[0];
    const bLastMessage = messagesByFriend[bFriendId]?.[0];
    
    if (aLastMessage && !bLastMessage) return -1;
    if (!aLastMessage && bLastMessage) return 1;
    if (aLastMessage && bLastMessage) {
      return new Date(bLastMessage.created_at).getTime() - new Date(aLastMessage.created_at).getTime();
    }
    
    return 0;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-cybergold-300">Dine venner</h3>
        {onRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onRefresh}
                  className="h-7 w-7 text-cybergold-500 hover:text-cybergold-300 hover:bg-cyberdark-700"
                >
                  <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  {lastRefreshed 
                    ? `Oppdatert: ${lastRefreshed.toLocaleTimeString()}` 
                    : 'Oppdater venneliste'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-md">
        <div className="space-y-2 pr-3">
          {sortedFriends.map((friend) => {
            const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
            
            // Get messages from this friend
            const friendMessages = messagesByFriend[friendId] || [];
            
            // Get unread messages
            const unreadMessages = friendMessages.filter(
              msg => msg.sender.id === friendId && !readMessages.has(msg.id)
            );
            
            // Get the most recent message
            const lastMessage = friendMessages.length > 0 ? friendMessages[0] : null;
            const isRecentMessage = lastMessage && 
              (new Date().getTime() - new Date(lastMessage.created_at).getTime() < 300000); // Within last 5 minutes
            
            return (
              <FriendItem 
                key={friend.id}
                friend={friend}
                currentUserId={currentUserId}
                unreadCount={unreadMessages.length}
                lastMessage={lastMessage}
                isRecentMessage={isRecentMessage}
                onClick={() => handleSelectFriend(friend)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};