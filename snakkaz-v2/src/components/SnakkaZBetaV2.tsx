import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Hash, Settings, Search, Plus, Menu, X, 
  Github, Mail, Lock, Eye, EyeOff, Shield, Bell, Phone, Video,
  MessageSquare, UserPlus, MoreVertical, Edit, Trash2, Copy, Share,
  File, Image, Mic, Smile, Paperclip, Download, Upload
} from 'lucide-react';

// Types for Beta V2
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  isTyping?: boolean;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar_url?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  encrypted: boolean;
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string;
}

interface GroupChat {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'secret';
  memberCount: number;
  admins: string[];
  members: User[];
  lastMessage?: Message;
  unreadCount: number;
  encrypted: boolean;
  inviteLink?: string;
}

// Mock data for development
const mockUser: User = {
  id: 'current-user',
  username: 'testuser',
  email: 'test@snakkaz.no',
  status: 'online',
  lastSeen: new Date()
};

const mockUsers: User[] = [
  { id: '1', username: 'erik_dev', email: 'erik@snakkaz.no', status: 'online', lastSeen: new Date() },
  { id: '2', username: 'anna_design', email: 'anna@snakkaz.no', status: 'online', lastSeen: new Date(), isTyping: true },
  { id: '3', username: 'lars_tech', email: 'lars@snakkaz.no', status: 'away', lastSeen: new Date(Date.now() - 300000) },
  { id: '4', username: 'maria_pm', email: 'maria@snakkaz.no', status: 'busy', lastSeen: new Date() },
  { id: '5', username: 'ole_admin', email: 'ole@snakkaz.no', status: 'online', lastSeen: new Date() }
];

const mockGroups: GroupChat[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Hovedkanal for alle brukere',
    type: 'public',
    memberCount: 156,
    admins: ['ole_admin'],
    members: mockUsers,
    unreadCount: 3,
    encrypted: true
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Teknologi diskusjoner og utviklersnakk',
    type: 'public',
    memberCount: 89,
    admins: ['erik_dev', 'lars_tech'],
    members: mockUsers.slice(0, 3),
    unreadCount: 12,
    encrypted: true
  },
  {
    id: 'design-team',
    name: 'Design Team',
    description: 'UI/UX og designdiskusjoner',
    type: 'private',
    memberCount: 24,
    admins: ['anna_design'],
    members: mockUsers.slice(1, 4),
    unreadCount: 5,
    encrypted: true
  },
  {
    id: 'secret-project',
    name: 'Secret Project',
    description: 'Hemmelig prosjekt - kun inviterte',
    type: 'secret',
    memberCount: 8,
    admins: ['ole_admin', 'maria_pm'],
    members: mockUsers.slice(0, 2),
    unreadCount: 1,
    encrypted: true
  }
];

const mockMessages: Record<string, Message[]> = {
  general: [
    {
      id: '1',
      content: 'Velkommen til SnakkaZ Beta V2! 🚀',
      userId: '5',
      username: 'ole_admin',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      encrypted: true,
      reactions: [{ emoji: '🚀', users: ['1', '2', '3'] }]
    },
    {
      id: '2',
      content: 'Designet ser fantastisk ut! E2E kryptering aktivt 🔒',
      userId: '2',
      username: 'anna_design',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      encrypted: true
    },
    {
      id: '3',
      content: 'Gruppe chat funksjonene er bedre enn Telegram nå! 💪',
      userId: '1',
      username: 'erik_dev',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
      encrypted: true,
      reactions: [{ emoji: '💪', users: ['2', '4'] }]
    }
  ]
};

const SnakkaZBetaV2: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat>(mockGroups[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedGroup.id] || []);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Login states
  const [loginMode, setLoginMode] = useState<'github' | 'email'>('github');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(mockMessages[selectedGroup.id] || []);
  }, [selectedGroup]);

  const handleLogin = async () => {
    if (loginMode === 'github') {
      // GitHub OAuth would go here
      console.log('GitHub OAuth login initiated');
      setIsLoggedIn(true);
    } else {
      // Email login
      if (email && password) {
        console.log('Email login:', email);
        setIsLoggedIn(true);
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      userId: mockUser.id,
      username: mockUser.username,
      timestamp: new Date(),
      type: 'text',
      encrypted: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'busy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>SnakkaZ Beta V2</h1>
            <p>Norsk chat med E2E kryptering</p>
          </div>

          <div className="login-methods">
            <button
              className={`method-btn ${loginMode === 'github' ? 'active' : ''}`}
              onClick={() => setLoginMode('github')}
            >
              <Github size={20} />
              GitHub
            </button>
            <button
              className={`method-btn ${loginMode === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMode('email')}
            >
              <Mail size={20} />
              E-post
            </button>
          </div>

          {loginMode === 'github' ? (
            <div className="login-form">
              <button className="github-login-btn" onClick={handleLogin}>
                <Github size={20} />
                Logg inn med GitHub
              </button>
              <p className="login-help">Trygg og sikker innlogging</p>
            </div>
          ) : (
            <div className="login-form">
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="E-post"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Passord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="email-login-btn" onClick={handleLogin}>
                Logg inn
              </button>
            </div>
          )}

          <div className="demo-section">
            <button 
              className="demo-btn"
              onClick={() => setIsLoggedIn(true)}
            >
              Demo (hopp over innlogging)
            </button>
          </div>
        </div>

        <style jsx>{`
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 1rem;
          }

          .login-card {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 2rem;
            width: 100%;
            max-width: 400px;
            text-align: center;
          }

          .login-header h1 {
            color: #3b82f6;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          .login-header p {
            color: #94a3b8;
            margin-bottom: 2rem;
          }

          .login-methods {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
          }

          .method-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.2s;
          }

          .method-btn.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .input-group {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-icon {
            position: absolute;
            left: 1rem;
            color: #6b7280;
            z-index: 1;
          }

          .login-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 3rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            color: white;
            outline: none;
          }

          .login-input:focus {
            border-color: #3b82f6;
          }

          .password-toggle {
            position: absolute;
            right: 1rem;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
          }

          .github-login-btn, .email-login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
          }

          .github-login-btn:hover, .email-login-btn:hover {
            background: #2563eb;
          }

          .login-help {
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 0.5rem;
          }

          .demo-section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1rem;
          }

          .demo-btn {
            color: #6b7280;
            background: none;
            border: none;
            cursor: pointer;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="snakkaz-v2">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1>SnakkaZ Beta V2</h1>
        </div>

        <div className="header-center">
          <div className="search-bar">
            <Search size={16} />
            <input placeholder="Søk i samtaler..." />
          </div>
        </div>

        <div className="header-right">
          <button className="header-btn">
            <Bell size={18} />
          </button>
          <button className="header-btn">
            <Settings size={18} />
          </button>
          <div className="user-menu" onClick={() => setShowUserProfile(!showUserProfile)}>
            <div className="user-avatar">
              <span>{mockUser.username[0].toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-section">
            <div className="section-header">
              <MessageSquare size={16} />
              <span>Gruppe Chats</span>
              <Plus size={14} className="add-btn" />
            </div>
            
            <div className="group-list">
              {mockGroups.map(group => (
                <button
                  key={group.id}
                  className={`group-item ${selectedGroup.id === group.id ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="group-icon">
                    <Hash size={16} />
                    {group.encrypted && <Shield size={12} className="encrypted-badge" />}
                  </div>
                  
                  <div className="group-info">
                    <div className="group-header">
                      <span className="group-name">{group.name}</span>
                      {group.unreadCount > 0 && (
                        <span className="unread-count">{group.unreadCount}</span>
                      )}
                    </div>
                    <span className="group-meta">
                      {group.memberCount} medlemmer • {group.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">
              <Users size={16} />
              <span>Online ({mockUsers.filter(u => u.status === 'online').length})</span>
            </div>
            
            <div className="user-list">
              {mockUsers.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-avatar-small">
                    <span>{user.username[0].toUpperCase()}</span>
                    <div 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    {user.isTyping && (
                      <span className="typing-indicator">skriver...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chat-area">
          {/* Chat Header */}
          <div className="chat-area-header">
            <div className="channel-info">
              <div className="channel-icon">
                <Hash size={20} />
                {selectedGroup.encrypted && <Shield size={16} className="encrypted-badge" />}
              </div>
              <div>
                <h2>{selectedGroup.name}</h2>
                <p>{selectedGroup.description} • {selectedGroup.memberCount} medlemmer</p>
              </div>
            </div>
            
            <div className="channel-actions">
              <button className="action-btn">
                <Phone size={18} />
              </button>
              <button className="action-btn">
                <Video size={18} />
              </button>
              <button className="action-btn">
                <UserPlus size={18} />
              </button>
              <button className="action-btn" onClick={() => setShowGroupSettings(!showGroupSettings)}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className="message">
                <div className="message-avatar">
                  <span>{message.username[0].toUpperCase()}</span>
                </div>
                
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">{message.username}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                    {message.encrypted && <Shield size={12} className="encrypted-indicator" />}
                  </div>
                  <div className="message-text">{message.content}</div>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="message-reactions">
                      {message.reactions.map(reaction => (
                        <button key={reaction.emoji} className="reaction">
                          {reaction.emoji} {reaction.users.length}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="message-input-area">
            <div className="input-actions">
              <button className="input-action">
                <Paperclip size={18} />
              </button>
              <button className="input-action">
                <Image size={18} />
              </button>
              <button className="input-action">
                <Mic size={18} />
              </button>
            </div>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Send melding til #${selectedGroup.name}...`}
              className="message-input"
            />
            
            <div className="send-actions">
              <button className="input-action">
                <Smile size={18} />
              </button>
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .snakkaz-v2 {
          height: 100vh;
          background: #0f172a;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
          font-family: system-ui, sans-serif;
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-left h1 {
          color: #3b82f6;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .sidebar-toggle {
          background: #374151;
          border: none;
          color: #d1d5db;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .header-center {
          flex: 1;
          max-width: 400px;
          margin: 0 2rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #374151;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
        }

        .search-bar input {
          background: none;
          border: none;
          color: #f1f5f9;
          outline: none;
          width: 100%;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-btn {
          background: #374151;
          border: none;
          color: #d1d5db;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .user-menu {
          cursor: pointer;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }

        /* Main Layout */
        .main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: #1e293b;
          border-right: 1px solid #334155;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        .sidebar-section {
          padding: 1rem;
          border-bottom: 1px solid #334155;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .add-btn {
          margin-left: auto;
          cursor: pointer;
          opacity: 0.7;
        }

        .add-btn:hover {
          opacity: 1;
        }

        .group-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .group-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          color: #f1f5f9;
          transition: background 0.2s;
        }

        .group-item:hover {
          background: #374151;
        }

        .group-item.active {
          background: #3b82f6;
        }

        .group-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #374151;
          border-radius: 0.5rem;
        }

        .encrypted-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          color: #10b981;
        }

        .group-info {
          flex: 1;
          min-width: 0;
        }

        .group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .group-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .unread-count {
          background: #ef4444;
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .group-meta {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .user-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }

        .user-item:hover {
          background: #374151;
        }

        .user-avatar-small {
          position: relative;
          width: 24px;
          height: 24px;
          background: #6b7280;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid #1e293b;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .typing-indicator {
          font-size: 0.75rem;
          color: #3b82f6;
          font-style: italic;
        }

        /* Chat Area */
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #0f172a;
        }

        .chat-area-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .channel-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #374151;
          border-radius: 0.5rem;
        }

        .channel-info h2 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .channel-info p {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .channel-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: #374151;
          border: none;
          color: #d1d5db;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .action-btn:hover {
          background: #4b5563;
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: #6b7280;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .message-username {
          font-weight: 600;
          color: #3b82f6;
          font-size: 0.875rem;
        }

        .message-time {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .encrypted-indicator {
          color: #10b981;
        }

        .message-text {
          color: #e2e8f0;
          line-height: 1.5;
        }

        .message-reactions {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .reaction {
          background: #374151;
          border: none;
          color: #d1d5db;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .reaction:hover {
          background: #4b5563;
        }

        /* Message Input */
        .message-input-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #1e293b;
          border-top: 1px solid #334155;
        }

        .input-actions, .send-actions {
          display: flex;
          gap: 0.5rem;
        }

        .input-action {
          background: #374151;
          border: none;
          color: #d1d5db;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .input-action:hover {
          background: #4b5563;
        }

        .message-input {
          flex: 1;
          background: #374151;
          border: 1px solid #4b5563;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          color: #f1f5f9;
          outline: none;
        }

        .message-input:focus {
          border-color: #3b82f6;
        }

        .send-btn {
          background: #3b82f6;
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 50;
          }
          
          .header-center {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SnakkaZBetaV2;