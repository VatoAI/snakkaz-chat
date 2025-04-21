
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: number;
}

export function UserAvatar({ avatarUrl, username = "", size = 48 }: UserAvatarProps) {
  const initials = username ? username.slice(0,2).toUpperCase() : "SZ";
  return (
    <Avatar className={`border-2 border-cybergold-500/50 shadow-neon-gold`} style={{ width: size, height: size }}>
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
