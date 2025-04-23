import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatEmptyState } from "./GroupChatEmptyState";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageForm } from "../friends/DirectMessageForm";
import { useGroupChat } from "./hooks/useGroupChat";
import { ChatGlassPanel } from "../ChatGlassPanel";

interface GroupChatProps {
  group: Group;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const GroupChat = ({ 
  group, 
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles = {}
}: GroupChatProps) => {
  const groupMessages = messages.filter(msg => 
    msg.group_id === group.id
  );

  const {
    newMessage,
    setNewMessage,
    isLoading,
    securityLevel,
    setSecurityLevel,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    sendError,
    handleSendMessage,
    handleReconnect,
    peerIsTyping,
    isMessageRead,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage
  } = useGroupChat(group, currentUserId, webRTCManager, onNewMessage, groupMessages);

  const isSecureConnection = (securityLevel === 'p2p_e2ee' && connectionState === 'connected' && dataChannelState === 'open') || 
                            securityLevel === 'server_e2ee' || 
                            securityLevel === 'standard';

  const handleFormSubmit = (e: React.FormEvent, text: string) => {
    handleSendMessage(e);
    return Promise.resolve(true);
  };

  return (
    <div className="flex flex-col h-full bg-cyberdark-950">
      <GroupChatHeader 
        group={group}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        usingServerFallback={usingServerFallback}
        connectionAttempts={connectionAttempts}
        onBack={onBack}
        onReconnect={handleReconnect}
        securityLevel={securityLevel}
        setSecurityLevel={setSecurityLevel}
        userProfiles={userProfiles}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
          {groupMessages.length === 0 && isSecureConnection ? (
            <GroupChatEmptyState 
              usingServerFallback={usingServerFallback} 
              securityLevel={securityLevel}
            />
          ) : (
            <DirectMessageList 
              messages={groupMessages} 
              currentUserId={currentUserId}
              peerIsTyping={peerIsTyping}
              isMessageRead={isMessageRead}
              connectionState={connectionState}
              dataChannelState={dataChannelState}
              usingServerFallback={usingServerFallback}
              onEditMessage={handleStartEditMessage}
              onDeleteMessage={handleDeleteMessage}
              securityLevel={securityLevel}
            />
          )}
        </ChatGlassPanel>
      </div>
      <div className="w-full">
        <ChatGlassPanel className="rounded-b-2xl rounded-t-none shadow-neon-gold/10" noPadding>
          <DirectMessageForm 
            usingServerFallback={usingServerFallback}
            sendError={sendError}
            isLoading={isLoading}
            onSendMessage={handleFormSubmit}
            newMessage={newMessage}
            onChangeMessage={setNewMessage}
            connectionState={connectionState}
            dataChannelState={dataChannelState}
            editingMessage={editingMessage}
            onCancelEdit={handleCancelEditMessage}
            securityLevel={securityLevel}
          />
        </ChatGlassPanel>
      </div>
    </div>
  );
};
