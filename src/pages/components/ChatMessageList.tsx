import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { cx, theme } from '../lib/theme';

interface ChatMessageListProps {
  messages: any[];
  currentUserId: string;
  userProfiles: Record<string, any>;
  onEditMessage?: (message: any) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles,
  onEditMessage,
  onDeleteMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  return (
    <div className={cx(
      'flex-grow overflow-y-auto py-4 px-4',
      theme.colors.background.primary
    )}>
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
          {messagesGroup.map(message => (
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
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className={cx(
            'w-16 h-16 rounded-full mb-4 flex items-center justify-center',
            theme.colors.background.tertiary
          )}>
            <svg className="w-8 h-8 text-cybergold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
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