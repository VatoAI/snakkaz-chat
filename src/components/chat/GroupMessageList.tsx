import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { GroupMessage } from '@/types/group';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ChevronDown, MessageSquare } from 'lucide-react';
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
    [key: string]: string | number | boolean | undefined;
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
  
  // Prepare messages for grouping by ensuring each has the right structure
  const preparedMessages = messages.map(msg => ({
    ...msg,
    senderId: msg.senderId || msg.sender_id || '',
    createdAt: msg.createdAt || msg.created_at || new Date()
  }));
  
  // Use custom hook to group messages by time - fixed to properly use the returned array
  const groupedMessages = useMessageGrouping(preparedMessages);
  
  // Helper function to format date separators
  const getDateSeparatorText = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };
  
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
      .filter(m => {
        const replyId = m.replyToId || m.reply_to_id;
        return replyId && !replyTargetMessages[replyId];
      })
      .map(m => (m.replyToId || m.reply_to_id) as string)
      .filter(Boolean);
      
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

  // Helper function to handle date safely
  const getIsoString = (dateInput: string | number | Date | undefined): string => {
    if (!dateInput) return new Date().toISOString();
    
    if (typeof dateInput === 'string') {
      return new Date(dateInput).toISOString();
    }
    
    if (typeof dateInput === 'number') {
      return new Date(dateInput).toISOString();
    }
    
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }
    
    return new Date().toISOString();
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto px-2 md:px-4 pt-2 pb-2 bg-gradient-to-b from-cyberdark-950 to-cyberdark-900"
    >
      {/* Load more messages indicator */}
      {hasMoreMessages && (
        <div 
          ref={topLoadingRef} 
          className="flex justify-center py-4 opacity-80"
        >
          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-6 w-6 text-cybergold-500 animate-spin mb-1" />
              <span className="text-xs text-cybergold-600">Laster tidligere meldinger...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Array.isArray(groupedMessages) && groupedMessages.map((group, groupIndex) => (
        <div key={`group-${group.senderId}-${groupIndex}`} className="space-y-1 mb-3">
          {/* Date separator */}
          {groupIndex === 0 || new Date(group.timestamp).toDateString() !== 
            new Date(groupedMessages[groupIndex - 1].timestamp).toDateString() ? (
            <div className="flex items-center justify-center my-4">
              <div className="bg-gradient-to-r from-cyberdark-950 via-cyberdark-800 to-cyberdark-950 text-cybergold-500 
                           px-4 py-1.5 rounded-full text-xs shadow-sm border-t border-b border-cybergold-800/20">
                {getDateSeparatorText(group.timestamp)}
              </div>
            </div>
          ) : null}
          
          {/* Messages for this group */}
          {group.messages.map(message => {
            const isCurrentUser = (message.senderId || message.sender_id) === userId;
            
            // Find reply message if this message is a reply
            let replyToMessage = null;
            const replyId = message.replyToId || message.reply_to_id;
            if (replyId) {
              replyToMessage = replyTargetMessages[replyId];
            }
            
            return (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content || message.text || '',
                  sender_id: message.senderId || message.sender_id || '',
                  created_at: getIsoString(message.createdAt || message.created_at),
                  media: (message.mediaUrl || message.media_url) ? {
                    url: message.mediaUrl || message.media_url || '',
                    type: message.mediaType || message.media_type || 'image'
                  } : undefined,
                  ttl: message.ttl,
                  status: 'sent',
                  readBy: message.readBy || message.read_by,
                  replyTo: message.replyToId || message.reply_to_id,
                  replyToMessage: replyToMessage ? {
                    content: replyToMessage.content || replyToMessage.text || '',
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
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-cyberdark-800/50 border border-cyberdark-700 mb-3 w-16 h-16 
                         flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8 text-cybergold-500 opacity-70" />
          </div>
          <p className="text-cybergold-400 font-medium mb-1">Ingen meldinger enda</p>
          <p className="text-sm text-cybergold-600">
            Send den første meldingen for å starte samtalen!
          </p>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
          <div className="p-5 rounded-xl bg-cyberdark-800/60 border border-cyberdark-700 mb-4">
            <Loader2 className="h-10 w-10 text-cybergold-500 animate-spin" />
          </div>
          <p className="text-cybergold-400 font-medium">Laster samtale</p>
          <p className="text-sm text-cybergold-600 mt-1">Henter meldinger...</p>
        </div>
      )}
      
      {/* Reference to bottom of the list for auto-scroll */}
      <div ref={messagesEndRef} />
      
      {/* Scroll to bottom button - more mobile friendly */}
      {showScrollToBottom && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 md:bottom-24 md:right-6 rounded-full h-10 w-10 md:h-11 md:w-11 border border-cybergold-700/30 
                    bg-gradient-to-br from-cyberdark-800 to-cyberdark-900 hover:bg-cyberdark-800 
                    shadow-md hover:shadow-lg hover:border-cybergold-500/40 transition-all duration-300 z-10"
        >
          <ChevronDown className="h-5 w-5 text-cybergold-500" />
        </Button>
      )}
    </div>
  );
};

export default GroupMessageList;
