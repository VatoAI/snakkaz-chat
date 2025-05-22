import { ChatMessages } from "./global/ChatMessages";
import { ChatInput } from "./global/ChatInput";
import { ChatSidebar } from "./global/ChatSidebar";
import { DecryptedMessage } from "@/types/message.d";
import { UserPresence } from "@/types/presence";
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { playSound } from "@/utils/notification-sound";

interface ChatGlobalProps {
  messages: DecryptedMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  onMessageExpired: (messageId: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentUserId: string | null;
  editingMessage: { id: string; content: string } | null;
  onEditMessage: (message: { id: string; content: string }) => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence: Record<string, UserPresence>;
  directMessages?: DecryptedMessage[];
  onStartChat?: (userId: string) => void;
  recentGroups?: { id: string; name: string; unreadCount: number; lastActive: string }[];
  recentConversations?: { userId: string; username: string; unreadCount: number; lastActive: string }[];
  onNewMessage?: (message: DecryptedMessage) => void;

  // Pagination props
  loadMoreMessages?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
}

export const ChatGlobal = ({
  messages,
  newMessage,
  setNewMessage,
  isLoading,
  ttl,
  setTtl,
  onMessageExpired,
  onSubmit,
  currentUserId,
  editingMessage,
  onEditMessage,
  onCancelEdit,
  onDeleteMessage,
  userPresence,
  directMessages = [],
  onStartChat,
  recentGroups = [],
  recentConversations = [],
  onNewMessage,

  // Pagination props
  loadMoreMessages,
  hasMoreMessages = false,
  isLoadingMoreMessages = false
}: ChatGlobalProps) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [realtimeConversations, setRealtimeConversations] = useState(recentConversations);
  const [realtimeGroups, setRealtimeGroups] = useState(recentGroups);

  // Update sidebar visibility on mobile/desktop switch
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Auto-close sidebar when selecting chat on mobile
  const handleStartChat = (userId: string) => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    if (onStartChat) {
      onStartChat(userId);
    }
  };

  // Set up realtime subscription for conversations
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('global-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message detected', payload);
          
          // Update conversations in real-time
          if (payload.new) {
            const newMessage = payload.new;
            
            // Process the new message
            if (typeof onNewMessage === 'function') {
              onNewMessage(newMessage as DecryptedMessage);
              
              // Play notification sound if message is from someone else
              if (newMessage.sender_id !== currentUserId) {
                playSound('message-received');
              }
            }
            
            // Update conversations list
            setRealtimeConversations(prev => {
              const updated = [...prev];
              const senderUserId = newMessage.sender_id || newMessage.user_id;
              const isFromCurrentUser = senderUserId === currentUserId;
              
              // Find existing conversation
              const existingIndex = updated.findIndex(c => 
                c.userId === senderUserId || 
                (isFromCurrentUser && newMessage.recipient_id === c.userId)
              );
              
              if (existingIndex >= 0) {
                // Update existing conversation
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  lastActive: new Date().toISOString(),
                  unreadCount: isFromCurrentUser ? 0 : updated[existingIndex].unreadCount + 1
                };
                
                // Move to the top
                if (existingIndex > 0) {
                  const [conversation] = updated.splice(existingIndex, 1);
                  updated.unshift(conversation);
                }
              } else if (!isFromCurrentUser || newMessage.recipient_id) {
                // Add new conversation
                const otherUserId = isFromCurrentUser ? newMessage.recipient_id : senderUserId;
                if (otherUserId) {
                  updated.unshift({
                    userId: otherUserId,
                    username: otherUserId, // Will be updated later with full user info
                    unreadCount: isFromCurrentUser ? 0 : 1,
                    lastActive: new Date().toISOString()
                  });
                }
              }
              
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, onNewMessage]);

  // Update conversations when prop changes
  useEffect(() => {
    setRealtimeConversations(recentConversations);
  }, [recentConversations]);

  // Update groups when prop changes
  useEffect(() => {
    setRealtimeGroups(recentGroups);
  }, [recentGroups]);

  // Handle for new messages if provided
  const handleOnNewMessage = (message: DecryptedMessage) => {
    if (typeof onNewMessage === 'function') {
      onNewMessage(message);
    }
  };

  return (
    <div className="h-full flex relative">
      {/* Main chat area */}
      <div className={`flex-1 flex flex-col ${isMobile && isSidebarOpen ? 'hidden' : 'block'}`}>
        <ChatMessages
          messages={messages}
          onMessageExpired={onMessageExpired}
          currentUserId={currentUserId}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          userPresence={userPresence}
          loadMoreMessages={loadMoreMessages}
          hasMoreMessages={hasMoreMessages}
          isLoadingMoreMessages={isLoadingMoreMessages}
        />

        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSubmit={onSubmit}
          isLoading={isLoading}
          ttl={ttl}
          setTtl={setTtl}
          editingMessage={editingMessage}
          onCancelEdit={onCancelEdit}
        />

        {/* Mobile button to show sidebar */}
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-cyberdark-900/80 text-cyberblue-400 p-1.5 rounded-l-lg border-y border-l border-cyberblue-500/30 shadow-glow-blue"
            style={{
              boxShadow: '0 0 10px rgba(26, 157, 255, 0.2)',
              zIndex: 10
            }}
            aria-label="Show sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Sidebar with responsive behavior */}
      <div
        className={`
          ${isMobile ? 'absolute right-0 top-0 bottom-0 z-20 w-3/4 shadow-lg' : 'relative'} 
          ${isSidebarOpen ? 'flex' : 'hidden'}
          transition-all duration-300
        `}
        style={{
          boxShadow: isMobile ? '-4px 0 15px rgba(0, 0, 0, 0.3)' : 'none',
          maxWidth: isMobile ? '280px' : '320px'
        }}
      >
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-cyberdark-900/80 text-cyberblue-400 p-1.5 rounded-l-lg border-y border-l border-cyberblue-500/30 shadow-glow-blue"
            style={{
              boxShadow: '0 0 10px rgba(26, 157, 255, 0.2)',
              zIndex: 10
            }}
            aria-label="Hide sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <ChatSidebar
          recentConversations={realtimeConversations}
          recentGroups={realtimeGroups}
          onStartChat={handleStartChat}
          userPresence={userPresence}
          currentUserId={currentUserId}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
