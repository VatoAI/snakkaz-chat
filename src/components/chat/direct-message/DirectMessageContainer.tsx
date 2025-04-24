
import { useState, useEffect } from 'react';
import { Friend } from '../friends/types';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';
import { DirectMessageHeader } from './DirectMessageHeader';
import { DirectMessageContent } from './DirectMessageContent';
import { DirectMessageForm } from './DirectMessageForm';
import { SecurityLevel } from '@/types/security';
import { useDirectMessage } from '../friends/hooks/useDirectMessage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const [isOnline] = useState<boolean>(navigator.onLine);
  
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

  // Auto-mark messages as read
  useEffect(() => {
    const markRead = async () => {
      try {
        const unreadMessages = messages.filter(
          msg => !msg.read_at && msg.sender.id !== currentUserId
        );
        
        for (const msg of unreadMessages) {
          await markMessageAsRead(msg.id);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    if (messages.length > 0) {
      markRead();
    }
  }, [messages, currentUserId]);

  // Helper function to mark messages as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString(), is_delivered: true })
        .eq('id', messageId);
        
      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessageAsRead:', error);
    }
  };

  const username = friend.profile?.username || userProfiles[friend.user_id]?.username || "User";
  const avatarUrl = friend.profile?.avatar_url || userProfiles[friend.user_id]?.avatar_url;

  const handleSendMessageWrapper = async (e: React.FormEvent, text: string): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        toast({
          title: "Error",
          description: "Cannot send message: Device is offline",
          variant: "destructive"
        });
        return false;
      }
      
      await handleSendMessage(e);
      return true; 
    } catch (error) {
      console.error("Error in send message wrapper:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
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
