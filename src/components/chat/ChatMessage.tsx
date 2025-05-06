
import React, { useState } from 'react';
import { DecryptedMessage } from '@/types/message.d';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { MoreVertical, Edit, Trash, Check, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: Partial<DecryptedMessage>;
  isCurrentUser: boolean;
  userProfiles: Record<string, any>;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser,
  userProfiles,
  onEdit,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  
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
  
  // Check if message has been edited
  const isEdited = message.is_edited === true || message.isEdited === true;
  
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
        }`}
        onMouseEnter={() => isCurrentUser && setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
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
        {isCurrentUser && showActions && (onEdit || onDelete) && (
          <div className="absolute top-2 right-2 bg-cyberdark-900 rounded-md shadow-lg overflow-hidden">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="p-2 hover:bg-cyberdark-800"
              >
                <Edit className="w-4 h-4 text-cybergold-500" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={onDelete}
                className="p-2 hover:bg-cyberdark-800"
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
