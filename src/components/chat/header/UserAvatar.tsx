
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Circle, Clock, Loader2 } from "lucide-react";
import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: number;
  status?: UserStatus;
  className?: string;
}

export function UserAvatar({ 
  avatarUrl, 
  username = "", 
  size = 32,
  status = "online",
  className
}: UserAvatarProps) {
  const initials = username ? username.slice(0,2).toUpperCase() : "SZ";
  
  const statusColors = {
    online: "bg-green-500",
    busy: "bg-yellow-500",
    brb: "bg-blue-500",
    offline: "bg-gray-500"
  };

  const statusIcons = {
    online: Circle,
    busy: Clock,
    brb: Loader2,
    offline: Circle
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="relative">
      <Avatar 
        className={cn(
          "border-2 border-cybergold-500/50 shadow-neon-gold",
          className
        )} 
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={username || "SnakkaZ"} />
        ) : (
          <AvatarFallback className="bg-cyberdark-800 text-cybergold-300">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className={cn(
        "absolute -bottom-1 -right-1 rounded-full p-0.5 bg-cyberdark-900",
        statusColors[status]
      )}>
        <StatusIcon className="w-2.5 h-2.5 text-white" />
      </div>
    </div>
  );
}
