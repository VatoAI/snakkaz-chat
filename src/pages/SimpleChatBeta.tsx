import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleChatBeta: React.FC = () => {
  const navigate = useNavigate();
  // Demo user for development
  const demoUser = { email: 'demo@snakkaz.com', id: 'demo-123' };

  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: '🌊 Velkommen til SnakkaZ Liquid Dream Chat!', timestamp: '12:00', type: 'system' },
    { id: 2, user: 'Aurora AI', text: 'Norsk chat teknologi med Crystal Blue design ✨', timestamp: '12:01', type: 'ai' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  // Get current user and setup real-time subscriptions
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log('🌊 Demo user loaded:', demoUser.email);

        // Welcome message with user's name
        const welcomeMessage = {
          id: Date.now(),
          user: 'System',
          text: `🌊 Velkommen tilbake, ${demoUser.email?.split('@')[0] || 'bruker'}! Liquid Dream chat er klar for deg ✨`,
          timestamp: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
          type: 'system'
        };

        setMessages([
          { id: 1, user: 'System', text: '🌊 Velkommen til SnakkaZ Liquid Dream Chat!', timestamp: '12:00', type: 'system' },
          welcomeMessage,
          { id: 2, user: 'Aurora AI', text: 'Norsk chat teknologi med Crystal Blue design ✨', timestamp: '12:01', type: 'ai' },
        ]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: user ? (user.email?.split('@')[0] || 'Du') : 'Du',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
        type: 'user'
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          user: 'Aurora AI',
          text: `🌊 Hei ${user ? (user.email?.split('@')[0] || 'bruker') : 'bruker'}! Liquid Dream chat systemet fungerer perfekt! Din melding "${newMessage.slice(0, 30)}${newMessage.length > 30 ? '...' : ''}" ble mottatt ✨`,
          timestamp: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
          type: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 relative">
            {/* Elegant wave animation */}
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="text-6xl animate-bounce">🌊</div>
            </div>

            <div className="text-blue-300 text-sm font-mono animate-pulse">
              {'> Initializing Liquid Dream chat...'}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 font-display">SnakkaZ</h1>
          <p className="text-purple-300 text-sm animate-pulse">Starter chat system...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
      color: 'white',
      fontFamily: 'var(--font-body)',
      position: 'relative'
    }}>
      {/* Liquid Dream Background Effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(77, 208, 225, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(129, 199, 132, 0.08) 0%, transparent 50%)
        `,
        animation: 'liquidDream 20s ease-in-out infinite',
        zIndex: -1
      }} />

      {/* Header */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SNAKKAZ CHAT
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--snakkaz-primary)'
            }}>
              👤 {demoUser?.email?.split('@')[0] || 'Bruker'}
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                color: '#f44336',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(244, 67, 54, 0.1)';
              }}
            >
              🚪 Logg ut
            </button>
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--snakkaz-primary)'
            }}>
              🌊 Liquid Dream Active
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Messages Area */}
        <div style={{
          flex: 1,
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--backdrop-blur)',
          WebkitBackdropFilter: 'var(--backdrop-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          overflowY: 'auto',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: message.type === 'system'
                  ? 'linear-gradient(135deg, var(--snakkaz-accent) 0%, var(--snakkaz-secondary) 100%)'
                  : message.type === 'ai'
                    ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                    : 'linear-gradient(135deg, var(--snakkaz-secondary) 0%, var(--snakkaz-primary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {message.type === 'system' ? '🌊' : message.type === 'ai' ? '🤖' : '👤'}
              </div>

              {/* Message Bubble */}
              <div style={{
                maxWidth: '70%',
                background: message.type === 'user'
                  ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: message.type === 'user' ? 'var(--snakkaz-dark)' : 'white',
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                border: message.type !== 'user' ? '1px solid var(--glass-border)' : 'none',
                backdropFilter: message.type !== 'user' ? 'var(--backdrop-blur)' : 'none'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  marginBottom: '0.25rem',
                  fontWeight: '600'
                }}>
                  {message.user} • {message.timestamp}
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                backdropFilter: 'var(--backdrop-blur)'
              }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                  Aurora AI skriver...
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>●</span>
                  <span style={{ animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}>●</span>
                  <span style={{ animation: 'pulse 1.5s ease-in-out infinite 0.4s' }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--backdrop-blur)',
          WebkitBackdropFilter: 'var(--backdrop-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Skriv din melding her... (Enter for å sende)"
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '0.75rem',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              outline: 'none'
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              background: newMessage.trim()
                ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: newMessage.trim() ? 'var(--snakkaz-dark)' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              transform: newMessage.trim() ? 'translateY(-2px)' : 'none',
              boxShadow: newMessage.trim() ? '0 8px 25px rgba(100, 181, 246, 0.4)' : 'none'
            }}
          >
            Send 🚀
          </button>
        </div>
      </div>

      <style>{`
        @keyframes liquidDream {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(1deg); }
          66% { transform: scale(0.9) rotate(-1deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SimpleChatBeta;