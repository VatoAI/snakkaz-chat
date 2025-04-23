
import { Friend } from './friends/types';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';
import { UserPresence } from "@/types/presence";
import { useMemo } from "react";
import { GlobalTab } from './tabs/GlobalTab';
import { PrivateTab } from './tabs/PrivateTab';
import { FriendsTab } from './tabs/FriendsTab';
import { DirectTab } from './tabs/DirectTab';
import { TabsContainer } from './tabs/TabsContainer';
import { TabContent } from './tabs/TabContent';

interface ChatTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFriend: Friend | null;
  messages: DecryptedMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  onMessageExpired: (messageId: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentUserId: string | null;
  editingMessage: { id: string; content: string } | null;
  onEditMessage: (message: { id: string; content: string }) => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: { id: string; content: string }) => void;
  webRTCManager: WebRTCManager | null;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  handleCloseDirectChat: () => void;
  setSelectedFriend: (friend: Friend | null) => void;
  userPresence?: Record<string, UserPresence>;
  friendsList?: string[];
}

export const ChatTabs = ({ 
  activeTab,
  setActiveTab,
  selectedFriend,
  messages,
  newMessage,
  setNewMessage,
  isLoading,
  ttl,
  setTtl,
  onMessageExpired,
  onSubmit,
  currentUserId,
  editingMessage,
  onEditMessage,
  onCancelEdit,
  onDeleteMessage,
  directMessages,
  onNewMessage,
  webRTCManager,
  userProfiles,
  handleCloseDirectChat,
  setSelectedFriend,
  userPresence = {},
  friendsList = []
}: ChatTabsProps) => {
  const recentConversations = useMemo(() => {
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

  return (
    <TabsContainer 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      selectedFriend={selectedFriend}
    >
      <TabContent value="global">
        <GlobalTab
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isLoading={isLoading}
          ttl={ttl}
          setTtl={setTtl}
          onMessageExpired={onMessageExpired}
          onSubmit={onSubmit}
          currentUserId={currentUserId}
          editingMessage={editingMessage}
          onEditMessage={onEditMessage}
          onCancelEdit={onCancelEdit}
          onDeleteMessage={onDeleteMessage}
          userPresence={userPresence}
          directMessages={directMessages}
          onStartChat={(userId) => {
            const friendProfile = userProfiles[userId];
            if (friendProfile) {
              const friend = {
                id: '',
                user_id: userId,
                friend_id: currentUserId || '',
                status: 'accepted',
                created_at: '',
                profile: {
                  id: userId,
                  username: friendProfile.username,
                  avatar_url: friendProfile.avatar_url,
                  full_name: null
                }
              };
              setActiveTab('direct');
              setSelectedFriend(friend);
            }
          }}
          recentConversations={recentConversations}
          recentGroups={[]}
        />
      </TabContent>

      <TabContent value="private">
        <PrivateTab
          currentUserId={currentUserId || ''}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={onNewMessage}
          onStartChat={(userId: string) => {
            const friendProfile = userProfiles[userId];
            if (friendProfile) {
              const friend = {
                id: '',
                user_id: userId,
                friend_id: currentUserId || '',
                status: 'accepted',
                created_at: '',
                profile: {
                  id: userId,
                  username: friendProfile.username,
                  avatar_url: friendProfile.avatar_url,
                  full_name: null
                }
              };
              setActiveTab('direct');
              setSelectedFriend(friend);
            }
          }}
          userProfiles={userProfiles}
          friendsList={friendsList}
        />
      </TabContent>

      <TabContent value="friends">
        <FriendsTab
          currentUserId={currentUserId || ''}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={onNewMessage}
          onStartChat={(userId: string) => {
            handleCloseDirectChat();
            setTimeout(() => {
              setActiveTab('direct');
            }, 0);
          }}
          userProfiles={userProfiles}
        />
      </TabContent>
      
      {selectedFriend && (
        <TabContent value="direct">
          <DirectTab
            friend={selectedFriend}
            currentUserId={currentUserId || ''}
            webRTCManager={webRTCManager}
            onBack={() => {
              handleCloseDirectChat();
              setActiveTab('private');
            }}
            messages={directMessages}
            onNewMessage={onNewMessage}
            userProfiles={userProfiles}
          />
        </TabContent>
      )}
    </TabsContainer>
  );
};
