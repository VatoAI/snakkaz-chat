import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PrivateConversations from './PrivateConversations';
import NewConversation from './NewConversation';
import PrivateChat from './PrivateChat';

interface ActiveConversation {
  id: string;
  userId: string;
  username?: string;
}

export interface PrivateChatContainerProps {
  onBack?: () => void;
  initialConversationId?: string;
  initialUserId?: string;
}

export const PrivateChatContainer: React.FC<PrivateChatContainerProps> = ({
  onBack,
  initialConversationId,
  initialUserId,
}) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'conversations' | 'chat' | 'new'>('conversations');
  const [activeConversation, setActiveConversation] = useState<ActiveConversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]); // Would be typed with Message interface in a real implementation

  useEffect(() => {
    if (user && initialConversationId && initialUserId) {
      handleSelectConversation(initialConversationId, initialUserId);
    } else {
      setIsLoading(false);
    }
  }, [user, initialConversationId, initialUserId]);

  const handleSelectConversation = async (conversationId: string, userId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch conversation details and messages from Supabase
      // For now, let's use demo data
      
      // Simulate fetching user details
      let username = "Unknown User";
      if (userId === "user1") username = "alex_tech";
      else if (userId === "user2") username = "sarah_design";
      else if (userId === "user3") username = "mike_dev";
      
      // Set active conversation
      setActiveConversation({
        id: conversationId,
        userId: userId,
        username: username
      });
      
      // Simulate fetching messages
      const mockMessages = [
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
          senderId: user?.id || '',
          timestamp: new Date(Date.now() - 4 * 60 * 1000),
          isRead: true
        },
        {
          id: "msg3",
          content: "Can you share your screen later to show me the progress?",
          senderId: userId,
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isRead: true
        },
        {
          id: "msg4",
          content: "Sure thing, I'll be available around 3pm",
          senderId: user?.id || '',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          isRead: true
        }
      ];
      
      setConversationMessages(mockMessages);
      setView('chat');
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConversation = async (userId: string, isEncrypted: boolean) => {
    setIsLoading(true);
    try {
      // In a real implementation, create a conversation in Supabase
      // For now, let's simulate it
      
      // Get username based on userId (mock data)
      let username = "Unknown User";
      if (userId === "user1") username = "alex_tech";
      else if (userId === "user2") username = "sarah_design";
      else if (userId === "user3") username = "mike_dev";
      else if (userId === "user4") username = "emma_newuser";
      else if (userId === "user5") username = "david_code";
      
      // Create a new conversation ID
      const newConversationId = `conv_${Date.now()}`;
      
      // Set as active conversation
      setActiveConversation({
        id: newConversationId,
        userId: userId,
        username: username
      });
      
      // Start with empty messages
      setConversationMessages([]);
      
      // Show encrypted chat indication if encryption is enabled
      if (isEncrypted) {
        toast({
          title: "Encrypted Chat",
          description: "This conversation is end-to-end encrypted",
          variant: "default",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (message: any) => {
    // In a real implementation, send message to Supabase
    // For now, let's just update the local state
    const newMessage = {
      id: `msg_${Date.now()}`,
      content: message.content,
      senderId: user?.id || '',
      timestamp: new Date(),
      isRead: false
    };
    
    setConversationMessages(prev => [...prev, newMessage]);
  };

  const handleMessageRead = (messageId: string) => {
    // In a real implementation, mark message as read in Supabase
    // For now, let's just update the local state
    setConversationMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
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
            currentUserId={user?.id || ''}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => setView('new')}
            activeConversationId={activeConversation?.id}
          />
        );
      case 'new':
        return (
          <NewConversation
            currentUserId={user?.id || ''}
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
            </div>
            <div className="flex-1 overflow-hidden">
              <PrivateChat
                currentUserId={user?.id || ''}
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