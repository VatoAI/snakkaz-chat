import React from "react";
import { Users } from "lucide-react";
import { UserPresence, UserStatus } from "@/types/presence";
import { StatusDropdown } from "./StatusDropdown";
import { VisibilityToggle } from "./VisibilityToggle";
import { UserList } from "./UserList";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface OnlineUsersProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  onStatusChange: (status: UserStatus) => void;
  currentStatus: UserStatus;
  onSendFriendRequest: (userId: string) => void;
  onStartChat: (userId: string) => void;
  friends: string[];
  hidden: boolean;
  onToggleHidden: () => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const OnlineUsers = ({ 
  userPresence, 
  currentUserId,
  onStatusChange,
  currentStatus,
  onSendFriendRequest,
  onStartChat,
  friends,
  hidden,
  onToggleHidden,
  userProfiles = {}
}: OnlineUsersProps) => {
  const { isAdmin } = useUserRole(currentUserId);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { toast } = useToast();
  
  const onlineCount = Object.keys(userPresence).length;
  
  const usersToDisplay = Object.entries(userPresence)
    .filter(([userId]) => userId !== currentUserId)
    .map(([userId, presence]) => {
      const isFriend = friends.includes(userId);
      const displayName = userProfiles[userId]?.username || userId.substring(0, 8);
      
      return {
        id: userId,
        username: displayName,
        status: presence.status,
        isOnline: true,
        isFriend
      };
    });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cybergold-400" />
          <span className="text-cybergold-200">{onlineCount} pålogget</span>
        </div>

        <div className="flex gap-2">
          <VisibilityToggle 
            hidden={hidden} 
            onToggleHidden={onToggleHidden} 
          />
          <StatusDropdown 
            currentStatus={currentStatus} 
            onStatusChange={onStatusChange} 
          />
        </div>
      </div>

      <UserList 
        userPresence={userPresence}
        currentUserId={currentUserId}
        friends={friends}
        onSendFriendRequest={onSendFriendRequest}
        onStartChat={onStartChat}
        userProfiles={userProfiles}
      />
    </div>
  );
};
