
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: number;
  status?: "online" | "busy" | "brb" | "offline";
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
      <span 
        className={cn(
          "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-cyberdark-900",
          statusColors[status]
        )}
      />
    </div>
  );
}
