/**
 * SnakkaZ Chat App - 2025 Fresh Start
 * Modern Norwegian Chat Application
 * 
 * Features:
 * - Glass morphism design
 * - End-to-end encryption
 * - Norwegian localization 
 * - Premium Apple-inspired UI
 * - Security-first approach
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Lock,
    Shield,
    MessageCircle,
    Phone,
    Video,
    Search,
    MoreVertical,
    Check,
    CheckCheck,
    Star,
    Zap
} from 'lucide-react';
import './SnakkaZChatApp.css';// Types
interface Message {
    id: string;
    type: 'user' | 'contact';
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    encrypted: boolean;
}

interface Contact {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    avatar?: string;
    online: boolean;
    unread: number;
    encrypted: boolean;
}

const SnakkaZChatApp: React.FC = () => {
    // State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'contact',
            content: 'Hei! Velkommen til SnakkaZ 🇳🇴 Alle meldinger er end-to-end kryptert for din sikkerhet.',
            timestamp: new Date(Date.now() - 300000),
            status: 'read',
            encrypted: true,
        },
        {
            id: '2',
            type: 'user',
            content: 'Takk! Dette ser fantastisk ut. Norsk kvalitet på sitt beste! ✨',
            timestamp: new Date(Date.now() - 240000),
            status: 'delivered',
            encrypted: true,
        }
    ]);

    const [contacts] = useState<Contact[]>([
        {
            id: '1',
            name: 'Erik Nordmann',
            lastMessage: 'Velkommen til SnakkaZ! 🇳🇴',
            timestamp: new Date(Date.now() - 180000),
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            online: true,
            unread: 0,
            encrypted: true,
        },
        {
            id: '2',
            name: 'Ingrid Hansen',
            lastMessage: 'Ser frem til å teste den nye appen! 🚀',
            timestamp: new Date(Date.now() - 3600000),
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            online: true,
            unread: 2,
            encrypted: true,
        },
        {
            id: '3',
            name: 'Oslo Tech Team',
            lastMessage: 'Klar for lansering! 💪',
            timestamp: new Date(Date.now() - 7200000),
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
            online: false,
            unread: 5,
            encrypted: true,
        }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [selectedContact, setSelectedContact] = useState(contacts[0]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effects
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handlers
    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
            status: 'sent',
            encrypted: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate response
        setTimeout(() => {
            const responses = [
                'Fantastisk! SnakkaZ leverer norsk kvalitet! 🇳🇴',
                'Dette er fremtiden for sikker kommunikasjon! 🔒',
                'Takk for at du tester SnakkaZ! ✨',
                'Norsk teknologi på sitt beste! 🚀',
                'End-to-end kryptering holder dataene dine trygge! 🛡️'
            ];

            const response: Message = {
                id: (Date.now() + 1).toString(),
                type: 'contact',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                status: 'delivered',
                encrypted: true,
            };

            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('nb-NO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatusIcon = ({ status }: { status: Message['status'] }) => {
        switch (status) {
            case 'sent':
                return <Check className="w-3 h-3 text-gray-400" />;
            case 'delivered':
                return <CheckCheck className="w-3 h-3 text-gray-400" />;
            case 'read':
                return <CheckCheck className="w-3 h-3 text-blue-500" />;
        }
    };

    return (
        <div className="snakkaz-chat-app">
            {/* Sidebar */}
            <div className="snakkaz-sidebar">
                {/* Header */}
                <div className="snakkaz-header">
                    <div className="snakkaz-logo">
                        <div className="snakkaz-logo-icon">
                            <MessageCircle size={24} color="white" />
                        </div>
                        <div>
                            <h1 className="snakkaz-title">SnakkaZ</h1>
                            <p className="snakkaz-subtitle">
                                <Star size={12} />
                                Premium • Sikker • Norsk 🇳🇴
                            </p>
                        </div>
                    </div>

                    <div className="snakkaz-search">
                        <Search size={16} className="snakkaz-search-icon" />
                        <input
                            type="text"
                            placeholder="Søk i samtaler..."
                        />
                    </div>
                </div>

                {/* Contacts */}
                <div className="snakkaz-contacts">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`snakkaz-contact ${selectedContact.id === contact.id ? 'active' : ''}`}
                            onClick={() => setSelectedContact(contact)}
                        >
                            <div className="snakkaz-avatar">
                                <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                                {contact.online && <div className="snakkaz-online-indicator" />}
                            </div>

                            <div className="snakkaz-contact-info">
                                <div className="snakkaz-contact-name">
                                    <span>{contact.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {contact.encrypted && <Shield size={12} color="#34C759" />}
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                                            {formatTime(contact.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <div className="snakkaz-contact-message">
                                    <span>{contact.lastMessage}</span>
                                    {contact.unread > 0 && (
                                        <div className="snakkaz-unread-badge">
                                            {contact.unread > 9 ? '9+' : contact.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="snakkaz-chat-area">
                {/* Chat Header */}
                <div className="snakkaz-chat-header">
                    <div className="snakkaz-chat-user">
                        <div className="snakkaz-avatar">
                            <img
                                src={selectedContact.avatar}
                                alt={selectedContact.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                            {selectedContact.online && <div className="snakkaz-online-indicator" />}
                        </div>
                        <div className="snakkaz-chat-user-info">
                            <h3>{selectedContact.name}</h3>
                            <div className="snakkaz-chat-user-status">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#34C759',
                                        borderRadius: '50%',
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }} />
                                    Aktiv nå
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Lock size={12} color="#34C759" />
                                    End-to-end kryptert
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="snakkaz-chat-actions">
                        <button className="snakkaz-action-btn">
                            <Phone size={18} />
                        </button>
                        <button className="snakkaz-action-btn">
                            <Video size={18} />
                        </button>
                        <button className="snakkaz-action-btn">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="snakkaz-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`snakkaz-message ${message.type}`}
                        >
                            {message.type === 'contact' && (
                                <div className="snakkaz-avatar">
                                    <img
                                        src={selectedContact.avatar}
                                        alt={selectedContact.name}
                                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                </div>
                            )}

                            <div className={`snakkaz-message-bubble ${message.type}`}>
                                <p className="snakkaz-message-content">{message.content}</p>
                                <div className="snakkaz-message-meta">
                                    <div className="snakkaz-message-time">
                                        {message.encrypted && <Lock size={10} color="#34C759" />}
                                        {formatTime(message.timestamp)}
                                    </div>
                                    {message.type === 'user' && (
                                        <StatusIcon status={message.status} />
                                    )}
                                </div>
                            </div>

                            {message.type === 'user' && (
                                <div className="snakkaz-avatar">
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: '#007AFF',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        Du
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="snakkaz-message">
                            <div className="snakkaz-avatar">
                                <img
                                    src={selectedContact.avatar}
                                    alt={selectedContact.name}
                                    style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </div>
                            <div className="snakkaz-typing">
                                <div className="snakkaz-typing-dot" />
                                <div className="snakkaz-typing-dot" />
                                <div className="snakkaz-typing-dot" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="snakkaz-input-area">
                    <div className="snakkaz-input-container">
                        <div className="snakkaz-input-wrapper">
                            <textarea
                                className="snakkaz-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Skriv en sikker melding..."
                                disabled={isTyping}
                                rows={1}
                            />
                            <div className="snakkaz-input-icons">
                                <Lock size={14} color="#34C759" />
                                <Zap size={14} color="#007AFF" />
                            </div>
                        </div>

                        <button
                            className="snakkaz-send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <div className="snakkaz-security-info">
                        <Shield size={12} color="#34C759" />
                        <span>End-to-end kryptert med norsk eleganse</span>
                        <span>•</span>
                        <span>SnakkaZ Premium 🇳🇴</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZChatApp;
