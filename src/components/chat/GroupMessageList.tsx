
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DecryptedMessage } from '@/types/message.d';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

// Define our own GroupMessage type that matches the expected structure
export interface GroupMessage {
  id: string;
  content?: string;
  sender_id?: string;
  group_id?: string;
  created_at: string;
  updated_at?: string;
  is_encrypted?: boolean;
  is_deleted?: boolean;
  is_edited?: boolean;
  is_pinned?: boolean;
  is_announcement?: boolean;
  read_by?: string[];
  reply_to_id?: string;
  senderId?: string;
  createdAt?: string;
  isPending?: boolean;
  hasError?: boolean;
  media?: {
    url: string;
    type: string;
    thumbnail?: string;
  };
  replyToId?: string;
}

interface GroupMessageListProps {
  messages: GroupMessage[];
  currentUserId: string;
  userProfiles?: Record<string, any>;
  isLoading?: boolean;
}

export const GroupMessageList: React.FC<GroupMessageListProps> = ({
  messages,
  currentUserId,
  userProfiles = {},
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-cybergold-500" />
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-3">
            <div className="px-3 py-1 rounded text-xs bg-cyberdark-800 text-gray-400">
              {formatDate(date)}
            </div>
          </div>
          
          {dateMessages.map((message) => {
            const isMyMessage = (message.sender_id || message.senderId) === currentUserId;
            const sender = userProfiles[message.sender_id || message.senderId || ''] || { 
              username: 'Unknown User', 
              avatar_url: null 
            };
            
            // Handle reply reference if available
            const replyToId = message.replyToId || message.reply_to_id;
            const replyToMessage = replyToId 
              ? messages.find(m => m.id === replyToId) 
              : null;
              
            const replyToSender = replyToMessage 
              ? userProfiles[replyToMessage.sender_id || replyToMessage.senderId || ''] 
              : null;
            
            return (
              <div 
                key={message.id} 
                className={`flex mb-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                {/* For messages from others, show avatar */}
                {!isMyMessage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 bg-cyberdark-800">
                    {sender.avatar_url ? (
                      <img 
                        src={sender.avatar_url} 
                        alt={sender.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cybergold-400">
                        {sender.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isMyMessage 
                      ? 'bg-cybergold-900/30 text-gray-100' 
                      : 'bg-cyberdark-800 text-gray-100'
                  }`}
                >
                  {/* Sender name for messages from others */}
                  {!isMyMessage && (
                    <div className="text-xs font-medium text-cybergold-400 mb-1">
                      {sender.username}
                    </div>
                  )}
                  
                  {/* Reply reference if any */}
                  {replyToMessage && (
                    <div className="mb-2 pl-2 border-l-2 border-cybergold-600/50">
                      <div className="text-xs text-cybergold-500 mb-0.5">
                        {isMyMessage ? 'Du svarte' : `Svar til ${replyToSender?.username || 'Unknown'}`}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {replyToMessage.content || 'Media'}
                      </div>
                    </div>
                  )}
                  
                  {/* Message content */}
                  {!message.is_deleted ? (
                    <>
                      {message.content && (
                        <div className="text-sm break-words mb-2">
                          {message.content}
                        </div>
                      )}
                      
                      {/* Media content if any */}
                      {message.media && (
                        <div className="rounded overflow-hidden mt-2">
                          {message.media.type.startsWith('image/') ? (
                            <img 
                              src={message.media.url} 
                              alt="Image" 
                              className="max-h-48 rounded"
                            />
                          ) : (
                            <div className="p-2 bg-cyberdark-900 rounded text-xs text-gray-400">
                              [Attachment: {message.media.type}]
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm italic text-gray-500">
                      Denne meldingen er slettet
                    </div>
                  )}
                  
                  {/* Status indicators */}
                  <div className="flex items-center mt-1 text-xs">
                    {/* Time */}
                    <span className="text-gray-500">
                      {formatMessageTime(message.created_at)}
                    </span>
                    
                    {/* Edited indicator */}
                    {message.is_edited && (
                      <span className="ml-1.5 text-gray-500">
                        (redigert)
                      </span>
                    )}
                    
                    {/* Pending indicator */}
                    {message.isPending && (
                      <span className="ml-1.5 text-gray-500">
                        (sender...)
                      </span>
                    )}
                    
                    {/* Error indicator */}
                    {message.hasError && (
                      <span className="ml-1.5 text-red-500">
                        (feilet)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Empty state */}
      {!isLoading && messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-1">Ingen meldinger ennå</p>
          <p className="text-xs text-gray-500">Start samtalen ved å sende en melding</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

// Helper functions
const groupMessagesByDate = (messages: GroupMessage[]) => {
  const groups: Record<string, GroupMessage[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at || message.createdAt || new Date()).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
    return 'I dag';
  } else if (date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
    return 'I går';
  } else {
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  }
};
