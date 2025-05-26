
import { DecryptedMessage } from "@/types/message";
import { Check, CheckCheck, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserStatus } from "@/types/presence";
import { StatusIcon } from "@/components/online-users/StatusIcons";
import { cn } from "@/lib/utils";

interface MessageMetadataProps {
  message: DecryptedMessage;
  isMessageRead?: (messageId: string) => boolean;
  isCurrentUser: boolean;
  usingServerFallback: boolean;
  userStatus?: UserStatus;
}

export const MessageMetadata = ({ 
  message, 
  isMessageRead, 
  isCurrentUser,
  usingServerFallback,
  userStatus
}: MessageMetadataProps) => {
  if (!message || !message.sender) {
    // Return empty metadata instead of null to maintain component structure
    return <div className="h-5"></div>;
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5">
        {userStatus && (
          <StatusIcon status={userStatus} size={3} />
        )}
        <span className="font-medium opacity-90">
          {message.sender.username || message.sender.id.substring(0, 8)}
        </span>
      </div>

      <span className="opacity-80">•</span>
      <span className="opacity-80">
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>

      {message.is_edited && !message.is_deleted && (
        <>
          <span className="opacity-80">•</span>
          <span className="opacity-70">(redigert)</span>
        </>
      )}

      <div className="flex items-center gap-1 ml-auto">
        {(message.is_encrypted || usingServerFallback) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Lock className="h-3 w-3 text-green-500" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="text-xs bg-cyberdark-900/95 border-cybergold-500/30">
                Ende-til-ende kryptert
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {isCurrentUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {isMessageRead && isMessageRead(message.id) ? (
                    <CheckCheck className="h-3 w-3 text-cybergold-400" />
                  ) : message.is_delivered ? (
                    <Check className="h-3 w-3 text-cyberdark-400" />
                  ) : (
                    <div className="h-3 w-3 flex items-center justify-center">
                      <svg viewBox="0 0 10 10" className="text-cyberdark-400 w-2.5 h-2.5">
                        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" fill="none"/>
                      </svg>
                    </div>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="text-xs bg-cyberdark-900/95 border-cybergold-500/30">
                {isMessageRead && isMessageRead(message.id) ? 'Lest' : 
                 message.is_delivered ? 'Levert' : 'Sendt'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
