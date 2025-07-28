import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Hash, Settings, Search, Plus, Zap, MessageCircle, Star, Shield } from 'lucide-react';
import type { ChatRoom, Message, User } from '../types';

// Ultra-modern mock data for V2
const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Hovedkanal for alle brukere',
    type: 'public',
    participantCount: 156,
    isActive: true,
    lastActivity: new Date(),
    unreadCount: 3,
    emoji: '💬'
  },
  {
    id: 'tech',
    name: 'Tech & Innovation',
    description: 'Teknologi og utviklerdiskusjoner',
    type: 'public',
    participantCount: 89,
    isActive: true,
    lastActivity: new Date(Date.now() - 300000),
    unreadCount: 12,
    emoji: '⚡'
  },
  {
    id: 'design',
    name: 'Design Studio',
    description: 'UI/UX og kreativ utvikling',
    type: 'public',
    participantCount: 47,
    isActive: true,
    lastActivity: new Date(Date.now() - 600000),
    emoji: '🎨'
  },
  {
    id: 'norwegian',
    name: 'Norsk Corner',
    description: 'For våre norske venner',
    type: 'public',
    participantCount: 234,
    isActive: true,
    lastActivity: new Date(Date.now() - 900000),
    unreadCount: 7,
    emoji: '🇳🇴'
  }
];

const mockUsers: User[] = [
  { id: '1', username: 'erik_dev', displayName: 'Erik Haugen', avatar: '👨‍💻', status: 'online', lastSeen: new Date(), isTyping: false },
  { id: '2', username: 'anna_design', displayName: 'Anna Nordahl', avatar: '👩‍🎨', status: 'online', lastSeen: new Date(), isTyping: true },
  { id: '3', username: 'lars_tech', displayName: 'Lars Olsen', avatar: '🧑‍💼', status: 'away', lastSeen: new Date(Date.now() - 300000) },
  { id: '4', username: 'maria_pm', displayName: 'Maria Berg', avatar: '👩‍🔬', status: 'online', lastSeen: new Date() },
  { id: '5', username: 'ole_founder', displayName: 'Ole Kristian', avatar: '👨‍🚀', status: 'busy', lastSeen: new Date(Date.now() - 150000) },
  { id: '6', username: 'ingrid_qa', displayName: 'Ingrid Sven', avatar: '👩‍💻', status: 'online', lastSeen: new Date() },
  { id: '7', username: 'bjorn_ops', displayName: 'Bjørn Hansen', avatar: '🔧', status: 'offline', lastSeen: new Date(Date.now() - 1800000) },
  { id: '8', username: 'kari_ui', displayName: 'Kari Andersen', avatar: '🎭', status: 'online', lastSeen: new Date() }
];

const mockMessages: Record<string, Message[]> = {
  general: [
    {
      id: '1',
      content: 'Velkommen til SnakkaZ Beta V2! 🚀 Dette er den nye generasjonen norsk chat!',
      userId: '5',
      username: 'ole_founder',
      avatar: '👨‍🚀',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      reactions: [{ emoji: '🚀', count: 15, users: ['1', '2', '3'] }, { emoji: '❤️', count: 8, users: ['4', '6'] }]
    },
    {
      id: '2',
      content: 'Den nye designen er helt fantastisk! Glass morphism og aurora-farger er perfekt for norsk tech 💪',
      userId: '2',
      username: 'anna_design',
      avatar: '👩‍🎨',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      reactions: [{ emoji: '🎨', count: 12, users: ['1', '3', '5'] }]
    },
    {
      id: '3',
      content: 'Performance-en på V2 er helt sinnsyk! Zero lag, smooth animations, og alt fungerer perfekt på mobil 📱',
      userId: '1',
      username: 'erik_dev',
      avatar: '👨‍💻',
      timestamp: new Date(Date.now() - 900000),
      type: 'text'
    },
    {
      id: '4',
      content: 'TypeScript-implementasjonen er så clean! Love the modern architecture 💻',
      userId: '3',
      username: 'lars_tech',
      avatar: '🧑‍💼',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      reactions: [{ emoji: '💻', count: 6, users: ['1', '2'] }]
    }
  ],
  tech: [
    {
      id: '5',
      content: 'React 18 + TypeScript + Vite = Perfect combo for V2! 🔥',
      userId: '1',
      username: 'erik_dev',
      avatar: '👨‍💻',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    },
    {
      id: '6',
      content: 'Glass morphism CSS er implementert med pure CSS variables. Zero external dependencies! ✨',
      userId: '2',
      username: 'anna_design',
      avatar: '👩‍🎨',
      timestamp: new Date(Date.now() - 150000),
      type: 'text'
    }
  ],
  design: [
    {
      id: '7',
      content: 'Aurora Borealis color palette er så norsk! 🌌 Blue + Purple + Green = Magic',
      userId: '2',
      username: 'anna_design',
      avatar: '👩‍🎨',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    }
  ],
  norwegian: [
    {
      id: '8',
      content: 'Endelig en norsk chat-app som matcher internasjonale standarder! 🇳🇴',
      userId: '4',
      username: 'maria_pm',
      avatar: '👩‍🔬',
      timestamp: new Date(Date.now() - 450000),
      type: 'text'
    }
  ]
};

const ChatApplication: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(mockRooms[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedRoom.id] || []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update messages when room changes
  useEffect(() => {
    setMessages(mockMessages[selectedRoom.id] || []);
  }, [selectedRoom]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      userId: 'current-user',
      username: 'Du',
      avatar: '😊',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'var(--accent-green)';
      case 'away': return 'var(--accent-orange)';
      case 'busy': return 'var(--accent-red)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="chat-application">
      {/* Modern Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <h1 className="logo-text">SNAKKAZ</h1>
            <span className="version-badge">V2</span>
          </div>
          <button 
            className="btn btn-ghost collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Hash size={18} />
          </button>
        </div>

        {/* Room List */}
        {!sidebarCollapsed && (
          <>
            <div className="section">
              <div className="section-header">
                <MessageCircle size={16} />
                <span>Chat Rooms</span>
                <Plus size={14} className="add-btn" />
              </div>
              <div className="room-list">
                {mockRooms.map(room => (
                  <button
                    key={room.id}
                    className={`room-item ${selectedRoom.id === room.id ? 'active' : ''}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <span className="room-emoji">{room.emoji}</span>
                    <div className="room-info">
                      <span className="room-name">{room.name}</span>
                      <span className="room-meta">
                        {room.participantCount} members
                        {room.unreadCount && (
                          <span className="unread-badge">{room.unreadCount}</span>
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Online Users */}
            <div className="section">
              <div className="section-header">
                <Users size={16} />
                <span>Online ({mockUsers.filter(u => u.status === 'online').length})</span>
              </div>
              <div className="user-list">
                {mockUsers.slice(0, 6).map(user => (
                  <div key={user.id} className="user-item">
                    <div className="user-avatar">
                      <span>{user.avatar}</span>
                      <div 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(user.status) }}
                      />
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.displayName}</span>
                      {user.isTyping && (
                        <span className="typing-indicator">typing...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Chat Header */}
        <header className="chat-header">
          <div className="channel-info">
            <span className="channel-emoji">{selectedRoom.emoji}</span>
            <div>
              <h2 className="channel-name">{selectedRoom.name}</h2>
              <p className="channel-description">{selectedRoom.description}</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-ghost">
              <Search size={18} />
            </button>
            <button className="btn btn-ghost">
              <Star size={18} />
            </button>
            <button className="btn btn-ghost">
              <Settings size={18} />
            </button>
            <div className="participant-count">
              <Users size={16} />
              <span>{selectedRoom.participantCount}</span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className="message-item">
                <div className="message-avatar">
                  <span>{msg.avatar}</span>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-text">{msg.content}</div>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="message-reactions">
                      {msg.reactions.map(reaction => (
                        <button key={reaction.emoji} className="reaction-btn">
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="message-input-area">
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Send melding til #${selectedRoom.name}...`}
              className="input message-input"
            />
            <button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className="btn btn-primary send-btn"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .chat-application {
          display: flex;
          height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 320px;
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-normal);
          position: relative;
          z-index: 10;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-text {
          font-family: var(--font-mono);
          font-size: 24px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 2px;
        }

        .version-badge {
          background: var(--accent-green);
          color: var(--bg-primary);
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-mono);
        }

        .collapse-btn {
          padding: 8px;
          border-radius: 8px;
        }

        .section {
          padding: 20px;
          border-bottom: 1px solid var(--border-glass);
          flex: 1;
          min-height: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .add-btn {
          margin-left: auto;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }

        .add-btn:hover {
          opacity: 1;
        }

        .room-list, .user-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
          max-height: 300px;
        }

        .room-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          width: 100%;
          color: var(--text-primary);
        }

        .room-item:hover {
          background: var(--bg-glass-hover);
        }

        .room-item.active {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          box-shadow: var(--glow-blue);
        }

        .room-emoji {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .room-info {
          flex: 1;
          min-width: 0;
        }

        .room-name {
          display: block;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .room-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .unread-badge {
          background: var(--accent-red);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 10px;
          transition: background var(--transition-fast);
        }

        .user-item:hover {
          background: var(--bg-glass-hover);
        }

        .user-avatar {
          position: relative;
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
          border-radius: 50%;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .typing-indicator {
          font-size: 11px;
          color: var(--accent-blue);
          font-style: italic;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Chat Main Area */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          position: relative;
        }

        .chat-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-glass);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .channel-emoji {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
          border-radius: 16px;
          border: 1px solid var(--border-glass);
        }

        .channel-name {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }

        .channel-description {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .participant-count {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          padding: 8px 12px;
          background: var(--bg-glass);
          border-radius: 20px;
          border: 1px solid var(--border-glass);
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .messages-list {
          height: 100%;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-glass);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          border: 1px solid var(--border-glass);
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 6px;
        }

        .message-username {
          font-weight: 600;
          color: var(--accent-blue);
          font-size: 14px;
        }

        .message-time {
          font-size: 12px;
          color: var(--text-muted);
        }

        .message-text {
          color: var(--text-primary);
          line-height: 1.6;
          font-size: 15px;
          word-wrap: break-word;
        }

        .message-reactions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .reaction-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--text-primary);
        }

        .reaction-btn:hover {
          background: var(--bg-glass-hover);
          border-color: var(--accent-blue);
        }

        /* Message Input */
        .message-input-area {
          padding: 20px 24px;
          border-top: 1px solid var(--border-glass);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
        }

        .input-container {
          display: flex;
          gap: 12px;
          align-items: center;
          max-width: 1200px;
        }

        .message-input {
          flex: 1;
          border-radius: 24px;
          padding: 14px 20px;
          font-size: 15px;
          background: var(--bg-secondary);
        }

        .send-btn {
          border-radius: 50%;
          width: 48px;
          height: 48px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-blue);
        }

        .send-btn:disabled {
          opacity: 0.5;
          box-shadow: none;
          cursor: not-allowed;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform var(--transition-normal);
          }

          .sidebar:not(.collapsed) {
            transform: translateX(0);
          }

          .chat-header {
            padding: 16px 20px;
          }

          .channel-name {
            font-size: 20px;
          }

          .messages-list {
            padding: 20px 16px;
          }

          .message-input-area {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatApplication;