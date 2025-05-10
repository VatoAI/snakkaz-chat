
import { DecryptedMessage } from '@/types/message.d';
import React, { useState } from 'react';
import { UserStatus } from '@/types/presence';
import { SecurityLevel } from '@/types/security';
import { ArrowDownToLine, File, Image, Video } from 'lucide-react';

interface MessageBodyContentProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  userStatus?: UserStatus;
  onMessageExpired?: (messageId: string) => void;
  securityLevel?: SecurityLevel;
}

export const MessageBodyContent: React.FC<MessageBodyContentProps> = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  userStatus,
  onMessageExpired,
  securityLevel
}) => {
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  
  if (!message) return null;
  
  const isRead = isMessageRead?.(message.id) || false;
  const hasMedia = message.media_url || message.media_type;
  
  return (
    <div className="w-full">
      {/* Message content */}
      {message.content && (
        <div className="mb-2 text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
      )}
      
      {/* Media content if present */}
      {hasMedia && (
        <div className="mb-2">
          <MediaPreview message={message} />
        </div>
      )}
      
      {/* Message footer - metadata, status, etc. */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center text-xs text-cybergold-600/70">
          {message.is_edited && (
            <span className="mr-1">(redigert)</span>
          )}
          
          {/* Time to live indicator */}
          {message.ttl && message.ttl > 0 && (
            <span className="ml-1">
              Forsvinner om {message.ttl}s
            </span>
          )}
        </div>
        
        {/* Delivery status for own messages */}
        {isCurrentUser && (
          <div className="text-xs text-cybergold-500">
            {message.isPending && "Sender..."}
            {!message.isPending && isRead && "Lest"}
            {!message.isPending && !isRead && "Levert"}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for media preview
const MediaPreview: React.FC<{ message: DecryptedMessage }> = ({ message }) => {
  if (!message.media_url) return null;
  
  const mediaType = message.media_type || 'unknown';
  
  if (mediaType.startsWith('image/')) {
    return (
      <div className="relative rounded overflow-hidden max-w-xs max-h-48">
        <img
          src={message.media_url}
          alt="Bildebeskjed"
          className="max-w-full max-h-48 object-contain"
        />
      </div>
    );
  }
  
  if (mediaType.startsWith('video/')) {
    return (
      <div className="rounded overflow-hidden bg-black/30 p-2 flex items-center">
        <Video className="text-cybergold-400 w-5 h-5 mr-2" />
        <span className="text-xs text-cybergold-300">Video</span>
        <a 
          href={message.media_url} 
          download 
          className="ml-auto p-1 rounded-full hover:bg-cyberdark-800"
        >
          <ArrowDownToLine className="w-4 h-4 text-cybergold-400" />
        </a>
      </div>
    );
  }
  
  // Default file preview
  return (
    <div className="rounded overflow-hidden bg-black/30 p-2 flex items-center">
      <File className="text-cybergold-400 w-5 h-5 mr-2" />
      <span className="text-xs text-cybergold-300 truncate flex-1">
        {message.media_url.split('/').pop() || 'Fil'}
      </span>
      <a 
        href={message.media_url} 
        download 
        className="ml-2 p-1 rounded-full hover:bg-cyberdark-800"
      >
        <ArrowDownToLine className="w-4 h-4 text-cybergold-400" />
      </a>
    </div>
  );
};
