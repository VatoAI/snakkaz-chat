
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTabShortcuts } from '@/hooks/useTabShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import { Friend } from './friends/types';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserPresence } from "@/types/presence";
import { useMemo } from "react";
import { GlobalTab } from './tabs/GlobalTab';
import { PrivateTab } from './tabs/PrivateTab';
import { FriendsTab } from './tabs/FriendsTab';
import { DirectTab } from './tabs/DirectTab';

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
  useTabShortcuts(setActiveTab, activeTab, !!selectedFriend);

  const handleTabChange = (newTab: string) => {
    if (newTab === 'direct' && !selectedFriend) {
      return;
    }
    setActiveTab(newTab);
  };

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
    <TooltipProvider>
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full h-full flex flex-col"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent 
              value="global" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
            >
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
                    handleTabChange('direct');
                    setSelectedFriend(friend);
                  }
                }}
                recentConversations={recentConversations}
                recentGroups={[]}
              />
            </TabsContent>

            <TabsContent 
              value="private" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
            >
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
                    handleTabChange('direct');
                    setSelectedFriend(friend);
                  }
                }}
                userProfiles={userProfiles}
                friendsList={friendsList}
              />
            </TabsContent>

            <TabsContent 
              value="friends" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
            >
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
            </TabsContent>
            
            {selectedFriend && (
              <TabsContent 
                value="direct" 
                className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
              >
                <DirectTab
                  friend={selectedFriend}
                  currentUserId={currentUserId || ''}
                  webRTCManager={webRTCManager}
                  onBack={() => {
                    handleCloseDirectChat();
                    handleTabChange('private');
                  }}
                  messages={directMessages}
                  onNewMessage={onNewMessage}
                  userProfiles={userProfiles}
                />
              </TabsContent>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </TooltipProvider>
  );
};
