
import { OnlineUsers } from "@/components/online-users/OnlineUsers";
import { UserPresence } from "@/types/presence";

interface OnlineUsersSectionProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  onStartChat?: (userId: string) => void;
}

export const OnlineUsersSection = ({
  userPresence,
  currentUserId,
  onStartChat
}: OnlineUsersSectionProps) => {
  return (
    <OnlineUsers
      userPresence={userPresence}
      currentUserId={currentUserId}
      onStartChat={onStartChat}
    />
  );
};
