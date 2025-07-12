
import { useState, useEffect } from "react";
import { WebRTCManager } from "@/utils/webrtc";
import { DecryptedMessage } from "@/types/message";
import { FriendListItem } from "./FriendListItem";
import { EmptyFriendsList } from "./EmptyFriendsList";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Friend } from "../types";

interface FriendsListProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat?: (friendId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null, full_name?: string | null}>;
  friends?: any[]; // We'll receive this from the parent now
  friendsList?: string[];
  onRefresh?: () => void;
  selectedFriendId?: string | null;
}

export const FriendsList = ({ 
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles = {},
  friends = [],
  friendsList = [],
  onRefresh,
  selectedFriendId
}: FriendsListProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if we have valid friends data
  const hasFriends = Array.isArray(friends) && friends.length > 0;
  
  // Create a mapping for friend data to match the expected Friend type
  const friendsData = hasFriends ? friends.map(friend => {
    if (!friend) return null;
    
    return {
      id: friend.id,
      user_id: currentUserId,
      friend_id: friend.friend_id,
      status: "accepted",
      profile: {
        id: friend.friend_id,
        username: userProfiles[friend.friend_id]?.username || "Ukjent bruker",
        full_name: userProfiles[friend.friend_id]?.full_name || null,
        avatar_url: userProfiles[friend.friend_id]?.avatar_url || null
      }
    } as Friend;
  }).filter(Boolean) : [];

  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
    }
  };

  if (friendsData.length === 0) {
    return <EmptyFriendsList />;
  }

  const handleSelectFriend = (friend: Friend) => {
    // Mark all messages from this friend as read
    const friendId = friend.friend_id;
    const messagesFromFriend = directMessages.filter(msg => 
      msg.sender && msg.sender.id === friendId
    );
    
    const newReadMessages = new Set(readMessages);
    messagesFromFriend.forEach(msg => newReadMessages.add(msg.id));
    
    setReadMessages(newReadMessages);
    
    if (onStartChat) {
      onStartChat(friendId);
    } else {
      setSelectedFriend(friend);
    }
  };
  
  // Count unread messages per friend
  const unreadCountByFriend: Record<string, number> = {};
  directMessages.forEach(msg => {
    if (msg.sender && !readMessages.has(msg.id) && msg.sender.id !== currentUserId) {
      if (!unreadCountByFriend[msg.sender.id]) {
        unreadCountByFriend[msg.sender.id] = 0;
      }
      unreadCountByFriend[msg.sender.id]++;
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-cybergold-300">Dine venner</h3>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-cyberdark-800"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 text-cyberdark-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {friendsData.map((friend) => (
          <FriendListItem
            key={friend.id}
            friend={friend}
            currentUserId={currentUserId}
            messages={directMessages}
            readMessages={readMessages}
            onSelect={handleSelectFriend}
            unreadCount={unreadCountByFriend[friend.friend_id] || 0}
            onlineStatus="offline" // Default to offline instead of using friend.profile.status
            isSelected={selectedFriendId === friend.friend_id}
          />
        ))}
      </div>
    </div>
  );
};
