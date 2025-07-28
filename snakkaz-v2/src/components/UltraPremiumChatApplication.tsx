import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Hash, Settings, Search, Plus, Zap, MessageCircle, Star, Shield,
  Crown, Sparkles, Globe, Bell, Download, User as UserIcon, LogOut, Menu, X, ChevronDown,
  Mic, Paperclip, Smile, MoreHorizontal, Heart, Flame, Lightbulb
} from 'lucide-react';
import type { ChatRoom, Message, User } from '../types';

// Ultra Premium Mock Data for 4K Experience
const ultraPremiumRooms: ChatRoom[] = [
  {
    id: 'aurora-general',
    name: 'Aurora General',
    description: 'Hovedkanal for vårt nordlys-community',
    type: 'public',
    participantCount: 2847,
    isActive: true,
    lastActivity: new Date(),
    unreadCount: 12,
    emoji: '🌌'
  },
  {
    id: 'innovation-lab',
    name: 'Innovation Lab',
    description: 'Norges fremste tech-innovatører',
    type: 'public',
    participantCount: 892,
    isActive: true,
    lastActivity: new Date(Date.now() - 300000),
    unreadCount: 47,
    emoji: '⚡'
  },
  {
    id: 'design-atelier',
    name: 'Design Atelier',
    description: 'Premium UI/UX og kreativ excellence',
    type: 'public',
    participantCount: 534,
    isActive: true,
    lastActivity: new Date(Date.now() - 600000),
    unreadCount: 23,
    emoji: '🎨'
  },
  {
    id: 'executive-lounge',
    name: 'Executive Lounge',
    description: 'Eksklusiv for premium medlemmer',
    type: 'private',
    participantCount: 127,
    isActive: true,
    lastActivity: new Date(Date.now() - 900000),
    unreadCount: 8,
    emoji: '👑'
  },
  {
    id: 'nordic-founders',
    name: 'Nordic Founders',
    description: 'Entreprenører og tech-pionerer',
    type: 'private',
    participantCount: 89,
    isActive: true,
    lastActivity: new Date(Date.now() - 1200000),
    unreadCount: 15,
    emoji: '🚀'
  }
];

const eliteUsers: User[] = [
  { id: '1', username: 'erik_cto', displayName: 'Erik Haugen', avatar: '👨‍💻', status: 'online', lastSeen: new Date(), isTyping: false },
  { id: '2', username: 'anna_lead_design', displayName: 'Anna Nordahl', avatar: '👩‍🎨', status: 'online', lastSeen: new Date(), isTyping: true },
  { id: '3', username: 'lars_architect', displayName: 'Lars Olsen', avatar: '🧑‍💼', status: 'away', lastSeen: new Date(Date.now() - 300000) },
  { id: '4', username: 'maria_ceo', displayName: 'Maria Berg', avatar: '👩‍🔬', status: 'online', lastSeen: new Date() },
  { id: '5', username: 'ole_founder', displayName: 'Ole Kristian', avatar: '👨‍🚀', status: 'busy', lastSeen: new Date(Date.now() - 150000) },
  { id: '6', username: 'ingrid_devops', displayName: 'Ingrid Svendsen', avatar: '👩‍💻', status: 'online', lastSeen: new Date() },
  { id: '7', username: 'bjorn_security', displayName: 'Bjørn Hansen', avatar: '🛡️', status: 'online', lastSeen: new Date() },
  { id: '8', username: 'kari_product', displayName: 'Kari Andersen', avatar: '🎭', status: 'online', lastSeen: new Date() },
  { id: '9', username: 'tom_investor', displayName: 'Tom Nordahl', avatar: '💼', status: 'away', lastSeen: new Date(Date.now() - 600000) },
  { id: '10', username: 'emma_ui', displayName: 'Emma Larsen', avatar: '✨', status: 'online', lastSeen: new Date() }
];

const premiumMessages: Record<string, Message[]> = {
  'aurora-general': [
    {
      id: '1',
      content: '🌌 Velkommen til SnakkaZ Ultra Premium! Dette er fremtiden for norsk digital kommunikasjon ✨',
      userId: '5',
      username: 'ole_founder',
      avatar: '👨‍🚀',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      reactions: [
        { emoji: '🚀', count: 127, users: ['1', '2', '3'] }, 
        { emoji: '🌟', count: 89, users: ['4', '6'] },
        { emoji: '🔥', count: 234, users: ['7', '8', '9'] }
      ]
    },
    {
      id: '2',
      content: 'Den nye 4K liquid glass designen er helt revolusjonerende! Nordlys-paletten gir en unik norsk identitet 💎',
      userId: '2',
      username: 'anna_lead_design',
      avatar: '👩‍🎨',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      reactions: [
        { emoji: '🎨', count: 156, users: ['1', '3', '5'] },
        { emoji: '💎', count: 98, users: ['4', '7'] }
      ]
    },
    {
      id: '3',
      content: 'Enterprise-grade arkitektur med Supabase backend! Real-time sync, E2EE, og skalering til millioner av brukere 🏗️',
      userId: '1',
      username: 'erik_cto',
      avatar: '👨‍💻',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
      reactions: [{ emoji: '⚡', count: 203, users: ['2', '4', '6'] }]
    },
    {
      id: '4',
      content: 'MCP integration gjør AI-assistenten helt magisk! Claude Code + SnakkaZ = Norwegian tech excellence 🤖✨',
      userId: '6',
      username: 'ingrid_devops',
      avatar: '👩‍💻',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      reactions: [
        { emoji: '🤖', count: 178, users: ['1', '3', '5'] },
        { emoji: '✨', count: 245, users: ['2', '4', '7'] }
      ]
    }
  ],
  'innovation-lab': [
    {
      id: '5',
      content: '🔬 React 18 + TypeScript + Vite = Norwegian innovation at its finest! Zero-config, maximum performance',
      userId: '1',
      username: 'erik_cto',
      avatar: '👨‍💻',
      timestamp: new Date(Date.now() - 600000),
      type: 'text',
      reactions: [{ emoji: '⚡', count: 89, users: ['2', '3'] }]
    },
    {
      id: '6',
      content: 'PWA features med offline support og push notifications! Appen installeres som native på alle enheter 📱',
      userId: '6',
      username: 'ingrid_devops',
      avatar: '👩‍💻',
      timestamp: new Date(Date.now() - 150000),
      type: 'text',
      reactions: [{ emoji: '📱', count: 67, users: ['1', '4'] }]
    }
  ],
  'design-atelier': [
    {
      id: '7',
      content: '🎨 4K aurora liquid glass er ikke bare design - det er en opplevelse! Hver interaksjon føles magisk',
      userId: '2',
      username: 'anna_lead_design',
      avatar: '👩‍🎨',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      reactions: [{ emoji: '✨', count: 156, users: ['1', '3', '5'] }]
    }
  ],
  'executive-lounge': [
    {
      id: '8',
      content: '👑 Premium medlemskap gir tilgang til exclusive features: Priority support, advanced analytics, custom themes',
      userId: '4',
      username: 'maria_ceo',
      avatar: '👩‍🔬',
      timestamp: new Date(Date.now() - 450000),
      type: 'text',
      reactions: [{ emoji: '💎', count: 45, users: ['2', '5'] }]
    }
  ],
  'nordic-founders': [
    {
      id: '9',
      content: '🚀 SnakkaZ positioning for IPO 2026. Norwegian tech unicorn in the making! 🦄',
      userId: '9',
      username: 'tom_investor',
      avatar: '💼',
      timestamp: new Date(Date.now() - 600000),
      type: 'text',
      reactions: [
        { emoji: '🦄', count: 234, users: ['1', '2', '4'] },
        { emoji: '💰', count: 189, users: ['3', '5', '6'] }
      ]
    }
  ]
};

const UltraPremiumChatApplication: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(ultraPremiumRooms[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(premiumMessages[selectedRoom.id] || []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(premiumMessages[selectedRoom.id] || []);
  }, [selectedRoom]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      userId: 'current-premium-user',
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
      case 'online': return 'var(--aurora-emerald)';
      case 'away': return 'var(--aurora-amber)';
      case 'busy': return 'var(--aurora-red)';
      default: return 'var(--text-muted)';
    }
  };

  const getRoomTypeIcon = (type: ChatRoom['type']) => {
    return type === 'private' ? <Crown size={14} className="text-aurora-amber" /> : <Globe size={14} />;
  };

  return (
    <div className="ultra-premium-chat fade-in-ultra">
      {/* Ultra Premium Header */}
      <header className="chat-header-ultra glass-premium">
        <div className="header-left">
          <button 
            className="btn-ultra btn-secondary-ultra sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
          
          <div className="logo-section-ultra">
            <h1 className="text-display aurora-glow">SNAKKAZ</h1>
            <div className="version-ultra">
              <Sparkles size={14} />
              <span>ULTRA</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="search-ultra glass-ultra">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Søk i samtaler, brukere, filer..."
              className="search-input-ultra"
            />
          </div>
        </div>

        <div className="header-right">
          <button className="btn-ultra btn-secondary-ultra notification-btn">
            <Bell size={18} />
            <span className="notification-badge">12</span>
          </button>
          
          <button className="btn-ultra btn-primary-ultra download-btn">
            <Download size={18} />
            <span>Last ned app</span>
          </button>

          <div className="user-menu-ultra" onClick={() => setShowUserProfile(!showUserProfile)}>
            <div className="user-avatar-ultra">
              <span>😊</span>
              <div className="status-dot-ultra" style={{ backgroundColor: 'var(--aurora-emerald)' }} />
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <div className="main-layout-ultra">
        {/* Ultra Premium Sidebar */}
        <aside className={`sidebar-ultra glass-luxury ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {!sidebarCollapsed && (
            <>
              {/* Room Categories */}
              <div className="section-ultra">
                <div className="section-header-ultra">
                  <MessageCircle size={16} />
                  <span className="text-luxury">Chat Rooms</span>
                  <div className="section-actions">
                    <Plus size={14} className="action-icon" />
                    <Settings size={14} className="action-icon" />
                  </div>
                </div>
                
                <div className="room-list-ultra">
                  {ultraPremiumRooms.map(room => (
                    <button
                      key={room.id}
                      className={`room-item-ultra glass-ultra ${selectedRoom.id === room.id ? 'active aurora-glow' : ''}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="room-icon-ultra">
                        <span className="room-emoji">{room.emoji}</span>
                        {getRoomTypeIcon(room.type)}
                      </div>
                      
                      <div className="room-content-ultra">
                        <div className="room-header">
                          <span className="room-name-ultra text-luxury">{room.name}</span>
                          {room.unreadCount && (
                            <span className="unread-badge-ultra">{room.unreadCount}</span>
                          )}
                        </div>
                        <div className="room-meta-ultra">
                          <Users size={12} />
                          <span>{room.participantCount.toLocaleString()}</span>
                          {room.type === 'private' && <Crown size={12} />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elite Users */}
              <div className="section-ultra">
                <div className="section-header-ultra">
                  <Users size={16} />
                  <span className="text-luxury">Elite Members</span>
                  <span className="user-count-ultra">
                    {eliteUsers.filter(u => u.status === 'online').length}/{eliteUsers.length}
                  </span>
                </div>
                
                <div className="user-list-ultra">
                  {eliteUsers.slice(0, 8).map(user => (
                    <div key={user.id} className="user-item-ultra glass-ultra">
                      <div className="user-avatar-section">
                        <div className="user-avatar-premium">
                          <span>{user.avatar}</span>
                          <div 
                            className="status-dot-premium"
                            style={{ backgroundColor: getStatusColor(user.status) }}
                          />
                        </div>
                      </div>
                      
                      <div className="user-info-ultra">
                        <span className="user-name-premium text-premium">{user.displayName}</span>
                        <div className="user-status-ultra">
                          {user.isTyping ? (
                            <span className="typing-ultra">typing...</span>
                          ) : (
                            <span className="status-text" style={{ color: getStatusColor(user.status) }}>
                              {user.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <button className="user-action-btn">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Ultra Premium Chat Area */}
        <main className="chat-main-ultra">
          {/* Channel Header */}
          <div className="channel-header-ultra glass-premium">
            <div className="channel-info-ultra">
              <div className="channel-icon-ultra">
                <span className="channel-emoji-large">{selectedRoom.emoji}</span>
                {getRoomTypeIcon(selectedRoom.type)}
              </div>
              
              <div className="channel-details">
                <h2 className="channel-name-ultra text-luxury">{selectedRoom.name}</h2>
                <p className="channel-description-ultra text-elegant">{selectedRoom.description}</p>
              </div>
            </div>
            
            <div className="channel-actions-ultra">
              <button className="btn-ultra btn-secondary-ultra">
                <Star size={18} />
              </button>
              <button className="btn-ultra btn-secondary-ultra">
                <Shield size={18} />
              </button>
              <button className="btn-ultra btn-secondary-ultra">
                <Settings size={18} />
              </button>
              
              <div className="participant-counter-ultra glass-ultra">
                <Users size={16} />
                <span className="text-premium">{selectedRoom.participantCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Premium Messages Area */}
          <div className="messages-area-ultra">
            <div className="messages-list-ultra">
              {messages.map(msg => (
                <div key={msg.id} className="message-ultra fade-in-ultra">
                  <div className="message-avatar-ultra">
                    <div className="avatar-premium">
                      <span>{msg.avatar}</span>
                    </div>
                  </div>
                  
                  <div className="message-content-ultra">
                    <div className="message-header-ultra">
                      <span className="message-username-ultra text-premium">{msg.username}</span>
                      <span className="message-time-ultra text-elegant">{formatTime(msg.timestamp)}</span>
                    </div>
                    
                    <div className="message-text-ultra text-elegant">{msg.content}</div>
                    
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="message-reactions-ultra">
                        {msg.reactions.map(reaction => (
                          <button key={reaction.emoji} className="reaction-ultra glass-ultra">
                            <span className="reaction-emoji">{reaction.emoji}</span>
                            <span className="reaction-count text-premium">{reaction.count}</span>
                          </button>
                        ))}
                        <button className="add-reaction-ultra glass-ultra">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="message-actions-ultra">
                    <button className="action-ultra"><Heart size={16} /></button>
                    <button className="action-ultra"><Flame size={16} /></button>
                    <button className="action-ultra"><Lightbulb size={16} /></button>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Ultra Premium Message Input */}
          <div className="message-input-area-ultra glass-premium">
            <div className="input-container-ultra">
              <button className="attachment-btn-ultra btn-ultra btn-secondary-ultra">
                <Paperclip size={18} />
              </button>
              
              <div className="message-input-wrapper-ultra">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Send premium melding til #${selectedRoom.name}...`}
                  className="input-ultra message-input-ultra"
                />
                
                <div className="input-actions-ultra">
                  <button className="input-action-ultra">
                    <Smile size={18} />
                  </button>
                  <button className="input-action-ultra">
                    <Mic size={18} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={sendMessage}
                disabled={!message.trim()}
                className="send-btn-ultra btn-ultra btn-primary-ultra aurora-glow"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .ultra-premium-chat {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: var(--font-premium);
          position: relative;
          z-index: 1;
        }

        /* Ultra Premium Header */
        .chat-header-ultra {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--border-luxury);
          position: relative;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .sidebar-toggle {
          padding: var(--space-3);
          border-radius: var(--radius-lg);
        }

        .logo-section-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .logo-section-ultra h1 {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .version-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background: linear-gradient(135deg, var(--aurora-green), var(--aurora-emerald));
          color: var(--aurora-primary);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .header-center {
          flex: 1;
          max-width: 600px;
          margin: 0 var(--space-6);
        }

        .search-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-2xl);
          width: 100%;
        }

        .search-input-ultra {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-premium);
          font-size: 0.875rem;
          width: 100%;
        }

        .search-input-ultra::placeholder {
          color: var(--text-muted);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .notification-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--aurora-red);
          color: white;
          border-radius: var(--radius-full);
          font-size: 0.625rem;
          font-weight: 700;
          padding: 2px 6px;
          min-width: 18px;
          text-align: center;
        }

        .download-btn {
          background: linear-gradient(135deg, var(--aurora-green), var(--aurora-emerald));
        }

        .user-menu-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .user-menu-ultra:hover {
          background: var(--glass-ultra);
        }

        .user-avatar-ultra {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: var(--glass-premium);
          border-radius: var(--radius-full);
          border: 2px solid var(--border-luxury);
        }

        .status-dot-ultra {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: var(--radius-full);
          border: 2px solid var(--aurora-primary);
        }

        /* Main Layout */
        .main-layout-ultra {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Ultra Premium Sidebar */
        .sidebar-ultra {
          width: 360px;
          border-right: 1px solid var(--border-luxury);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-luxury);
          overflow-y: auto;
          position: relative;
        }

        .sidebar-ultra.collapsed {
          width: 80px;
        }

        .section-ultra {
          padding: var(--space-6);
          border-bottom: 1px solid var(--border-ultra);
        }

        .section-header-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-elite);
        }

        .section-actions {
          margin-left: auto;
          display: flex;
          gap: var(--space-2);
        }

        .action-icon {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }

        .action-icon:hover {
          opacity: 1;
        }

        .user-count-ultra {
          margin-left: auto;
          background: var(--glass-premium);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: 0.625rem;
        }

        .room-list-ultra {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .room-item-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          border: none;
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-smooth);
          text-align: left;
          width: 100%;
          position: relative;
        }

        .room-item-ultra:hover {
          background: var(--glass-premium);
          transform: translateX(4px);
        }

        .room-item-ultra.active {
          background: linear-gradient(135deg, var(--glass-luxury), var(--glass-elite));
          border-color: var(--aurora-blue);
        }

        .room-icon-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          position: relative;
        }

        .room-emoji {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-premium);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-premium);
        }

        .room-content-ultra {
          flex: 1;
          min-width: 0;
        }

        .room-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-1);
        }

        .room-name-ultra {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .unread-badge-ultra {
          background: var(--aurora-red);
          color: white;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.625rem;
          font-weight: 700;
        }

        .room-meta-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Elite Users */
        .user-list-ultra {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .user-item-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .user-item-ultra:hover {
          background: var(--glass-premium);
        }

        .user-avatar-section {
          position: relative;
        }

        .user-avatar-premium {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: var(--glass-premium);
          border-radius: var(--radius-full);
          border: 2px solid var(--border-premium);
          position: relative;
        }

        .status-dot-premium {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: var(--radius-full);
          border: 2px solid var(--aurora-primary);
        }

        .user-info-ultra {
          flex: 1;
          min-width: 0;
        }

        .user-name-premium {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 2px;
        }

        .user-status-ultra {
          font-size: 0.75rem;
        }

        .typing-ultra {
          color: var(--aurora-blue);
          font-style: italic;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .user-action-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          opacity: 0;
          transition: all var(--transition-fast);
        }

        .user-item-ultra:hover .user-action-btn {
          opacity: 1;
        }

        .user-action-btn:hover {
          background: var(--glass-ultra);
          color: var(--text-premium);
        }

        /* Chat Main Area */
        .chat-main-ultra {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--glass-ultra);
          position: relative;
        }

        .channel-header-ultra {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--border-luxury);
        }

        .channel-info-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .channel-icon-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          position: relative;
        }

        .channel-emoji-large {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-premium);
          border-radius: var(--radius-2xl);
          border: 2px solid var(--border-luxury);
        }

        .channel-details {
          flex: 1;
        }

        .channel-name-ultra {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .channel-description-ultra {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .channel-actions-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .participant-counter-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-xl);
          font-weight: 600;
        }

        /* Messages Area */
        .messages-area-ultra {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .messages-list-ultra {
          height: 100%;
          overflow-y: auto;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .message-ultra {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
          position: relative;
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          transition: all var(--transition-fast);
        }

        .message-ultra:hover {
          background: var(--glass-ultra);
        }

        .message-avatar-ultra {
          flex-shrink: 0;
        }

        .avatar-premium {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          background: var(--glass-premium);
          border-radius: var(--radius-full);
          border: 2px solid var(--border-premium);
        }

        .message-content-ultra {
          flex: 1;
          min-width: 0;
        }

        .message-header-ultra {
          display: flex;
          align-items: baseline;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .message-username-ultra {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--aurora-blue);
        }

        .message-time-ultra {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .message-text-ultra {
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: var(--space-3);
        }

        .message-reactions-ultra {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-top: var(--space-3);
        }

        .reaction-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .reaction-ultra:hover {
          background: var(--glass-premium);
          transform: scale(1.05);
        }

        .add-reaction-ultra {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .message-actions-ultra {
          display: flex;
          gap: var(--space-1);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .message-ultra:hover .message-actions-ultra {
          opacity: 1;
        }

        .action-ultra {
          background: var(--glass-ultra);
          border: none;
          color: var(--text-muted);
          padding: var(--space-2);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-ultra:hover {
          background: var(--glass-premium);
          color: var(--text-premium);
          transform: scale(1.1);
        }

        /* Message Input */
        .message-input-area-ultra {
          padding: var(--space-5) var(--space-6);
          border-top: 1px solid var(--border-luxury);
        }

        .input-container-ultra {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          max-width: 1200px;
        }

        .attachment-btn-ultra {
          padding: var(--space-3);
          border-radius: var(--radius-lg);
        }

        .message-input-wrapper-ultra {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .message-input-ultra {
          padding-right: var(--space-20);
          font-size: 0.9375rem;
        }

        .input-actions-ultra {
          position: absolute;
          right: var(--space-4);
          display: flex;
          gap: var(--space-2);
        }

        .input-action-ultra {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .input-action-ultra:hover {
          background: var(--glass-ultra);
          color: var(--text-premium);
        }

        .send-btn-ultra {
          padding: var(--space-4);
          border-radius: var(--radius-full);
          min-width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn-ultra:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sidebar-ultra {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform var(--transition-luxury);
          }

          .sidebar-ultra:not(.collapsed) {
            transform: translateX(0);
          }

          .header-center {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .chat-header-ultra {
            padding: var(--space-4) var(--space-5);
          }

          .channel-header-ultra {
            padding: var(--space-4) var(--space-5);
          }

          .channel-emoji-large {
            width: 48px;
            height: 48px;
            font-size: 2rem;
          }

          .channel-name-ultra {
            font-size: 1.25rem;
          }

          .messages-list-ultra {
            padding: var(--space-5);
            gap: var(--space-5);
          }

          .message-input-area-ultra {
            padding: var(--space-4) var(--space-5);
          }
        }
      `}</style>
    </div>
  );
};

export default UltraPremiumChatApplication;