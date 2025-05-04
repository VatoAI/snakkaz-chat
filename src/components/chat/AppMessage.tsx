import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Check, CheckCheck, Edit, Trash2, Reply, EyeOff, Clock, Shield, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/messages';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

export type MessageVariant = 'direct' | 'group' | 'global';

export interface AppMessageProps {
  message: ChatMessage;
  isOwn: boolean;
  variant: MessageVariant;
  isRead?: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderAvatarUrl?: string;
  isEncrypted?: boolean;
  ephemeral?: boolean;
  expiresAt?: Date | null;
  onEdit?: (message: ChatMessage) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: ChatMessage) => void;
  onReactionSelect?: (messageId: string, emoji: string) => void;
  onExpired?: (messageId: string) => void;
  disableActions?: boolean;
  showStatus?: boolean;
}

const defaultReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "🎉"];

export const AppMessage: React.FC<AppMessageProps> = ({
  message,
  isOwn,
  variant,
  isRead = false,
  showAvatar = true,
  senderName,
  senderAvatarUrl,
  isEncrypted = false,
  ephemeral = false,
  expiresAt = null,
  onEdit,
  onDelete,
  onReply,
  onReactionSelect,
  onExpired,
  disableActions = false,
  showStatus = true,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedDate = new Date(message.timestamp).toLocaleDateString();
  const relativeTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: nb
  });

  // Handle ephemeral messages countdown
  useEffect(() => {
    if (!ephemeral || !expiresAt) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const expires = new Date(expiresAt);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Utløpt');
        if (onExpired) onExpired(message.id);
        return;
      }

      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) {
        setTimeLeft(`${seconds}s`);
      } else if (seconds < 3600) {
        setTimeLeft(`${Math.floor(seconds / 60)}m`);
      } else if (seconds < 86400) {
        setTimeLeft(`${Math.floor(seconds / 3600)}t`);
      } else {
        setTimeLeft(`${Math.floor(seconds / 86400)}d`);
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [ephemeral, expiresAt, message.id, onExpired]);

  const handleCopyText = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      toast({
        title: "Tekst kopiert",
        description: "Meldingsteksten er kopiert til utklippstavlen",
      });
    }
  };

  // Show sender info based on variant and isOwn
  const shouldShowSenderInfo = variant !== 'direct' && !isOwn;

  return (
    <div
      ref={messageRef}
      className={cn(
        'group relative flex items-start gap-3 py-2 px-4 rounded-lg hover:bg-cyberdark-800/30 transition-colors duration-200',
        isOwn ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for non-own messages */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          {senderAvatarUrl ? (
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img src={senderAvatarUrl} alt={senderName || 'User'} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-cybergold-900/30 flex items-center justify-center text-sm font-semibold text-cybergold-400">
              {senderName ? senderName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
      )}
      
      {/* Message content */}
      <div 
        className={cn(
          'relative max-w-[75%] flex flex-col',
          isOwn ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name for group chats */}
        {shouldShowSenderInfo && senderName && (
          <div className="text-xs font-medium text-cybergold-500 mb-1">
            {senderName}
          </div>
        )}
        
        {/* Reply to info */}
        {message.replyToId && message.replyToPreview && (
          <div className={cn(
            'mb-1 px-3 py-1.5 rounded border-l-2 text-sm',
            isOwn 
              ? 'bg-cybergold-950/30 border-cybergold-700/50 text-cybergold-300' 
              : 'bg-cyberdark-800/80 border-cyberdark-600 text-cyberdark-300'
          )}>
            <div className="text-xs font-medium text-cybergold-500">
              {message.replyToSenderName || 'Someone'}
            </div>
            <div className="text-xs truncate text-cybergold-400">
              {message.replyToPreview}
            </div>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          'px-4 py-2 rounded-2xl',
          isOwn 
            ? 'bg-cybergold-900/30 text-cybergold-100 rounded-tr-none' 
            : 'bg-cyberdark-800 text-cyberdark-100 rounded-tl-none'
        )}>
          {/* Text content */}
          {message.text && (
            <div className={cn(
              'whitespace-pre-wrap text-sm',
              message.isEdited && 'mb-1'
            )}>
              {message.text}
            </div>
          )}

          {/* Media content (image/video) */}
          {message.mediaUrl && (
            <div className={cn(
              'rounded-lg overflow-hidden mt-1',
              message.text && 'mt-2'
            )}>
              {message.mediaType === 'image' ? (
                <img 
                  src={message.mediaUrl} 
                  alt="Attached media" 
                  className="max-w-full max-h-64 rounded-lg"
                />
              ) : message.mediaType === 'video' ? (
                <video 
                  src={message.mediaUrl}
                  controls
                  className="max-w-full max-h-64 rounded-lg"
                />
              ) : null}
            </div>
          )}

          {/* File attachment */}
          {message.fileUrl && (
            <div className="mt-2 p-2 bg-cyberdark-700/50 rounded-md flex items-center">
              <div className="text-xs text-cybergold-300 truncate">
                {message.fileName || 'Attached File'}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 ml-auto"
                onClick={() => window.open(message.fileUrl, '_blank')}
              >
                <span className="sr-only">Download</span>
              </Button>
            </div>
          )}

          {/* Editing indicator */}
          {message.isEdited && (
            <div className="text-xs text-cybergold-600 italic">
              redigert
            </div>
          )}
          
          {/* Encryption indicator */}
          {isEncrypted && (
            <div className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3" />
              <span>Kryptert</span>
            </div>
          )}
          
          {/* Ephemeral message indicator */}
          {ephemeral && timeLeft && (
            <div className="text-xs text-amber-400/80 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-cybergold-600 mt-1 flex items-center gap-1">
          <span title={`${formattedDate} ${formattedTime}`}>{relativeTime}</span>
          
          {/* Read status */}
          {isOwn && showStatus && (
            <>
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-cybergold-400" />
              ) : (
                <Check className="h-3 w-3 text-cybergold-600" />
              )}
            </>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <div 
                key={`${reaction.emoji}-${index}`}
                className="bg-cyberdark-800 px-1.5 py-0.5 rounded-full text-xs flex items-center gap-0.5"
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span className="text-cybergold-500">{reaction.count}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!disableActions && showActions && (
        <div 
          className={cn(
            'absolute top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isOwn ? 'left-2' : 'right-2'
          )}
        >
          {/* Reply */}
          {onReply && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700"
              onClick={() => onReply(message)}
            >
              <Reply className="h-3.5 w-3.5" />
              <span className="sr-only">Reply</span>
            </Button>
          )}
          
          {/* Edit (only for own messages) */}
          {isOwn && onEdit && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700"
              onClick={() => onEdit(message)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {/* Delete (only for own messages) */}
          {isOwn && onDelete && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700 hover:text-red-400"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
          
          {/* Reactions */}
          {onReactionSelect && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700"
                >
                  <span className="text-sm">😀</span>
                  <span className="sr-only">Add reaction</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cyberdark-800 border-cyberdark-700">
                <div className="flex flex-wrap gap-2 p-2 max-w-[200px]">
                  {defaultReactions.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-lg hover:bg-cyberdark-700 p-1 rounded"
                      onClick={() => {
                        onReactionSelect(message.id, emoji);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Copy text */}
          {message.text && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700"
              onClick={handleCopyText}
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="sr-only">Copy text</span>
            </Button>
          )}
        </div>
      )}
      
      {/* Space for own message avatars (for alignment) */}
      {showAvatar && isOwn && (
        <div className="w-8 flex-shrink-0"></div>
      )}
    </div>
  );
};

export default AppMessage;