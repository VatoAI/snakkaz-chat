
import { RecentChatsSection } from "./RecentChatsSection";
import { OnlineUsersSection } from "./OnlineUsersSection";
import { UserPresence } from "@/types/presence";

interface ChatSidebarProps {
  recentConversations: { userId: string; username: string; unreadCount: number; lastActive: string }[];
  recentGroups: { id: string; name: string; unreadCount: number; lastActive: string }[];
  onStartChat: (userId: string) => void;
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
}

export const ChatSidebar = ({
  recentConversations,
  recentGroups,
  onStartChat,
  userPresence,
  currentUserId
}: ChatSidebarProps) => {
  return (
    <div className="w-64 border-l border-cybergold-500/30 p-4 hidden lg:flex flex-col">
      <RecentChatsSection 
        recentConversations={recentConversations}
        recentGroups={recentGroups}
        onStartChat={onStartChat}
      />
      <OnlineUsersSection
        userPresence={userPresence}
        currentUserId={currentUserId}
        onStartChat={onStartChat}
      />
    </div>
  );
};
