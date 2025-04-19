
import { DecryptedMessage } from "@/types/message";
import { Check, CheckCheck, Lock, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageItemProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const MessageItem = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage
}: MessageItemProps) => {
  const isDeleted = message.is_deleted;

  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="group relative">
        <div 
          className={`
            max-w-[80%] p-3 rounded-lg border transition-all duration-300
            ${isCurrentUser 
              ? 'bg-gradient-to-r from-cyberblue-900/90 via-cyberblue-800/80 to-cyberblue-900/90 border-cyberblue-500/20 text-cyberblue-100 shadow-neon-blue hover:shadow-neon-dual' 
              : 'bg-gradient-to-r from-cyberdark-800/90 via-cyberdark-700/80 to-cyberdark-800/90 border-cyberred-500/20 text-cybergold-200 shadow-neon-red hover:shadow-neon-dual'
            } 
            ${isDeleted ? 'opacity-50 italic' : ''}
            backdrop-blur-sm
          `}
        >
          <p>{isDeleted ? "Denne meldingen er slettet" : message.content}</p>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs opacity-70">
              {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            
            {message.is_edited && !isDeleted && (
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
            
            {/* Enhanced read receipts */}
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
        </div>
        
        {/* Message action buttons for current user's messages */}
        {isCurrentUser && !isDeleted && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            {onEditMessage && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-cyberdark-800/80 hover:bg-cyberdark-700 text-cybergold-400"
                      onClick={() => onEditMessage(message)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-cyberdark-900 border-cybergold-500/30">
                    Rediger melding
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onDeleteMessage && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-cyberdark-800/80 hover:bg-red-900/80 text-cybergold-400 hover:text-red-300"
                      onClick={() => onDeleteMessage(message.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-cyberdark-900 border-cybergold-500/30">
                    Slett melding
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
