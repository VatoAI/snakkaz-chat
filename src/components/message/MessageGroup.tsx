
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { UserStatus } from '@/types/presence';

interface MessageGroupProps {
  groupedMessages?: Record<string, DecryptedMessage[]>;
  getDateSeparatorText?: (dateKey: string) => string;
  getUserStatus?: (userId: string) => UserStatus;
  messages?: DecryptedMessage[];
  isUserMessage?: (message: any) => boolean;
  onMessageExpired?: (messageId: any) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  securityLevel?: string;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  groupedMessages = {},
  getDateSeparatorText = (date) => date,
  getUserStatus = () => 'online',
  messages = [],
  isUserMessage = () => false,
  onMessageExpired = () => {},
  onEditMessage,
  onDeleteMessage,
  securityLevel
}) => {
  // If using grouped messages format
  if (Object.keys(groupedMessages).length > 0) {
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
                  <div className="message-content">
                    {message.content}
                  </div>
                  
                  <div className="message-sender">
                    <span className="sender-name">{message.sender.username || 'Unknown User'}</span>
                    <span className="message-time">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                    
                    <div className={`status-indicator ${getUserStatus(message.sender.id)}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // If using flat messages format
  return (
    <div className="message-groups">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <div className="message-content">
            {message.content}
          </div>
          
          <div className="message-sender">
            <span className="sender-name">{message.sender?.username || 'Unknown User'}</span>
            <span className="message-time">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
            
            {onEditMessage && (
              <button 
                onClick={() => onEditMessage(message)}
                className="edit-button"
              >
                Edit
              </button>
            )}
            
            {onDeleteMessage && (
              <button 
                onClick={() => onDeleteMessage(message.id)}
                className="delete-button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
