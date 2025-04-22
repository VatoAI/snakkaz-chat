
import { Friend } from "./types";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { DirectMessageHeader } from "./DirectMessageHeader";
import { DirectMessageEmptyState } from "./DirectMessageEmptyState";
import { DirectMessageList } from "./DirectMessageList";
import { DirectMessageForm } from "./DirectMessageForm";
import { useDirectMessage } from "./hooks/useDirectMessage";
import { SecurityLevel } from "@/types/security";

interface DirectMessageProps {
  friend: Friend;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const DirectMessage = ({ 
  friend, 
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles = {}
}: DirectMessageProps) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
  const friendProfile = friend.profile || userProfiles[friendId];
  const username = friendProfile?.username || 'Ukjent bruker';
  const avatarUrl = friendProfile?.avatar_url;

  // Filter messages for this direct chat
  const chatMessages = messages.filter(msg => 
    (msg.sender.id === friendId && !msg.receiver_id) || 
    (msg.sender.id === currentUserId && msg.receiver_id === friendId) || 
    (msg.sender.id === friendId && msg.receiver_id === currentUserId)
  );

  const {
    newMessage,
    setNewMessage,
    isLoading,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    securityLevel,
    setSecurityLevel,
    sendError,
    handleSendMessage,
    handleReconnect,
    peerIsTyping,
    isMessageRead,
    // Add editing and deletion functionality
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage
  } = useDirectMessage(friend, currentUserId, webRTCManager, onNewMessage, chatMessages);

  const isSecureConnection = (securityLevel === 'p2p_e2ee' && connectionState === 'connected' && dataChannelState === 'open') || 
                            securityLevel === 'server_e2ee' || 
                            securityLevel === 'standard';

  // Create a wrapper function that matches the expected type signature
  const handleFormSubmit = (e: React.FormEvent, text: string) => {
    handleSendMessage(e);
    return Promise.resolve(true); // Return Promise<boolean> to match the required type
  };

  return (
    <div className="flex flex-col h-full bg-cyberdark-950">
      <DirectMessageHeader 
        friend={friend}
        username={username}
        avatarUrl={avatarUrl}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        usingServerFallback={usingServerFallback}
        connectionAttempts={connectionAttempts}
        onBack={onBack}
        onReconnect={handleReconnect}
        isTyping={peerIsTyping}
        securityLevel={securityLevel}
        setSecurityLevel={setSecurityLevel}
      />
      
      {chatMessages.length === 0 && isSecureConnection ? (
        <DirectMessageEmptyState 
          usingServerFallback={usingServerFallback} 
          securityLevel={securityLevel}
        />
      ) : (
        <DirectMessageList 
          messages={chatMessages} 
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
    </div>
  );
};
