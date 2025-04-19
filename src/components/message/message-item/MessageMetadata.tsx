
import { DecryptedMessage } from "@/types/message";
import { Check, CheckCheck, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageMetadataProps {
  message: DecryptedMessage;
  isMessageRead?: (messageId: string) => boolean;
  isCurrentUser: boolean;
  usingServerFallback: boolean;
}

export const MessageMetadata = ({ 
  message, 
  isMessageRead, 
  isCurrentUser,
  usingServerFallback 
}: MessageMetadataProps) => {
  return (
    <div className="flex items-center gap-1 mt-1">
      <p className="text-xs opacity-70">
        {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </p>
      
      {message.is_edited && !message.is_deleted && (
        <span className="text-xs opacity-70 ml-1">(redigert)</span>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs opacity-70">
              {message.is_encrypted || usingServerFallback ? <Lock className="h-3 w-3 text-green-500" /> : null}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-xs bg-cyberdark-900 border-cybergold-500/30">
            Ende-til-ende kryptert
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isCurrentUser && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs ml-1">
                {isMessageRead && isMessageRead(message.id) ? (
                  <CheckCheck className="h-3 w-3 text-cybergold-400" />
                ) : message.is_delivered ? (
                  <Check className="h-3 w-3 text-cyberdark-400" />
                ) : (
                  <span className="h-3 w-3 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-cyberdark-400">
                      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                  </span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="text-xs bg-cyberdark-900 border-cybergold-500/30">
              {isMessageRead && isMessageRead(message.id) ? 'Lest' : 
               message.is_delivered ? 'Levert' : 'Sendt'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
