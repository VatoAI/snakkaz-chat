
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { cn } from '@/lib/utils';
import { Shield, Clock, Check, CheckCheck, XCircle, Reply, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ChatMessageProps {
  message: Partial<DecryptedMessage>;
  isCurrentUser: boolean;
  userProfiles?: Record<string, any>;
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  isEncrypted?: boolean;
  children?: React.ReactNode; // Add children prop
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles = {},
  onEdit,
  onDelete,
  onReply,
  isEncrypted = false,
  children // Accept children prop
}) => {
  const sender = message.sender ? userProfiles[message.sender.id || ''] : null;
  const isMedia = message.media_url || message.media;
  const hasBeenEdited = message.is_edited || message.edited_at;
  
  const messageClasses = cn(
    "px-3 py-2 rounded-lg break-words w-fit max-w-[75%] shadow-md",
    isCurrentUser ? "bg-cybergold-900/70 text-cybergold-200 ml-auto" : "bg-cyberdark-800/70 text-cybergold-300",
    isMedia ? "max-w-[250px] md:max-w-[300px]" : "max-w-[75%]"
  );
  
  const getStatusIcon = () => {
    if (message.status === 'error') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (!isCurrentUser) return null;
    
    if (message.readBy && message.readBy.length > 0) {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    
    return <Check className="h-4 w-4 text-cybergold-400" />;
  };
  
  const getFormattedTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: nb });
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };
  
  return (
    <div className={cn(
      "relative group flex flex-col",
      isCurrentUser ? "items-end" : "items-start"
    )}>
      <div className="absolute top-0 left-0 flex items-center justify-start">
        {isEncrypted && (
          <Shield className="h-4 w-4 text-green-500 mr-1" aria-label="Ende-til-ende kryptert" />
        )}
      </div>
      
      <div className={messageClasses}>
        {/* Sender info */}
        <div className="flex items-center space-x-2 mb-1">
          {sender?.avatar_url && (
            <img
              src={sender.avatar_url}
              alt={`${sender?.username || 'Unknown'} Avatar`}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium">{sender?.username || 'Ukjent'}</span>
        </div>
        
        {/* Media content */}
        {isMedia && (
          <div className="relative rounded-md overflow-hidden">
            {message.media_type?.startsWith('video') ? (
              <video src={message.media_url || (message.media as any)?.url} controls className="w-full h-auto max-h-[300px] object-cover rounded-md" />
            ) : (
              <img
                src={message.media_url || (message.media as any)?.url}
                alt="Media Message"
                className="w-full h-auto max-h-[300px] object-cover rounded-md"
              />
            )}
          </div>
        )}
        
        {/* Text content */}
        {message.content && (
          <p className="text-sm">{message.content}</p>
        )}
        
        {/* Message metadata */}
        <div className="flex items-center space-x-2 mt-1 text-xs opacity-70">
          <span className="text-muted-foreground">{getFormattedTime(message.created_at)}</span>
          {hasBeenEdited && (
            <span className="italic text-muted-foreground">(Redigert)</span>
          )}
          {message.ttl && (
            <span className="flex items-center text-amber-500">
              <Clock className="h-3 w-3 mr-1" />
              {message.ttl}s
            </span>
          )}
        </div>
      </div>
      
      {/* Message status or any custom content */}
      {children}
    </div>
  );
};

export default ChatMessage;
