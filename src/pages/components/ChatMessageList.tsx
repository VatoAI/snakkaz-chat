import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { cx, theme } from '../lib/theme';

interface ChatMessageListProps {
  messages: any[];
  currentUserId: string;
  userProfiles: Record<string, any>;
  onEditMessage?: (message: any) => void;
  onDeleteMessage?: (messageId: string) => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles,
  onEditMessage,
  onDeleteMessage,
  isLoading = false,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onLoadMoreMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle scroll to load more messages
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMoreMessages && onLoadMoreMessages) {
      onLoadMoreMessages();
    }
  };
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  return (
    <div 
      ref={messagesContainerRef}
      className={cx(
        'flex-grow overflow-y-auto py-4 px-4',
        theme.colors.background.primary
      )}
      onScroll={handleScroll}
    >
      {/* Loading indicator for more messages */}
      {isLoadingMoreMessages && (
        <div className="flex justify-center mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-cybergold-600" />
        </div>
      )}
      
      {/* Load more button */}
      {!isLoadingMoreMessages && hasMoreMessages && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onLoadMoreMessages}
            className={cx(
              'px-4 py-1 rounded text-xs',
              theme.colors.background.tertiary,
              theme.colors.text.secondary,
              'hover:bg-cyberdark-800'
            )}
          >
            Last flere meldinger
          </button>
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([date, messagesGroup]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center justify-center my-3">
            <div className={cx(
              'px-3 py-1 rounded text-xs',
              theme.colors.background.tertiary,
              theme.colors.text.secondary
            )}>
              {formatDateHeader(date)}
            </div>
          </div>
          
          {/* Messages for this date */}
          {messagesGroup.map((message: any) => (
            <ChatMessage 
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === currentUserId}
              userProfiles={userProfiles}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))}
        </div>
      ))}
      
      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className={cx(
            'w-16 h-16 rounded-full mb-4 flex items-center justify-center',
            theme.colors.background.tertiary
          )}>
            <svg className="w-8 h-8 text-cybergold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className={cx('text-lg font-medium', theme.colors.text.secondary)}>
            Ingen meldinger ennå
          </h3>
          <p className="text-sm text-cyberdark-500 mt-1">
            Start samtalen ved å sende en melding
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cybergold-600" />
        </div>
      )}
      
      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} className="h-0" />
    </div>
  );
};

// Helper function to group messages by date
function groupMessagesByDate(messages: any[]) {
  const groups: Record<string, any[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString('nb-NO');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
}

// Helper function to format date header
function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Format for today and yesterday
  if (dateStr === today.toLocaleDateString('nb-NO')) {
    return 'I dag';
  } else if (dateStr === yesterday.toLocaleDateString('nb-NO')) {
    return 'I går';
  }
  
  // Format for other dates
  return date.toLocaleDateString('nb-NO', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
}