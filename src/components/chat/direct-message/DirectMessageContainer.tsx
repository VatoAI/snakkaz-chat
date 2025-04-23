
import { useState } from 'react';
import { Friend } from '../friends/types';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';
import { DirectMessageHeader } from './DirectMessageHeader';
import { DirectMessageContent } from './DirectMessageContent';
import { DirectMessageForm } from './DirectMessageForm';
import { SecurityLevel } from '@/types/security';
import { useDirectMessage } from '../friends/hooks/useDirectMessage';

interface DirectMessageContainerProps {
  friend: Friend;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const DirectMessageContainer = ({
  friend,
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles
}: DirectMessageContainerProps) => {
  const {
    newMessage,
    setNewMessage,
    isLoading,
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
    handleDeleteMessage,
    securityLevel,
    setSecurityLevel
  } = useDirectMessage(friend, currentUserId, webRTCManager, onNewMessage, messages);

  // Extract username and avatar from profiles for header
  const username = friend.profile?.username || userProfiles[friend.user_id]?.username || "User";
  const avatarUrl = friend.profile?.avatar_url || userProfiles[friend.user_id]?.avatar_url;
  
  // Check for network connectivity
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Wrapper function to adapt the return type to match what DirectMessageForm expects
  const handleSendMessageWrapper = async (e: React.FormEvent, text: string): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        console.error("Cannot send message: Device is offline");
        return false;
      }
      
      // We'll use the event but ignore the text since it's already in the state
      await handleSendMessage(e);
      return true; 
    } catch (error) {
      console.error("Error in send message wrapper:", error);
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-cyberdark-950">
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
        securityLevel={securityLevel}
        setSecurityLevel={setSecurityLevel}
      />
      
      <DirectMessageContent 
        messages={messages}
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
      
      <DirectMessageForm 
        usingServerFallback={usingServerFallback}
        sendError={sendError}
        isLoading={isLoading}
        onSendMessage={handleSendMessageWrapper}
        newMessage={newMessage}
        onChangeMessage={setNewMessage}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEditMessage}
        securityLevel={securityLevel}
        onReconnect={handleReconnect}
      />
    </div>
  );
};
