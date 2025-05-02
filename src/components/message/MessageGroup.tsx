
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';

interface MessageGroupProps {
  groupedMessages: Record<string, DecryptedMessage[]>;
  getDateSeparatorText: (dateKey: string) => string;
  getUserStatus: (userId: string) => UserStatus;
  messages?: DecryptedMessage[]; // Add this to fix the error
  isUserMessage?: (message: any) => boolean; // Add this for compatibility
  onMessageExpired?: (messageId: any) => void; // Add this for compatibility
  onEditMessage?: (message: DecryptedMessage) => void; // Add this for compatibility
  onDeleteMessage?: (messageId: string) => void; // Add this for compatibility
  securityLevel?: string; // Add this for compatibility
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  groupedMessages,
  getDateSeparatorText,
  getUserStatus,
  messages = [], // Provide a default value
  isUserMessage = () => false, // Default implementation
  onMessageExpired = () => {}, // Default implementation
  onEditMessage,
  onDeleteMessage,
  securityLevel
}) => {
  return (
    <div className="message-groups">
      {Object.entries(groupedMessages).map(([dateKey, messagesForDate]) => (
        <div key={dateKey} className="message-group">
          <div className="date-separator">
            <span className="date-text">{getDateSeparatorText(dateKey)}</span>
          </div>
          
          <div className="messages-container">
            {messagesForDate.map((message, index) => (
              <div key={message.id} className="message-item">
                {/* Message content would be rendered here */}
                <div className="message-content">
                  {message.content}
                </div>
                
                {/* Sender information */}
                <div className="message-sender">
                  <span className="sender-name">{message.sender.username || 'Unknown User'}</span>
                  <span className="message-time">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  
                  {/* User status indicator */}
                  <div className={`status-indicator ${getUserStatus(message.sender.id)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
