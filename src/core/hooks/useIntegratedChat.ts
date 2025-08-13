import { useState, useEffect, useCallback } from 'react';
import { useWebRTCDirectMessaging, DirectMessage } from './useWebRTCDirectMessaging.new';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isP2P: boolean;
  isRead: boolean;
  isDelivered: boolean;
  isFailed: boolean;
}

export interface DirectChatOptions {
  // Timeout in milliseconds before fallback to server
  p2pTimeout?: number;
  // Maximum number of attempts to send via WebRTC before fallback
  maxRetries?: number;
  // Interval for checking delivery status in milliseconds
  deliveryCheckInterval?: number;
}

/**
 * useIntegratedChat - Hook that integrates WebRTC direct messaging with database-stored messages
 * 
 * This hook combines the advantages of WebRTC direct messaging (end-to-end encrypted, low latency)
 * with the reliability of server-stored messages and history.
 */
export const useIntegratedChat = (
  currentUserId: string | undefined,
  peerId: string | undefined,
  options?: DirectChatOptions
) => {
  const defaultOptions = {
    p2pTimeout: 8000,
    maxRetries: 3,
    deliveryCheckInterval: 15000,
    ...options
  };
  
  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Connect to WebRTC direct messaging functionality
  const {
    connectionState,
    isEncrypted,
    latency,
    connect,
    sendMessage: sendWebRTCMessage,
    statusInfo
  } = useWebRTCDirectMessaging(currentUserId, peerId);
  
  // Load message history from the database
  useEffect(() => {
    if (!currentUserId || !peerId) return;
    
    const loadMessages = async () => {
      setIsLoading(true);
      
      try {
        // Get messages where current user is sender OR recipient
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`senderId.eq.${currentUserId},recipientId.eq.${currentUserId}`)
          .or(`senderId.eq.${peerId},recipientId.eq.${peerId}`)
          .order('timestamp', { ascending: true });
          
        if (error) throw error;
        
        // Filter to only get messages between these two users
        const relevantMessages = data.filter(msg => 
          (msg.senderId === currentUserId && msg.recipientId === peerId) ||
          (msg.senderId === peerId && msg.recipientId === currentUserId)
        );
        
        setMessages(relevantMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Kunne ikke laste inn meldinger');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up real-time listener for new messages
    const messageSubscription = supabase
      .channel('direct_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `senderId=eq.${peerId},recipientId=eq.${currentUserId}`
      }, (payload) => {
        // Add new incoming message to state
        setMessages(prev => [...prev, payload.new as Message]);
        
        // Mark as read
        markMessageAsRead(payload.new.id);
      })
      .subscribe();
    
    // Try to establish WebRTC connection
    connect().catch(err => {
      console.warn('Failed to establish WebRTC connection:', err);
    });
    
    return () => {
      // Clean up real-time subscription on unmount
      supabase.removeChannel(messageSubscription);
    };
  }, [currentUserId, peerId, supabase, connect]);

  // Handle incoming WebRTC messages
  useEffect(() => {
    // In a complete implementation, we would register a handler for incoming WebRTC messages
    // and add them to the messages state
    // This would be handled by the useWebRTCDirectMessaging hook passing a callback
    
    // For now, we rely on the database messages for consistency
  }, []);
  
  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!supabase || !currentUserId) return;
    
    try {
      await supabase
        .from('messages')
        .update({ isRead: true })
        .match({ id: messageId });
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [supabase, currentUserId]);
  
  // Mark messages from other user as read when they are displayed
  useEffect(() => {
    if (!currentUserId) return;
    
    // Find unread messages from the other user
    const unreadMessages = messages.filter(
      msg => msg.senderId === peerId && !msg.isRead
    );
    
    // Mark each message as read
    unreadMessages.forEach(msg => {
      markMessageAsRead(msg.id);
    });
  }, [messages, currentUserId, peerId, markMessageAsRead]);
  
  // Send message with automatic fallback
  const sendMessage = useCallback(async (content: string) => {
    if (!currentUserId || !peerId || !content.trim()) {
      return null;
    }
    
    // Generate message ID
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Create message object
    const newMessage: Message = {
      id: messageId,
      senderId: currentUserId,
      recipientId: peerId,
      content: content.trim(),
      timestamp,
      isP2P: connectionState === 'p2p',
      isRead: false,
      isDelivered: false,
      isFailed: false
    };
    
    // Add to local state immediately for fast UI update
    setMessages(prev => [...prev, newMessage]);
    
    // Try to send via WebRTC if connected
    let webrtcSuccess = false;
    if (connectionState === 'p2p') {
      try {
        const result = await sendWebRTCMessage(JSON.stringify({
          type: 'chat_message',
          message: newMessage
        }));
        webrtcSuccess = result;
      } catch (err) {
        console.warn('WebRTC send failed, falling back to server:', err);
        webrtcSuccess = false;
      }
    }
    
    // Store the message in the database regardless for history and fallback
    try {
      const { error } = await supabase.from('messages').insert({
        ...newMessage,
        isP2P: webrtcSuccess // Update P2P status based on actual result
      });
      
      if (error) throw error;
      
      // Update local state with updated P2P status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isP2P: webrtcSuccess, isDelivered: true } 
            : msg
        )
      );
      
      return messageId;
    } catch (err) {
      console.error('Error saving message to database:', err);
      
      // Mark the message as failed in UI
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isFailed: true } 
            : msg
        )
      );
      
      return null;
    }
  }, [currentUserId, peerId, connectionState, supabase, sendWebRTCMessage]);
  
  // Retry sending a failed message
  const retrySendMessage = useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return false;
    
    // Update state to show we're trying again
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFailed: false } 
          : msg
      )
    );
    
    // Try to send the message again
    const result = await sendMessage(message.content);
    return !!result;
  }, [messages, sendMessage]);
  
  // Return all necessary functions and state
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retrySendMessage,
    connectionState,
    isEncrypted,
    latency,
    connect,
    statusInfo
  };
};
