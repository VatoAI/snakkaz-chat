
import { User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "../types";
import { DecryptedMessage } from "@/types/message";

interface FriendListItemProps {
  friend: Friend;
  currentUserId: string;
  messages: DecryptedMessage[];
  readMessages: Set<string>;
  onSelect: (friend: Friend) => void;
}

export const FriendListItem = ({ 
  friend,
  currentUserId,
  messages,
  readMessages,
  onSelect
}: FriendListItemProps) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
  
  // Get messages from this friend that haven't been read
  const unreadMessages = messages.filter(
    msg => msg.sender.id === friendId && !readMessages.has(msg.id)
  );
  
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

  return (
    <div
      className="flex items-center justify-between p-3 bg-cyberdark-800 border border-cybergold-500/30 rounded-md hover:bg-cyberdark-700 transition-colors cursor-pointer"
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
          {isRecentMessage && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-cyberdark-800"></span>
          )}
        </div>
        <div>
          <p className="text-cybergold-200 font-medium">
            {username}
          </p>
          {lastMessage && (
            <p className="text-xs text-cybergold-400 truncate max-w-[150px]">
              {lastMessage.sender.id === currentUserId ? 'You: ' : ''}
              {lastMessage.content}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-600"
      >
        <MessageSquare className="w-5 h-5" />
        {unreadMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-cybergold-500 text-cyberdark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadMessages.length}
          </span>
        )}
      </Button>
    </div>
  );
};
