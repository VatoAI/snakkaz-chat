
import { ReactNode } from "react";
import { DecryptedMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../../security/SecurityBadge";
import { UserAvatar } from "@/components/chat/header/UserAvatar";
import { MessageTimer } from "@/components/message/MessageTimer";
import { UserStatus } from "@/types/presence";

// Helper interface for bringing in metadata
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

  const bubbleClasses = cn(
    // Cyberpunk-theme bubble
    "relative group p-3 rounded-lg shadow-neon-blue shadow-lg border-2 border-cyberblue-400/30 hover:border-cyberred-500/40 transition-all duration-300",
    isCurrentUser
      ? "bg-gradient-to-br from-cyberblue-700 via-cybergold-500/10 to-cyberred-900 text-white rounded-br-none"
      : "bg-cyberdark-800/80 border-cybergold-500/20 text-cybergold-50 rounded-bl-none",
    isDeleted && "opacity-50"
  );

  // Show security badge always, label only on hover (for current user)
  const renderSecurityBadge = () => (
    <div className="ml-1">
      <SecurityBadge
        securityLevel={securityLevel}
        connectionState={undefined}
        dataChannelState={undefined}
        usingServerFallback={undefined}
        size="sm"
      />
    </div>
  );

  // Format date and time nicely
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = new Date(message.created_at).toLocaleDateString();

  // Build name fallback
  const username = message?.sender?.username || message?.sender?.full_name ||
    (message?.sender?.id ? message.sender.id.substring(0, 8) : "Ukjent");

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {/* Header row: Avatar, Username, Status, DateTime, E2EE */}
        {showMeta && message.sender && (
          <div className={cn(
            "flex items-center gap-2 mb-1",
            isCurrentUser ? "justify-end flex-row-reverse" : ""
          )}>
            {/* Avatar with initials and status ring */}
            <UserAvatar
              avatarUrl={message.sender.avatar_url}
              username={username}
              size={28}
              status={userStatus ?? "online"}
              className="shadow-neon-blue"
            />
            {/* Sender + time/status block */}
            <div className="flex flex-col text-xs items-start">
              <span className="font-semibold text-cyberblue-200">{username}</span>
              <div className="flex items-center gap-2 text-cyberdark-200 text-[11px]">
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
                {userStatus && (
                  <span className="ml-1 capitalize">{userStatus}</span>
                )}
              </div>
            </div>
            {/* Security badge */}
            <div className="ml-auto pr-1">{renderSecurityBadge()}</div>
          </div>
        )}

        {/* Message text & content */}
        <div className="mb-1">{children}</div>

        {/* Countdown timer */}
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
