
import { ChatTabs } from "@/components/chat/ChatTabs";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MigrationHelper } from "@/components/chat/MigrationHelper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserStatus } from "@/types/presence";

interface ChatLayoutProps {
  userPresence: Record<string, any>;
  currentUserId: string;
  currentStatus: UserStatus;
  handleStatusChange: (status: UserStatus) => void;
  webRTCManager: any;
  directMessages: any[];
  handleStartEditMessage: (message: any) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, any>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  chatState: any;
  selectedFriend: any;
  setSelectedFriend: (friend: any) => void;
  friendsList: string[];
}

export const ChatLayout = ({
  userPresence,
  currentUserId,
  currentStatus,
  handleStatusChange,
  webRTCManager,
  directMessages,
  handleStartEditMessage,
  onStartChat,
  userProfiles,
  activeTab,
  onTabChange,
  chatState,
  selectedFriend,
  setSelectedFriend,
  friendsList
}: ChatLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="h-[100dvh] w-full bg-cyberdark-950 text-white flex flex-col overflow-hidden">
        <ChatHeader
          userPresence={userPresence}
          currentUserId={currentUserId}
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={handleStartEditMessage}
          onStartChat={onStartChat}
          userProfiles={userProfiles}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <div className="flex-1 overflow-hidden relative">
          <ChatTabs
            activeTab={activeTab}
            setActiveTab={onTabChange}
            selectedFriend={selectedFriend}
            messages={chatState.messages}
            newMessage={chatState.newMessage}
            setNewMessage={chatState.setNewMessage}
            isLoading={chatState.isLoading}
            ttl={chatState.ttl}
            setTtl={chatState.setTtl}
            onMessageExpired={chatState.handleMessageExpired}
            onSubmit={chatState.handleSendMessage}
            currentUserId={currentUserId}
            editingMessage={chatState.editingMessage}
            onEditMessage={chatState.handleStartEditMessage}
            onCancelEdit={chatState.handleCancelEditMessage}
            onDeleteMessage={chatState.handleDeleteMessage}
            directMessages={directMessages}
            onNewMessage={handleStartEditMessage}
            webRTCManager={webRTCManager}
            userProfiles={userProfiles}
            handleCloseDirectChat={() => setSelectedFriend(null)}
            setSelectedFriend={setSelectedFriend}
            userPresence={userPresence}
            friendsList={friendsList}
          />
        </div>
        <MigrationHelper />
      </div>
    </TooltipProvider>
  );
};
