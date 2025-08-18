import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Smile, ArrowLeft } from 'lucide-react';
import chatService, { ChatRoom, Message } from '../../../services/chatService';
import ModernChatBubble from './ModernChatBubble';
import { useAuth } from '../../authentication';

interface ModernSpectacularChatProps {
    selectedRoom?: ChatRoom;
    onBack?: () => void;
}

const ModernSpectacularChat: React.FC<ModernSpectacularChatProps> = ({
    selectedRoom,
    onBack
}) => {
    console.log('🎨 ModernSpectacularChat: COMPONENT STARTING!', { selectedRoom, onBack });

    // EXTREME DEBUG - ALERT TO ENSURE WE SEE SOMETHING
    useEffect(() => {
        console.log('🔥 MODERNE CHAT LASTER - VISES DETTE I BROWSEREN?');
        // Show alert only once on mount
        window.alert('🚀 MODERNE CHAT KOMPONENT STARTET!');
    }, []); // Empty dependency array ensures this runs only once

    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null); const roomId = selectedRoom?.id || '550e8400-e29b-41d4-a716-446655440001';
    const roomName = selectedRoom?.name || 'SnakkaZ Norge 🇳🇴';

    useEffect(() => {
        console.log('🎨 ModernSpectacularChat: Component initializing...');

        // Wrap everything in try-catch to prevent silent failures
        const initializeChat = async () => {
            try {
                await loadMessages();

                // Subscribe to new messages with error handling
                const unsubscribe = chatService.subscribeToMessages(roomId, (message) => {
                    console.log('📩 New message received:', message);
                    setMessages(prev => [...prev, message]);
                    scrollToBottom();
                });

                return unsubscribe;
            } catch (error) {
                console.error('🎨 ModernSpectacularChat: CRITICAL ERROR in useEffect:', error);
                // Still set loading to false even if there's an error
                setLoading(false);
                return () => { }; // Return empty cleanup function
            }
        };

        let cleanup: (() => void) | undefined;

        initializeChat().then((unsubscribeFn) => {
            cleanup = unsubscribeFn;
        });

        return () => {
            if (cleanup) {
                try {
                    cleanup();
                } catch (error) {
                    console.error('🎨 ModernSpectacularChat: Error during cleanup:', error);
                }
            }
        };
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        console.log('🎨 ModernSpectacularChat: LOADING MESSAGES for room:', roomId);
        setLoading(true);
        try {
            const fetchedMessages = await chatService.getMessages(roomId);
            console.log('🎨 ModernSpectacularChat: MESSAGES LOADED:', fetchedMessages.length, fetchedMessages);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('🎨 ModernSpectacularChat: ERROR loading messages:', error);
        } finally {
            console.log('🎨 ModernSpectacularChat: LOADING FINISHED');
            setLoading(false);
        }
    }; const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageContent = newMessage.trim();
        setNewMessage('');

        try {
            const success = await chatService.sendMessage(roomId, messageContent);
            if (!success) {
                console.error('Failed to send message');
                setNewMessage(messageContent); // Restore message if failed
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageContent); // Restore message if failed
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getUserId = () => {
        return user?.id || '419b9a79-e1ee-4935-83e2-375ca5a3ac13';
    };

    console.log('🎨 ModernSpectacularChat: RENDER STATE:', {
        loading,
        messagesCount: messages.length,
        roomId,
        roomName,
        userId: getUserId()
    });

    if (loading) {
        return (
            <div className="modern-chat-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        animation: 'typingPulse 1.5s infinite'
                    }}>
                        💬
                    </div>
                    <div style={{ fontSize: '18px', opacity: 0.7 }}>
                        Laster chat...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modern-chat-container">
            {/* DEBUG INFO - VIS I UI */}
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 0, 0, 0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '300px'
            }}>
                <div><strong>🐛 DEBUG INFO:</strong></div>
                <div>Messages count: {messages.length}</div>
                <div>User ID: {getUserId()}</div>
                <div>Component mounted: ✅</div>
                <div>CSS classes: modern-chat-container</div>
                <div>Room: {roomName}</div>
                <div>Has messages: {messages.length > 0 ? '✅' : '❌'}</div>
                <div>Modern chat rendering: ✅</div>
            </div>

            {/* Modern Header */}
            <div className="modern-chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '50%',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="modern-chat-title">
                        <span>{roomName}</span>
                        <div className="online-status" />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                    }}>
                        <Phone size={20} />
                    </button>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                    }}>
                        <Video size={20} />
                    </button>
                    <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                    }}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="modern-messages-area">
                {messages.map((message, index) => (
                    <ModernChatBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.sender_id === getUserId()}
                        showAvatar={index === 0 || messages[index - 1]?.sender_id !== message.sender_id}
                        showTimestamp={true}
                    />
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="typing-indicator">
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                            Skriver...
                        </span>
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Modern Input Area */}
            <div className="modern-input-area">
                <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    opacity: 0.7
                }}>
                    <Smile size={20} />
                </button>

                <textarea
                    className="modern-input"
                    placeholder="Skriv en spektakulær melding... ✨ (Enter for å sende)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    style={{
                        resize: 'none',
                        overflow: 'hidden',
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                />

                <button
                    className="modern-send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ModernSpectacularChat;
