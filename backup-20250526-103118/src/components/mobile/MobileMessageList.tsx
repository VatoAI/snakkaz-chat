import React, { useState, useRef, useEffect } from 'react';
import { DecryptedMessage } from '@/types/message';
import { UserPresence } from '@/types/presence';
import { groupMessagesByTime } from '@/utils/messageUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useMobilePullToRefresh } from '@/components/message-list/useMobilePullToRefresh';
import { formatMessageTimestamp } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';

interface MobileMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string | null;
  onDeleteMessage?: (messageId: string) => void;
  onReplyMessage?: (message: DecryptedMessage) => void;
  onLoadMore?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onMessageExpired?: (messageId: string) => void;
}

export const MobileMessageList: React.FC<MobileMessageListProps> = ({
  messages,
  currentUserId,
  onDeleteMessage,
  onReplyMessage,
  onLoadMore,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onMessageExpired
}) => {
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [revealedMessageId, setRevealedMessageId] = useState<string | null>(null);
  
  // Process messages into groups by time
  const messageGroups = groupMessagesByTime(messages);
  
  // Handle pull to refresh
  const handleRefresh = async () => {
    if (isRefreshing || !onLoadMore) return;
    
    setIsRefreshing(true);
    try {
      await onLoadMore();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };
  
  // Use the pull-to-refresh hook
  useMobilePullToRefresh({
    scrollAreaRef,
    onRefresh: handleRefresh
  });
  
  // Determine if a message is from the current user
  const isUserMessage = (message: DecryptedMessage) =>
    message.sender?.id === currentUserId;
    
  // Handle scroll events to manage scroll-to-bottom button visibility
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setAutoScroll(isAtBottom);
    setShowScrollToBottom(!isAtBottom);
    
    if (isAtBottom) {
      setNewMessageCount(0);
    }
  };
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
    setNewMessageCount(0);
    setShowScrollToBottom(false);
  };
  
  // Update new message count
  useEffect(() => {
    // Only update if we're not at the bottom and there are messages
    if (!autoScroll && messages.length > 0) {
      // Check if the last message is from someone else and recent
      const lastMessage = messages[messages.length - 1];
      if (
        currentUserId &&
        lastMessage.sender?.id !== currentUserId &&
        new Date().getTime() - new Date(lastMessage.timestamp || Date.now()).getTime() < 60000
      ) {
        setNewMessageCount(prev => prev + 1);
      }
    }
  }, [messages, autoScroll, currentUserId]);
  
  // Auto-scroll to bottom on new messages if autoScroll is true
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.length, autoScroll]);
  
  // Handle swipe to reveal actions
  const handleSwipeStart = (messageId: string) => {
    setRevealedMessageId(messageId === revealedMessageId ? null : messageId);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pb-2 z-10 bg-gradient-to-b from-cyberdark-900 to-transparent">
          <div className="flex items-center">
            <RotateCcw size={16} className="animate-spin mr-2 text-cybergold-400" />
            <span className="text-sm text-cybergold-400">Laster flere meldinger...</span>
          </div>
        </div>
      )}
      
      {/* Messages area */}
      <div 
        ref={scrollAreaRef} 
        className="flex-1 overflow-y-auto ios-scroll-fix mobile-elastic-scroll pt-2 pb-4 px-2"
        onScroll={handleScroll}
      >
        {/* Load more button */}
        {hasMoreMessages && !isRefreshing && (
          <div className="flex justify-center my-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingMoreMessages}
              className="text-xs flex items-center gap-1 py-1 border-cybergold-500/30 hover:bg-cyberdark-800"
            >
              {isLoadingMoreMessages ? (
                <Spinner size="sm" />
              ) : (
                <RotateCcw size={14} className="mr-1" />
              )}
              Last eldre meldinger
            </Button>
          </div>
        )}
        
        {/* Message groups */}
        {messageGroups.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`} className="mb-4">
            {/* Time separator */}
            <div className="flex justify-center mb-3">
              <div className="px-2 py-1 bg-cyberdark-800/70 rounded-full text-xs text-cybergold-500">
                {formatMessageTimestamp(new Date(group[0]?.timestamp || Date.now()), true)}
              </div>
            </div>
            
            {/* Messages in this time group */}
            {group.map((message) => {
              const isUser = isUserMessage(message);
              const isRevealed = revealedMessageId === message.id;
              
              return (
                <div 
                  key={message.id}
                  className={`mb-2 ${isUser ? 'flex justify-end' : ''}`}
                  onTouchStart={() => handleSwipeStart(message.id)}
                >
                  {/* Message container with swipe reveal */}
                  <div className="relative max-w-[85%]">
                    {/* Message bubble */}
                    <div
                      className={`
                        rounded-2xl px-3 py-2 
                        ${isUser 
                          ? 'bg-gradient-to-r from-cyberblue-900/90 to-cyberblue-800/80 text-white ml-auto' 
                          : 'bg-cyberdark-800 text-white'
                        }
                        ${message.is_edited ? 'border-l-2 border-cybergold-500/50' : ''}
                        relative overflow-hidden
                      `}
                    >
                      {/* Sender info (only for non-user messages) */}
                      {!isUser && (
                        <div className="flex items-center mb-1">
                          <Avatar className="h-5 w-5 mr-1">
                            {message.sender?.avatar_url ? (
                              <img 
                                src={message.sender.avatar_url} 
                                alt={message.sender.username || 'User'} 
                              />
                            ) : (
                              <div className="bg-cybergold-900/50 text-cybergold-400 text-xs flex items-center justify-center h-full w-full">
                                {(message.sender?.username || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Avatar>
                          <span className="text-xs font-medium text-cybergold-300">
                            {message.sender?.username || 'Unknown'}
                          </span>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div>
                        {/* Text content */}
                        {message.content && (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        )}
                        
                        {/* Media content (images, etc) */}
                        {message.media_url && (
                          <div className="mt-1 max-w-full overflow-hidden rounded-lg">
                            <img 
                              src={message.media_url} 
                              alt="Media" 
                              className="max-w-full h-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        {/* Message footer with timestamp, edited indicator and TTL */}
                        <div className="flex items-center justify-end mt-1 text-xs text-cybergold-500/70 gap-1">
                          {message.is_edited && (
                            <span className="mr-1 italic">Redigert</span>
                          )}
                          <span>
                            {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.ttl > 0 && (
                            <span className="ml-1 text-cyberred-400">
                              ⏱️
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Swipe-revealed action buttons */}
                    {isRevealed && (
                      <div className={`absolute top-0 ${isUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} h-full flex items-center gap-1`}>
                        {/* Reply button */}
                        {onReplyMessage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full bg-cyberdark-800 p-0"
                            onClick={() => {
                              onReplyMessage(message);
                              setRevealedMessageId(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cybergold-400">
                              <path d="M9 17 L3 12 L9 7"></path>
                              <path d="M21 12 L5 12"></path>
                            </svg>
                          </Button>
                        )}
                        
                        {/* Delete button (only for user's messages) */}
                        {isUser && onDeleteMessage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full bg-red-900/40 p-0"
                            onClick={() => {
                              onDeleteMessage(message.id);
                              setRevealedMessageId(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                              <path d="M8 6V4a2 2 0 0 1-2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
            <div className="w-16 h-16 rounded-full bg-cyberdark-800 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cybergold-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"></path>
              </svg>
            </div>
            <p className="text-cybergold-400 font-medium">Ingen meldinger ennå</p>
            <p className="text-cybergold-500 text-sm mt-1">Start samtalen ved å sende en melding</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute right-4 bottom-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToBottom}
            className="rounded-full shadow-lg bg-cyberdark-800 border border-cyberblue-500/30 h-10 w-10 flex items-center justify-center"
          >
            <ChevronDown size={20} className="text-cybergold-400" />
            {newMessageCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-cyberred-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {newMessageCount > 99 ? '99+' : newMessageCount}
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileMessageList;