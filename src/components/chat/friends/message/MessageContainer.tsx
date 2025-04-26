
import { ReactNode } from "react";
import { DecryptedMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../../security/SecurityBadge";
import { UserAvatar } from "@/components/chat/header/UserAvatar";
import { MessageTimer } from "@/components/message/MessageTimer";
import { UserStatus } from "@/types/presence";
import { statusColors, securityColors } from "@/constants/colors";

interface MessageContainerProps {
  children: ReactNode;
  isCurrentUser: boolean;
  isDeleted: boolean;
  message: DecryptedMessage;
  onMessageExpired?: (messageId: string) => void;
  securityLevel?: SecurityLevel;
  showMeta?: boolean;
  userStatus?: UserStatus;
  showTimer?: boolean;
}

export const MessageContainer = ({
  children,
  isCurrentUser,
  isDeleted,
  message,
  onMessageExpired,
  securityLevel = 'server_e2ee',
  showMeta = true,
  userStatus,
  showTimer = true,
}: MessageContainerProps) => {
  const containerClasses = cn(
    "relative flex w-full max-w-[85%] mb-2",
    isCurrentUser ? "ml-auto" : "mr-auto"
  );

  const secColor = securityColors[securityLevel];
  const statusColor = userStatus ? statusColors[userStatus] : null;

  const bubbleClasses = cn(
    "relative group p-3 rounded-lg transition-all duration-300",
    secColor.glow,
    `border-2 ${secColor.border}/30`,
    isCurrentUser
      ? "bg-gradient-to-br from-cyberdark-800 via-cyberdark-900 to-cyberdark-950 text-white rounded-br-none"
      : "bg-cyberdark-800/80 text-white rounded-bl-none",
    isDeleted && "opacity-50"
  );

  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = new Date(message.created_at).toLocaleDateString();

  const username = message?.sender?.username || message?.sender?.full_name ||
    (message?.sender?.id ? message.sender.id.substring(0, 8) : "Ukjent");

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {showMeta && message.sender && (
          <div className={cn(
            "flex items-center gap-2 mb-1",
            isCurrentUser ? "justify-end flex-row-reverse" : ""
          )}>
            <UserAvatar
              avatarUrl={message.sender.avatar_url}
              username={username}
              size={28}
              status={userStatus ?? "online"}
              className={userStatus ? statusColors[userStatus].glow : undefined}
            />
            <div className="flex flex-col text-xs items-start">
              <span className={cn("font-semibold", secColor.primary)}>{username}</span>
              <div className="flex items-center gap-2 text-cyberdark-200 text-[11px]">
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
                {userStatus && (
                  <span className={cn("ml-1 capitalize", statusColors[userStatus].primary)}>
                    {userStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto pr-1">
              <SecurityBadge
                securityLevel={securityLevel}
                size="sm"
              />
            </div>
          </div>
        )}

        <div className="mb-1">{children}</div>

        {showTimer && !message.is_deleted && (
          <div className="flex mt-1">
            <MessageTimer
              message={message}
              onExpired={onMessageExpired}
            />
          </div>
        )}
      </div>
    </div>
  );
};
