import { ChatMessages } from "./global/ChatMessages";
import { ChatInput } from "./global/ChatInput";
import { ChatSidebar } from "./global/ChatSidebar";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight, ChevronLeft } from "lucide-react";

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
  recentConversations = []
}: ChatGlobalProps) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Ved endringer i isMobile, oppdater sidebar-visning
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Lukk sidebar automatisk når brukeren starter chat med noen på mobil
  const handleStartChat = (userId: string) => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    if (onStartChat) {
      onStartChat(userId);
    }
  };

  return (
    <div className="h-full flex relative">
      <div className={`flex-1 flex flex-col ${isMobile && isSidebarOpen ? 'hidden' : 'block'}`}>
        <ChatMessages
          messages={messages}
          onMessageExpired={onMessageExpired}
          currentUserId={currentUserId}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          userPresence={userPresence}
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

        {/* Mobil-knapp for å vise sidebar */}
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-cyberdark-900/80 text-cyberblue-400 p-1.5 rounded-l-lg border-y border-l border-cyberblue-500/30 shadow-glow-blue"
            style={{
              boxShadow: '0 0 10px rgba(26, 157, 255, 0.2)',
              zIndex: 10
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Sidebar med responsiv visning */}
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
          >
            <ChevronRight size={20} />
          </button>
        )}

        <ChatSidebar
          recentConversations={recentConversations}
          recentGroups={recentGroups}
          onStartChat={handleStartChat}
          userPresence={userPresence}
          currentUserId={currentUserId}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
