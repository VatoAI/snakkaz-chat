
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: number;
}

export function UserAvatar({ avatarUrl, username = "", size = 48 }: UserAvatarProps) {
  const initials = username ? username.slice(0,2).toUpperCase() : "SZ";
  return (
    <Avatar className={`h-[${size}px] w-[${size}px] border-2 border-cybergold-500/30 shadow-neon-gold`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={username || "SnakkaZ"} />
      ) : (
        <AvatarFallback className="bg-cyberdark-800 text-cybergold-300 text-xl">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
