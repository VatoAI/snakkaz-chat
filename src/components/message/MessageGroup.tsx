
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';

interface MessageGroupProps {
  groupedMessages: Record<string, DecryptedMessage[]>;
  getDateSeparatorText: (dateKey: string) => string;
  getUserStatus: (userId: string) => UserStatus;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  securityLevel?: string;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  groupedMessages,
  getDateSeparatorText,
  getUserStatus,
  onEditMessage,
  onDeleteMessage,
  securityLevel = 'standard'
}) => {
  return (
    <div className="space-y-6">
      {Object.keys(groupedMessages).map(dateKey => (
        <div key={dateKey} className="space-y-2">
          <div className="text-center">
            <span className="text-xs text-cyberdark-400 bg-cyberdark-900/70 px-2 py-1 rounded-full">
              {getDateSeparatorText(dateKey)}
            </span>
          </div>
          
          <div className="space-y-1">
            {groupedMessages[dateKey].map(message => (
              <div key={message.id} className="message-item">
                {/* Simplified message rendering - in a real app, render actual message content here */}
                <div className="px-4 py-2 rounded-lg bg-cyberdark-800/70 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-cybergold-300">
                      {message.sender?.username || 'Unknown user'}
                    </span>
                    <span className="text-xs text-cyberdark-400">
                      {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="mt-1 text-white">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageGroup;
