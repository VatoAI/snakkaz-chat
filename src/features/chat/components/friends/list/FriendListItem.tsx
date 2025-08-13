
import { useState } from 'react';
import { Friend } from '../types';
import { DecryptedMessage } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface FriendListItemProps {
  friend: Friend;
  currentUserId: string;
  messages: DecryptedMessage[];
  readMessages: Set<string>;
  onSelect: (friend: Friend) => void;
  unreadCount: number;
  onlineStatus: 'online' | 'offline' | 'away' | 'busy';
  isSelected?: boolean;
}

export const FriendListItem = ({
  friend,
  currentUserId,
  messages,
  readMessages,
  onSelect,
  unreadCount,
  onlineStatus,
  isSelected = false
}: FriendListItemProps) => {
  // Find the most recent message with this friend
  const recentMessages = messages.filter(
    msg => 
      (msg.sender.id === friend.friend_id && msg.receiver_id === currentUserId) || 
      (msg.sender.id === currentUserId && msg.receiver_id === friend.friend_id)
  ).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const lastMessage = recentMessages[0];
  
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };
  
  return (
    <div 
      className={`
        flex items-center p-2 rounded-lg transition-colors cursor-pointer
        ${isSelected ? 'bg-cybergold-900/30 border border-cybergold-700/40' : 'hover:bg-cyberdark-800'}
      `}
      onClick={() => onSelect(friend)}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-cyberdark-700 overflow-hidden">
          {friend.profile?.avatar_url ? (
            <img 
              src={friend.profile.avatar_url} 
              alt={friend.profile?.username || "Friend"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cybergold-900 text-cybergold-300">
              {(friend.profile?.username?.charAt(0) || 'U').toUpperCase()}
            </div>
          )}
        </div>
        
        <div className={`
          absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-cyberdark-900
          ${onlineStatus === 'online' ? 'bg-green-500' : 
            onlineStatus === 'away' ? 'bg-amber-500' : 
            onlineStatus === 'busy' ? 'bg-red-500' : 'bg-gray-500'
          }
        `}></div>
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-cybergold-300 truncate">
            {friend.profile?.username || "Unknown Friend"}
          </h4>
          {lastMessage && (
            <span className="text-xs text-cybergold-500">
              {formatTimestamp(lastMessage.created_at)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-cybergold-500 truncate max-w-[180px]">
            {lastMessage 
              ? lastMessage.sender.id === currentUserId 
                ? `Du: ${lastMessage.content}` 
                : lastMessage.content
              : 'Ingen meldinger enda'}
          </p>
          
          {unreadCount > 0 && (
            <Badge 
              variant="default" 
              className="bg-cybergold-600 hover:bg-cybergold-600 text-[10px] h-5 min-w-[20px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
