import { RecentChats } from "@/components/chat/recent/RecentChats";

interface RecentChatsSectionProps {
  recentConversations: { userId: string; username: string; unreadCount: number; lastActive: string }[];
  recentGroups: { id: string; name: string; unreadCount: number; lastActive: string }[];
  onStartChat: ((userId: string) => void) | undefined;
  isMobile?: boolean;
}

export const RecentChatsSection = ({
  recentConversations,
  recentGroups,
  onStartChat,
  isMobile = false
}: RecentChatsSectionProps) => {
  if (recentConversations.length === 0 && recentGroups.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${isMobile ? 'pb-2' : ''}`}>
      <RecentChats
        recentConversations={recentConversations}
        recentGroups={recentGroups}
        onStartChat={onStartChat}
      />
    </div>
  );
};
