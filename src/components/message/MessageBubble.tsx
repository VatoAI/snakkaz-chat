
import { DecryptedMessage } from "@/types/message";
import { MessageContent } from "./MessageContent";
import { MessageActions } from "./MessageActions";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  messageIndex: number;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
}

export const MessageBubble = ({ 
  message, 
  isCurrentUser, 
  messageIndex,
  onMessageExpired,
  onEdit,
  onDelete
}: MessageBubbleProps) => {
  const ttlIsFixed = true;
  const isAutoDelete = message.ephemeral_ttl ? true : false;

  return (
    <div 
      className={`group relative flex mb-1 ${messageIndex === 0 ? '' : 'mt-1'}`}
    >
      <div 
        className={`
          relative py-2 px-3 rounded-md max-w-full break-words 
          ${isCurrentUser 
            ? 'bg-gradient-to-r from-cyberblue-900/90 to-cyberblue-800/80 text-white border border-cyberblue-500/20 shadow-neon-blue' 
            : 'bg-gradient-to-r from-cyberdark-800/90 to-cyberdark-700/80 text-cyberblue-100 border border-cyberred-500/20 shadow-neon-red'
          }
          backdrop-blur-sm transition-all duration-300 hover:shadow-neon-dual
        `}
      >
        <MessageContent message={message} onMessageExpired={onMessageExpired} />
        
        {ttlIsFixed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center text-[10px] text-cyberdark-400 mt-1 ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  24t
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="text-xs bg-cyberdark-900 border-cybergold-500/30">
                Slettes automatisk etter 24 timer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {isCurrentUser && (
        <div className="self-start ml-1">
          <MessageActions 
            message={message} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>
      )}
    </div>
  );
};
