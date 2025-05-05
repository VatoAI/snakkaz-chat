import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DecryptedMessage } from '@/types/message';
import { MoreHorizontal, Reply, Trash, Edit, Lock, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChatMessageProps {
  message: Partial<DecryptedMessage>;
  isCurrentUser?: boolean;
  userProfiles?: Record<string, any>;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReactionAdd?: (emoji: string) => void;
  showAvatar?: boolean;
  isEncrypted?: boolean;
  children?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser = false,
  userProfiles = {},
  onReply,
  onEdit,
  onDelete,
  onReactionAdd,
  showAvatar = true,
  isEncrypted = false,
  children
}) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  
  const senderId = message.sender?.id || '';
  
  const senderProfile = userProfiles[senderId] || {
    username: message.sender?.username || 'Unknown User',
    avatar_url: message.sender?.avatar_url || null
  };
  
  const formattedTime = message.created_at 
    ? format(new Date(message.created_at), 'HH:mm')
    : '';
  
  const isEdited = message.is_edited || message.isEdited;
  
  // Message content rendering functions
  
  return (
    <div 
      className={cn(
        "group relative flex items-start gap-2 py-1",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isCurrentUser && showAvatar && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-cyberdark-700 mt-1">
          {senderProfile.avatar_url ? (
            <img 
              src={senderProfile.avatar_url} 
              alt={senderProfile.username || 'User avatar'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cybergold-900 text-cybergold-400">
              {(senderProfile.username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      
      <div className={cn(
        "relative max-w-[85%] sm:max-w-[75%]",
        isCurrentUser ? "bg-cybergold-900/30 border border-cybergold-800/30" : "bg-cyberdark-800/80 border border-cyberdark-700",
        "rounded-lg px-3 py-2 text-sm shadow-sm"
      )}>
        {!isCurrentUser && (
          <div className="text-xs font-medium text-cybergold-400 mb-1">
            {senderProfile.username || 'Unknown User'}
            {isEncrypted && (
              <Lock 
                className="inline-block ml-1 text-cybergold-500" 
                size={12} 
                aria-label="Encrypted message"
              />
            )}
          </div>
        )}
        
        {/* Message content */}
        <div className="text-cybergold-300 break-words">
          {message.content}
          {message.is_edited && (
            <span className="text-xs text-cybergold-600 ml-1">(redigert)</span>
          )}
        </div>
        
        {/* Message time */}
        <div className="text-[10px] text-cybergold-600 mt-1 flex items-center">
          {formattedTime}
          {message.ttl && message.ttl > 0 && (
            <span className="ml-1 flex items-center" title="Disappearing message">
              <Clock size={10} className="mr-0.5" />
              {formatTTL(message.ttl)}
            </span>
          )}
          {children}
        </div>
      </div>
      
      {/* Message actions */}
      {showActions && (
        <div 
          ref={actionsRef}
          className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isCurrentUser ? "-left-10" : "-right-10",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-cybergold-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCurrentUser ? "start" : "end"} className="bg-cyberdark-900 border-cyberdark-700">
              {onReply && (
                <DropdownMenuItem onClick={onReply} className="text-cybergold-400 hover:text-cybergold-300">
                  <Reply className="mr-2 h-4 w-4" />
                  <span>Svar</span>
                </DropdownMenuItem>
              )}
              {isCurrentUser && onEdit && (
                <DropdownMenuItem onClick={onEdit} className="text-cybergold-400 hover:text-cybergold-300">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Rediger</span>
                </DropdownMenuItem>
              )}
              {isCurrentUser && onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-red-500 hover:text-red-400">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Slett</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(message.content || '')}
                className="text-cybergold-400 hover:text-cybergold-300"
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Kopier tekst</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

// Helper function to format TTL time
const formatTTL = (ttl: number): string => {
  if (ttl < 60) {
    return `${ttl}s`;
  } else if (ttl < 3600) {
    return `${Math.floor(ttl / 60)}m`;
  } else if (ttl < 86400) {
    return `${Math.floor(ttl / 3600)}h`;
  } else {
    return `${Math.floor(ttl / 86400)}d`;
  }
};
