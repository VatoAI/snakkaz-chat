
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
  );
};
