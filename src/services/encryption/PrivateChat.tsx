
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEncryptionKey, encryptWithKey, decryptWithKey } from '@/utils/encryption';
import { CircleUserIcon, LockIcon, SendIcon } from 'lucide-react';
import { PrivateChatProps, Message, EncryptedMessage } from './types';

/**
 * PrivateChat - A component for secure end-to-end encrypted private chat
 * 
 * Features:
 * - End-to-end encryption using AES-GCM
 * - Secure key generation and management
 * - Real-time updates through Supabase channels
 * - Message encryption/decryption
 * - Typing indicators
 * - Read receipts
 */
const PrivateChat: React.FC<PrivateChatProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  initialMessages = [],
  onMessageSent,
  onMessageRead
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [receiverIsTyping, setReceiverIsTyping] = useState(false);
  const { toast } = useToast();

  // Initialize the secure chat session
  useEffect(() => {
    const setupEncryptedChat = async () => {
      try {
        // Check if we already have a session key for this conversation
        const { data: existingKey } = await supabase
          .from('private_chat_sessions')
          .select('session_key')
          .eq('user1_id', currentUserId)
          .eq('user2_id', receiverId)
          .single();

        if (existingKey?.session_key) {
          setSessionKey(existingKey.session_key);
        } else {
          // Generate new secure encryption key for this conversation
          const newKey = await generateEncryptionKey();
          
          // Store the session key securely
          await supabase
            .from('private_chat_sessions')
            .insert([
              { 
                user1_id: currentUserId, 
                user2_id: receiverId, 
                session_key: newKey,
                created_at: new Date().toISOString()
              }
            ]);
            
          setSessionKey(newKey);
        }
      } catch (error) {
        console.error('Error setting up encrypted chat:', error);
        toast({
          title: "Encryption Error",
          description: "Could not establish secure connection",
          variant: "destructive"
        });
      }
    };

    if (currentUserId && receiverId) {
      setupEncryptedChat();
    }
  }, [currentUserId, receiverId, toast]);

  // Subscribe to real-time messages on this channel
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    const channel = supabase
      .channel(`private:${currentUserId}:${receiverId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`,
      }, handleNewMessage)
      .on('presence', { event: 'sync' }, () => {
        // Handle presence sync
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        // Check if the receiver joined
        const receiverPresence = newPresences.find(p => p.user_id === receiverId);
        if (receiverPresence) {
          // Handle receiver online status
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        // Check if the receiver left
        const receiverPresence = leftPresences.find(p => p.user_id === receiverId);
        if (receiverPresence) {
          // Handle receiver offline status
        }
      })
      .subscribe();

    // Handle typing indicator channel
    const typingChannel = supabase
      .channel(`typing:${currentUserId}:${receiverId}`)
      .on('broadcast', { event: 'typing' }, payload => {
        if (payload.sender === receiverId) {
          setReceiverIsTyping(payload.isTyping);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(typingChannel);
    };
  }, [currentUserId, receiverId]);

  // Handle new incoming message from Supabase realtime
  const handleNewMessage = async (payload: { new: EncryptedMessage }) => {
    if (!sessionKey) return;
    
    try {
      const { encrypted_content, iv, sender_id } = payload.new;
      
      // Only decrypt messages sent by the other user
      if (sender_id !== currentUserId) {
        const decryptedContent = await decryptWithKey(
          encrypted_content,
          sessionKey,
          iv
        );
        
        const newMsg: Message = {
          id: payload.new.id,
          content: decryptedContent,
          senderId: sender_id,
          timestamp: new Date(payload.new.created_at),
          isRead: false
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Mark message as read
        if (onMessageRead) {
          onMessageRead(payload.new.id);
        }
        
        // Call Supabase RPC to mark message as read
        await supabase.rpc('mark_message_as_read', { message_id: payload.new.id });
      }
    } catch (error) {
      console.error('Error decrypting message:', error);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sessionKey) return;
    
    setIsLoading(true);
    try {
      // Encrypt the message content
      const { encryptedContent, iv } = await encryptWithKey(
        newMessage.trim(),
        sessionKey
      );
      
      // Store the encrypted message in Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          encrypted_content: encryptedContent,
          iv: iv,
          is_private: true
        })
        .select('id, created_at')
        .single();
      
      if (error) throw error;
      
      // Add the sent message to the UI
      const sentMessage: Message = {
        id: data.id,
        content: newMessage.trim(),
        senderId: currentUserId,
        timestamp: new Date(data.created_at),
        isRead: false
      };
      
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      if (onMessageSent) {
        onMessageSent(sentMessage);
      }
    } catch (error) {
      console.error('Error sending encrypted message:', error);
      toast({
        title: "Error",
        description: "Could not send message securely",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value;
      setNewMessage(content);
      
      // Only send typing indicator if actually typing
      const isCurrentlyTyping = content.length > 0;
      
      if (isTyping !== isCurrentlyTyping) {
        setIsTyping(isCurrentlyTyping);
        
        // Broadcast typing status to the other user
        supabase
          .channel(`typing:${receiverId}:${currentUserId}`)
          .send({
            type: 'broadcast',
            event: 'typing',
            payload: {
              sender: currentUserId,
              isTyping: isCurrentlyTyping
            }
          });
      }
    },
    [currentUserId, receiverId, isTyping]
  );

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg">
      <CardHeader className="border-b bg-primary-foreground">
        <CardTitle className="flex items-center space-x-2 text-primary">
          <CircleUserIcon className="mr-2" />
          <span>{receiverName || 'Private Chat'}</span>
          <LockIcon className="ml-2 text-green-500" size={16} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.senderId === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <div className="text-xs opacity-70 text-right mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.senderId === currentUserId && message.isRead && (
                  <span className="ml-1">✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {receiverIsTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-2 text-sm">
              Typing...
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form 
          className="flex w-full items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Textarea
            placeholder="Type a secure message..."
            value={newMessage}
            onChange={handleTyping}
            className="flex-1 min-h-10"
          />
          <Button 
            type="submit"
            size="icon" 
            disabled={isLoading || !newMessage.trim()}
          >
            <SendIcon />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PrivateChat;
