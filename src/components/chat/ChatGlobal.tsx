
import { MessageList } from "@/components/message-list/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { OnlineUsers } from "@/components/online-users/OnlineUsers";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { RecentChats } from "@/components/chat/recent/RecentChats";

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
        <div className="flex-1 overflow-hidden">
          <MessageList 
            messages={messages} 
            onMessageExpired={onMessageExpired}
            currentUserId={currentUserId}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            userPresence={userPresence}
          />
        </div>

        <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
          <MessageInput
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
      </div>
      
      <div className="w-64 border-l border-cybergold-500/30 p-4 hidden lg:flex flex-col">
        {/* Recent activity section at the top */}
        {(recentConversations.length > 0 || recentGroups.length > 0) && (
          <div className="mb-6">
            <RecentChats 
              recentConversations={recentConversations}
              recentGroups={recentGroups}
              onStartChat={onStartChat}
            />
          </div>
        )}
        
        {/* Online users section */}
        <OnlineUsers
          userPresence={userPresence}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
};
