
import { ReactNode } from "react";
import { DecryptedMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../../security/SecurityBadge";

interface MessageContainerProps {
  children: ReactNode;
  isCurrentUser: boolean;
  isDeleted: boolean;
  message: DecryptedMessage;
  onMessageExpired?: (messageId: string) => void;
  securityLevel?: SecurityLevel;
}

export const MessageContainer = ({
  children,
  isCurrentUser,
  isDeleted,
  message,
  onMessageExpired,
  securityLevel = 'server_e2ee'
}: MessageContainerProps) => {
  const containerClasses = cn(
    "relative flex w-full max-w-[85%] mb-2",
    isCurrentUser ? "ml-auto" : "mr-auto"
  );

  const bubbleClasses = cn(
    "relative group p-3 rounded-lg",
    isCurrentUser
      ? "bg-cybergold-500/20 text-white rounded-br-none"
      : "bg-cyberdark-800 border border-cybergold-500/20 text-white rounded-bl-none",
    isDeleted && "opacity-50"
  );
  
  const renderSecurityBadge = () => {
    if (!isCurrentUser) return null;
    
    return (
      <div className="absolute bottom-1 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
        <SecurityBadge
          securityLevel={securityLevel}
          showLabel={false}
          size="sm"
          className="h-4"
        />
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {children}
        {renderSecurityBadge()}
      </div>
    </div>
  );
};
