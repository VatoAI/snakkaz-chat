
import { useMemo } from "react";
import { DecryptedMessage } from "@/types/message";

export const useRecentConversations = (
  currentUserId: string | null,
  directMessages: DecryptedMessage[],
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>
) => {
  return useMemo(() => {
    if (!currentUserId) return [];
    
    const conversations = new Map();
    
    directMessages.forEach((msg) => {
      const isFromCurrentUser = msg.sender.id === currentUserId;
      const otherUserId = isFromCurrentUser ? msg.receiver_id : msg.sender.id;
      
      if (!otherUserId) return;
      
      if (!conversations.has(otherUserId)) {
        const username = isFromCurrentUser 
          ? userProfiles[otherUserId]?.username || otherUserId 
          : msg.sender.username || otherUserId;
        
        conversations.set(otherUserId, {
          userId: otherUserId,
          username,
          unreadCount: isFromCurrentUser ? 0 : (msg.read_at ? 0 : 1),
          lastActive: msg.created_at
        });
      } else {
        const existing = conversations.get(otherUserId);
        const newDate = new Date(msg.created_at);
        const existingDate = new Date(existing.lastActive);
        
        if (newDate > existingDate) {
          existing.lastActive = msg.created_at;
        }
        
        if (!isFromCurrentUser && !msg.read_at) {
          existing.unreadCount += 1;
        }
      }
    });
    
    return Array.from(conversations.values());
  }, [currentUserId, directMessages, userProfiles]);
};
