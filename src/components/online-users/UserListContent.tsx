
import { UserItem } from "./UserItem";

interface UserListContentProps {
  isLoading: boolean;
  usersToDisplay: Array<{
    id: string;
    username: string;
    status: any;
    isOnline: boolean;
    isFriend: boolean;
    isPending: boolean;
  }>;
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
}

export const UserListContent = ({
  isLoading,
  usersToDisplay,
  onSendFriendRequest,
  onStartChat
}: UserListContentProps) => {
  if (usersToDisplay.length === 0) {
    return (
      <div className="text-center text-cybergold-500 py-2 text-sm">
        {isLoading ? 
          "Laster brukere..." : 
          "Ingen brukere funnet"}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {usersToDisplay.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          username={user.username}
          isOnline={user.isOnline}
          status={user.status}
          isFriend={user.isFriend}
          isPending={user.isPending}
          onSendFriendRequest={onSendFriendRequest}
          onStartChat={onStartChat}
        />
      ))}
    </div>
  );
};
