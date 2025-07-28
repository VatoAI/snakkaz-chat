import React, { useState, useEffect } from 'react';

const SnakkazGlassLiquidChatFixed = () => {
  console.log('🎨 Glass Liquid Chat component loading...');
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to SnakkaZ Glass Liquid Design! 🌊", sent: false, time: "12:30" },
    { id: 2, text: "This looks absolutely stunning! 😍", sent: true, time: "12:31" },
    { id: 3, text: "The glass morphism effects are incredible!", sent: false, time: "12:32" },
    { id: 4, text: "CloudMCP-inspired interface at its finest ✨", sent: true, time: "12:33" }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sent: true,
        time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: messages.length + 2,
          text: "Glass Liquid design is working perfectly! 🌟",
          sent: false,
          time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, response]);
      }, 1500);
    }
  };

  return (
    <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>

      <div className="cloudmcp-chat-container">
        {/* Sidebar */}
        <aside className="cloudmcp-sidebar">
          <div className="cloudmcp-header">
            <h1 className="glow-text" style={{ fontSize: '24px', margin: '0 0 16px 0', color: 'white' }}>
              SnakkaZ Glass
            </h1>
            <div className="cloudmcp-search">
              <span className="cloudmcp-search-icon">🔍</span>
              <input 
                type="text" 
                className="cloudmcp-search-input" 
                placeholder="Search conversations..."
              />
            </div>
          </div>

          <div className="cloudmcp-chat-list">
            {[
              { name: 'Glass Liquid Demo', message: 'New design system active!', time: '12:30', unread: 3, online: true },
              { name: 'CloudMCP Style', message: 'Apple-inspired interface', time: '11:45', unread: 0, online: true },
              { name: 'Premium Design', message: 'Backdrop filters working', time: 'Yesterday', unread: 0, online: false },
              { name: 'Norwegian Tech', message: 'Community feedback', time: 'Monday', unread: 0, online: false }
            ].map((chat, index) => (
              <div key={index} className={`cloudmcp-chat-item ${index === 0 ? 'active' : ''}`}>
                <div className="cloudmcp-avatar-wrapper">
                  <div className="cloudmcp-avatar">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {chat.online && <div className="cloudmcp-online-indicator"></div>}
                </div>
                <div className="cloudmcp-chat-info">
                  <div className="cloudmcp-chat-name">{chat.name}</div>
                  <div className="cloudmcp-chat-message">{chat.message}</div>
                </div>
                <div className="cloudmcp-chat-meta">
                  <div className="cloudmcp-chat-time">{chat.time}</div>
                  {chat.unread > 0 && (
                    <div className="cloudmcp-unread-badge">{chat.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat */}
        <main className="cloudmcp-main-chat">
          <header className="cloudmcp-chat-header">
            <div className="cloudmcp-header-info">
              <div className="cloudmcp-avatar-wrapper">
                <div className="cloudmcp-avatar">GL</div>
                <div className="cloudmcp-online-indicator"></div>
              </div>
              <div className="cloudmcp-header-details">
                <h2>Glass Liquid Demo</h2>
                <div className="cloudmcp-header-status">Design system active</div>
              </div>
            </div>
            <div className="cloudmcp-header-actions">
              <button className="cloudmcp-icon-button">📞</button>
              <button className="cloudmcp-icon-button">📹</button>
              <button className="cloudmcp-icon-button">⚡</button>
            </div>
          </header>

          <div className="cloudmcp-messages">
            {messages.map(message => (
              <div key={message.id} className={`cloudmcp-message ${message.sent ? 'sent' : 'received'}`}>
                {!message.sent && (
                  <div className="cloudmcp-message-avatar">
                    <div className="liquid-avatar" style={{ width: '32px', height: '32px' }}>
                      <div className="liquid-avatar-glow"></div>
                    </div>
                  </div>
                )}
                <div className="cloudmcp-message-content">
                  {message.text}
                  <div className="cloudmcp-message-time">{message.time}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="cloudmcp-typing-indicator">
                <div className="cloudmcp-typing-dot"></div>
                <div className="cloudmcp-typing-dot"></div>
                <div className="cloudmcp-typing-dot"></div>
              </div>
            )}
          </div>

          <div className="cloudmcp-input-area">
            <div className="cloudmcp-input-container">
              <textarea 
                className="cloudmcp-input"
                placeholder="Type a message to test Glass Liquid design..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                rows="1"
              />
              <div className="cloudmcp-input-actions">
                <button className="cloudmcp-icon-button">📎</button>
                <button className="cloudmcp-icon-button">😊</button>
                <button className="cloudmcp-send-button" onClick={sendMessage}>
                  <span style={{ fontSize: '20px' }}>✈️</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="cloudmcp-floating-button floating-element">
        <span>✨</span>
      </button>
    </div>
  );
};

export default SnakkazGlassLiquidChatFixed;
