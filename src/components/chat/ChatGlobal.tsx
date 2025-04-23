
import { ChatMessages } from "./global/ChatMessages";
import { ChatInput } from "./global/ChatInput";
import { ChatSidebar } from "./global/ChatSidebar";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";

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
  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
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
      </div>
      
      <ChatSidebar 
        recentConversations={recentConversations}
        recentGroups={recentGroups}
        onStartChat={onStartChat}
        userPresence={userPresence}
        currentUserId={currentUserId}
      />
    </div>
  );
};
