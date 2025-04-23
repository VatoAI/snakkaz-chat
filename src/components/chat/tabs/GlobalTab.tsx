
import { ChatGlobal } from '@/components/chat/ChatGlobal';
import { DecryptedMessage } from '@/types/message';
import { UserPresence } from '@/types/presence';

interface GlobalTabProps {
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
  directMessages: DecryptedMessage[];
  onStartChat?: (userId: string) => void;
  recentConversations?: { userId: string; username: string; unreadCount: number; lastActive: string }[];
  recentGroups?: { id: string; name: string; unreadCount: number; lastActive: string }[];
}

export const GlobalTab = ({
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
  directMessages,
  onStartChat,
  recentConversations = [],
  recentGroups = []
}: GlobalTabProps) => {
  return (
    <ChatGlobal 
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      isLoading={isLoading}
      ttl={ttl}
      setTtl={setTtl}
      onMessageExpired={onMessageExpired}
      onSubmit={onSubmit}
      currentUserId={currentUserId}
      editingMessage={editingMessage}
      onEditMessage={onEditMessage}
      onCancelEdit={onCancelEdit}
      onDeleteMessage={onDeleteMessage}
      userPresence={userPresence}
      directMessages={directMessages}
      onStartChat={onStartChat}
      recentConversations={recentConversations}
      recentGroups={recentGroups}
    />
  );
};
