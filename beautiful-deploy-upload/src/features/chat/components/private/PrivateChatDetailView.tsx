/**
 * PrivateChatDetailView Component
 * 
 * Enhanced private chat component with pinned messages support
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ChatInterface from '../ChatInterface';
import useChatPin from '@/hooks/chat/useChatPin';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';
import { Loader, ArrowLeft } from 'lucide-react';
import { encryptMessage, decryptMessage } from '@/utils/encryption/message-encryption';
import { generateChatEncryptionKey } from '@/utils/encryption/key-management';
import { UserProfile } from '@/types/profile';

interface PrivateChatDetailViewProps {
  chatId: string;
  recipientId: string;
  onClose: () => void;
}

// Mock decrypt function until we connect with actual encryption service
const mockDecryptWithKey = (message: any, encryptionKey: string | null): DecryptedMessage => {
  // In a real implementation, we would use the encryption key to decrypt
  // For now, we just pass through the content
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

const PrivateChatDetailView: React.FC<PrivateChatDetailViewProps> = ({
  chatId,
  recipientId,
  onClose
}) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [recipient, setRecipient] = useState<UserProfile | null>(null);
  const [recipientStatus, setRecipientStatus] = useState<UserStatus | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  
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
    chatId,
    chatType: 'private',
    encryptionKey: encryptionKey || undefined
  });
  
  // Fetch recipient profile and status
  const fetchRecipient = useCallback(async () => {
    if (!recipientId) return;
    
    try {
      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData) {
        setRecipient(profileData as UserProfile);
        setUserProfiles(prev => ({
          ...prev,
          [recipientId]: profileData as UserProfile
        }));
      }
      
      // Get presence status
      const { data: presenceData, error: presenceError } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', recipientId)
        .single();
      
      if (!presenceError && presenceData) {
        setRecipientStatus(presenceData as unknown as UserStatus);
      }
    } catch (err) {
      console.error('Failed to fetch recipient details:', err);
    }
  }, [recipientId]);
  
  // Generate or fetch encryption key for the chat
  const setupEncryption = useCallback(async () => {
    if (!user || !chatId) return;
    
    try {
      // In a real implementation, we would get the key from secure storage
      // or generate it if it doesn't exist
      const chatKey = await generateChatEncryptionKey(chatId);
      setEncryptionKey(chatKey);
    } catch (err) {
      console.error('Failed to set up encryption:', err);
      toast({
        title: 'Encryption error',
        description: 'Failed to set up end-to-end encryption for this chat',
        variant: 'destructive',
      });
    }
  }, [user, chatId, toast]);
  
  // Fetch private chat messages
  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('private_chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Decrypt messages and set state
        const decryptedMessages = data.map(msg => mockDecryptWithKey(msg, encryptionKey));
        setMessages(decryptedMessages);
        
        // Set oldest message date for pagination
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
        // Add user profiles
        if (user) {
          setUserProfiles(prev => ({
            ...prev,
            [user.id]: { 
              id: user.id,
              username: user.email?.split('@')[0] || 'You',
              avatar_url: null
            } as UserProfile
          }));
        }
        
        // Check if there are more messages
        setHasMoreMessages(data.length === 50);
      }
    } catch (err) {
      console.error('Failed to fetch private chat messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatId, encryptionKey, user, toast]);
  
  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!chatId || !oldestMessageDate || isLoadingMoreMessages || !hasMoreMessages) return;
    
    setIsLoadingMoreMessages(true);
    
    try {
      const { data, error } = await supabase
        .from('private_chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .lt('created_at', oldestMessageDate)
        .limit(30);
      
      if (error) throw error;
      
      if (data) {
        const decryptedMessages = data.map(msg => mockDecryptWithKey(msg, encryptionKey));
        
        setMessages(prev => [...prev, ...decryptedMessages]);
        
        // Update oldest message date
        if (decryptedMessages.length > 0) {
          const oldest = decryptedMessages[decryptedMessages.length - 1];
          setOldestMessageDate(oldest.created_at);
        }
        
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
  }, [chatId, oldestMessageDate, isLoadingMoreMessages, hasMoreMessages, encryptionKey, toast]);
  
  // Send a message
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    if (!text.trim() && !mediaFile) return;
    if (!user || !chatId) {
      toast({
        title: 'Error',
        description: 'Cannot send message',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      let content = text;
      
      // Encrypt content if encryption key is available
      if (encryptionKey) {
        try {
          content = await encryptMessage(text, encryptionKey);
        } catch (encryptError) {
          console.error('Failed to encrypt message:', encryptError);
          // Continue with unencrypted message as fallback
        }
      }
      
      // For edit mode
      if (editingMessage) {
        const { error } = await supabase
          .from('private_chat_messages')
          .update({
            content: content,
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
              ? { ...msg, content: text, is_edited: true } // Store unencrypted for display
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
        chat_id: chatId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: content,
        encrypted: !!encryptionKey,
        created_at: new Date().toISOString(),
        message_type: 'text'
      };
      
      // Handle media upload if present
      if (mediaFile) {
        try {
          // Upload file to storage
          const fileName = `private/${chatId}/${Date.now()}_${mediaFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('message_media')
            .upload(fileName, mediaFile);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrl } = supabase.storage
            .from('message_media')
            .getPublicUrl(fileName);
          
          // Encrypt URL if needed
          let mediaUrl = publicUrl.publicUrl;
          if (encryptionKey) {
            try {
              mediaUrl = await encryptMessage(publicUrl.publicUrl, encryptionKey);
            } catch (encryptError) {
              console.error('Failed to encrypt media URL:', encryptError);
            }
          }
          
          // Update message data
          messageData = {
            ...messageData,
            content: mediaUrl,
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
        .from('private_chat_messages')
        .insert(messageData)
        .select();
      
      if (error) throw error;
      
      // Add message to local state
      if (data) {
        // Create a decrypted version for local display
        const newMessage: DecryptedMessage = {
          id: data[0].id,
          content: text, // Use the original unencrypted text
          sender_id: user.id,
          created_at: data[0].created_at,
          is_edited: false,
          is_deleted: false,
          pinned: false,
          message_type: messageData.message_type,
          metadata: messageData.metadata || {}
        };
        
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
    if (!user || !chatId) return;
    
    try {
      const { error } = await supabase
        .from('private_chat_messages')
        .update({ is_deleted: true, content: '[Message deleted]' })
        .eq('id', messageId)
        .eq('sender_id', user.id) // Security: ensure users can only delete their own messages
        .eq('chat_id', chatId);
      
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
    if (!chatId) return;
    
    if (pinnedMessageIds.has(messageId)) {
      await unpinMessage(messageId);
    } else {
      await pinMessage(messageId);
    }
  };
  
  // Set up initial data loading
  useEffect(() => {
    fetchRecipient();
    setupEncryption();
  }, [fetchRecipient, setupEncryption]);
  
  // Fetch messages when encryption is set up
  useEffect(() => {
    if (encryptionKey !== null) {
      fetchMessages();
    }
  }, [encryptionKey, fetchMessages]);
  
  // Set up realtime subscription
  useEffect(() => {
    if (!chatId) return;
    
    // Subscribe to message changes
    const subscription = supabase
      .channel(`private-chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'private_chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const msgData = payload.new;
            
            // Skip own messages (already added to state on send)
            if (msgData.sender_id === user?.id) {
              return;
            }
            
            // Decrypt if needed
            let content = msgData.content;
            if (msgData.encrypted && encryptionKey) {
              try {
                content = await decryptMessage(msgData.content, encryptionKey);
              } catch (decryptError) {
                console.error('Failed to decrypt message:', decryptError);
                content = '[Encrypted message]';
              }
            }
            
            const newMessage: DecryptedMessage = {
              id: msgData.id,
              content: content,
              sender_id: msgData.sender_id,
              created_at: msgData.created_at,
              is_edited: false,
              is_deleted: false,
              pinned: msgData.pinned || false,
              message_type: msgData.message_type || 'text',
              metadata: msgData.metadata || {}
            };
            
            // Only add if it's not already in the list
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [newMessage, ...prev];
            });
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new;
            
            // Decrypt if needed
            let content = updatedMsg.content;
            if (updatedMsg.encrypted && encryptionKey && !updatedMsg.is_deleted) {
              try {
                content = await decryptMessage(updatedMsg.content, encryptionKey);
              } catch (decryptError) {
                console.error('Failed to decrypt updated message:', decryptError);
                content = '[Encrypted message]';
              }
            }
            
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMsg.id ? {
                ...msg,
                content: content,
                is_edited: updatedMsg.is_edited || false,
                is_deleted: updatedMsg.is_deleted || false,
                pinned: updatedMsg.pinned || false
              } : msg  
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
  }, [chatId, encryptionKey, user?.id]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cybergold-500 mx-auto mb-2" />
          <p className="text-cybergold-500">Loading chat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ChatInterface
      messages={messages}
      currentUserId={user?.id || ''}
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
      chatId={chatId}
      chatType="private"
      encryptionKey={encryptionKey || undefined}
      isLoading={isLoading}
      recipientInfo={{
        name: recipient?.username || 'User',
        avatar: recipient?.avatar_url || undefined,
        isOnline: recipientStatus?.status === 'online',
        status: recipientStatus?.status as UserStatus || undefined
      }}
      isDirectMessage={true}
      onBackToList={onClose}
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

export default PrivateChatDetailView;
