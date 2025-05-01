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
}

const LOAD_MORE_THRESHOLD = 200; // px fra toppen når vi skal laste flere meldinger

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
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [replyTargetMessages, setReplyTargetMessages] = useState<Record<string, GroupMessage>>({});
  
  // Bruk custom hook for å gruppere meldinger etter tid - pass messages as an object property
  const { groupedMessages, getDateSeparatorText } = useMessageGrouping({ messages });
  
  // IntersectionObserver for å laste flere meldinger når vi scroller til toppen
  const { ref: topLoadingRef } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasMoreMessages && onLoadMore) {
        onLoadMore();
      }
    },
  });

  // Følg med på om vi er i bunnen av listen
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

  // Scroll til bunnen når nye meldinger kommer, hvis autoScroll er på
  useEffect(() => {
    if (autoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, autoScrollEnabled]);

  // Hent reply-meldinger
  useEffect(() => {
    const replyIds = messages
      .filter(m => m.replyToId && !replyTargetMessages[m.replyToId])
      .map(m => m.replyToId as string);
      
    if (replyIds.length === 0) return;
    
    // Her ville vi normalt hente replyTo-meldinger fra API
    // Dette er en forenklet versjon som bare finner dem fra nåværende meldingsarray
    const foundMessages = messages.filter(m => replyIds.includes(m.id));
    if (foundMessages.length > 0) {
      const newReplyTargets = {...replyTargetMessages};
      foundMessages.forEach(m => {
        newReplyTargets[m.id] = m;
      });
      setReplyTargetMessages(newReplyTargets);
    }
  }, [messages, replyTargetMessages]);

  // Funksjon for å scrolle til bunnen av listen
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScrollEnabled(true);
    }
  };

  if (!user) return null;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-y-auto px-2 md:px-4 pt-2 pb-2 bg-cyberdark-950"
    >
      {/* Lasting flere meldinger indikator */}
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
      
      {/* Grupperte meldinger med datoseparatorer */}
      {Object.entries(groupedMessages).map(([dateKey, messagesForDate]) => (
        <div key={dateKey} className="space-y-1">
          {/* Dato-separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-cyberdark-800 text-cybergold-500 px-3 py-1 rounded-full text-xs">
              {getDateSeparatorText(dateKey)}
            </div>
          </div>
          
          {/* Meldinger for denne datoen */}
          {(messagesForDate as GroupMessage[]).map(message => {
            const isCurrentUser = message.senderId === user.id;
            
            // Finn reply-meldingen hvis denne meldingen er et svar
            let replyToMessage = null;
            if (message.replyToId) {
              replyToMessage = replyTargetMessages[message.replyToId] || null;
            }
            
            return (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.text || '',
                  sender_id: message.senderId,
                  created_at: message.createdAt instanceof Date ? message.createdAt.toISOString() : message.createdAt,
                  media: message.mediaUrl ? {
                    url: message.mediaUrl,
                    type: message.mediaType || 'image'
                  } : null,
                  ttl: message.ttl,
                  status: 'sent',
                  readBy: message.readBy,
                  replyTo: message.replyToId,
                  replyToMessage: replyToMessage ? {
                    content: replyToMessage.text || '',
                    sender_id: replyToMessage.senderId
                  } : undefined
                }}
                isCurrentUser={isCurrentUser}
                userProfiles={userProfiles}
                onEdit={onMessageEdit ? () => onMessageEdit(message) : undefined}
                onDelete={onMessageDelete ? () => onMessageDelete(message.id) : undefined}
                onReply={onMessageReply ? () => onMessageReply(message) : undefined}
                isEncrypted={isEncryptedGroup || (message.isEncrypted || false)}
              />
            );
          })}
        </div>
      ))}
      
      {/* Melding når chatten er tom */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-cybergold-600">
          <p>Ingen meldinger enda.</p>
          <p className="text-sm mt-1">Start en samtale!</p>
        </div>
      )}
      
      {/* Laster-indikator */}
      {isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-cybergold-500 animate-spin mb-2" />
          <p className="text-cybergold-600">Laster meldinger...</p>
        </div>
      )}
      
      {/* Referanse til bunnen av listen for auto-scroll */}
      <div ref={messagesEndRef} />
      
      {/* Scroll til bunnen knapp */}
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