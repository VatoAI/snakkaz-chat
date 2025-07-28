
import { UserStatus } from "@/types/presence";

interface FilterUsersParams {
  users: Array<{id: string, username: string | null}>;
  userPresence: Record<string, { status: UserStatus }>;
  currentUserId: string | null;
  friends: string[];
  pendingRequests: string[];
  showAllUsers: boolean;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const filterUsers = ({
  users,
  userPresence,
  currentUserId,
  friends,
  pendingRequests,
  showAllUsers,
  userProfiles
}: FilterUsersParams) => {
  if (showAllUsers) {
    return users.map(user => {
      const isOnline = userPresence[user.id] !== undefined;
      const status = isOnline ? userPresence[user.id].status : null;
      const isFriend = friends.includes(user.id);
      const isPending = pendingRequests.includes(user.id);
      const displayName = userProfiles[user.id]?.username || user.username || user.id.substring(0, 8);
      
      return {
        id: user.id,
        username: displayName,
        status,
        isOnline,
        isFriend,
        isPending
      };
    });
  } else {
    return Object.entries(userPresence)
      .filter(([userId]) => userId !== currentUserId)
      .map(([userId, presence]) => {
        const isFriend = friends.includes(userId);
        const isPending = pendingRequests.includes(userId);
        const displayName = userProfiles[userId]?.username || 
                         users.find(u => u.id === userId)?.username || 
                         userId.substring(0, 8);
        
        return {
          id: userId,
          username: displayName,
          status: presence.status,
          isOnline: true,
          isFriend,
          isPending
        };
      });
  }
};
