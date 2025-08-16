import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Smile, ArrowLeft } from 'lucide-react';

interface MockMessage {
    id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    created_at: string;
    isOwnMessage: boolean;
}

const DefinitiveModernChat: React.FC = () => {
    const [messages, setMessages] = useState<MockMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock data for immediate rendering
    const mockMessages: MockMessage[] = [
        {
            id: '1',
            content: 'Hei! Velkommen til den nye SnakkaZ chatten! 🎉',
            sender_id: 'other-user',
            sender_name: 'Emma',
            created_at: new Date(Date.now() - 300000).toISOString(),
            isOwnMessage: false
        },
        {
            id: '2',
            content: 'Wow, denne designet ser fantastisk ut! 😍',
            sender_id: 'current-user',
            sender_name: 'Du',
            created_at: new Date(Date.now() - 240000).toISOString(),
            isOwnMessage: true
        },
        {
            id: '3',
            content: 'Ja! Dette er den nye glassmorfisme designet. Ser det ikke spektakulært ut med alle de vakre effektene? ✨',
            sender_id: 'other-user',
            sender_name: 'Emma',
            created_at: new Date(Date.now() - 180000).toISOString(),
            isOwnMessage: false
        },
        {
            id: '4',
            content: 'Absolutt! Jeg elsker hvordan meldingene flyter og animasjonene er så glatte 🌊',
            sender_id: 'current-user',
            sender_name: 'Du',
            created_at: new Date(Date.now() - 120000).toISOString(),
            isOwnMessage: true
        },
        {
            id: '5',
            content: 'Dette minner meg om Telegram og Signal, men med en helt unik norsk touch! 🇳🇴',
            sender_id: 'other-user',
            sender_name: 'Emma',
            created_at: new Date(Date.now() - 60000).toISOString(),
            isOwnMessage: false
        }
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setMessages(mockMessages);
            setLoading(false);
            scrollToBottom();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg: MockMessage = {
            id: Date.now().toString(),
            content: newMessage,
            sender_id: 'current-user',
            sender_name: 'Du',
            created_at: new Date().toISOString(),
            isOwnMessage: true
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setTimeout(scrollToBottom, 100);
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('no-NO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="definitive-chat-container">
                <div className="loading-screen">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Laster spektakulær chat...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="definitive-chat-container">
            {/* SUCCESS INDICATOR */}
            <div className="success-indicator">
                <div><strong>🎯 MODERNE CHAT AKTIV!</strong></div>
                <div>Glassmorfisme: ✅</div>
                <div>Animasjoner: ✅</div>
                <div>Liquid Glass: ✅</div>
                <div>Meldinger: {messages.length}</div>
            </div>

            {/* Chat Header */}
            <div className="definitive-chat-header">
                <div className="header-left">
                    <ArrowLeft className="back-button" size={20} />
                    <div className="contact-info">
                        <div className="contact-name">SnakkaZ Norge 🇳🇴</div>
                        <div className="contact-status">
                            <div className="online-dot"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <Phone className="header-icon" size={20} />
                    <Video className="header-icon" size={20} />
                    <MoreVertical className="header-icon" size={20} />
                </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
                <div className="messages-scroll">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.isOwnMessage ? 'own-message' : 'other-message'}`}
                        >
                            <div className={`message-bubble ${message.isOwnMessage ? 'bubble-sent' : 'bubble-received'}`}>
                                <div className="message-content">{message.content}</div>
                                <div className="message-meta">
                                    <span className="message-time">{formatTime(message.created_at)}</span>
                                    {message.isOwnMessage && (
                                        <div className="message-status">✓✓</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Container */}
            <div className="input-container">
                <div className="input-wrapper">
                    <Smile className="input-icon emoji-icon" size={20} />
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Skriv en melding..."
                        className="message-input"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="send-button"
                        disabled={!newMessage.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .definitive-chat-container {
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    font-family: "Space Grotesk", sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .success-indicator {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(34, 197, 94, 0.95);
                    color: white;
                    padding: 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    z-index: 9999;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    animation: successPulse 2s infinite;
                }

                @keyframes successPulse {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.05); opacity: 1; }
                }

                .loading-screen {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loading-content {
                    text-align: center;
                    color: white;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid #64b5f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-text {
                    font-size: 16px;
                    opacity: 0.8;
                }

                .definitive-chat-header {
                    background: rgba(15, 15, 35, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: white;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .back-button {
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }

                .back-button:hover {
                    opacity: 1;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .contact-name {
                    font-weight: 600;
                    font-size: 16px;
                    font-family: "Orbitron", monospace;
                }

                .contact-status {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                }

                .online-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .header-icon {
                    cursor: pointer;
                    opacity: 0.8;
                    transition: all 0.2s;
                }

                .header-icon:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .messages-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .messages-scroll {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .message-wrapper {
                    display: flex;
                    animation: messageSlideIn 0.3s ease-out;
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

                .own-message {
                    justify-content: flex-end;
                }

                .other-message {
                    justify-content: flex-start;
                }

                .message-bubble {
                    max-width: 75%;
                    padding: 12px 16px 8px;
                    border-radius: 18px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    transition: all 0.2s ease;
                }

                .message-bubble:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .bubble-sent {
                    background: linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.8) 0%, 
                        rgba(139, 92, 246, 0.8) 100%);
                    color: white;
                    border-bottom-right-radius: 6px;
                }

                .bubble-received {
                    background: rgba(30, 30, 50, 0.8);
                    color: white;
                    border-bottom-left-radius: 6px;
                }

                .message-content {
                    margin-bottom: 4px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }

                .message-meta {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                    opacity: 0.7;
                }

                .message-time {
                    font-size: 11px;
                }

                .message-status {
                    font-size: 12px;
                    color: #4ade80;
                }

                .input-container {
                    padding: 16px 20px;
                    background: rgba(15, 15, 35, 0.95);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(30, 30, 50, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 25px;
                    padding: 8px 16px;
                    transition: all 0.2s ease;
                }

                .input-wrapper:focus-within {
                    border-color: rgba(99, 102, 241, 0.5);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
                }

                .input-icon {
                    color: rgba(255, 255, 255, 0.6);
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .input-icon:hover {
                    color: rgba(255, 255, 255, 0.9);
                }

                .message-input {
                    flex: 1;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    outline: none;
                    font-family: "Space Grotesk", sans-serif;
                }

                .message-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .send-button {
                    background: linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.8) 0%, 
                        rgba(139, 92, 246, 0.8) 100%);
                    border: none;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .send-button:hover:not(:disabled) {
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default DefinitiveModernChat;
