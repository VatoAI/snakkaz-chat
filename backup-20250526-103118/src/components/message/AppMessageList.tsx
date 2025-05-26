import React, { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';
import { SecurityLevel } from '@/types/security';
import { AppMessage, MessageVariant } from './AppMessage';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { LoadMoreMessages } from './LoadMoreMessages';

export interface AppMessageListProps {
  messages: DecryptedMessage[];
  variant?: MessageVariant;
  className?: string;
  currentUserId?: string;
  isMessageRead?: (messageId: string) => boolean;
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
  showAvatar?: boolean;
  showSender?: boolean;
  showGroupedMessages?: boolean;
  showScrollToBottom?: boolean;
}

interface MessageGroup {
  senderId: string;
  messages: DecryptedMessage[];
  isCurrentUser: boolean;
}

const SCROLL_THRESHOLD = 300; // pixels from bottom to trigger auto-scroll

/**
 * AppMessageList - A unified message list component for displaying messages across the application
 * 
 * This component provides a consistent message list UI with configurable features based on the context.
 * It supports message grouping, virtualization, and scroll behaviors.
 */
export const AppMessageList: React.FC<AppMessageListProps> = ({
  messages,
  variant = 'default',
  className,
  currentUserId = '',
  isMessageRead,
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
  showAvatar = true,
  showSender = true,
  showGroupedMessages = true,
  showScrollToBottom = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Group messages by sender for better visual display
  const groupedMessages = useMemo(() => {
    if (!showGroupedMessages) {
      return messages.map(message => ({
        senderId: message.sender?.id || '',
        messages: [message],
        isCurrentUser: message.sender?.id === currentUserId
      }));
    }
    
    return messages.reduce((groups: MessageGroup[], message) => {
      const senderId = message.sender?.id || '';
      const isCurrentUser = senderId === currentUserId;
      const lastGroup = groups[groups.length - 1];
      
      // Check if this message should start a new group
      const shouldStartNewGroup = 
        // If it's the first message
        !lastGroup || 
        // If it's from a different sender
        lastGroup.senderId !== senderId ||
        // If time gap is more than 5 minutes
        (message.created_at && lastGroup.messages[lastGroup.messages.length - 1].created_at &&
         (new Date(message.created_at).getTime() - 
          new Date(lastGroup.messages[lastGroup.messages.length - 1].created_at).getTime()) > 5 * 60 * 1000) ||
        // If message has a reply, always start a new group
        message.replyToId || message.reply_to_id;
      
      if (shouldStartNewGroup) {
        groups.push({
          senderId,
          messages: [message],
          isCurrentUser
        });
      } else {
        lastGroup.messages.push(message);
      }
      
      return groups;
    }, []);
  }, [messages, currentUserId, showGroupedMessages]);

  // Handle scroll events to show/hide scroll button and determine auto-scrolling
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    setShowScrollButton(distanceFromBottom > SCROLL_THRESHOLD);
    setIsNearBottom(distanceFromBottom < SCROLL_THRESHOLD);
  };

  // Scroll to bottom when new messages are added or on initial load
  useEffect(() => {
    if (containerRef.current && isNearBottom && !loading) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading, isNearBottom]);

  // Scroll to bottom when clicking the scroll button
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };
  
  // Handle loading more messages when scrolling to top
  const handleScroll1ToTop = () => {
    if (containerRef.current && containerRef.current.scrollTop < 100 && hasMoreMessages && onLoadMore && !loading) {
      // Store current scroll position and height
      const scrollHeight = containerRef.current.scrollHeight;
      
      // Load more messages
      onLoadMore().then(() => {
        // After loading, maintain scroll position
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - scrollHeight;
        }
      });
    }
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col h-full overflow-hidden bg-gradient-to-b from-cyberdark-950 to-cyberdark-900",
        className
      )}
    >
      {/* Load more messages button/indicator */}
      {hasMoreMessages && (
        <LoadMoreMessages 
          loading={loading} 
          onLoadMore={onLoadMore}
        />
      )}
      
      {/* Messages container with scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyberdark-700 scrollbar-track-cyberdark-950"
        onScroll={() => {
          handleScroll();
          handleScroll1ToTop();
        }}
      >
        <div className="flex flex-col min-h-full justify-end py-4">
          {groupedMessages.map((group, groupIndex) => (
            <div key={`${group.senderId}-${groupIndex}`} className="flex flex-col">
              {group.messages.map((message, messageIndex) => {
                // Determine if this message should show sender/avatar based on position in group
                const isFirstInGroup = messageIndex === 0;
                const isLastInGroup = messageIndex === group.messages.length - 1;
                
                return (
                  <AppMessage
                    key={message.id}
                    message={message}
                    variant={variant}
                    isCurrentUser={group.isCurrentUser}
                    showAvatar={showAvatar && isLastInGroup && !group.isCurrentUser}
                    showSender={showSender && isFirstInGroup && !group.isCurrentUser && variant === 'group'}
                    isMessageRead={isMessageRead}
                    onEditMessage={onEditMessage}
                    onDeleteMessage={onDeleteMessage}
                    onReplyToMessage={onReplyToMessage}
                    onReactionSelect={onReactionSelect}
                    onMessageExpired={onMessageExpired}
                    userStatus={group.isCurrentUser ? undefined : userStatus[group.senderId]}
                    securityLevel={securityLevel}
                    className={cn(
                      !isLastInGroup && 'pb-0',
                      !isFirstInGroup && 'pt-0'
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollToBottom && showScrollButton && (
        <ScrollToBottomButton onClick={scrollToBottom} />
      )}
    </div>
  );
};

export default AppMessageList;