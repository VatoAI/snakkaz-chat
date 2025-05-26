/**
 * GlobalChatContainer Component
 * 
 * Main container for the global chat functionality with pinned messages support
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '../ChatInterface';
import useChatPin from '@/hooks/chat/useChatPin';
import { DecryptedMessage } from '@/types/message';
import { UserProfile } from '@/types/profile';
import { Loader } from 'lucide-react';

// Mock decrypt function until we connect with actual encryption service
const mockDecrypt = (message: any): DecryptedMessage => {
  return {
    id: message.id,
    content: message.content,
    sender_id: message.sender_id,
    created_at: message.created_at,
    is_edited: message.is_edited || false,
    is_deleted: message.is_deleted || false,
    pinned: message.pinned || false,
    pinned_by: message.pinned_by || null,
    pinned_at: message.pinned_at || null,
    message_type: message.message_type || 'text',
    metadata: message.metadata || {}
  };
};

const GlobalChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize chat pin functionality
  const {
    pinnedMessages,
    pinnedMessageIds,
    pinMessage,
    unpinMessage,
    isPinning,
    isLoading: isPinLoading
  } = useChatPin({
    chatId: null,
    chatType: 'global',
  });
  
  // Fetch user profiles for message authors
  const fetchUserProfiles = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return;
    
    const uniqueIds = [...new Set(userIds)];
    const missingIds = uniqueIds.filter(id => !userProfiles[id]);
    
    if (missingIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', missingIds);
        
      if (error) throw error;
      
      if (data) {
        const newProfiles: Record<string, UserProfile> = {};
        data.forEach(profile => {
          newProfiles[profile.id] = profile as UserProfile;
        });
        
        setUserProfiles(prev => ({ ...prev, ...newProfiles }));
      }
    } catch (err) {
      console.error('Failed to fetch user profiles:', err);
    }
  }, [userProfiles]);
  
  // Fetch global chat messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('global_chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Decrypt messages and set state
        const decryptedMessages = data.map(msg => mockDecrypt(msg));
        setMessages(decryptedMessages);
        
        // Set oldest message date for pagination
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
        // Fetch user profiles
        const userIds = data.map(msg => msg.sender_id);
        fetchUserProfiles(userIds);
        
        // Check if there are more messages
        setHasMoreMessages(data.length === 50);
      }
    } catch (err) {
      console.error('Failed to fetch global chat messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load global chat messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfiles, toast]);
  
  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!oldestMessageDate || isLoadingMoreMessages || !hasMoreMessages) return;
    
    setIsLoadingMoreMessages(true);
    
    try {
      const { data, error } = await supabase
        .from('global_chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .lt('created_at', oldestMessageDate)
        .limit(30);
      
      if (error) throw error;
      
      if (data) {
        const decryptedMessages = data.map(msg => mockDecrypt(msg));
        
        setMessages(prev => [...prev, ...decryptedMessages]);
        
        // Update oldest message date
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
        // Fetch user profiles
        const userIds = data.map(msg => msg.sender_id);
        fetchUserProfiles(userIds);
        
        // Check if there are more messages
        setHasMoreMessages(data.length === 30);
      }
    } catch (err) {
      console.error('Failed to load more messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load more messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMoreMessages(false);
    }
  }, [oldestMessageDate, isLoadingMoreMessages, hasMoreMessages, fetchUserProfiles, toast]);
  
  // Send a message
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    if (!text.trim() && !mediaFile) return;
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to send messages',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // For edit mode
      if (editingMessage) {
        const { error } = await supabase
          .from('global_chat_messages')
          .update({
            content: text,
            is_edited: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMessage.id)
          .eq('sender_id', user.id); // Ensure user can only edit their own messages
        
        if (error) throw error;
        
        // Update local state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === editingMessage.id 
              ? { ...msg, content: text, is_edited: true }
              : msg
          )
        );
        
        // Exit edit mode
        setEditingMessage(null);
        setNewMessage('');
        
        toast({
          title: 'Success',
          description: 'Message updated',
        });
        
        return;
      }
      
      // Normal message sending
      let messageData: any = {
        sender_id: user.id,
        content: text,
        created_at: new Date().toISOString(),
        message_type: 'text'
      };
      
      // Handle media upload if present
      if (mediaFile) {
        try {
          // Upload file to storage
          const fileName = `${user.id}/${Date.now()}_${mediaFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('message_media')
            .upload(fileName, mediaFile);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrl } = supabase.storage
            .from('message_media')
            .getPublicUrl(fileName);
          
          // Update message data
          messageData = {
            ...messageData,
            content: publicUrl.publicUrl,
            message_type: mediaFile.type.startsWith('image/') ? 'image' : 'file',
            metadata: {
              fileName: mediaFile.name,
              fileSize: mediaFile.size,
              mimeType: mediaFile.type
            }
          };
        } catch (err) {
          console.error('Failed to upload media:', err);
          toast({
            title: 'Error',
            description: 'Failed to upload media file',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Insert message into database
      const { data, error } = await supabase
        .from('global_chat_messages')
        .insert(messageData)
        .select();
      
      if (error) throw error;
      
      // Add message to local state
      if (data) {
        const newMessage = mockDecrypt(data[0]);
        setMessages(prev => [newMessage, ...prev]);
      }
      
      // Clear input
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };
  
  // Handle message edit
  const handleEditMessage = (message: DecryptedMessage) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };
  
  // Delete a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('global_chat_messages')
        .update({ is_deleted: true, content: '[Message deleted]' })
        .eq('id', messageId)
        .eq('sender_id', user.id); // Security: ensure users can only delete their own messages
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, is_deleted: true, content: '[Message deleted]' }
            : msg
        )
      );
      
      toast({
        title: 'Success',
        description: 'Message deleted',
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };
  
  // Handle pinning/unpinning a message
  const handlePinMessage = async (messageId: string) => {
    if (pinnedMessageIds.has(messageId)) {
      await unpinMessage(messageId);
    } else {
      await pinMessage(messageId);
    }
  };
  
  // Set up initial data fetch and realtime subscription
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to message changes
    const subscription = supabase
      .channel('global-chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_chat_messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = mockDecrypt(payload.new);
            
            // Only add if it's not already in the list
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [newMessage, ...prev];
            });
            
            // Fetch user profile if needed
            fetchUserProfiles([newMessage.sender_id]);
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedMessage = mockDecrypt(payload.new);
            
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg  
            ));
          }
          else if (payload.eventType === 'DELETE') {
            const deletedMessageId = payload.old.id;
            setMessages(prev => prev.filter(msg => msg.id !== deletedMessageId));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchMessages, fetchUserProfiles]);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-cybergold-500 mb-2">You need to be logged in to view the global chat</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cybergold-500 mx-auto mb-2" />
          <p className="text-cybergold-500">Loading global chat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ChatInterface
      messages={messages}
      currentUserId={user.id}
      userProfiles={userProfiles}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSendMessage={handleSendMessage}
      onEditMessage={handleEditMessage}
      onDeleteMessage={handleDeleteMessage}
      onPinMessage={handlePinMessage}
      onUnpinMessage={handlePinMessage}
      pinnedMessages={pinnedMessages}
      showPinnedMessages={true}
      chatType="global"
      isLoading={isLoading}
      recipientInfo={{
        name: "Global Chat",
        isOnline: true,
      }}
      isDirectMessage={false}
      editingMessage={editingMessage}
      onCancelEdit={handleCancelEdit}
      hasMoreMessages={hasMoreMessages}
      isLoadingMoreMessages={isLoadingMoreMessages}
      onLoadMoreMessages={loadMoreMessages}
      canPin={true}
      pinnedMessageIds={pinnedMessageIds}
    />
  );
};

export default GlobalChatContainer;
