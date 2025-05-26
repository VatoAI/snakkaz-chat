import React from 'react';
import { Button } from '@/components/ui/button';
import { DecryptedMessage } from '@/types/message';
import { Pencil, Trash2, Reply } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface MessageActionsProps {
  message: DecryptedMessage;
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * Component for message action buttons (edit, delete, reply)
 */
export function MessageActions({
  message,
  onEdit,
  onDelete,
  onReply,
  size = 'sm'
}: MessageActionsProps) {
  // Size mappings for icons
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 18
  };
  
  const iconSize = sizeMap[size];
  
  // Don't render if no actions are available
  if (!onEdit && !onDelete && !onReply) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal size={iconSize} />
          <span className="sr-only">Meldingsalternativer</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onReply && (
          <DropdownMenuItem onClick={onReply}>
            <Reply size={iconSize} className="mr-2" />
            <span>Svar</span>
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil size={iconSize} className="mr-2" />
            <span>Rediger</span>
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 size={iconSize} className="mr-2" />
            <span>Slett</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
