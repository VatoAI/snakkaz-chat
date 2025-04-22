
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Circle, Clock, Loader2 } from "lucide-react";
import { UserStatus } from "@/types/presence";
import { cn } from "@/lib/utils";

// Sz: New avatar glass effect settings
const glassEffect = "backdrop-blur-md bg-cyberdark-800/50 border-cybergold-400/30"; // for overlay

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
    online: "bg-cyberblue-400",
    busy: "bg-cyberred-500",
    brb: "bg-cyberblue-200",
    offline: "bg-cyberdark-700"
  };

  const statusIcons = {
    online: Circle,
    busy: Clock,
    brb: Loader2,
    offline: Circle
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <Avatar
        className={cn(
          "relative border-4 border-cyberblue-400/80 shadow-neon-blue hover:border-cybergold-400 hover:shadow-neon-gold transition-all duration-200 bg-gradient-to-br from-cyberdark-800 via-cyberred-900/60 to-cybergold-400/50 overflow-hidden",
          className
        )}
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          // Render image 100% in back and initials on top with glass effect
          <>
            <AvatarImage
              src={avatarUrl}
              alt={username || "SnakkaZ"}
              className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px] scale-105"
            />
            <div className={cn(
              "relative flex items-center justify-center h-full w-full z-10 pointer-events-none"
            )}>
              <span
                className={cn(
                  "text-cybergold-100 text-lg font-bold",
                  "drop-shadow-[0_0_10px_rgba(26,157,255,0.3)]",
                  glassEffect
                )}
                style={{
                  fontSize: Math.round(size * 0.48)
                }}
              >
                {initials}
              </span>
            </div>
          </>
        ) : (
          <AvatarFallback className="bg-cyberdark-800 text-cybergold-300">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className={cn(
        "absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 border-cyberdark-950",
        statusColors[status]
      )}>
        <StatusIcon className="w-3 h-3 text-cybergold-200" />
      </div>
    </div>
  );
}
