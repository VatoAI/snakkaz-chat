
import { Users } from "lucide-react";
import { UserPresence } from "@/types/presence";

interface OnlineUsersProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
}

export const OnlineUsers = ({ userPresence, currentUserId }: OnlineUsersProps) => {
  const onlineCount = Object.keys(userPresence).length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-cybergold-400" />
        <span className="text-cybergold-200">{onlineCount} pålogget</span>
      </div>
      
      <div className="space-y-2">
        {Object.entries(userPresence).map(([userId, presence]) => (
          <div 
            key={userId}
            className={`flex items-center gap-2 ${userId === currentUserId ? 'text-cybergold-400' : 'text-white'}`}
          >
            <div className={`w-2 h-2 rounded-full ${
              presence.status === 'online' ? 'bg-green-500' :
              presence.status === 'busy' ? 'bg-red-500' :
              presence.status === 'brb' ? 'bg-yellow-500' :
              'bg-gray-500'
            }`} />
            <span className="text-sm">
              {userId === currentUserId ? 'Du' : userId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
