
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { cx, theme } from '../lib/theme';
import { Loader2 } from 'lucide-react';

interface ChatMessageListProps {
  messages: Array<any>;
  currentUserId: string;
  userProfiles?: Record<string, any>;
  onEdit?: (message: any) => void;
  onDelete?: (messageId: string) => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles = {},
  onEdit,
  onDelete,
  isLoading = false,
  hasMoreMessages = false,
  isLoadingMore = false,
  onLoadMore,
  className = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);
  
  // Handle scroll to load more messages
  useEffect(() => {
    const container = containerRef.current;
    
    if (!container || !hasMoreMessages || !onLoadMore) {
      return;
    }
    
    const handleScroll = () => {
      if (isLoadingMore || !hasMoreMessages) return;
      
      // Check if user has scrolled to the top
      if (container.scrollTop < 50) {
        // Save current scroll position and height
        const scrollHeight = container.scrollHeight;
        
        // Call onLoadMore to fetch more messages
        onLoadMore();
        
        // After loading more messages, adjust scroll position to maintain relative position
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - scrollHeight;
          container.scrollTop = heightDifference;
        }, 100);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [hasMoreMessages, isLoadingMore, onLoadMore]);
  
  return (
    <div 
      ref={containerRef}
      className={cx('flex-1 overflow-y-auto p-4 space-y-2', className)}
    >
      {/* Loading indicator for more messages */}
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-cybergold-400" />
        </div>
      )}
      
      {/* Messages */}
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId || message.senderId === currentUserId}
          userProfile={userProfiles[message.sender_id || message.senderId]}
          onEdit={onEdit ? () => onEdit(message) : undefined}
          onDelete={onDelete ? () => onDelete(message.id) : undefined}
        />
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-cybergold-400" />
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-10">
          <p className="text-cybergold-500 text-sm">Ingen meldinger ennå</p>
          <p className="text-cybergold-600 text-xs mt-1">Send en melding for å starte en samtale</p>
        </div>
      )}
      
      {/* Invisible div for auto-scrolling to latest message */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
