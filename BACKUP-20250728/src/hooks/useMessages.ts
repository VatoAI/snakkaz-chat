import { useMessageState } from "./message/useMessageState";
import { useMessageFetch } from "./message/useMessageFetch";
import { useMessageRealtime } from "./message/useMessageRealtime";
import { useMessageSender } from "./message/useMessageSender"; 
import { useMessageP2P } from "./message/useMessageP2P";
import { useMessageExpiry } from "./message/useMessageExpiry";
import { useMessageActions } from "./message/useMessageActions";
import { DecryptedMessage } from "@/types/message";
import { useEffect, useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '../integrations/supabase/client';
import { useAppEncryption } from '../contexts/AppEncryptionContext';

export const useMessages = (userId: string | null, receiverId?: string, groupId?: string) => {
  const { toast } = useToast();
  const { decryptMessage, enabled: encryptionEnabled } = useAppEncryption();
  
  const {
    messages,
    setMessages,
    optimisticallyDeleteMessage,
    newMessage,
    setNewMessage,
    isLoading,
    setIsLoading,
    ttl,
    setTtl,
  } = useMessageState();

  // Add directMessages state
  const [directMessages, setDirectMessages] = useState<DecryptedMessage[]>([]);
  const [isLoadingDirect, setIsLoadingDirect] = useState(false);
  const [hasMoreDirectMessages, setHasMoreDirectMessages] = useState(true);
  
  // Set default TTL to 24 hours (86400 seconds)
  useEffect(() => {
    if (ttl === null) {
      setTtl(86400);
    }
  }, [ttl, setTtl]);

  // Fetch messages from the server with pagination
  const {
    fetchMessages,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore
  } = useMessageFetch(userId, setMessages, toast, receiverId, groupId);

  // Setup realtime subscription
  const { setupRealtimeSubscription } = useMessageRealtime(userId, setMessages, receiverId, groupId);

  // Message sending
  const { handleSendMessage: internalSendMessage } = useMessageSender(
    userId, newMessage, setNewMessage, ttl, setIsLoading, toast
  );

  // P2P message handling
  const { addP2PMessage } = useMessageP2P(setMessages);

  // Message expiry handling
  const { handleMessageExpired } = useMessageExpiry(setMessages);

  // Create simple edit and delete handlers
  const handleEditMessage = useCallback(async (messageId: string, content: string) => {
    // Implementation to be added later if needed
    console.log('Edit message functionality not implemented yet', messageId, content);
    return Promise.resolve();
  }, []);

  const handleDeleteMessageById = useCallback(async (messageId: string) => {
    // Implementation to be added later if needed
    console.log('Delete message functionality not implemented yet', messageId);
    return Promise.resolve();
  }, []);

  // Message editing and deletion actions
  const {
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleSubmitEditMessage,
    handleDeleteMessageById: messageActionsDeleteById
  } = useMessageActions(userId, handleEditMessage, handleDeleteMessageById);

  // Handle message submission (new or edit)
  const handleSubmitMessage = async (content: string, options?: { 
    ttl?: number, 
    mediaFile?: File, 
    webRTCManager?: any, 
    onlineUsers?: Set<string>,
    receiverId?: string,
    onProgress?: (progress: number) => void
  }) => {
    if (editingMessage) {
      await handleSubmitEditMessage(content);
    } else {
      // Extract options
      const messageTtl = options?.ttl !== undefined ? options.ttl : ttl;
      const mediaFile = options?.mediaFile;
      const webRTCManager = options?.webRTCManager;
      const onlineUsers = options?.onlineUsers || new Set<string>();
      const messageReceiverId = options?.receiverId || receiverId;
      const onProgress = options?.onProgress;

      await internalSendMessage(
        webRTCManager, 
        onlineUsers, 
        mediaFile, 
        messageReceiverId, 
        groupId, 
        onProgress
      );
      
      return mediaFile ? "success" : "";
    }
  };

  // Enhanced delete message handler with optimistic updates
  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      // Apply optimistic update first
      optimisticallyDeleteMessage(messageId);

      // Then perform actual deletion
      await messageActionsDeleteById(messageId);
      return Promise.resolve();
    } catch (error) {
      // If deletion fails, we should refresh the messages
      console.error("Error deleting message, refreshing data:", error);
      await fetchMessages();
      return Promise.reject(error);
    }
  }, [messageActionsDeleteById, optimisticallyDeleteMessage, fetchMessages]);

  // Fetch direct messages between users
  const fetchDirectMessages = useCallback(async (limit = 50) => {
    if (!userId || !receiverId) return;
    
    try {
      setIsLoadingDirect(true);
      
      // Query direct messages between the two users
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .and(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Error fetching direct messages:", error);
        toast({
          title: "Error fetching messages",
          description: "Could not load direct messages. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data || data.length === 0) {
        setDirectMessages([]);
        setHasMoreDirectMessages(false);
        return;
      }

      // Decrypt messages if encryption is enabled
      let decryptedMessages: DecryptedMessage[] = [];
      
      if (encryptionEnabled) {
        // Process messages through decryption
        for (const msg of data) {
          try {
            const conversationId = `direct-${userId}-${receiverId}`;
            const decryptedContent = await decryptMessage(
              {
                content: msg.encrypted_content,
                encryption_key: msg.encryption_key,
                iv: msg.iv
              }, 
              conversationId
            );
            
            decryptedMessages.push({
              ...msg,
              content: decryptedContent,
              is_encrypted: true,
              sender: {
                id: msg.sender_id,
                username: msg.sender_username || null,
                full_name: msg.sender_name || null,
                avatar_url: msg.sender_avatar_url || null
              }
            });
          } catch (decryptError) {
            console.error("Failed to decrypt message:", decryptError);
            // Include the message with an error indicator
            decryptedMessages.push({
              ...msg,
              content: "[Encrypted message - unable to decrypt]",
              is_encrypted: true,
              sender: {
                id: msg.sender_id,
                username: msg.sender_username || null,
                full_name: msg.sender_name || null,
                avatar_url: msg.sender_avatar_url || null
              }
            });
          }
        }
      } else {
        // If encryption is disabled, just format the messages
        decryptedMessages = data.map(msg => ({
          ...msg,
          content: msg.content || "[Encrypted message]",
          is_encrypted: false,
          sender: {
            id: msg.sender_id,
            username: msg.sender_username || null,
            full_name: msg.sender_name || null,
            avatar_url: msg.sender_avatar_url || null
          }
        }));
      }
      
      // Sort messages by creation time
      decryptedMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setDirectMessages(decryptedMessages);
      setHasMoreDirectMessages(data.length === limit);
      
    } catch (error) {
      console.error("Error in fetchDirectMessages:", error);
      toast({
        title: "Error",
        description: "Failed to load direct messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDirect(false);
    }
  }, [userId, receiverId, toast, decryptMessage, encryptionEnabled]);

  // Setup realtime subscription for direct messages
  const setupDirectMessageSubscription = useCallback(() => {
    if (!userId || !receiverId) return;
    
    // Create a channel for direct messages between these users
    const channel = supabase
      .channel(`direct_messages_${userId}_${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `(sender_id=eq.${userId},receiver_id=eq.${receiverId})|(sender_id=eq.${receiverId},receiver_id=eq.${userId})`
        },
        async (payload) => {
          // Handle new message
          const newMsg = payload.new;
          
          try {
            let decryptedMsg: DecryptedMessage;
            
            if (encryptionEnabled) {
              const conversationId = `direct-${userId}-${receiverId}`;
              const decryptedContent = await decryptMessage(
                {
                  content: newMsg.encrypted_content,
                  encryption_key: newMsg.encryption_key,
                  iv: newMsg.iv
                }, 
                conversationId
              );
              
              decryptedMsg = {
                ...newMsg,
                content: decryptedContent,
                is_encrypted: true,
                sender: {
                  id: newMsg.sender_id,
                  username: newMsg.sender_username || null,
                  full_name: newMsg.sender_name || null,
                  avatar_url: newMsg.sender_avatar_url || null
                }
              };
            } else {
              decryptedMsg = {
                ...newMsg,
                content: newMsg.content || "[Encrypted message]",
                is_encrypted: false,
                sender: {
                  id: newMsg.sender_id,
                  username: newMsg.sender_username || null,
                  full_name: newMsg.sender_name || null,
                  avatar_url: newMsg.sender_avatar_url || null
                }
              };
            }
            
            setDirectMessages(prev => [...prev, decryptedMsg]);
            
          } catch (decryptError) {
            console.error("Failed to decrypt real-time message:", decryptError);
            // Add with an error indicator
            const errorMsg: DecryptedMessage = {
              ...newMsg,
              content: "[Encrypted message - unable to decrypt]",
              is_encrypted: true,
              sender: {
                id: newMsg.sender_id,
                username: newMsg.sender_username || null,
                full_name: newMsg.sender_name || null,
                avatar_url: newMsg.sender_avatar_url || null
              }
            };
            
            setDirectMessages(prev => [...prev, errorMsg]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `(sender_id=eq.${userId},receiver_id=eq.${receiverId})|(sender_id=eq.${receiverId},receiver_id=eq.${userId})`
        },
        (payload) => {
          // Handle updated message
          const updatedMsg = payload.new;
          
          setDirectMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMsg.id 
                ? {
                    ...msg,
                    ...updatedMsg,
                    is_edited: true,
                    sender: {
                      id: updatedMsg.sender_id,
                      username: updatedMsg.sender_username || null,
                      full_name: updatedMsg.sender_name || null,
                      avatar_url: updatedMsg.sender_avatar_url || null
                    }
                  }
                : msg
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'direct_messages',
          filter: `(sender_id=eq.${userId},receiver_id=eq.${receiverId})|(sender_id=eq.${receiverId},receiver_id=eq.${userId})`
        },
        (payload) => {
          // Handle deleted message
          const deletedMsgId = payload.old.id;
          
          setDirectMessages(prev => 
            prev.filter(msg => msg.id !== deletedMsgId)
          );
        }
      )
      .subscribe();
      
    // Return a cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId, decryptMessage, encryptionEnabled]);

  return {
    // Message state
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    ttl,
    setTtl,

    // Message operations
    fetchMessages,
    setupRealtimeSubscription,
    addP2PMessage,
    handleSendMessage: handleSubmitMessage,
    handleMessageExpired,

    // Pagination
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,

    // Editing and deletion
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage,

    // Direct messages
    directMessages,
    setDirectMessages,
    fetchDirectMessages,
    setupDirectMessageSubscription,
    isLoadingDirect,
    hasMoreDirectMessages
  };
};
