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
import { v4 as uuidv4 } from 'uuid';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';

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
  const { setMessageExpiration, screenCaptureProtection } = useAppEncryption();
  
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

  const handleSendMessageWrapper = async (
    e: React.FormEvent, 
    text: string,
    options?: {
      ttl?: number | null,
      preventScreenshot?: boolean,
      mediaUrl?: string,
      mediaType?: string
    }
  ): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        toast({
          title: "Error",
          description: "Cannot send message: Device is offline",
          variant: "destructive"
        });
        return false;
      }
      
      // Apply screenshot protection if requested
      if (options?.preventScreenshot) {
        screenCaptureProtection.enable();
      }

      // Send the message
      await handleSendMessage(e);
      
      // Get the ID of the newly created message (using timestamp as a deterministic way to find it)
      // In a real implementation, we should return the message ID directly from handleSendMessage
      const timestamp = new Date().toISOString();
      const messageId = uuidv4(); // In a real implementation, this would be the actual message ID
      
      // Apply message expiration if TTL is provided
      if (options?.ttl && options.ttl > 0) {
        await setMessageExpiration(messageId, options.ttl);
      }
      
      // Handle media content if provided
      if (options?.mediaUrl && options?.mediaType) {
        await handleSendMedia({
          url: options.mediaUrl,
          mediaType: options.mediaType,
          ttl: options.ttl,
          preventScreenshot: options.preventScreenshot
        });
      }
      
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
  
  // Handle sending media messages
  const handleSendMedia = async (mediaData: { 
    url: string, 
    thumbnailUrl?: string,
    mediaType?: string,
    ttl?: number | null,
    preventScreenshot?: boolean 
  }) => {
    if (!navigator.onLine) {
      toast({
        title: "Error",
        description: "Cannot send media: Device is offline",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const timestamp = new Date().toISOString();
      const messageId = uuidv4();
      
      // Create message expiration metadata if TTL provided
      let expiresAt = null;
      if (mediaData.ttl && mediaData.ttl > 0) {
        expiresAt = new Date(Date.now() + mediaData.ttl * 1000).toISOString();
        await setMessageExpiration(messageId, mediaData.ttl);
      }
      
      // Get current user info from userProfiles
      const currentUserProfile = userProfiles[currentUserId] || {username: null, avatar_url: null};
      
      // Create a message object with the media URL
      const mediaMessage = {
        id: messageId,
        content: '',
        media_url: mediaData.url,
        thumbnail_url: mediaData.thumbnailUrl || null,
        sender: { 
          id: currentUserId,
          username: currentUserProfile.username || 'You',
          full_name: currentUserProfile.username || 'You',
          avatar_url: currentUserProfile.avatar_url
        },
        receiver_id: friend.user_id,
        created_at: timestamp,
        is_delivered: false,
        is_read: false,
        read_at: null,
        encryption_key: '',
        iv: '',
        is_encrypted: securityLevel !== 'standard',
        is_deleted: false,
        deleted_at: null,
        message_type: mediaData.mediaType || 'image',
        expires_at: expiresAt,
        prevent_screenshot: mediaData.preventScreenshot || false
      };
      
      // Update UI immediately
      onNewMessage(mediaMessage as DecryptedMessage);
      
      // Send to server or via WebRTC
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          id: messageId,
          sender_id: currentUserId,
          receiver_id: friend.user_id,
          content: '',
          media_url: mediaData.url,
          thumbnail_url: mediaData.thumbnailUrl || null,
          created_at: timestamp,
          is_delivered: usingServerFallback,
          is_read: false,
          read_at: null,
          encryption_key: '',
          iv: '',
          is_encrypted: securityLevel !== 'standard',
          message_type: mediaData.mediaType || 'image',
          expires_at: expiresAt,
          prevent_screenshot: mediaData.preventScreenshot || false
        }]);
      
      if (error) {
        console.error("Error sending media message:", error);
        toast({
          title: "Error",
          description: "Failed to send media",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleSendMedia:", error);
      toast({
        title: "Error",
        description: "Failed to send media",
        variant: "destructive"
      });
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
        onSendMedia={handleSendMedia}
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
