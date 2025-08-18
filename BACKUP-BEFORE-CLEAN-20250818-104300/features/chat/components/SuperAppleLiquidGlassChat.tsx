import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './SuperAppleLiquidGlassChat.css';

// Import Apple 2025 Liquid Glass system
import '../../../styles/apple-liquid-glass-2025.css';

// Super high-quality SVG icons (Apple-inspired)
const AppleIcons = {
    Send: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="apple-icon">
            <defs>
                <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#007AFF" />
                    <stop offset="100%" stopColor="#5856D6" />
                </linearGradient>
            </defs>
            <path d="M2.01 21L23 12 2.01 3 2 10L17 12 2 14Z" fill="url(#sendGradient)" />
        </svg>
    ),
    Attach: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="apple-icon">
            <defs>
                <linearGradient id="attachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34C759" />
                    <stop offset="100%" stopColor="#30D158" />
                </linearGradient>
            </defs>
            <path d="M16.5 6V17.5C16.5 20.538 14.038 23 11 23S5.5 20.538 5.5 17.5V5C5.5 2.791 7.291 1 9.5 1S13.5 2.791 13.5 5V15.5C13.5 16.328 12.828 17 12 17S10.5 16.328 10.5 15.5V6H12V15.5C12 15.5 12 15.5 12 15.5C12 15.5 12 15.5 12 15.5V6H16.5Z" fill="url(#attachGradient)" />
        </svg>
    ),
    Mic: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="apple-icon">
            <defs>
                <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3B30" />
                    <stop offset="100%" stopColor="#FF9500" />
                </linearGradient>
            </defs>
            <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2S9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.3 11C17.3 14 15 16.1 12 16.1S6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.24 19 14.42 19 11H17.3Z" fill="url(#micGradient)" />
        </svg>
    ),
    Camera: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="apple-icon">
            <defs>
                <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5856D6" />
                    <stop offset="100%" stopColor="#AF52DE" />
                </linearGradient>
            </defs>
            <path d="M12 7C9.24 7 7 9.24 7 12S9.24 17 12 17 17 14.76 17 12 14.76 7 12 7ZM20 5H16.83L15 3H9L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5Z" fill="url(#cameraGradient)" />
        </svg>
    ),
    Heart: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="apple-icon">
            <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3B30" />
                    <stop offset="100%" stopColor="#FF2D92" />
                </linearGradient>
            </defs>
            <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09 10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5 2 12.28 5.4 15.36 10.55 20.04L12 21.35 13.45 20.03C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Z" fill="url(#heartGradient)" />
        </svg>
    ),
    Sparkle: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="apple-sparkle">
            <defs>
                <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD60A" />
                    <stop offset="100%" stopColor="#FF9500" />
                </linearGradient>
            </defs>
            <path d="M9 11H7L9 9V7L11 9H13L11 11V13L9 11Z" fill="url(#sparkleGradient)" opacity="0.8" />
            <path d="M19 15H17L19 13V11L21 13H23L21 15V17L19 15Z" fill="url(#sparkleGradient)" opacity="0.6" />
            <path d="M5 19H3L5 17V15L7 17H9L7 19V21L5 19Z" fill="url(#sparkleGradient)" opacity="0.4" />
        </svg>
    )
};

const SuperAppleLiquidGlassChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { user } = useAuth();

    // Demo messages with Apple-quality content
    useEffect(() => {
        const demoMessages = [
            {
                id: '1',
                content: 'Welcome to SnakkaZ Chat! 🌟 Experience the future of messaging with our Apple-inspired Liquid Glass interface.',
                sender: 'system',
                timestamp: new Date(Date.now() - 300000),
                reactions: [{ emoji: '👋', count: 3 }],
                messageType: 'welcome'
            },
            {
                id: '2',
                content: 'This interface showcases advanced glassmorphism with specular highlights, aurora gradients, and micro-interactions inspired by Apple\'s 2025 design language.',
                sender: user?.id || 'user-1',
                timestamp: new Date(Date.now() - 240000),
                reactions: [{ emoji: '🔥', count: 2 }, { emoji: '✨', count: 1 }],
                messageType: 'text'
            },
            {
                id: '3',
                content: 'Notice the layered transparency, adaptive blur effects, and smooth animations. Each message bubble uses premium glassmorphic styling with performance optimization.',
                sender: 'other-user',
                timestamp: new Date(Date.now() - 180000),
                messageType: 'text'
            },
            {
                id: '4',
                content: 'The interface adapts to your device capabilities, providing high-fidelity effects on modern browsers and graceful degradation on older systems. 🎨',
                sender: user?.id || 'user-1',
                timestamp: new Date(Date.now() - 120000),
                reactions: [{ emoji: '🎨', count: 1 }],
                messageType: 'text'
            },
            {
                id: '5',
                content: 'Ready to experience the most beautiful chat interface ever created? Start typing and watch the magic happen! ✨',
                sender: 'system',
                timestamp: new Date(Date.now() - 60000),
                messageType: 'assistant'
            }
        ];
        setMessages(demoMessages);
    }, [user?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Simulated typing indicator
    useEffect(() => {
        if (inputMessage.length > 0) {
            setIsTyping(true);
            const timer = setTimeout(() => setIsTyping(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [inputMessage]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: user?.id || 'user-1',
            timestamp: new Date(),
            messageType: 'text'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                'That\'s fantastic! The Liquid Glass interface really brings out the beauty in every conversation. ✨',
                'I love how the glassmorphism effects make everything feel so premium and modern! 🌟',
                'The micro-interactions and specular highlights create such a delightful user experience. 🎨',
                'This Apple-inspired design language truly elevates the chat experience to new heights! 🚀',
                'Every message feels special with these beautiful visual effects and animations. 💫'
            ];

            const aiResponse = {
                id: (Date.now() + 1).toString(),
                content: responses[Math.floor(Math.random() * responses.length)],
                sender: 'ai-assistant',
                timestamp: new Date(),
                messageType: 'assistant',
                reactions: [{ emoji: '✨', count: 1 }]
            };

            setMessages(prev => [...prev, aiResponse]);
        }, 1500);
    };

    const addReaction = (messageId, emoji) => {
        setMessages(prev =>
            prev.map(message => {
                if (message.id === messageId) {
                    const existingReaction = message.reactions?.find(r => r.emoji === emoji);
                    if (existingReaction) {
                        return {
                            ...message,
                            reactions: message.reactions.map(r =>
                                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                            )
                        };
                    } else {
                        return {
                            ...message,
                            reactions: [...(message.reactions || []), { emoji, count: 1 }]
                        };
                    }
                }
                return message;
            })
        );
    };

    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat('no', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(timestamp);
    };

    return (
        <div className="super-apple-liquid-glass-chat">
            {/* Background aurora effects */}
            <div className="aurora-background">
                <div className="aurora-layer-1"></div>
                <div className="aurora-layer-2"></div>
                <div className="aurora-layer-3"></div>
            </div>

            {/* Main chat container */}
            <div className="liquid-glass-container liquid-glass-2xl liquid-glass-aurora chat-container">
                <div className="liquid-glass-filter"></div>
                <div className="liquid-glass-overlay"></div>
                <div className="liquid-glass-specular"></div>

                <div className="liquid-glass-content">
                    {/* Header */}
                    <header className="chat-header">
                        <div className="liquid-glass-container liquid-glass-md liquid-glass-frosted header-glass">
                            <div className="liquid-glass-filter"></div>
                            <div className="liquid-glass-overlay"></div>
                            <div className="liquid-glass-specular"></div>

                            <div className="liquid-glass-content">
                                <div className="header-content">
                                    <div className="header-left">
                                        <div className="status-indicator connected">
                                            <div className="status-dot"></div>
                                            <span>SnakkaZ Live</span>
                                        </div>
                                        <AppleIcons.Sparkle />
                                    </div>
                                    <div className="header-center">
                                        <h1 className="chat-title">
                                            <span className="title-gradient">Super Apple Chat</span>
                                            <span className="title-subtitle">2025 Liquid Glass</span>
                                        </h1>
                                    </div>
                                    <div className="header-right">
                                        <div className="user-count">
                                            <span className="count-number">3</span>
                                            <span className="count-label">online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Messages area */}
                    <div className="messages-area">
                        <div className="messages-container">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message-wrapper ${message.sender === user?.id || message.sender === 'user-1' ? 'own-message' : 'other-message'} ${message.messageType}`}
                                >
                                    <div className={`message-bubble liquid-glass-container liquid-glass-interactive liquid-glass-${message.messageType === 'system' ? 'holographic' :
                                            message.messageType === 'assistant' ? 'iridescent' :
                                                message.sender === user?.id || message.sender === 'user-1' ? 'translucent' : 'frosted'
                                        }`}>
                                        <div className="liquid-glass-filter"></div>
                                        <div className="liquid-glass-overlay"></div>
                                        <div className="liquid-glass-specular"></div>

                                        <div className="liquid-glass-content">
                                            <div className="message-content">
                                                {message.messageType === 'system' && <AppleIcons.Sparkle />}
                                                <p className="message-text">{message.content}</p>
                                                <div className="message-meta">
                                                    <span className="message-time">
                                                        {formatTimestamp(message.timestamp)}
                                                    </span>
                                                    {message.sender === user?.id && (
                                                        <span className="message-status delivered">✓</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reactions */}
                                            {message.reactions && message.reactions.length > 0 && (
                                                <div className="message-reactions">
                                                    {message.reactions.map((reaction, index) => (
                                                        <button
                                                            key={index}
                                                            className="reaction-bubble liquid-glass-container liquid-glass-sm liquid-glass-interactive"
                                                            onClick={() => addReaction(message.id, reaction.emoji)}
                                                        >
                                                            <div className="liquid-glass-filter"></div>
                                                            <div className="liquid-glass-overlay"></div>
                                                            <div className="liquid-glass-specular"></div>
                                                            <div className="liquid-glass-content">
                                                                <span className="reaction-emoji">{reaction.emoji}</span>
                                                                <span className="reaction-count">{reaction.count}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    <button
                                                        className="add-reaction liquid-glass-container liquid-glass-sm liquid-glass-interactive"
                                                        onClick={() => addReaction(message.id, '❤️')}
                                                    >
                                                        <div className="liquid-glass-filter"></div>
                                                        <div className="liquid-glass-overlay"></div>
                                                        <div className="liquid-glass-specular"></div>
                                                        <div className="liquid-glass-content">
                                                            <AppleIcons.Heart />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="liquid-glass-container liquid-glass-sm liquid-glass-frosted liquid-glass-pulse">
                                <div className="liquid-glass-filter"></div>
                                <div className="liquid-glass-overlay"></div>
                                <div className="liquid-glass-specular"></div>
                                <div className="liquid-glass-content">
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span className="typing-text">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input area */}
                    <div className="input-area">
                        <div className="liquid-glass-container liquid-glass-lg liquid-glass-translucent input-container">
                            <div className="liquid-glass-filter"></div>
                            <div className="liquid-glass-overlay"></div>
                            <div className="liquid-glass-specular"></div>

                            <div className="liquid-glass-content">
                                <form onSubmit={handleSendMessage} className="input-form">
                                    <div className="input-actions-left">
                                        <button type="button" className="action-button liquid-glass-container liquid-glass-sm liquid-glass-interactive">
                                            <div className="liquid-glass-filter"></div>
                                            <div className="liquid-glass-overlay"></div>
                                            <div className="liquid-glass-specular"></div>
                                            <div className="liquid-glass-content">
                                                <AppleIcons.Attach />
                                            </div>
                                        </button>
                                        <button type="button" className="action-button liquid-glass-container liquid-glass-sm liquid-glass-interactive">
                                            <div className="liquid-glass-filter"></div>
                                            <div className="liquid-glass-overlay"></div>
                                            <div className="liquid-glass-specular"></div>
                                            <div className="liquid-glass-content">
                                                <AppleIcons.Camera />
                                            </div>
                                        </button>
                                    </div>

                                    <div className="input-wrapper">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Experience the magic of Liquid Glass messaging..."
                                            className="message-input"
                                        />
                                    </div>

                                    <div className="input-actions-right">
                                        <button type="button" className="action-button liquid-glass-container liquid-glass-sm liquid-glass-interactive">
                                            <div className="liquid-glass-filter"></div>
                                            <div className="liquid-glass-overlay"></div>
                                            <div className="liquid-glass-specular"></div>
                                            <div className="liquid-glass-content">
                                                <AppleIcons.Mic />
                                            </div>
                                        </button>
                                        <button
                                            type="submit"
                                            className="send-button liquid-glass-container liquid-glass-sm liquid-glass-interactive liquid-glass-iridescent"
                                            disabled={!inputMessage.trim()}
                                        >
                                            <div className="liquid-glass-filter"></div>
                                            <div className="liquid-glass-overlay"></div>
                                            <div className="liquid-glass-specular"></div>
                                            <div className="liquid-glass-content">
                                                <AppleIcons.Send />
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="floating-particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`particle particle-${i % 5 + 1}`}></div>
                ))}
            </div>
        </div>
    );
};

export default SuperAppleLiquidGlassChat;
