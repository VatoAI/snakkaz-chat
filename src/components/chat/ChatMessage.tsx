import React, { useState } from 'react';
import { DecryptedMessage } from '@/types/message.d';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { MoreVertical, Edit, Trash, Check, Clock, Pin, Share, Copy } from 'lucide-react';

// Define UserProfile type to avoid using 'any'
interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  [key: string]: unknown;
}

interface ChatMessageProps {
  message: Partial<DecryptedMessage>;
  isCurrentUser: boolean;
  userProfiles: Record<string, UserProfile>;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: (id: string) => Promise<void>;
  onCopy?: (content: string) => void;
  onShare?: (message: Partial<DecryptedMessage>) => void;
  isPinned?: boolean;
  canPin?: boolean;
  chatType?: 'private' | 'group' | 'global';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser,
  userProfiles,
  onEdit,
  onDelete,
  onPin,
  onCopy,
  onShare,
  isPinned = false,
  canPin = true,
  chatType = 'private'
}) => {
  const [showActions, setShowActions] = useState(false);
  const [pinning, setPinning] = useState(false);
  
  // Handle undefined sender_id
  const senderId = message.sender_id || message.sender?.id || '';
  const profile = userProfiles[senderId] || {
    username: 'Unknown',
    avatar_url: null
  };
  
  // Format timestamp
  const formattedTime = message.created_at 
    ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: nb })
    : '';
  
  // Handle opening/closing action menu
  const toggleActions = () => setShowActions(!showActions);
  
  // Check if message has been edited - use is_edited consistently
  const isEdited = message.is_edited === true;

  // Handle pin action
  const handlePinMessage = async () => {
    if (!onPin || !message.id) return;
    
    try {
      setPinning(true);
      await onPin(message.id);
    } catch (error) {
      console.error('Failed to pin message:', error);
    } finally {
      setPinning(false);
      setShowActions(false);
    }
  };

  // Handle copy action
  const handleCopyMessage = () => {
    if (!onCopy || !message.content) return;
    onCopy(message.content);
    setShowActions(false);
  };

  // Handle share action
  const handleShareMessage = () => {
    if (!onShare) return;
    onShare(message);
    setShowActions(false);
  };
  
  return (
    <div className={`flex gap-3 group ${isCurrentUser ? 'justify-end' : ''}`}>
      {/* Avatar for non-user messages */}
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-cyberdark-800">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.username} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cybergold-500 font-medium">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      
      {/* Message content */}
      <div 
        className={`relative max-w-[75%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-cybergold-900/30 text-cybergold-50' 
            : 'bg-cyberdark-800 text-gray-200'
        } ${isPinned ? 'border-l-2 border-cybergold-500' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Pinned indicator */}
        {isPinned && (
          <div className="absolute -left-1 -top-1 bg-cybergold-500 rounded-full p-0.5 transform -translate-x-1/2 -translate-y-1/2">
            <Pin size={10} className="text-cyberdark-900" />
          </div>
        )}
        
        {/* Sender name for non-user messages */}
        {!isCurrentUser && (
          <div className="text-xs font-medium text-cybergold-400 mb-1">
            {profile.username}
          </div>
        )}
        
        {/* Message text */}
        {!message.is_deleted ? (
          <div className="text-sm break-words">
            {message.content}
          </div>
        ) : (
          <div className="text-sm italic text-gray-500">
            Denne meldingen er slettet
          </div>
        )}
        
        {/* Message metadata */}
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{formattedTime}</span>
          
          {/* Edit indicator */}
          {isEdited && (
            <span className="ml-2 flex items-center">
              <Check className="w-3 h-3 mr-1" />
              redigert
            </span>
          )}
          
          {/* TTL indicator */}
          {(message.ttl || message.ttl === 0) && (
            <span className="ml-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {message.ttl > 0 ? `${message.ttl}s` : 'Utløper straks'}
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        {showActions && !message.is_deleted && (
          <div className="absolute top-2 right-2 bg-cyberdark-900 rounded-md shadow-lg overflow-hidden flex">
            {/* Pin/Unpin */}
            {canPin && onPin && (
              <button 
                onClick={handlePinMessage}
                disabled={pinning}
                className={`p-2 hover:bg-cyberdark-800 ${isPinned ? 'bg-cyberdark-800' : ''}`}
                title={isPinned ? "Unpin message" : "Pin message"}
              >
                <Pin className={`w-4 h-4 ${isPinned ? 'text-cybergold-400' : 'text-gray-400'} ${pinning ? 'animate-pulse' : ''}`} />
              </button>
            )}
            
            {/* Copy */}
            {onCopy && (
              <button 
                onClick={handleCopyMessage}
                className="p-2 hover:bg-cyberdark-800"
                title="Copy message"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {/* Share */}
            {onShare && (
              <button 
                onClick={handleShareMessage}
                className="p-2 hover:bg-cyberdark-800"
                title="Share message"
              >
                <Share className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {/* Edit - only for current user */}
            {isCurrentUser && onEdit && (
              <button 
                onClick={onEdit}
                className="p-2 hover:bg-cyberdark-800"
                title="Edit message"
              >
                <Edit className="w-4 h-4 text-cybergold-500" />
              </button>
            )}
            
            {/* Delete - only for current user or moderators */}
            {isCurrentUser && onDelete && (
              <button 
                onClick={onDelete}
                className="p-2 hover:bg-cyberdark-800"
                title="Delete message"
              >
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
