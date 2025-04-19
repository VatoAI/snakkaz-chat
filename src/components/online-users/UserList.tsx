
import { UserListHeader } from "./UserListHeader";
import { UserListContent } from "./UserListContent";
import { useUserList } from "./hooks/useUserList";

interface UserListProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  friends: string[];
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const UserList = ({
  userPresence,
  currentUserId,
  friends,
  onSendFriendRequest,
  onStartChat,
  userProfiles = {}
}: UserListProps) => {
  const {
    showAllUsers,
    setShowAllUsers,
    isLoading,
    usersToDisplay,
    onlineCount
  } = useUserList({
    userPresence,
    currentUserId,
    friends,
    userProfiles
  });

  const toggleShowAllUsers = () => {
    setShowAllUsers(!showAllUsers);
  };

  return (
    <div className="relative">
      <UserListHeader 
        showAllUsers={showAllUsers}
        isLoading={isLoading}
        onlineCount={onlineCount}
        toggleShowAllUsers={toggleShowAllUsers}
      />
      
      <div className="max-h-[200px] overflow-y-auto pr-1">
        <UserListContent 
          isLoading={isLoading}
          usersToDisplay={usersToDisplay}
          onSendFriendRequest={onSendFriendRequest}
          onStartChat={onStartChat}
        />
      </div>
    </div>
  );
};
