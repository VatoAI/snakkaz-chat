
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';
import { SecurityLevel } from '@/types/groups';
import AppMessageList from '../message/AppMessageList';
import { MessageInput } from '../MessageInput';
import { MessageVariant } from '../message/AppMessage';

export interface AppChatInterfaceProps {
  messages: DecryptedMessage[];
  variant?: MessageVariant;
  className?: string;
  currentUserId?: string;
  chatTitle?: string;
  chatSubtitle?: string;
  placeholder?: string;
  disableInput?: boolean;
  isMessageRead?: (messageId: string) => boolean;
  onSendMessage?: (message: string, attachments?: File[]) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  onReplyToMessage?: (message: DecryptedMessage) => void;
  onReactionSelect?: (messageId: string, reaction: string) => void;
  onMessageExpired?: (messageId: string) => void;
  onLoadMore?: () => Promise<void>;
  hasMoreMessages?: boolean;
  loading?: boolean;
  userStatus?: Record<string, UserStatus>;
  securityLevel?: SecurityLevel;
  ephemeralMessagesEnabled?: boolean;
  ephemeralMessageTTL?: number;
  inputAttachmentsEnabled?: boolean;
  inputReactionsEnabled?: boolean;
  inputEncryptionEnabled?: boolean;
  renderHeader?: () => React.ReactNode;
}

/**
 * AppChatInterface - A unified chat interface component for the application
 * 
 * This component provides a complete chat interface with a message list and input area.
 * It's designed to be used as the main component for different chat types (direct, group, etc.)
 */
export const AppChatInterface: React.FC<AppChatInterfaceProps> = ({
  messages,
  variant = 'default',
  className,
  currentUserId,
  chatTitle,
  chatSubtitle,
  placeholder = 'Skriv en melding...',
  disableInput = false,
  isMessageRead,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReplyToMessage,
  onReactionSelect,
  onMessageExpired,
  onLoadMore,
  hasMoreMessages = false,
  loading = false,
  userStatus = {},
  securityLevel = 'server_e2ee',
  ephemeralMessagesEnabled = false,
  ephemeralMessageTTL = 300,
  inputAttachmentsEnabled = true,
  inputReactionsEnabled = true,
  inputEncryptionEnabled = true,
  renderHeader
}) => {
  const [replyToMessage, setReplyToMessage] = useState<DecryptedMessage | null>(null);
  
  // Handle reply to message
  const handleReplyToMessage = (message: DecryptedMessage) => {
    setReplyToMessage(message);
    if (onReplyToMessage) {
      onReplyToMessage(message);
    }
  };
  
  // Cancel reply
  const handleCancelReply = () => {
    setReplyToMessage(null);
  };
  
  // Determine if we should show avatars based on chat type
  const showAvatars = variant === 'group' || variant === 'default';
  
  // Determine if we should show sender names
  const showSenderNames = variant === 'group';

  return (
    <div 
      className={cn(
        "flex flex-col h-full overflow-hidden",
        className
      )}
    >
      {/* Optional header component */}
      {renderHeader && renderHeader()}
      
      {/* Message list */}
      <div className="flex-1 overflow-hidden">
        <AppMessageList
          messages={messages}
          variant={variant}
          currentUserId={currentUserId}
          isMessageRead={isMessageRead}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onReplyToMessage={handleReplyToMessage}
          onReactionSelect={onReactionSelect}
          onMessageExpired={onMessageExpired}
          onLoadMore={onLoadMore}
          hasMoreMessages={hasMoreMessages}
          loading={loading}
          userStatus={userStatus}
          securityLevel={securityLevel}
          showAvatar={showAvatars}
          showSender={showSenderNames}
        />
      </div>
      
      {/* Message input */}
      {!disableInput && (
        <div className="border-t border-cyberdark-800 bg-cyberdark-900/70 backdrop-blur-sm">
          <MessageInput 
            onSendMessage={onSendMessage}
            placeholder={placeholder}
            replyToMessage={replyToMessage}
            onCancelReply={handleCancelReply}
            enableAttachments={inputAttachmentsEnabled}
            enableEphemeralMessages={ephemeralMessagesEnabled}
            ephemeralTTL={ephemeralMessageTTL}
            securityLevel={securityLevel}
          />
        </div>
      )}
    </div>
  );
};

export default AppChatInterface;
