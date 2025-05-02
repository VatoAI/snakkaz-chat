import { MessageSquare, Crown, Clock, ShieldCheck, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "../types";
import { DecryptedMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FriendListItemProps {
  friend: Friend;
  currentUserId: string;
  messages: DecryptedMessage[];
  readMessages: Set<string>;
  onSelect: (friend: Friend) => void;
  unreadCount?: number;
  onlineStatus?: 'online' | 'busy' | 'brb' | 'offline';
  lastSeen?: string;
}

export const FriendListItem = ({ 
  friend,
  currentUserId,
  messages,
  readMessages,
  onSelect,
  unreadCount = 0,
  onlineStatus = 'offline',
  lastSeen
}: FriendListItemProps) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
  
  // Find the most recent message for this friend
  const recentMessages = messages.filter(
    msg => (msg.sender.id === friendId && msg.receiver_id === currentUserId) || 
           (msg.sender.id === currentUserId && msg.receiver_id === friendId)
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const lastMessage = recentMessages.length > 0 ? recentMessages[0] : null;
  const isRecentMessage = lastMessage && 
    (new Date().getTime() - new Date(lastMessage.created_at).getTime() < 60000); // Within last minute
  
  // Get user profile info
  const friendProfile = friend.profile;
  const username = friendProfile?.username || 'Ukjent bruker';
  const avatarUrl = friendProfile?.avatar_url;
  const isPremium = friendProfile?.is_premium || false;
  const isVerified = friendProfile?.is_verified || false;
  
  // Format last seen time
  const lastSeenFormatted = lastSeen ? 
    formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: nb }) : 
    null;
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'brb': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status description
  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'online': return 'Pålogget';
      case 'busy': return 'Opptatt';
      case 'brb': return 'Straks tilbake';
      default: return lastSeenFormatted ? `Sist sett ${lastSeenFormatted}` : 'Avlogget';
    }
  };

  // Format message preview
  const getMessagePreview = (message: DecryptedMessage) => {
    if (message.media) {
      const mediaType = message.media.type;
      if (mediaType?.startsWith('image/')) return '📷 Bilde';
      if (mediaType?.startsWith('video/')) return '🎬 Video';
      if (mediaType?.startsWith('audio/')) return '🎵 Lyd';
      return '📎 Vedlegg';
    }
    
    if (message.content.length > 30) {
      return message.content.substring(0, 30) + '...';
    }
    
    return message.content;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-md transition-colors cursor-pointer",
        unreadCount > 0 
          ? "bg-cyberdark-700 border-cybergold-500/50" 
          : "bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700"
      )}
      onClick={() => onSelect(friend)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl.startsWith('avatars/') 
                  ? supabase.storage.from('avatars').getPublicUrl(avatarUrl.replace('avatars/', '')).data.publicUrl 
                  : avatarUrl} 
                alt={username}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffd54d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`;
                }}
              />
            ) : (
              <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span 
                  className={cn(
                    "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-cyberdark-800",
                    getStatusColor(onlineStatus)
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-cyberdark-800 border-cyberdark-700 text-xs py-1 px-2">
                <p>{getStatusDescription(onlineStatus)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isPremium && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-cybergold-500 border border-cyberdark-800 flex items-center justify-center">
                    <Crown className="h-2 w-2 text-cyberdark-950" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-cyberdark-800 border-cyberdark-700 text-xs py-1 px-2">
                  <p>Premium-bruker</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {isVerified && !isPremium && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-cyberblue-500 border border-cyberdark-800 flex items-center justify-center">
                    <ShieldCheck className="h-2 w-2 text-cyberdark-950" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-cyberdark-800 border-cyberdark-700 text-xs py-1 px-2">
                  <p>Verifisert bruker</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-medium text-cybergold-100 truncate">{username}</p>
            {isPremium && (
              <Crown className="h-3 w-3 ml-1 text-cybergold-400" />
            )}
            {isVerified && !isPremium && (
              <ShieldCheck className="h-3 w-3 ml-1 text-cyberblue-400" />
            )}
          </div>
          {lastMessage && (
            <div className="flex items-center gap-1">
              {lastMessage.created_at && !isRecentMessage && (
                <span className="text-[10px] text-cybergold-600 flex items-center">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  {formatDistanceToNow(new Date(lastMessage.created_at), {
                    addSuffix: false,
                    locale: nb
                  })}
                </span>
              )}
              <p className="text-xs text-cybergold-400 truncate">
                {lastMessage.sender.id === currentUserId ? 'Du: ' : ''}
                {getMessagePreview(lastMessage)}
              </p>
              {lastMessage.ttl && (
                <span className="text-amber-400 text-[10px]">🕒</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {unreadCount > 0 && (
        <div className="flex items-center justify-center bg-cybergold-500 text-cyberdark-800 rounded-full h-5 min-w-[20px] px-1.5 text-xs font-medium">
          {unreadCount}
        </div>
      )}
      
      {unreadCount === 0 && (
        <Button
          size="sm"
          variant="ghost" 
          className="h-8 w-8 p-0 text-cybergold-500/50 hover:text-cybergold-500 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(friend);
          }}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
