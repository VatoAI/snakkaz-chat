import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';
import { SecurityLevel } from '@/types/security';
import { MessageContentDisplay } from './message-item/MessageContentDisplay';
import { MessageActionsMenu } from './message-item/MessageActionsMenu';
import { MessageMetadata } from './message-item/MessageMetadata';
import { formatMessageDate } from '@/types/message';
import { MessageTimer } from './MessageTimer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BurnOnReadMessage } from './BurnOnReadMessage';

export type MessageVariant = 'default' | 'direct' | 'group' | 'ai' | 'system';

export interface AppMessageProps {
  message: DecryptedMessage;
  variant?: MessageVariant;
  isCurrentUser?: boolean;
  showAvatar?: boolean;
  showSender?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  showTimer?: boolean;
  showReactions?: boolean;
  showEncryptionIndicator?: boolean;
  className?: string;
  isMessageRead?: (messageId: string) => boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  onReplyToMessage?: (message: DecryptedMessage) => void;
  onReactionSelect?: (messageId: string, reaction: string) => void;
  onMessageExpired?: (messageId: string) => void;
  userStatus?: UserStatus;
  securityLevel?: SecurityLevel;
  usingServerFallback?: boolean;
}

/**
 * AppMessage - A unified message component for displaying messages across the application
 * 
 * This component provides a consistent message UI with configurable features based on the context.
 * It supports direct messages, group chats, AI chats, and system messages with appropriate styling.
 */
export const AppMessage = memo(({
  message,
  variant = 'default',
  isCurrentUser = false,
  showAvatar = true,
  showSender = true,
  showMetadata = true,
  showActions = true,
  showTimer = true,
  showReactions = true,
  showEncryptionIndicator = true,
  className,
  isMessageRead,
  onEditMessage,
  onDeleteMessage,
  onReplyToMessage,
  onReactionSelect,
  onMessageExpired,
  userStatus,
  securityLevel = 'server_e2ee',
  usingServerFallback = false
}: AppMessageProps) => {
  // Handle invalid message with a placeholder
  if (!message || !message.id || !message.sender) {
    return null;
  }

  const isDeleted = message.is_deleted || message.isDeleted || false;
  const isPersistent = !(message.ttl || message.ephemeral_ttl);
  const isExpiring = Boolean(message.ttl || message.ephemeral_ttl);
  const isBurnOnRead = message.ttl === 0 || message.ephemeral_ttl === 0;
  
  // Format message time for display
  const messageTime = message.createdAt || message.created_at;
  const formattedTime = messageTime ? formatMessageDate(new Date(messageTime)) : '';

  return (
    <div
      className={cn(
        "relative group flex gap-2 px-2 py-1 transition-colors",
        isCurrentUser ? "justify-end" : "justify-start",
        variant === 'system' && "justify-center",
        isDeleted && "opacity-70",
        className
      )}
      data-message-id={message.id}
    >
      {/* Avatar (only shown for other users in direct/group chats) */}
      {showAvatar && !isCurrentUser && variant !== 'system' && message.sender && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={message.sender.avatar_url || undefined} alt={message.sender.username || 'User'} />
            <AvatarFallback>
              {(message.sender.username || 'U').substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {/* Message Bubble Container */}
      <div
        className={cn(
          "relative flex flex-col max-w-[85%] rounded-lg p-2 shadow-sm",
          
          // Message background based on variant and sender
          variant === 'default' && isCurrentUser && "bg-cybergold-950/80 border border-cybergold-900",
          variant === 'default' && !isCurrentUser && "bg-cyberdark-900/80 border border-cyberdark-800",
          
          variant === 'direct' && isCurrentUser && "bg-cybergold-950/80 border border-cybergold-900",
          variant === 'direct' && !isCurrentUser && "bg-cyberdark-900/80 border border-cyberdark-800",
          
          variant === 'group' && isCurrentUser && "bg-cybergold-950/80 border border-cybergold-900",
          variant === 'group' && !isCurrentUser && "bg-cyberdark-900/80 border border-cyberdark-800",
          
          variant === 'ai' && "bg-gradient-to-br from-purple-900/50 to-blue-900/30 border border-purple-800/40",
          
          variant === 'system' && "bg-cyberdark-800/50 border border-cyberdark-700 text-center max-w-md mx-auto",
          
          // Expired/deleted message styling
          isDeleted && "bg-opacity-50 border-opacity-50",
          
          // Special styling for burn-on-read messages
          isBurnOnRead && "bg-gradient-to-br from-amber-950 to-red-950 border-amber-900"
        )}
      >
        {/* Sender name (shown in group chats for other users) */}
        {showSender && !isCurrentUser && variant === 'group' && message.sender && (
          <div className="text-xs font-medium mb-1 text-cybergold-400">
            {message.sender.username || message.sender.full_name || 'Unknown User'}
          </div>
        )}
        
        {/* Message Content */}
        {isBurnOnRead ? (
          <BurnOnReadMessage 
            message={message} 
            onExpired={onMessageExpired ? () => onMessageExpired(message.id) : undefined} 
          />
        ) : (
          <MessageContentDisplay 
            message={message}
            isCurrentUser={isCurrentUser}
            showReplyPreview={true}
          />
        )}
        
        {/* Message Metadata */}
        {showMetadata && (
          <div className="flex items-center justify-end gap-1 mt-1">
            {/* Security level indicator */}
            {showEncryptionIndicator && message.is_encrypted && (
              <span className="text-cybergold-500" title="End-to-end encrypted">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            )}
            
            {/* Message timer (for expiring messages) */}
            {showTimer && isExpiring && (
              <MessageTimer 
                ttl={message.ttl ?? message.ephemeral_ttl ?? 300} 
                createdAt={new Date(message.createdAt || message.created_at || '')}
                onExpired={onMessageExpired ? () => onMessageExpired(message.id) : undefined}
              />
            )}
            
            {/* Message metadata (time, read status, etc.) */}
            <MessageMetadata 
              message={message} 
              isCurrentUser={isCurrentUser}
              isMessageRead={isMessageRead}
            />
          </div>
        )}
      </div>
      
      {/* Message Actions Menu (for user's own messages) */}
      {showActions && isCurrentUser && !isDeleted && (
        <MessageActionsMenu 
          message={message}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onReplyToMessage={onReplyToMessage}
        />
      )}
    </div>
  );
});

AppMessage.displayName = 'AppMessage';

export default AppMessage;