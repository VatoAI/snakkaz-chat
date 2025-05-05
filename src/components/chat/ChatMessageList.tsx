
import React, { useEffect, useRef, useState } from 'react';
import { DecryptedMessage } from '@/types/message';
import { ChatMessage } from './ChatMessage';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

interface ChatMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  onReplyToMessage?: (message: DecryptedMessage) => void;
  onLoadMore?: () => void;
  userProfiles?: Record<string, any>;
  isEncrypted?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  isLoading = false,
  hasMoreMessages = false,
  onEditMessage,
  onDeleteMessage,
  onReplyToMessage,
  onLoadMore,
  userProfiles = {},
  isEncrypted = false
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  // Use IntersectionObserver for loading more messages
  const { ref: topRef } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasMoreMessages && onLoadMore) {
        onLoadMore();
      }
    }
  });
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, autoScroll]);
  
  // Detect scroll position to manage auto-scroll feature
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      setAutoScroll(nearBottom);
      setShowScrollBottom(!nearBottom);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to bottom manually
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScroll(true);
    }
  };
  
  // Get text for date separators
  const getDateText = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    
    // Format date separators nicely
    if (date.toDateString() === today.toDateString()) {
      return 'I dag';
    } else if (date.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      return 'I går';
    } else {
      return formatDistanceToNow(date, { addSuffix: true, locale: nb });
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto px-2 md:px-4 py-4 bg-gradient-to-b from-cyberdark-950 to-cyberdark-900/95"
    >
      {/* Load more indicator */}
      {hasMoreMessages && (
        <div 
          ref={topRef}
          className="flex justify-center py-2"
        >
          {isLoading && (
            <Loader2 className="h-5 w-5 text-cybergold-500 animate-spin" />
          )}
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([dateKey, messagesForDate]) => (
        <div key={dateKey} className="mb-4">
          {/* Date separator */}
          <div className="flex justify-center mb-4">
            <div className="px-3 py-1 bg-cyberdark-800/80 text-cybergold-500 text-xs rounded-full">
              {getDateText(dateKey)}
            </div>
          </div>
          
          {/* Messages for this date */}
          <div className="space-y-3">
            {messagesForDate.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender.id === currentUserId}
                userProfiles={userProfiles}
                onReply={onReplyToMessage ? () => onReplyToMessage(message) : undefined}
                onEdit={onEditMessage ? () => onEditMessage(message) : undefined}
                onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
                isEncrypted={isEncrypted}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Empty state */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-cybergold-600">
          <p>Ingen meldinger enda.</p>
          <p className="text-sm mt-1">Start en samtale!</p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-cybergold-500 animate-spin mb-2" />
          <p className="text-cybergold-600">Laster meldinger...</p>
        </div>
      )}
      
      {/* Scroll to bottom reference */}
      <div ref={endRef} />
      
      {/* Scroll to bottom button */}
      {showScrollBottom && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-6 rounded-full bg-cyberdark-900 border-cybergold-700 shadow-md"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-5 w-5 text-cybergold-400" />
        </Button>
      )}
    </div>
  );
};

// Helper function to group messages by date
function groupMessagesByDate(messages: DecryptedMessage[]): Record<string, DecryptedMessage[]> {
  const groups: Record<string, DecryptedMessage[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
  });
  
  return groups;
}

export default ChatMessageList;
