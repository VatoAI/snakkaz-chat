import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { cx } from '../lib/theme';
import { Loader2, WifiOff, RefreshCw } from 'lucide-react';
import { DecryptedMessage } from '@/types/message.d';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define UserProfile directly in the file to avoid import issues
interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  [key: string]: unknown;
}

interface ChatMessageListProps {
  messages: Array<DecryptedMessage>;
  currentUserId: string;
  userProfiles?: Record<string, UserProfile>;
  onEdit?: (message: DecryptedMessage) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => Promise<void>;
  onCopy?: (content: string) => void;
  onShare?: (message: DecryptedMessage) => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  chatType?: 'private' | 'group' | 'global';
  pinnedMessageIds?: Set<string>;
  canPin?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles = {},
  onEdit,
  onDelete,
  onPin,
  onCopy,
  onShare,
  isLoading = false,
  hasMoreMessages = false,
  isLoadingMore = false,
  onLoadMore,
  className = '',
  chatType = 'private',
  pinnedMessageIds = new Set(),
  canPin = true,
}) => {
  const { toast } = useToast();
  const { online, wasOffline, reconnecting, forceReconnect } = useNetworkStatus({
    enablePing: true,
    pingUrl: '/api/chat/ping',
    onReconnect: () => {
      toast({
        title: 'Tilkoblet igjen',
        description: 'Du er nå tilkoblet chat-serveren igjen.',
        variant: 'default'
      });
      
      // Oppdater meldinger når tilkoblingen er gjenopprettet
      if (onLoadMore && messages.length > 0) {
        onLoadMore();
      }
    },
    onOffline: () => {
      toast({
        title: 'Mistet tilkobling',
        description: 'Jobber med å gjenopprette forbindelsen...',
        variant: 'destructive'
      });
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copyMessageSuccess, setCopyMessageSuccess] = useState<string | null>(null);
  
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

  // Handle copy message
  const handleCopyMessage = (content: string) => {
    if (onCopy) {
      onCopy(content);
    } else {
      // Default copy behavior if onCopy not provided
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopyMessageSuccess('Copied to clipboard');
          setTimeout(() => setCopyMessageSuccess(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy message:', err);
        });
    }
  };

  // Handle share message
  const handleShareMessage = (message: DecryptedMessage) => {
    if (onShare) {
      onShare(message);
    } else {
      // Default share behavior if onShare not provided
      console.log('Share message:', message);
      // Could implement a basic share dialog here
    }
  };
  
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
      
      {/* Copy success notification */}
      {copyMessageSuccess && (
        <div className="fixed top-4 right-4 bg-cybergold-600 text-cyberdark-900 px-3 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {copyMessageSuccess}
        </div>
      )}
      
      {/* Network status indicator */}
      {!online && (
        <div className="sticky top-0 left-0 right-0 z-10 bg-red-900/80 text-white p-2 rounded-md mb-3 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff size={18} />
            <span>Mistet tilkobling til server{reconnecting ? ' – forsøker å koble til...' : ''}</span>
          </div>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={forceReconnect} 
            className="bg-red-700 hover:bg-red-800 text-white"
            disabled={reconnecting}
          >
            {reconnecting ? (
              <RefreshCw size={16} className="mr-1 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-1" />
            )}
            Koble til på nytt
          </Button>
        </div>
      )}

      {/* Reconnection notification */}
      {online && wasOffline && (
        <div className="sticky top-0 left-0 right-0 z-10 bg-green-900/80 text-white p-2 rounded-md mb-3 backdrop-blur-sm flex items-center">
          <div className="flex items-center gap-2 w-full justify-between">
            <span>Tilkobling gjenopprettet</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={onLoadMore}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Oppdater meldinger
            </Button>
          </div>
        </div>
      )}
      
      {/* Messages */}
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
          userProfiles={userProfiles}
          onEdit={onEdit ? () => onEdit(message) : undefined}
          onDelete={onDelete ? () => onDelete(message.id) : undefined}
          onPin={onPin ? () => onPin(message.id) : undefined}
          onCopy={handleCopyMessage}
          onShare={onShare ? () => handleShareMessage(message) : undefined}
          isPinned={pinnedMessageIds.has(message.id)}
          canPin={canPin}
          chatType={chatType}
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
