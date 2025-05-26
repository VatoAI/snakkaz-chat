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
  isLoadingMoreMessages?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles,
  onEdit,
  onDelete,
  isLoading = false,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onLoadMore,
  className = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef<number>(messages.length);
  
  // Scroll til bunnen når det kommer nye meldinger
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);
  
  // Handle scrolling for "load more" functionality
  const handleScroll = () => {
    if (!messagesContainerRef.current || !onLoadMore || isLoadingMoreMessages || !hasMoreMessages) {
      return;
    }
    
    const { scrollTop } = messagesContainerRef.current;
    // Hvis bruker har scrollet nesten helt til toppen, last flere meldinger
    if (scrollTop < 50) {
      onLoadMore();
    }
  };
  
  // Scroll til bunnen av meldingslisten
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Gruppér meldinger etter dato
  const groupMessagesByDate = () => {
    const groups: Record<string, any[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString('nb-NO');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <div
      ref={messagesContainerRef}
      className={cx(
        'flex flex-col h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cyberdark-700 scrollbar-track-cyberdark-900',
        className
      )}
      onScroll={handleScroll}
    >
      {/* "Load more" loader */}
      {isLoadingMoreMessages && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 text-cybergold-500 animate-spin" />
        </div>
      )}
      
      {/* "Load more" button hvis det finnes flere meldinger */}
      {!isLoadingMoreMessages && hasMoreMessages && (
        <button
          className={cx(
            'mx-auto mb-2 py-1 px-3 rounded-full text-xs',
            theme.colors.button.secondary.bg,
            theme.colors.button.secondary.text,
            theme.colors.button.secondary.hover
          )}
          onClick={onLoadMore}
        >
          Last flere meldinger
        </button>
      )}
      
      {/* Meldingsgrupper etter dato */}
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date} className="mb-4">
          <div className="flex items-center justify-center my-3">
            <div className="h-[1px] flex-grow bg-cyberdark-700"></div>
            <span className="px-2 text-xs text-cybergold-600">{date}</span>
            <div className="h-[1px] flex-grow bg-cyberdark-700"></div>
          </div>
          
          {msgs.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === currentUserId}
              userProfiles={userProfiles}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
      
      {/* Tom tilstand */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
          <div className="text-lg mb-2 text-cybergold-400">Ingen meldinger ennå</div>
          <p className="text-sm text-cybergold-600">
            Send en melding for å starte samtalen
          </p>
        </div>
      )}
      
      {/* Loading tilstand */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <Loader2 className="h-8 w-8 text-cybergold-500 animate-spin mb-2" />
          <span className="text-sm text-cybergold-600">Laster inn meldinger...</span>
        </div>
      )}
      
      {/* Usynlig element som brukes for å scrolle til bunnen */}
      <div ref={messagesEndRef} />
    </div>
  );
};