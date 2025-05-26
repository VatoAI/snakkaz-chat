import { RecentChatsSection } from "./RecentChatsSection";
import { OnlineUsersSection } from "./OnlineUsersSection";
import { UserPresence } from "@/types/presence";

interface ChatSidebarProps {
  recentConversations: { userId: string; username: string; unreadCount: number; lastActive: string }[];
  recentGroups: { id: string; name: string; unreadCount: number; lastActive: string }[];
  onStartChat: (userId: string) => void;
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  isMobile?: boolean;
}

export const ChatSidebar = ({
  recentConversations,
  recentGroups,
  onStartChat,
  userPresence,
  currentUserId,
  isMobile = false
}: ChatSidebarProps) => {
  return (
    <div
      className={`
        ${isMobile ? 'w-full' : 'w-64 hidden lg:flex'} 
        border-l border-cybergold-500/30 p-4 flex-col bg-cyberdark-950/95 backdrop-blur-xl
        ${isMobile ? 'flex h-full overflow-y-auto' : 'hidden lg:flex'}
      `}
      style={{
        boxShadow: isMobile ? 'inset 3px 0 10px rgba(0, 0, 0, 0.2)' : 'none'
      }}
    >
      <h2 className="text-lg font-bold text-cybergold-400 mb-4">
        {isMobile ? 'Chats & Kontakter' : 'Aktive Samtaler'}
      </h2>

      <RecentChatsSection
        recentConversations={recentConversations}
        recentGroups={recentGroups}
        onStartChat={onStartChat}
        isMobile={isMobile}
      />

      <OnlineUsersSection
        userPresence={userPresence}
        currentUserId={currentUserId}
        onStartChat={onStartChat}
        isMobile={isMobile}
      />
    </div>
  );
};
