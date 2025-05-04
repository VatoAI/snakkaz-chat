import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DirectMessage: React.FC<{
  message: DecryptedMessage;
  currentUserId: string;
  onClick?: () => void;
}> = ({ message, currentUserId, onClick }) => {
  const isCurrentUser = message.sender?.id === currentUserId;
  const messageDate = new Date(message.created_at);
  const timeAgo = formatDistanceToNow(messageDate, { addSuffix: true, locale: nb });

  const sender = {
    id: message.sender?.id || '',
    username: message.sender?.username || 'Unknown',
    full_name: message.sender?.full_name || null,
    avatar_url: message.sender?.avatar_url || '/images/default-avatar.png'
  };

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg w-fit max-w-[75%] break-words",
        isCurrentUser ? "bg-cybergold-700 text-black ml-auto" : "bg-cyberdark-700 text-cybergold-200 mr-auto",
        "hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{sender.username}</span>
        <span className="text-xs text-cybergold-400">{timeAgo}</span>
      </div>
      <p className="mt-1">{message.content}</p>
    </div>
  );
};
