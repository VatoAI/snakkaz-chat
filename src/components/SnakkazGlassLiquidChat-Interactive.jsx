import React, { useState, useEffect, useRef } from 'react';

const SnakkazGlassLiquidChat = () => {
  console.log('🎨 SnakkazGlassLiquidChat component is rendering...');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'System',
      avatar: 'TC',
      content: 'Hey! Welcome to SnakkaZ with our new Glass Liquid design! 🎨',
      time: '12:30',
      type: 'received'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Wow, this looks amazing! Love the CloudMCP-inspired interface 😍',
      time: '12:31',
      type: 'sent'
    },
    {
      id: 3,
      sender: 'System',
      avatar: 'TC',
      content: 'The glass morphism effects are incredible! How did you achieve this?',
      time: '12:32',
      type: 'received'
    },
    {
      id: 4,
      sender: 'You',
      content: 'It\'s all about layering backdrop-filters with gradients and subtle animations ✨',
      time: '12:33',
      type: 'sent'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect to MCP server
  useEffect(() => {
    const connectToMCP = async () => {
      try {
        const API_BASE = import.meta.env.PROD ? 'https://mcp.snakkaz.com' : 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        if (data.status === 'healthy') {
          setIsConnected(true);
          console.log('✅ Connected to MCP server');
        }
      } catch (error) {
        console.log('⚠️ MCP server not available, using demo mode');
        setIsConnected(false);
      }
    };
    
    connectToMCP();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      content: inputValue,
      time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
      type: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Send to MCP server if connected
    if (isConnected) {
      try {
        const API_BASE = import.meta.env.PROD ? 'https://mcp.snakkaz.com' : 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            timestamp: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          const mcpResponse = await response.json();
          
          // Add MCP response
          setTimeout(() => {
            const responseMessage = {
              id: messages.length + 2,
              sender: 'MCP Server',
              avatar: 'MC',
              content: mcpResponse.response || 'Message received and processed! 🚀',
              time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
              type: 'received'
            };
            setMessages(prev => [...prev, responseMessage]);
          }, 1000);
        }
      } catch (error) {
        console.log('Error sending to MCP:', error);
      }
    } else {
      // Demo response
      setTimeout(() => {
        const demoResponse = {
          id: messages.length + 2,
          sender: 'Glass Liquid AI',
          avatar: 'GL',
          content: 'Beautiful message! The Glass Liquid design makes everything look so elegant ✨',
          time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
          type: 'received'
        };
        setMessages(prev => [...prev, demoResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="cloudmcp-chat-container">
      {/* Left Sidebar */}
      <aside className="cloudmcp-sidebar">
        <div className="cloudmcp-header">
          <h1 className="glow-text" style={{ color: 'white', fontSize: '28px', margin: '0 0 20px 0' }}>
            SnakkaZ
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
          <div className="cloudmcp-chat-item active" onClick={() => console.log('Chat selected')}>
            <div className="cloudmcp-avatar-wrapper">
              <div className="cloudmcp-avatar">TC</div>
              <div className="cloudmcp-online-indicator"></div>
            </div>
            <div className="cloudmcp-chat-info">
              <div className="cloudmcp-chat-name">Team CloudMCP</div>
              <div className="cloudmcp-chat-message">Check out the new design!</div>
            </div>
            <div className="cloudmcp-chat-meta">
              <div className="cloudmcp-chat-time">12:30</div>
              <div className="cloudmcp-unread-badge">3</div>
            </div>
          </div>
          
          <div className="cloudmcp-chat-item" onClick={() => console.log('Chat selected')}>
            <div className="cloudmcp-avatar-wrapper">
              <div className="cloudmcp-avatar">DS</div>
            </div>
            <div className="cloudmcp-chat-info">
              <div className="cloudmcp-chat-name">Design System</div>
              <div className="cloudmcp-chat-message">Glass morphism is trending</div>
            </div>
            <div className="cloudmcp-chat-meta">
              <div className="cloudmcp-chat-time">11:45</div>
            </div>
          </div>
          
          <div className="cloudmcp-chat-item" onClick={() => console.log('Chat selected')}>
            <div className="cloudmcp-avatar-wrapper">
              <div className="cloudmcp-avatar">AI</div>
            </div>
            <div className="cloudmcp-chat-info">
              <div className="cloudmcp-chat-name">Apple Inspired</div>
              <div className="cloudmcp-chat-message">Liquid animations added</div>
            </div>
            <div className="cloudmcp-chat-meta">
              <div className="cloudmcp-chat-time">Yesterday</div>
            </div>
          </div>
          
          <div className="cloudmcp-chat-item" onClick={() => console.log('Chat selected')}>
            <div className="cloudmcp-avatar-wrapper">
              <div className="cloudmcp-avatar">PU</div>
            </div>
            <div className="cloudmcp-chat-info">
              <div className="cloudmcp-chat-name">Premium UI/UX</div>
              <div className="cloudmcp-chat-message">Backdrop filters are amazing</div>
            </div>
            <div className="cloudmcp-chat-meta">
              <div className="cloudmcp-chat-time">Monday</div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Chat Area */}
      <main className="cloudmcp-main-chat">
        <header className="cloudmcp-chat-header">
          <div className="cloudmcp-header-info">
            <div className="cloudmcp-avatar-wrapper">
              <div className="cloudmcp-avatar">TC</div>
              <div className="cloudmcp-online-indicator"></div>
            </div>
            <div className="cloudmcp-header-details">
              <h2>Team CloudMCP</h2>
              <div className="cloudmcp-header-status">
                Active now {isConnected && '• MCP Connected'}
              </div>
            </div>
          </div>
          <div className="cloudmcp-header-actions">
            <button className="cloudmcp-icon-button">📞</button>
            <button className="cloudmcp-icon-button">📹</button>
            <button className="cloudmcp-icon-button">⚡</button>
          </div>
        </header>
        
        <div className="cloudmcp-messages">
          {messages.map((message) => (
            <div key={message.id} className={`cloudmcp-message ${message.type}`}>
              {message.type === 'received' && (
                <div className="cloudmcp-message-avatar">
                  <div className="liquid-avatar" style={{ width: '32px', height: '32px' }}>
                    <div className="liquid-avatar-glow"></div>
                  </div>
                </div>
              )}
              <div className="cloudmcp-message-content">
                {message.content}
                <div className="cloudmcp-message-time">{message.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="cloudmcp-input-area">
          <div className="cloudmcp-input-container">
            <textarea 
              className="cloudmcp-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <div className="cloudmcp-input-actions">
              <button className="cloudmcp-icon-button">📎</button>
              <button className="cloudmcp-icon-button">😊</button>
              <button className="cloudmcp-send-button" onClick={handleSendMessage}>
                <span style={{ fontSize: '20px' }}>✈️</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <button className="cloudmcp-floating-button">
        <span>✨</span>
      </button>
    </div>
  );
};

export default SnakkazGlassLiquidChat;
