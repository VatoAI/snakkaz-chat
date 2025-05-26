/**
 * MobileChatMessageList Component
 * 
 * A mobile-friendly version of the ChatMessageList component that includes
 * touch-based pin functionality and mobile-specific UI optimizations.
 */

import React, { useRef, useEffect, useState } from 'react';
import { Loader2, ChevronDown, RotateCcw } from 'lucide-react';
import { DecryptedMessage } from '@/types/message';
import { MobileChatMessage } from './MobileChatMessage';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { groupMessagesByTime } from '@/utils/messageUtils';
import { formatMessageTimestamp } from '@/utils/dateUtils';
import { useMobilePullToRefresh } from '@/components/message-list/useMobilePullToRefresh';
import { UserProfile } from '@/types/profile';

interface MobileChatMessageListProps {
  messages: Array<DecryptedMessage>;
  currentUserId: string;
  userProfiles?: Record<string, UserProfile>;
  onEdit?: (message: DecryptedMessage) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => Promise<void>;
  onUnpin?: (messageId: string) => Promise<void>;
  onCopy?: (content: string) => void;
  onShare?: (message: DecryptedMessage) => void;
  onReply?: (message: DecryptedMessage) => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMore?: () => Promise<void>;
  className?: string;
  chatType?: 'private' | 'group' | 'global';
  pinnedMessageIds?: Set<string>;
  canPin?: boolean;
  chatId?: string;
  onMessageExpired?: (messageId: string) => void;
}

export const MobileChatMessageList: React.FC<MobileChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles = {},
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onCopy,
  onShare,
  onReply,
  isLoading = false,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onLoadMore,
  className = '',
  chatType = 'private',
  pinnedMessageIds = new Set(),
  canPin = true,
  chatId,
  onMessageExpired
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [copyMessageSuccess, setCopyMessageSuccess] = useState<string | null>(null);
  
  // Process messages into groups by time
  const messageGroups = groupMessagesByTime(messages);
  
  // Handle pull to refresh (load more messages)
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
    message.sender?.id === currentUserId || message.sender_id === currentUserId;
  
  // Handle scroll events to manage scroll-to-bottom button visibility
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    setAutoScroll(distanceFromBottom < 50);
    setShowScrollToBottom(distanceFromBottom >= 50);
    
    if (distanceFromBottom < 50) {
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
        !isUserMessage(lastMessage) &&
        new Date().getTime() - new Date(lastMessage.created_at || Date.now()).getTime() < 60000
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
  
  // Handle copy message
  const handleCopyMessage = (content: string) => {
    if (onCopy) {
      onCopy(content);
    } else {
      // Default copy behavior if onCopy not provided
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopyMessageSuccess('Kopiert til utklippstavlen');
          setTimeout(() => setCopyMessageSuccess(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy message:', err);
        });
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Copy success notification */}
      {copyMessageSuccess && (
        <div className="fixed top-4 right-4 bg-cybergold-600 text-cyberdark-900 px-3 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {copyMessageSuccess}
        </div>
      )}
      
      {/* Messages container */}
      <div 
        ref={scrollAreaRef}
        className={`flex-1 overflow-y-auto p-4 space-y-2 ${className}`}
        onScroll={handleScroll}
      >
        {/* Loading indicator for more messages */}
        {hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore ? () => onLoadMore() : undefined}
              disabled={isLoadingMoreMessages || !onLoadMore}
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
                {formatMessageTimestamp(new Date(group[0]?.created_at || Date.now()), true)}
              </div>
            </div>
            
            {/* Messages in this time group */}
            {group.map((message) => (
              <MobileChatMessage
                key={message.id}
                message={message}
                isCurrentUser={isUserMessage(message)}
                userProfiles={userProfiles}
                onEdit={onEdit ? () => onEdit(message) : undefined}
                onDelete={onDelete ? () => onDelete(message.id) : undefined}
                onPin={onPin}
                onUnpin={onUnpin}
                onCopy={handleCopyMessage}
                onShare={onShare}
                isPinned={pinnedMessageIds.has(message.id)}
                canPin={canPin}
                chatType={chatType}
                chatId={chatId}
                pinnedMessageIds={pinnedMessageIds}
              />
            ))}
          </div>
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
      
      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            onClick={scrollToBottom}
            variant="outline" 
            size="icon"
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

export default MobileChatMessageList;
