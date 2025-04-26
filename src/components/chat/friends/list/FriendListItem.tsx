import { User, MessageSquare, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "../types";
import { DecryptedMessage } from "@/types/message";
import { cn } from "@/lib/utils";

interface FriendListItemProps {
  friend: Friend;
  currentUserId: string;
  messages: DecryptedMessage[];
  readMessages: Set<string>;
  onSelect: (friend: Friend) => void;
  unreadCount?: number;
  onlineStatus?: 'online' | 'busy' | 'brb' | 'offline';
}

export const FriendListItem = ({ 
  friend,
  currentUserId,
  messages,
  readMessages,
  onSelect,
  unreadCount = 0,
  onlineStatus = 'offline'
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
  const isPremium = friendProfile?.isPremium || false;
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'brb': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
                src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl} 
                alt={username}
              />
            ) : (
              <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <span 
            className={cn(
              "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-cyberdark-800",
              getStatusColor(onlineStatus)
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-medium text-cybergold-100 truncate">{username}</p>
            {isPremium && (
              <Crown className="h-3 w-3 ml-1 text-cybergold-400" />
            )}
          </div>
          {lastMessage && (
            <p className="text-xs text-cybergold-400 truncate">
              {lastMessage.sender.id === currentUserId ? 'Du: ' : ''}
              {lastMessage.content}
            </p>
          )}
        </div>
      </div>
      
      {unreadCount > 0 && (
        <div className="flex items-center justify-center bg-cybergold-500 text-cyberdark-800 rounded-full h-5 min-w-[20px] px-1 text-xs font-medium">
          {unreadCount}
        </div>
      )}
    </div>
  );
};
