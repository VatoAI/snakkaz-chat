import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ChatMessage } from '@/types/messages';
import AppMessage, { MessageVariant } from './AppMessage';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export interface MessageGroup {
  date: Date;
  messages: ChatMessage[];
}

export interface MessageListProps {
  messages: ChatMessage[];
  variant: MessageVariant;
  userId?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  showDateSeparators?: boolean;
  groupMessages?: boolean;
  avatarMapping?: Record<string, string>;
  nameMapping?: Record<string, string>;
  onLoadMore?: () => void;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (message: ChatMessage) => void;
  onDelete?: (messageId: string) => void;
  onReactionSelect?: (messageId: string, emoji: string) => void;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  variant,
  userId = '',
  isLoading = false,
  hasMore = false,
  showDateSeparators = true,
  groupMessages = true,
  avatarMapping = {},
  nameMapping = {},
  onLoadMore,
  onReply,
  onEdit,
  onDelete,
  onReactionSelect,
  className,
}) => {
  const virtuosoRef = useRef<any>(null);
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // Group messages by date
  useEffect(() => {
    if (!messages.length) {
      setMessageGroups([]);
      return;
    }

    if (!groupMessages) {
      // When grouping is disabled, create one group per date
      const groups = messages.reduce((acc: Record<string, MessageGroup>, message) => {
        const date = new Date(message.timestamp);
        const dateKey = format(date, 'yyyy-MM-dd');
        
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: new Date(date.setHours(0, 0, 0, 0)),
            messages: [],
          };
        }

        acc[dateKey].messages.push(message);
        return acc;
      }, {});

      setMessageGroups(Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime()));
      return;
    }

    // Group messages by date and consecutive sender
    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const groups = sortedMessages.reduce((acc: Record<string, MessageGroup>, message) => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: new Date(date.setHours(0, 0, 0, 0)),
          messages: [],
        };
      }

      acc[dateKey].messages.push(message);
      return acc;
    }, {});

    setMessageGroups(Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime()));
  }, [messages, groupMessages]);

  // Scroll to bottom on first load
  useEffect(() => {
    if (messages.length && !initialScrollDone && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'auto',
      });
      setInitialScrollDone(true);
    }
  }, [messages.length, initialScrollDone]);

  // Calculate which messages should show avatars (for grouping)
  const shouldShowAvatar = (messageIndex: number, groupIndex: number) => {
    if (!groupMessages) return true;
    
    const group = messageGroups[groupIndex];
    const message = group.messages[messageIndex];
    const nextMessage = messageIndex < group.messages.length - 1 
      ? group.messages[messageIndex + 1] 
      : null;
    
    // Always show avatar for the first message of a sender
    if (!nextMessage) return true;
    
    // Show avatar if next message is from a different sender
    return message.senderId !== nextMessage.senderId;
  };

  // Render message with appropriate props
  const renderMessage = (message: ChatMessage, showAvatar: boolean) => {
    const isOwn = message.senderId === userId;
    
    return (
      <AppMessage
        key={message.id}
        message={message}
        isOwn={isOwn}
        variant={variant}
        isRead={message.isRead}
        showAvatar={showAvatar}
        senderName={nameMapping[message.senderId] || message.senderName}
        senderAvatarUrl={avatarMapping[message.senderId]}
        isEncrypted={message.isEncrypted}
        ephemeral={message.ephemeral}
        expiresAt={message.expiresAt ? new Date(message.expiresAt) : null}
        onEdit={isOwn ? onEdit : undefined}
        onDelete={isOwn ? onDelete : undefined}
        onReply={onReply}
        onReactionSelect={onReactionSelect}
      />
    );
  };

  // Render date separator
  const renderDateSeparator = (date: Date) => {
    return (
      <div className="flex items-center justify-center my-2 sticky top-0 z-10">
        <div className="bg-cyberdark-950/80 px-4 py-1 rounded-full text-xs text-cybergold-500 backdrop-blur-sm">
          {format(date, 'EEEE, d. MMMM yyyy')}
        </div>
      </div>
    );
  };

  // Render loading spinner
  const renderLoadingSpinner = () => {
    if (!isLoading) return null;
    
    return (
      <div className="flex justify-center my-4">
        <Spinner className="h-6 w-6 text-cybergold-500" />
      </div>
    );
  };

  // Handles loading more messages when scrolling to the top
  const handleLoadMore = () => {
    if (hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  // Render empty state
  if (!messages.length && !isLoading) {
    return (
      <div className={cn("flex flex-col flex-1 items-center justify-center p-8", className)}>
        <div className="text-cyberdark-400 text-sm">
          Ingen meldinger ennå
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col h-full", className)}>
      {renderLoadingSpinner()}
      
      <Virtuoso
        ref={virtuosoRef}
        className="flex-1"
        data={messageGroups}
        startReached={handleLoadMore}
        itemContent={(groupIndex, group) => (
          <>
            {showDateSeparators && renderDateSeparator(group.date)}
            
            {group.messages.map((message, messageIndex) => (
              <div key={message.id}>
                {renderMessage(message, shouldShowAvatar(messageIndex, groupIndex))}
              </div>
            ))}
          </>
        )}
      />
    </div>
  );
};

export default MessageList;