import React, { useState, useEffect, useRef } from 'react';
import { useChatOptimization } from '../hooks/useChatOptimization';

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface EnhancedChatInterfaceProps {
  chatId: string;
  messages: Message[];
  onSendMessage: (content: string, type?: string) => void;
  currentUserId: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  chatId,
  messages,
  onSendMessage,
  currentUserId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages: optimizedMessages,
    searchResults,
    searchQuery,
    setSearchQuery,
    isTyping,
    startTyping,
    stopTyping,
    compressImage
  } = useChatOptimization({
    chatId,
    messages,
    enabled: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [optimizedMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      startTyping();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const compressedImage = await compressImage(file);
      // Handle compressed image upload
      console.log('Compressed image:', compressedImage);
    } else {
      // Handle regular file upload
      console.log('File upload:', file);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="enhanced-chat-interface">
      {/* Chat Header */}
      <div className="chat-header">
        <h3>Chat Room</h3>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="search-toggle"
        >
          🔍
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.slice(0, 5).map((message) => (
                <div key={message.id} className="search-result">
                  <strong>{message.userName}:</strong> {message.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div className="messages-container">
        {optimizedMessages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === currentUserId ? 'own-message' : 'other-message'}`}
          >
            <div className="message-header">
              <span className="user-name">{message.userName}</span>
              <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
            </div>
            <div className="message-content">
              {message.type === 'image' ? (
                <img src={message.content} alt="Shared image" className="message-image" />
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="input-actions">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="file-upload-btn"
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
        
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="message-input"
          rows={1}
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="send-button"
        >
          ➤
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx"
      />
    </div>
  );
};
