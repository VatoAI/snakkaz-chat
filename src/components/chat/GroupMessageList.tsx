
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { GroupMessage } from '@/types/group';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMessageGrouping } from '@/hooks/useMessageGrouping';
import { useInView } from 'react-intersection-observer';

interface GroupMessageListProps {
  messages: GroupMessage[];
  isLoading: boolean;
  userProfiles?: Record<string, {
    displayName?: string;
    photoURL?: string;
    [key: string]: any;
  }>;
  onMessageEdit?: (message: GroupMessage) => void;
  onMessageDelete?: (messageId: string) => void;
  onMessageReply?: (message: GroupMessage) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onLoadMore?: () => void;
  hasMoreMessages?: boolean;
  isEncryptedGroup?: boolean;
  currentUserId?: string;
  loadMoreMessages?: () => void;
}

const LOAD_MORE_THRESHOLD = 200; // px from top when we should load more messages

export const GroupMessageList: React.FC<GroupMessageListProps> = ({
  messages,
  isLoading,
  userProfiles = {},
  onMessageEdit,
  onMessageDelete,
  onMessageReply,
  onReactionAdd,
  onLoadMore,
  hasMoreMessages = false,
  isEncryptedGroup = false,
  currentUserId,
  loadMoreMessages
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [replyTargetMessages, setReplyTargetMessages] = useState<Record<string, GroupMessage>>({});
  
  // Use custom hook to group messages by time - pass messages as an object property
  const { groupedMessages, getDateSeparatorText } = useMessageGrouping({ messages });
  
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

  // Fetch reply messages
  useEffect(() => {
    const replyIds = messages
      .filter(m => m.replyToId && !replyTargetMessages[m.replyToId])
      .map(m => m.replyToId as string);
      
    if (replyIds.length === 0) return;
    
    // Here we would normally fetch replyTo messages from API
    // This is a simplified version that just finds them from current messages array
    const foundMessages = messages.filter(m => m.id && replyIds.includes(m.id));
    if (foundMessages.length > 0) {
      const newReplyTargets = {...replyTargetMessages};
      foundMessages.forEach(m => {
        newReplyTargets[m.id] = m;
      });
      setReplyTargetMessages(newReplyTargets);
    }
  }, [messages, replyTargetMessages]);

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
      
      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([dateKey, messagesForDate]) => (
        <div key={dateKey} className="space-y-1">
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-cyberdark-800 text-cybergold-500 px-3 py-1 rounded-full text-xs">
              {getDateSeparatorText(dateKey)}
            </div>
          </div>
          
          {/* Messages for this date */}
          {(messagesForDate as GroupMessage[]).map(message => {
            const isCurrentUser = message.senderId === userId || message.sender_id === userId;
            
            // Find reply message if this message is a reply
            let replyToMessage = null;
            if (message.replyToId || message.reply_to_id) {
              const replyId = message.replyToId || message.reply_to_id;
              replyToMessage = replyId ? replyTargetMessages[replyId] : null;
            }
            
            // Handle date conversion safely
            const createdAtString = (): string => {
              if (typeof message.createdAt === 'string') {
                return message.createdAt;
              } else if (message.createdAt instanceof Date) {
                return message.createdAt.toISOString();
              } else if (typeof message.created_at === 'string') {
                return message.created_at;
              } else if (message.created_at instanceof Date) {
                return message.created_at.toISOString();
              }
              return new Date().toISOString(); // Fallback
            };
            
            return (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.text || message.content || '',
                  sender_id: message.senderId || message.sender_id || '',
                  created_at: createdAtString(),
                  media: (message.mediaUrl || message.media_url) ? {
                    url: message.mediaUrl || message.media_url || '',
                    type: message.mediaType || message.media_type || 'image'
                  } : undefined,
                  ttl: message.ttl,
                  status: 'sent',
                  readBy: message.readBy || message.read_by,
                  replyTo: message.replyToId || message.reply_to_id,
                  replyToMessage: replyToMessage ? {
                    content: replyToMessage.text || replyToMessage.content || '',
                    sender_id: replyToMessage.senderId || replyToMessage.sender_id || ''
                  } : undefined
                }}
                isCurrentUser={isCurrentUser}
                userProfiles={userProfiles}
                onEdit={onMessageEdit ? () => onMessageEdit(message) : undefined}
                onDelete={onMessageDelete ? () => onMessageDelete(message.id) : undefined}
                onReply={onMessageReply ? () => onMessageReply(message) : undefined}
                isEncrypted={isEncryptedGroup || (message.isEncrypted || message.is_encrypted || false)}
              />
            );
          })}
        </div>
      ))}
      
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
