import React, { useState, useEffect, useRef } from 'react';
import '../styles/master-design-system.css';
import '../styles/design-system/liquid-glass.css';
import '../styles/design-system/components.css';

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
      content: "It's all about layering backdrop-filters with gradients and subtle animations ✨",
      time: '12:33',
      type: 'sent'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect to MCP server
  useEffect(() => {
    const connectToMCP = async () => {
      try {
        const response = await fetch('http://localhost:3003/health');
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

  // Add animated background blobs
  useEffect(() => {
    const createNeuralNetwork = () => {
      const network = document.querySelector('.neural-network');
      if (!network) return;

      // Create nodes
      for (let i = 0; i < 50; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        node.style.animationDelay = `${Math.random() * 5}s`;
        network.appendChild(node);
      }
    };

    createNeuralNetwork();
  }, []);

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
        const response = await fetch('http://localhost:3003/chat', {
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
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: messages.length + 2,
          sender: 'Glass Liquid AI',
          avatar: 'GL',
          content: "That message looks beautiful with our glass liquid design! 🌟",
          time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
          type: 'received'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app-background">
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>

      <div className="cloudmcp-chat-container">
        {/* Sidebar */}
        <aside className="cloudmcp-sidebar">
          <div className="cloudmcp-header">
            <h1 className="glow-text" style={{ fontSize: '24px', margin: '0 0 16px 0' }}>SnakkaZ</h1>
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
              { name: 'Team CloudMCP', message: 'Check out the new design!', time: '12:30', unread: 3, online: true },
              { name: 'Design System', message: 'Glass morphism is trending', time: '11:45', unread: 0, online: true },
              { name: 'Apple Inspired', message: 'Liquid animations added', time: 'Yesterday', unread: 0, online: false },
              { name: 'Premium UI/UX', message: 'Backdrop filters are amazing', time: 'Monday', unread: 0, online: false }
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
                <div className="cloudmcp-avatar">TC</div>
                <div className="cloudmcp-online-indicator"></div>
              </div>
              <div className="cloudmcp-header-details">
                <h2>Team CloudMCP</h2>
                <div className="cloudmcp-header-status">Active now</div>
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
                placeholder="Type a message..."
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

export default SnakkazGlassLiquidChat;
