
import { UserItem } from "./UserItem";
import { Skeleton } from "@/components/ui/skeleton";
import { UserStatus } from "@/types/presence";

interface UserListContentProps {
  isLoading: boolean;
  usersToDisplay: Array<{
    id: string;
    username: string;
    status: UserStatus | null;
    isOnline: boolean;
    isFriend: boolean;
    isPending?: boolean;
    isAdmin?: boolean;
  }>;
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
  currentUserIsAdmin?: boolean;
}

export const UserListContent = ({
  isLoading,
  usersToDisplay,
  onSendFriendRequest,
  onStartChat,
  currentUserIsAdmin = false
}: UserListContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-12 w-full bg-cyberdark-800" />
        ))}
      </div>
    );
  }

  if (usersToDisplay.length === 0) {
    return (
      <div className="text-center text-cybergold-500 py-4">
        <p>Ingen brukere funnet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {usersToDisplay.map((user) => (
        <UserItem
          key={user.id}
          {...user}
          onSendFriendRequest={onSendFriendRequest}
          onStartChat={onStartChat}
          currentUserIsAdmin={currentUserIsAdmin}
        />
      ))}
    </div>
  );
};
