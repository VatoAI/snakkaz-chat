import React, { useState, useEffect } from 'react';
import { Send, Users, Plus, Search, Settings, LogOut, Hash, Menu, X } from 'lucide-react';

// Clean, simple types
interface Message {
  id: string;
  content: string;
  user: string;
  timestamp: Date;
  avatar?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participant_count: number;
  messages: Message[];
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
}

// Mock data for immediate functionality
const mockRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Generell Chat',
    description: 'Hovedkanal for alle brukere',
    participant_count: 42,
    messages: [
      { id: '1', content: 'Velkommen til SnakkaZ Beta V2! 🚀', user: 'System', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', content: 'Dette er mye bedre design!', user: 'Lars', timestamp: new Date(Date.now() - 1800000), avatar: '👨‍💻' },
      { id: '3', content: 'Endelig fungerer alt perfekt 💪', user: 'Anna', timestamp: new Date(Date.now() - 900000), avatar: '👩‍🎨' },
    ]
  },
  {
    id: '2',
    name: 'Utvikling',
    description: 'Teknisk diskusjon og koding',
    participant_count: 18,
    messages: [
      { id: '4', content: 'V2 er mye raskere og renere! 🔥', user: 'Dev Team', timestamp: new Date(Date.now() - 600000) },
      { id: '5', content: 'React performance er økt 300%', user: 'Tech Lead', timestamp: new Date(Date.now() - 300000), avatar: '⚡' },
    ]
  },
  {
    id: '3',
    name: 'Design',
    description: 'UI/UX og designdiskusjoner',
    participant_count: 25,
    messages: [
      { id: '6', content: 'Liquid glass effekten er perfekt! ✨', user: 'Designer', timestamp: new Date(Date.now() - 150000), avatar: '🎨' },
    ]
  }
];

const mockUsers: User[] = [
  { id: '1', name: 'Lars', status: 'online', avatar: '👨‍💻' },
  { id: '2', name: 'Anna', status: 'online', avatar: '👩‍🎨' },
  { id: '3', name: 'Erik', status: 'away', avatar: '🧑‍💼' },
  { id: '4', name: 'Maria', status: 'online', avatar: '👩‍🔬' },
  { id: '5', name: 'Ole', status: 'offline', avatar: '👨‍🚀' },
];

const SnakkaZChatBetaV2: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(mockRooms[0]);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(selectedRoom.messages);

  // Update messages when room changes
  useEffect(() => {
    setMessages(selectedRoom.messages);
  }, [selectedRoom]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      user: 'Du',
      timestamp: new Date(),
      avatar: '😊'
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

  return (
    <div className="snakkaz-beta-v2">
      {/* Header */}
      <header className="beta-header">
        <div className="header-content">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="logo-section">
            <h1>SnakkaZ Beta V2</h1>
            <span className="version-badge">🚀 Production Ready</span>
          </div>
          
          <div className="header-actions">
            <button className="action-btn">
              <Search size={18} />
            </button>
            <button className="action-btn">
              <Settings size={18} />
            </button>
            <button className="action-btn logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-section">
            <h3>
              <Hash size={16} />
              Chat Rooms
            </h3>
            <div className="room-list">
              {mockRooms.map(room => (
                <button
                  key={room.id}
                  className={`room-item ${selectedRoom.id === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="room-info">
                    <span className="room-name"># {room.name}</span>
                    <span className="room-count">{room.participant_count} members</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>
              <Users size={16} />
              Online ({mockUsers.filter(u => u.status === 'online').length})
            </h3>
            <div className="user-list">
              {mockUsers.map(user => (
                <div key={user.id} className="user-item">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.name}</span>
                  <span className={`status-dot ${user.status}`}></span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chat-area">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="channel-info">
              <Hash size={20} />
              <h2>{selectedRoom.name}</h2>
              <span className="channel-description">{selectedRoom.description}</span>
            </div>
            <div className="channel-stats">
              <Users size={16} />
              <span>{selectedRoom.participant_count} members</span>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg.id} className="message">
                  <div className="message-avatar">
                    {msg.avatar || '👤'}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="message-input-container">
            <div className="message-input">
              <input
                type="text"
                placeholder={`Send melding til #${selectedRoom.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
              />
              <button 
                onClick={sendMessage}
                className="send-btn"
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .snakkaz-beta-v2 {
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .beta-header {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 100%;
        }

        .sidebar-toggle {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-toggle:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: scale(1.05);
        }

        .logo-section h1 {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffd700 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .version-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 8px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .action-btn.logout {
          color: #ef4444;
        }

        .main-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }

        .sidebar.closed {
          transform: translateX(-100%);
          width: 0;
          padding: 0;
        }

        .sidebar-section {
          margin-bottom: 24px;
        }

        .sidebar-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .room-list, .user-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .room-item {
          background: transparent;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .room-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .room-item.active {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .room-name {
          color: #f1f5f9;
          font-weight: 500;
        }

        .room-count {
          color: #64748b;
          font-size: 12px;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .user-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-avatar {
          font-size: 18px;
        }

        .user-name {
          color: #e2e8f0;
          font-size: 14px;
          flex: 1;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: auto;
        }

        .status-dot.online {
          background: #22c55e;
        }

        .status-dot.away {
          background: #eab308;
        }

        .status-dot.offline {
          background: #64748b;
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(30, 41, 59, 0.3);
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.5);
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .channel-info h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .channel-description {
          color: #94a3b8;
          font-size: 14px;
        }

        .channel-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
        }

        .messages-container {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .message-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
        }

        .message-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }

        .message-user {
          font-weight: 600;
          color: #60a5fa;
          font-size: 14px;
        }

        .message-time {
          color: #64748b;
          font-size: 12px;
        }

        .message-text {
          color: #e2e8f0;
          line-height: 1.5;
        }

        .message-input-container {
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.5);
        }

        .message-input {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .input-field {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 12px 16px;
          color: #f1f5f9;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          border-color: #60a5fa;
          background: rgba(255, 255, 255, 0.15);
        }

        .input-field::placeholder {
          color: #64748b;
        }

        .send-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 50;
          }
          
          .sidebar.closed {
            transform: translateX(-100%);
          }
          
          .header-content {
            padding: 0 8px;
          }
          
          .logo-section h1 {
            font-size: 18px;
          }
          
          .message-input-container {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SnakkaZChatBetaV2;