import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatGlobal } from '@/components/chat/ChatGlobal';
import { DirectMessage } from '@/components/chat/friends/DirectMessage';
import { PrivateChats } from '@/components/chat/PrivateChats';
import { useTabShortcuts } from '@/hooks/useTabShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import { Friend } from '@/components/chat/friends/types';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FriendsContainer } from './friends/FriendsContainer';

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
  onNewMessage: (message: DecryptedMessage) => void;
  webRTCManager: WebRTCManager | null;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  handleCloseDirectChat: () => void;
  setSelectedFriend: (friend: Friend | null) => void;
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
  setSelectedFriend
}: ChatTabsProps) => {
  useTabShortcuts(setActiveTab, activeTab, !!selectedFriend);

  // Helper function to ensure proper tab and friend state
  const handleTabChange = (newTab: string) => {
    if (newTab === 'direct' && !selectedFriend) {
      return; // Don't switch to direct tab without a selected friend
    }
    setActiveTab(newTab);
  };

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
              <ChatGlobal 
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
              />
            </TabsContent>

            <TabsContent 
              value="private" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
            >
              <PrivateChats 
                currentUserId={currentUserId || ''}
                webRTCManager={webRTCManager}
                directMessages={directMessages}
                onNewMessage={onNewMessage}
                onStartChat={(userId: string) => {
                  // Find friend data
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
                    handleTabChange('direct'); // Change tab first
                    setSelectedFriend(friend); // Then set friend
                  }
                }}
                userProfiles={userProfiles}
              />
            </TabsContent>

            <TabsContent 
              value="friends" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
            >
              <div className="h-full p-4 overflow-y-auto">
                <FriendsContainer
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
              </div>
            </TabsContent>
            
            {selectedFriend && (
              <TabsContent 
                value="direct" 
                className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
              >
                <DirectMessage 
                  friend={selectedFriend}
                  currentUserId={currentUserId || ''}
                  webRTCManager={webRTCManager}
                  onBack={() => {
                    handleCloseDirectChat(); // Clear selected friend
                    handleTabChange('private'); // Go back to private chats
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
