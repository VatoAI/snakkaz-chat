
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { DecryptedMessage } from "@/types/message";

interface MessageActionsProps {
  message: DecryptedMessage;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
}

export const MessageActions = ({ message, onEdit, onDelete }: MessageActionsProps) => {
  if (message.is_deleted) return null;

  const isEditingDisabled = false;
  const isDeletionDisabled = false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-cyberdark-400 hover:text-cyberdark-300 hover:bg-cyberdark-800/50"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-cyberdark-800/90 backdrop-blur-sm border-cybergold-500/30">
        <DropdownMenuLabel className="text-xs text-cyberdark-400">
          Meldinger slettes automatisk etter 24 timer
        </DropdownMenuLabel>
        <>
          {!isEditingDisabled && (
            <DropdownMenuItem 
              className="text-cybergold-300 cursor-pointer flex items-center hover:text-cybergold-200 hover:bg-cyberdark-700/50"
              onClick={() => onEdit(message)}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Rediger</span>
            </DropdownMenuItem>
          )}
          {!isDeletionDisabled && (
            <DropdownMenuItem 
              className="text-cyberred-400 cursor-pointer flex items-center hover:text-cyberred-300 hover:bg-cyberdark-700/50"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Slett</span>
            </DropdownMenuItem>
          )}
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
