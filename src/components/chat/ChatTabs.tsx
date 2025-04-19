import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatGlobal } from '@/components/chat/ChatGlobal';
import { DirectMessage } from '@/components/chat/friends/DirectMessage';
import { AIAgentChat } from '@/components/chat/AIAgentChat';
import { Friend } from '@/components/chat/friends/types';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';
import { Globe, MessageSquare, Bot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
      <div className="border-b border-cybergold-500/30 px-4">
        <TabsList className="bg-transparent border-b-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="global" 
                className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cyberblue-400 rounded-none flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>Global Room</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Public chat room with message history and editing</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="assistant" 
                className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cyberred-400 rounded-none flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get help and guidance from our AI assistant</p>
            </TooltipContent>
          </Tooltip>

          {selectedFriend && (
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="direct" 
                  className="text-cybergold-300 data-[state=active]:text-cybergold-100 data-[state=active]:border-b-2 data-[state=active]:border-cybergold-400 rounded-none flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{selectedFriend.profile?.username || 'Direktemelding'}</span>
                  <button 
                    onClick={handleCloseDirectChat}
                    className="ml-2 text-xs text-cybergold-400 hover:text-cybergold-300"
                  >
                    ✕
                  </button>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>End-to-end encrypted private chat</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TabsList>
      </div>
      
      <TabsContent value="global" className="h-full flex flex-col mt-0 pt-0">
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

      <TabsContent value="assistant" className="h-full flex flex-col mt-0 pt-0">
        <AIAgentChat currentUserId={currentUserId || ''} />
      </TabsContent>
      
      {selectedFriend && (
        <TabsContent value="direct" className="h-full mt-0 pt-0">
          <div className="h-full">
            <DirectMessage 
              friend={selectedFriend}
              currentUserId={currentUserId || ''}
              webRTCManager={webRTCManager}
              onBack={handleCloseDirectChat}
              messages={directMessages}
              onNewMessage={onNewMessage}
              userProfiles={userProfiles}
            />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};
