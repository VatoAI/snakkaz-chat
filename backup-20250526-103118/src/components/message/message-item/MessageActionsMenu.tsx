
import { useCallback, useState } from "react";
import { Edit, Trash2, MoreVertical, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DecryptedMessage } from "@/types/message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageActionsMenuProps {
  message: DecryptedMessage;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  position?: "top-right" | "bottom-right";
}

export const MessageActionsMenu = ({
  message,
  onEditMessage,
  onDeleteMessage,
  position = "top-right"
}: MessageActionsMenuProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Check if message is older than 24 hours
  const isOld = new Date(message.created_at).getTime() + (24 * 60 * 60 * 1000) < Date.now();
  
  // Format time remaining until auto-deletion
  const formatTimeRemaining = useCallback(() => {
    const createdAt = new Date(message.created_at).getTime();
    const ttl = message.ephemeral_ttl || 86400; // Default to 24 hours
    const expiresAt = createdAt + (ttl * 1000);
    const remainingMs = expiresAt - Date.now();
    
    if (remainingMs <= 0) return "Expiring soon";
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  }, [message.created_at, message.ephemeral_ttl]);

  if (message.is_deleted) return null;

  const handleDeleteClick = () => {
    if (isOld) {
      // Show confirmation dialog for old messages
      setIsDeleteDialogOpen(true);
    } else {
      // Delete directly for recent messages
      onDeleteMessage?.(message.id);
    }
  };

  const handleForceDelete = () => {
    onDeleteMessage?.(message.id);
    setIsDeleteDialogOpen(false);
  };

  const positionClasses = position === "top-right" 
    ? "top-0 right-0" 
    : "bottom-0 right-0";

  return (
    <>
      <div className={`absolute ${positionClasses} z-10`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-cyberdark-400 hover:text-cyberdark-300 hover:bg-cyberdark-800/50"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-cyberdark-800/90 backdrop-blur-sm border-cyberblue-500/30">
            <DropdownMenuLabel className="text-xs text-cyberdark-400">
              Message Actions
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-cyberdark-700/50" />
            
            <DropdownMenuItem 
              className="text-cyberblue-300 cursor-pointer flex items-center hover:text-cyberblue-200 hover:bg-cyberdark-700/50"
              onClick={() => onEditMessage?.(message)}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>{isOld ? "Force Edit" : "Edit"}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="text-cyberred-400 cursor-pointer flex items-center hover:text-cyberred-300 hover:bg-cyberdark-700/50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{isOld ? "Force Delete" : "Delete"}</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-cyberdark-700/50" />
            
            <DropdownMenuItem 
              className="text-cyberdark-300 cursor-default flex items-center"
              onSelect={(e) => e.preventDefault()}
            >
              <Timer className="mr-2 h-4 w-4" />
              <span className="text-xs">{formatTimeRemaining()}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-cyberdark-900 border border-cyberred-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyberred-400">Force Delete Message?</AlertDialogTitle>
            <AlertDialogDescription className="text-cyberdark-300">
              This message is over 24 hours old. Are you sure you want to force delete it?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-cyberdark-800 text-cyberdark-300 hover:bg-cyberdark-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleForceDelete}
              className="bg-cyberred-600 text-white hover:bg-cyberred-700"
            >
              Force Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
