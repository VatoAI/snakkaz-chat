import React, { useState, useRef, useEffect } from 'react';
import {
    Send, Phone, Video, MoreVertical, Smile, Paperclip, Search,
    Settings, User, MessageCircle, Users, Bell, Moon, Sun,
    ArrowLeft, Plus, Mic, Image, File, MapPin, Hash,
    Check, CheckCheck, Volume2, VolumeX, Star
} from 'lucide-react';

interface ChatRoom {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    isTyping: boolean;
    isGroup: boolean;
}

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
    messageType: 'text' | 'image' | 'file' | 'voice' | 'location';
    status: 'sent' | 'delivered' | 'read';
    reactions?: string[];
}

const FullScreenSnakkaZChat: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<string>('1');
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock data - representerer hvordan ekte data ville sett ut
    const chatRooms: ChatRoom[] = [
        {
            id: '1',
            name: 'SnakkaZ Norge 🇳🇴',
            avatar: '🇳🇴',
            lastMessage: 'Dette minner meg om Telegram og Signal, men med en helt unik norsk touch!',
            lastMessageTime: '16:32',
            unreadCount: 3,
            isOnline: true,
            isTyping: false,
            isGroup: true
        },
        {
            id: '2',
            name: 'Emma Larsen',
            avatar: '👩‍💼',
            lastMessage: 'Hei! Skal vi møtes i morgen?',
            lastMessageTime: '15:45',
            unreadCount: 0,
            isOnline: true,
            isTyping: true,
            isGroup: false
        },
        {
            id: '3',
            name: 'Utviklere Team',
            avatar: '👨‍💻',
            lastMessage: 'Ny feature er klar for testing!',
            lastMessageTime: '14:20',
            unreadCount: 12,
            isOnline: false,
            isTyping: false,
            isGroup: true
        },
        {
            id: '4',
            name: 'Lisa Olsen',
            avatar: '👩‍🎨',
            lastMessage: 'Elsker det nye designet! 🎨',
            lastMessageTime: '13:15',
            unreadCount: 0,
            isOnline: true,
            isTyping: false,
            isGroup: false
        }
    ];

    const messages: Message[] = [
        {
            id: '1',
            content: 'Hei! Velkommen til den nye SnakkaZ chatten! 🎉',
            sender: 'Emma',
            timestamp: '16:28',
            isOwn: false,
            messageType: 'text',
            status: 'read'
        },
        {
            id: '2',
            content: 'Wow, denne designet ser fantastisk ut! 😍',
            sender: 'Du',
            timestamp: '16:29',
            isOwn: true,
            messageType: 'text',
            status: 'read'
        },
        {
            id: '3',
            content: 'Ja! Dette er den nye glassmorfisme designet. Ser det ikke spektakulært ut med alle de vakre effektene? ✨',
            sender: 'Emma',
            timestamp: '16:30',
            isOwn: false,
            messageType: 'text',
            status: 'read',
            reactions: ['😍', '🔥', '✨']
        },
        {
            id: '4',
            content: 'Absolutt! Jeg elsker hvordan meldingene flyter og animasjonene er så glatte 🌊',
            sender: 'Du',
            timestamp: '16:31',
            isOwn: true,
            messageType: 'text',
            status: 'delivered'
        },
        {
            id: '5',
            content: 'Dette minner meg om Telegram og Signal, men med en helt unik norsk touch! 🇳🇴',
            sender: 'Emma',
            timestamp: '16:32',
            isOwn: false,
            messageType: 'text',
            status: 'read'
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        // Implementer sending-logikk her
        setMessage('');
    };

    const filteredRooms = chatRooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentRoom = chatRooms.find(room => room.id === selectedRoom);

    return (
        <div className="snakkaz-fullscreen-chat">
            {/* Sidebar - Chat Rooms */}
            <div className={`chat-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <div className="app-branding">
                        <div className="app-logo">⚡</div>
                        {!sidebarCollapsed && (
                            <h1 className="app-title">SnakkaZ</h1>
                        )}
                    </div>

                    <div className="header-actions">
                        {!sidebarCollapsed && (
                            <>
                                <button className="icon-btn" onClick={() => setShowSettings(!showSettings)}>
                                    <Settings size={18} />
                                </button>
                                <button className="icon-btn">
                                    <Plus size={18} />
                                </button>
                            </>
                        )}
                        <button
                            className="icon-btn"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            <ArrowLeft size={18} style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : '' }} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {!sidebarCollapsed && (
                    <div className="search-container">
                        <div className="search-wrapper">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Søk i chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                )}

                {/* Chat Rooms List */}
                <div className="rooms-container">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className={`room-item ${selectedRoom === room.id ? 'active' : ''}`}
                            onClick={() => setSelectedRoom(room.id)}
                        >
                            <div className="room-avatar">
                                <span className="avatar-text">{room.avatar}</span>
                                {room.isOnline && <div className="online-indicator"></div>}
                            </div>

                            {!sidebarCollapsed && (
                                <div className="room-info">
                                    <div className="room-header">
                                        <span className="room-name">{room.name}</span>
                                        <span className="room-time">{room.lastMessageTime}</span>
                                    </div>

                                    <div className="room-preview">
                                        <p className="last-message">
                                            {room.isTyping ? (
                                                <span className="typing-indicator">
                                                    <span>skriver</span>
                                                    <span className="typing-dots">
                                                        <span></span><span></span><span></span>
                                                    </span>
                                                </span>
                                            ) : (
                                                room.lastMessage
                                            )}
                                        </p>

                                        {room.unreadCount > 0 && (
                                            <div className="unread-badge">{room.unreadCount}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Settings Dropdown */}
                {showSettings && !sidebarCollapsed && (
                    <div className="settings-dropdown">
                        <div className="settings-item">
                            <User size={16} />
                            <span>Profil</span>
                        </div>
                        <div className="settings-item">
                            <Bell size={16} />
                            <span>Varslinger</span>
                        </div>
                        <div className="settings-item" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                            <span>{darkMode ? 'Lys modus' : 'Mørk modus'}</span>
                        </div>
                        <div className="settings-item">
                            <Settings size={16} />
                            <span>Innstillinger</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="header-left">
                        <div className="contact-avatar">
                            <span>{currentRoom?.avatar}</span>
                        </div>
                        <div className="contact-info">
                            <h3 className="contact-name">{currentRoom?.name}</h3>
                            <p className="contact-status">
                                {currentRoom?.isTyping ? (
                                    <span className="typing-text">skriver...</span>
                                ) : (
                                    <><span className="status-dot"></span>Online</>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="header-btn">
                            <Search size={20} />
                        </button>
                        <button className="header-btn">
                            <Phone size={20} />
                        </button>
                        <button className="header-btn">
                            <Video size={20} />
                        </button>
                        <button className="header-btn">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="messages-area">
                    <div className="messages-scroll">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-group ${msg.isOwn ? 'own' : 'other'}`}>
                                <div className="message-bubble-container">
                                    <div className={`message-bubble ${msg.isOwn ? 'sent' : 'received'}`}>
                                        <div className="message-content">{msg.content}</div>

                                        {msg.reactions && (
                                            <div className="message-reactions">
                                                {msg.reactions.map((reaction, i) => (
                                                    <span key={i} className="reaction">{reaction}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="message-footer">
                                            <span className="message-time">{msg.timestamp}</span>
                                            {msg.isOwn && (
                                                <div className="message-status">
                                                    {msg.status === 'sent' && <Check size={14} />}
                                                    {msg.status === 'delivered' && <CheckCheck size={14} />}
                                                    {msg.status === 'read' && <CheckCheck size={14} className="read" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="input-area">
                    <div className="input-container">
                        <button className="attachment-btn">
                            <Paperclip size={20} />
                        </button>

                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Skriv en melding..."
                                className="message-input"
                            />

                            <button className="emoji-btn">
                                <Smile size={20} />
                            </button>
                        </div>

                        <button className="voice-btn">
                            <Mic size={20} />
                        </button>

                        <button
                            className={`send-btn ${message.trim() ? 'active' : ''}`}
                            onClick={sendMessage}
                            disabled={!message.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Media Options */}
                    <div className="media-options">
                        <button className="media-btn">
                            <Image size={16} />
                            <span>Bilde</span>
                        </button>
                        <button className="media-btn">
                            <File size={16} />
                            <span>Fil</span>
                        </button>
                        <button className="media-btn">
                            <MapPin size={16} />
                            <span>Lokasjon</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .snakkaz-fullscreen-chat {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          font-family: "Space Grotesk", sans-serif;
          overflow: hidden;
        }

        /* SIDEBAR STYLES */
        .chat-sidebar {
          width: 320px;
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: relative;
        }

        .chat-sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-branding {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .app-title {
          color: white;
          font-size: 24px;
          font-weight: 700;
          font-family: "Orbitron", monospace;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn, .header-btn {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .icon-btn:hover, .header-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: scale(1.05);
        }

        .search-container {
          padding: 0 20px 20px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .search-input {
          width: 100%;
          background: rgba(30, 30, 50, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 12px 12px 40px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .search-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .rooms-container {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px;
        }

        .room-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 4px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .room-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .room-item.active {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .room-avatar {
          position: relative;
          min-width: 48px;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .online-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 2px solid #0f0f23;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .room-info {
          flex: 1;
          min-width: 0;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .room-name {
          color: white;
          font-weight: 600;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .room-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .room-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
          flex: 1;
        }

        .typing-indicator {
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-dots span {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #6366f1;
          border-radius: 50%;
          animation: typingPulse 1.4s infinite;
          margin-right: 2px;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingPulse {
          0%, 60%, 100% { transform: scale(1); opacity: 0.4; }
          30% { transform: scale(1.2); opacity: 1; }
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }

        .settings-dropdown {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: rgba(15, 15, 35, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .settings-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .settings-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* MAIN CHAT STYLES */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.2);
        }

        .chat-header {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .contact-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .contact-info h3 {
          color: white;
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .contact-status {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .typing-text {
          color: #6366f1;
          font-style: italic;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .messages-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-group {
          display: flex;
          animation: messageSlideIn 0.4s ease-out;
        }

        .message-group.own {
          justify-content: flex-end;
        }

        .message-group.other {
          justify-content: flex-start;
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .message-bubble-container {
          max-width: 70%;
          position: relative;
        }

        .message-bubble {
          padding: 14px 18px 8px;
          border-radius: 20px;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .message-bubble.sent {
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.9) 0%, 
            rgba(139, 92, 246, 0.9) 100%);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .message-bubble.received {
          background: rgba(30, 30, 50, 0.9);
          color: white;
          border-bottom-left-radius: 6px;
        }

        .message-content {
          margin-bottom: 6px;
          line-height: 1.4;
          word-wrap: break-word;
          font-size: 15px;
        }

        .message-reactions {
          display: flex;
          gap: 4px;
          margin: 6px 0;
        }

        .reaction {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2px 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reaction:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .message-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          margin-top: 4px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
        }

        .message-status {
          display: flex;
          align-items: center;
        }

        .message-status .read {
          color: #10b981;
        }

        /* INPUT AREA */
        .input-area {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px 24px;
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .attachment-btn, .voice-btn {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .attachment-btn:hover, .voice-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .input-wrapper {
          flex: 1;
          background: rgba(30, 30, 50, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .message-input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          font-size: 15px;
          outline: none;
          padding: 8px;
          resize: none;
          max-height: 100px;
        }

        .message-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .emoji-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .emoji-btn:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.1);
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .send-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .media-options {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          padding-left: 56px;
        }

        .media-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 6px 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .media-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateY(-1px);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Scrollbar Styling */
        .messages-scroll::-webkit-scrollbar,
        .rooms-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-scroll::-webkit-scrollbar-track,
        .rooms-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .messages-scroll::-webkit-scrollbar-thumb,
        .rooms-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .messages-scroll::-webkit-scrollbar-thumb:hover,
        .rooms-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .chat-sidebar {
            position: absolute;
            z-index: 1000;
            height: 100%;
            transform: translateX(-100%);
          }

          .chat-sidebar.open {
            transform: translateX(0);
          }

          .message-bubble-container {
            max-width: 85%;
          }

          .media-options {
            padding-left: 12px;
          }
        }
      `}</style>
        </div>
    );
};

export default FullScreenSnakkaZChat;
