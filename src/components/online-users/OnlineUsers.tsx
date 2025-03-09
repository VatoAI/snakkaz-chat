
import React from "react";
import { Users } from "lucide-react";
import { UserPresence, UserStatus } from "@/types/presence";
import { StatusDropdown } from "./StatusDropdown";
import { VisibilityToggle } from "./VisibilityToggle";
import { UserList } from "./UserList";

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
  const onlineCount = Object.keys(userPresence).length;
  
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
