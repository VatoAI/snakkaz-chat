import React from 'react';
import { Message } from '../../../services/chatService';

interface ModernChatBubbleProps {
    message: Message;
    isOwnMessage: boolean;
    showAvatar?: boolean;
    showTimestamp?: boolean;
}

export const ModernChatBubble: React.FC<ModernChatBubbleProps> = ({
    message,
    isOwnMessage,
    showAvatar = true,
    showTimestamp = true,
}) => {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('no-NO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div
            className={`modern-chat-bubble-container ${isOwnMessage ? 'own-message' : 'other-message'}`}
            style={{
                display: 'flex',
                flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                marginBottom: '12px',
                padding: '0 16px',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            {/* Avatar */}
            {showAvatar && !isOwnMessage && (
                <div
                    className="chat-avatar"
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                        {message.sender?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
            )}

            {/* Message Bubble */}
            <div
                className="modern-chat-bubble"
                style={{
                    maxWidth: '70%',
                    minWidth: '60px',
                    padding: '12px 16px',
                    borderRadius: isOwnMessage ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                    background: isOwnMessage
                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                        : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: isOwnMessage
                        ? 'none'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    wordWrap: 'break-word',
                    position: 'relative',
                    boxShadow: isOwnMessage
                        ? '0 8px 32px rgba(99, 102, 241, 0.4)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = isOwnMessage
                        ? '0 12px 40px rgba(99, 102, 241, 0.5)'
                        : '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isOwnMessage
                        ? '0 8px 32px rgba(99, 102, 241, 0.4)'
                        : '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
            >
                {/* Message Content */}
                <div style={{
                    fontSize: '15px',
                    lineHeight: '1.4',
                    fontFamily: '"Space Grotesk", sans-serif'
                }}>
                    {message.encrypted_content}
                </div>

                {/* Timestamp */}
                {showTimestamp && (
                    <div style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        marginTop: '4px',
                        textAlign: isOwnMessage ? 'right' : 'left',
                        color: isOwnMessage ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)'
                    }}>
                        {formatTime(message.created_at)}
                    </div>
                )}

                {/* Message Status (for own messages) */}
                {isOwnMessage && (
                    <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '8px',
                        fontSize: '12px',
                        opacity: 0.8
                    }}>
                        ✓✓
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernChatBubble;
