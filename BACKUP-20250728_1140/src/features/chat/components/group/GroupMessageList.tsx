
import { memo, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../common/ChatMessage';
import { GroupMessage } from '@/types/group';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import { EncryptionStatus } from '@/components/chat/security/EncryptionIndicator';

interface GroupMessageListProps {
  messages: GroupMessage[];
  isLoading?: boolean;
  userProfiles?: Record<string, {
    displayName?: string;
    photoURL?: string;
    [key: string]: any;
  }>;
  onMessageEdit?: (message: GroupMessage) => void;
  onMessageDelete?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onLoadMore?: () => void;
  hasMoreMessages?: boolean;
  isEncryptedGroup?: boolean;
  currentUserId?: string;
  loadMoreMessages?: () => void;
}

export const GroupMessageList = memo(({
  messages = [],
  isLoading = false,
  userProfiles = {},
  onMessageEdit,
  onMessageDelete,
  onLoadMore,
  hasMoreMessages = false,
  isEncryptedGroup = false,
  currentUserId
}: GroupMessageListProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // IntersectionObserver to load more messages when scrolling to top
  const { ref: topLoadingRef } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasMoreMessages && onLoadMore) {
        onLoadMore();
      }
    },
  });

  // Watch if we're at the bottom of the list
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      setAutoScrollEnabled(isNearBottom);
      setShowScrollToBottom(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom when new messages come in if autoScroll is on
  useEffect(() => {
    if (autoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, autoScrollEnabled]);

  // Fetch reply messages (simplified - skip for now since GroupMessage doesn't have reply fields)
  useEffect(() => {
    // Skip reply functionality for now since GroupMessage type doesn't include reply fields
    // This can be added when the database schema and types are updated
  }, [messages]);

  // Function to scroll to bottom of the list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScrollEnabled(true);
    }
  };

  const userId = currentUserId || user?.id;
  if (!userId) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto px-2 md:px-4 pt-2 pb-2 bg-cyberdark-950"
    >
      {/* Load more messages indicator */}
      {hasMoreMessages && (
        <div
          ref={topLoadingRef}
          className="flex justify-center py-4"
        >
          {isLoading && (
            <Loader2 className="h-6 w-6 text-cybergold-500 animate-spin" />
          )}
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {messages.map(message => {
          const isCurrentUser = message.sender_id === userId;

          return (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                content: message.content || '',
                sender_id: message.sender_id,
                created_at: message.created_at,
                media: message.media_url ? {
                  url: message.media_url,
                  type: message.media_type || 'image'
                } : undefined,
                status: 'sent',
                // Encryption related fields
                encrypted: isEncryptedGroup,
                transmission_type: isEncryptedGroup ? 'mcp' : 'supabase'
              }}
              isCurrentUser={isCurrentUser}
              userProfiles={userProfiles}
              onEdit={onMessageEdit ? () => onMessageEdit(message) : undefined}
              onDelete={onMessageDelete ? () => onMessageDelete(message.id) : undefined}
              // Pass encryption information to ChatMessage
              encryptionStatus={
                isEncryptedGroup
                  ? 'group-encrypted' as EncryptionStatus
                  : 'not-encrypted' as EncryptionStatus
              }
              transmissionType={isEncryptedGroup ? 'mcp' : 'supabase'}
              showEncryptionIndicator={true}
            />
          );
        })}
      </div>

      {/* Empty chat message */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-cybergold-600">
          <p>Ingen meldinger enda.</p>
          <p className="text-sm mt-1">Start en samtale!</p>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-cybergold-500 animate-spin mb-2" />
          <p className="text-cybergold-600">Laster meldinger...</p>
        </div>
      )}

      {/* Reference to bottom of the list for auto-scroll */}
      <div ref={messagesEndRef} />

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 rounded-full h-10 w-10 border border-cybergold-600 bg-cyberdark-900 hover:bg-cyberdark-800 shadow-md"
        >
          <ChevronDown className="h-5 w-5 text-cybergold-400" />
        </Button>
      )}
    </div>
  );
};

export default GroupMessageList;
