import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChatGlobal } from '@/components/chat/ChatGlobal';
import { DirectMessage } from '@/components/chat/friends/DirectMessage';
import { AIAgentChat } from '@/components/chat/AIAgentChat';
import { TabsHeader } from './tabs/TabsHeader';
import { Friend } from '@/components/chat/friends/types';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';
import { TooltipProvider } from '@/components/ui/tooltip';

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
  handleCloseDirectChat
}: ChatTabsProps) => {
  return (
    <TooltipProvider>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full h-full flex flex-col"
      >
        <TabsHeader 
          selectedFriend={selectedFriend}
          handleCloseDirectChat={handleCloseDirectChat}
        />
        
        <div className="flex-1 overflow-hidden">
          <TabsContent 
            value="global" 
            className="h-full m-0 p-0 data-[state=active]:animate-fadeIn"
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
            value="assistant" 
            className="h-full m-0 p-0 data-[state=active]:animate-fadeIn"
          >
            <AIAgentChat currentUserId={currentUserId || ''} />
          </TabsContent>
          
          {selectedFriend && (
            <TabsContent 
              value="direct" 
              className="h-full m-0 p-0 data-[state=active]:animate-fadeIn"
            >
              <DirectMessage 
                friend={selectedFriend}
                currentUserId={currentUserId || ''}
                webRTCManager={webRTCManager}
                onBack={handleCloseDirectChat}
                messages={directMessages}
                onNewMessage={onNewMessage}
                userProfiles={userProfiles}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </TooltipProvider>
  );
};
