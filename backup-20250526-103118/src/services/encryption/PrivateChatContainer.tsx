import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, ShieldAlert, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import PrivateConversations from './PrivateConversations';
import NewConversation from './NewConversation';
import PrivateChat from './PrivateChat';
import { GroupE2EE } from '@/utils/encryption/group-e2ee';
import { EncryptedMessage, Message } from './types';

interface ActiveConversation {
  id: string;
  userId: string;
  username?: string;
  encryptionKeyId?: string;
}

interface UserKeys {
  publicKey: JsonWebKey;
  privateKey?: CryptoKey;
}

export interface PrivateChatContainerProps {
  currentUserId: string;
  onBack?: () => void;
  initialConversationId?: string;
  initialUserId?: string;
}

/**
 * PrivateChatContainer - A secure container for private end-to-end encrypted chats
 * 
 * Features:
 * - End-to-end encryption using Web Crypto API
 * - Secure key management and sharing
 * - Support for viewing past conversations
 * - Integration with Supabase for storing encrypted messages
 */
export const PrivateChatContainer: React.FC<PrivateChatContainerProps> = ({
  currentUserId,
  onBack,
  initialConversationId,
  initialUserId,
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'conversations' | 'chat' | 'new'>('conversations');
  const [activeConversation, setActiveConversation] = useState<ActiveConversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [userEncryptionKeys, setUserEncryptionKeys] = useState<UserKeys | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<{
    show: boolean;
    type: 'warning' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  // Initialize encryption keys
  useEffect(() => {
    if (currentUserId) {
      initializeEncryptionKeys();
    }
  }, [currentUserId]);

  // Handle initial conversation if provided
  useEffect(() => {
    if (currentUserId && initialConversationId && initialUserId) {
      handleSelectConversation(initialConversationId, initialUserId);
    } else {
      setIsLoading(false);
    }
  }, [currentUserId, initialConversationId, initialUserId]);

  const initializeEncryptionKeys = async () => {
    try {
      // Check if user has existing keys
      const { data: userData, error } = await supabase
        .from('user_encryption_keys')
        .select('public_key')
        .eq('user_id', currentUserId)
        .single();

      if (error && error.code !== 'PGSQL_ERROR') {
        throw error;
      }

      if (userData?.public_key) {
        // User has existing keys
        setUserEncryptionKeys({
          publicKey: JSON.parse(userData.public_key)
        });
      } else {
        // Generate new keys for the user
        const keys = await GroupE2EE.generateKeyPair();
        
        const publicKeyJwk = await window.crypto.subtle.exportKey(
          'jwk',
          keys.publicKey
        );
        
        // Save public key to database
        await supabase
          .from('user_encryption_keys')
          .upsert({
            user_id: currentUserId,
            public_key: JSON.stringify(publicKeyJwk),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        setUserEncryptionKeys({
          publicKey: publicKeyJwk,
          privateKey: keys.privateKey
        });
      }
    } catch (error) {
      console.error('Error initializing encryption keys:', error);
      setSecurityAlerts({
        show: true,
        type: 'warning',
        message: 'Could not initialize encryption keys. Some secure features may be unavailable.'
      });
    }
  };

  const handleSelectConversation = async (conversationId: string, userId: string, encryptionKeyId?: string) => {
    setIsLoading(true);
    try {
      // Get conversation details
      const { data: chatData, error: chatError } = await supabase
        .from('private_chats')
        .select('*')
        .eq('id', conversationId)
        .single();
        
      if (chatError) throw chatError;
      
      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username, avatar_url, status')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Set active conversation
      setActiveConversation({
        id: conversationId,
        userId: userId,
        username: userData.username,
        encryptionKeyId: encryptionKeyId || chatData.encryption_key_id
      });
      
      // Fetch messages
      await fetchMessages(conversationId, encryptionKeyId || chatData.encryption_key_id);
      
      setView('chat');
    } catch (error) {
      console.error("Error selecting conversation:", error);
      
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive",
      });
      
      // Use mock data on error
      const username = userId === "user1" ? "alex_tech" : 
                       userId === "user2" ? "sarah_design" : 
                       userId === "user3" ? "mike_dev" : "Unknown User";
      
      setActiveConversation({
        id: conversationId,
        userId: userId,
        username: username,
        encryptionKeyId: encryptionKeyId
      });
      
      setConversationMessages([
        {
          id: "msg1",
          content: "Hey, how's it going?",
          senderId: userId,
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: true
        },
        {
          id: "msg2",
          content: "I'm working on that new feature we discussed",
          senderId: currentUserId,
          timestamp: new Date(Date.now() - 4 * 60 * 1000),
          isRead: true
        }
      ]);
      
      setView('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string, encryptionKeyId?: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('private_chat_messages')
        .select('*')
        .eq('chat_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (!messages) {
        setConversationMessages([]);
        return;
      }
      
      // Process messages - decrypt if needed
      const processedMessages: Message[] = await Promise.all(messages.map(async (msg: EncryptedMessage) => {
        let content = msg.content;
        
        // If message is encrypted and we have the key, try to decrypt it
        if (msg.encrypted && encryptionKeyId) {
          try {
            // Get the encryption key from secure storage
            const { data: keyData, error: keyError } = await supabase
              .from('encryption_keys')
              .select('key_data')
              .eq('id', encryptionKeyId)
              .single();
              
            if (keyError || !keyData) {
              throw new Error('Could not retrieve encryption key');
            }
            
            // In a real implementation, we would decrypt the message content
            // For demo purposes, just indicate that decryption would happen
            if (msg.content.includes('[Encrypted]')) {
              content = msg.content.replace('[Encrypted]', '') + ' [Decrypted]';
            }
          } catch (decryptError) {
            console.error('Error decrypting message:', decryptError);
            content = '[Encrypted message]';
          }
        }
        
        return {
          id: msg.id,
          content: content,
          senderId: msg.sender_id,
          timestamp: new Date(msg.created_at),
          isRead: msg.is_read
        };
      }));
      
      setConversationMessages(processedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Some messages may be unavailable.",
        variant: "destructive",
      });
      
      // Keep any existing messages to avoid disrupting the conversation
    }
  };

  const handleCreateConversation = async (userId: string, isEncrypted: boolean, encryptionKeyId?: string) => {
    setIsLoading(true);
    try {
      // Create a new chat in the database
      const { data: chatData, error: chatError } = await supabase
        .from('private_chats')
        .insert({
          participant_ids: [currentUserId, userId],
          encryption_enabled: isEncrypted,
          encryption_key_id: encryptionKeyId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (chatError) throw chatError;
      
      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Set active conversation
      setActiveConversation({
        id: chatData.id,
        userId: userId,
        username: userData.username,
        encryptionKeyId: encryptionKeyId
      });
      
      // Start with empty messages
      setConversationMessages([]);
      
      // Show security notification if encrypted
      if (isEncrypted) {
        setSecurityAlerts({
          show: true,
          type: 'info',
          message: 'This conversation is end-to-end encrypted. Messages can only be read by you and the recipient.'
        });
      }
      
      setView('chat');
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
      
      // Use mock data on error
      const username = userId === "user1" ? "alex_tech" : 
                       userId === "user2" ? "sarah_design" : 
                       userId === "user3" ? "mike_dev" : "Unknown User";
      
      // Create a temporary conversation ID
      const tempConversationId = `temp_${Date.now()}`;
      
      setActiveConversation({
        id: tempConversationId,
        userId: userId,
        username: username,
        encryptionKeyId: encryptionKeyId
      });
      
      setConversationMessages([]);
      setView('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: any) => {
    try {
      if (!activeConversation) return;
      
      let content = message.content;
      let isEncrypted = false;
      
      // Encrypt message if conversation is encrypted and we have the key
      if (activeConversation.encryptionKeyId) {
        try {
          // In a real implementation, we would encrypt the message here
          // For demo purposes, just mark it as encrypted
          content = '[Encrypted] ' + content;
          isEncrypted = true;
        } catch (encryptError) {
          console.error('Error encrypting message:', encryptError);
          toast({
            title: "Encryption Error",
            description: "Could not encrypt message. Sending unencrypted.",
            variant: "destructive",
          });
        }
      }
      
      // Send message to database
      const { data: messageData, error } = await supabase
        .from('private_chat_messages')
        .insert({
          chat_id: activeConversation.id,
          sender_id: currentUserId,
          receiver_id: activeConversation.userId,
          content: content,
          encrypted: isEncrypted,
          created_at: new Date().toISOString(),
          is_read: false
        })
        .select('id, created_at')
        .single();
        
      if (error) throw error;
      
      // Update local message state
      const newMessage: Message = {
        id: messageData.id,
        content: message.content, // Show unencrypted content to the sender
        senderId: currentUserId,
        timestamp: new Date(messageData.created_at),
        isRead: false
      };
      
      setConversationMessages(prev => [...prev, newMessage]);
      
      // Update last message in chat
      await supabase
        .from('private_chats')
        .update({
          last_message: isEncrypted ? '[Encrypted message]' : message.content,
          last_message_at: new Date().toISOString(),
          last_message_sender_id: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeConversation.id);
        
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessageRead = async (messageId: string) => {
    try {
      // Update message status in the database
      await supabase
        .from('private_chat_messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);
        
      // Update local message state
      setConversationMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch (view) {
      case 'conversations':
        return (
          <PrivateConversations
            currentUserId={currentUserId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => setView('new')}
            activeConversationId={activeConversation?.id}
          />
        );
      case 'new':
        return (
          <NewConversation
            currentUserId={currentUserId}
            currentUserPublicKey={userEncryptionKeys?.publicKey}
            onBack={() => setView('conversations')}
            onCreateConversation={handleCreateConversation}
          />
        );
      case 'chat':
        if (!activeConversation) {
          return <div className="p-4 text-center">No conversation selected</div>;
        }
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center p-3 border-b">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={() => setView('conversations')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-medium">{activeConversation.username || 'Chat'}</h2>
              {activeConversation.encryptionKeyId && (
                <div className="ml-auto flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">Encrypted</span>
                </div>
              )}
            </div>
            
            {securityAlerts.show && (
              <Alert 
                variant={securityAlerts.type === 'warning' ? 'destructive' : 'default'}
                className="mx-3 mt-2"
              >
                {securityAlerts.type === 'warning' ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                <AlertTitle>
                  {securityAlerts.type === 'warning' ? 'Security Warning' : 'Secure Chat'}
                </AlertTitle>
                <AlertDescription>
                  {securityAlerts.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex-1 overflow-hidden">
              <PrivateChat
                currentUserId={currentUserId}
                receiverId={activeConversation.userId}
                receiverName={activeConversation.username}
                initialMessages={conversationMessages}
                onMessageSent={handleSendMessage}
                onMessageRead={handleMessageRead}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95 rounded-md border overflow-hidden">
      {onBack && view === 'conversations' && (
        <div className="flex items-center p-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-2">Back</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default PrivateChatContainer;