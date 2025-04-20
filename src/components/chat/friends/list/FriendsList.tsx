
import { useState } from "react";
import { Friend } from "../types";
import { DirectMessage } from "../DirectMessage";
import { WebRTCManager } from "@/utils/webrtc";
import { DecryptedMessage } from "@/types/message";
import { FriendListItem } from "./FriendListItem";
import { EmptyFriendsList } from "./EmptyFriendsList";

interface FriendsListProps {
  friends: Friend[];
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat?: (friendId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const FriendsList = ({ 
  friends, 
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles = {}
}: FriendsListProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  if (friends.length === 0) {
    return <EmptyFriendsList />;
  }

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

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-cybergold-300 px-1">Dine venner</h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {friends.map((friend) => (
          <FriendListItem
            key={friend.id}
            friend={friend}
            currentUserId={currentUserId}
            messages={directMessages}
            readMessages={readMessages}
            onSelect={handleSelectFriend}
          />
        ))}
      </div>
    </div>
  );
};
