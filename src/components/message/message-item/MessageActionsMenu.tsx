
import { DecryptedMessage } from "@/types/message";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MessageActionsMenuProps {
  message: DecryptedMessage;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const MessageActionsMenu = ({ 
  message, 
  onEditMessage, 
  onDeleteMessage 
}: MessageActionsMenuProps) => {
  if (message.is_deleted) return null;

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-1">
      {onEditMessage && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-cyberdark-800/90 hover:bg-cyberdark-700/90 text-cybergold-400 shadow-neon-gold/10 backdrop-blur-sm"
                onClick={() => onEditMessage(message)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-cyberdark-900/95 border-cybergold-500/30 text-xs">
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
                className="h-7 w-7 bg-cyberdark-800/90 hover:bg-cyberred-900/90 text-cybergold-400 hover:text-cyberred-300 shadow-neon-red/10 backdrop-blur-sm"
                onClick={() => onDeleteMessage(message.id)}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-cyberdark-900/95 border-cybergold-500/30 text-xs">
              Slett melding
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
