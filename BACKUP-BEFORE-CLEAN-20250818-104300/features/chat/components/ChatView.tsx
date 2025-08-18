import React, { useMemo } from 'react';
import { MessageList, MessageInput, Message } from './EnhancedChatComponents';
import { GlassmorphicCard, NeonText, CyberSpinner } from '../ui/CyberpunkComponents';
import { useTheme } from '../../context/ThemeProvider';

interface ChatViewProps {
    messages: Message[];
    onSendMessage: (content: string) => Promise<void>;
    onTyping: (isTyping: boolean) => void;
    isConnected: boolean;
    isLoading: boolean;
    isTyping: boolean;
    typingUsers: string[];
    currentUserId: string;
    roomId: string;
    connectionStatus: string;
    error: string | null;
    onRetry: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
    messages,
    onSendMessage,
    onTyping,
    isConnected,
    isLoading,
    isTyping,
    typingUsers,
    currentUserId,
    roomId,
    connectionStatus,
    error,
    onRetry
}) => {
    const { tokens } = useTheme();

    // Memoize typing users display to avoid unnecessary renders
    const typingDisplay = useMemo(() => {
        if (typingUsers.length === 0) return null;

        if (typingUsers.length === 1) {
            return `${typingUsers[0]} is typing...`;
        } else if (typingUsers.length === 2) {
            return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
        } else {
            return `${typingUsers.length} people are typing...`;
        }
    }, [typingUsers]);

    // Connection status styling
    const connectionStatusColor = {
        'Connected': tokens.colors.status.success,
        'Connecting...': tokens.colors.status.warning,
        'Disconnected': tokens.colors.status.error,
        'Disconnecting...': tokens.colors.status.warning,
    }[connectionStatus] || tokens.colors.text.secondary;

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: tokens.spacing.xl,
                textAlign: 'center',
            }}>
                <GlassmorphicCard
                    variant="medium"
                    style={{
                        padding: tokens.spacing.xl,
                        maxWidth: '400px',
                    }}
                >
                    <div style={{
                        fontSize: '48px',
                        marginBottom: tokens.spacing.lg,
                    }}>
                        ⚠️
                    </div>

                    <NeonText
                        as="h3"
                        color="pink"
                        style={{
                            marginBottom: tokens.spacing.base,
                            fontSize: tokens.typography.scale.xl,
                        }}
                    >
                        Connection Error
                    </NeonText>

                    <p style={{
                        color: tokens.colors.text.secondary,
                        marginBottom: tokens.spacing.lg,
                        lineHeight: tokens.typography.leading.relaxed,
                    }}>
                        {error}
                    </p>

                    <button
                        onClick={onRetry}
                        style={{
                            background: `linear-gradient(135deg, ${tokens.colors.primary.cyan}, ${tokens.colors.primary.purple})`,
                            border: 'none',
                            borderRadius: tokens.layout.radius.lg,
                            color: tokens.colors.text.white,
                            padding: `${tokens.spacing.base} ${tokens.spacing.xl}`,
                            fontSize: tokens.typography.scale.base,
                            fontWeight: tokens.typography.weights.semibold,
                            cursor: 'pointer',
                            transition: 'var(--transition-normal)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 8px 32px ${tokens.colors.primary.cyan}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Try Again
                    </button>
                </GlassmorphicCard>
            </div>
        );
    }

    return (
        <div
            className="chat-view"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'var(--bg-primary)',
                position: 'relative',
            }}
        >
            {/* Chat Header */}
            <GlassmorphicCard
                variant="light"
                style={{
                    padding: tokens.spacing.base,
                    borderRadius: 0,
                    borderBottom: `1px solid ${tokens.colors.interactive.hover}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '60px',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacing.base,
                }}>
                    <NeonText color="cyan" as="h2">
                        Chat Room
                    </NeonText>
                    <span style={{
                        fontSize: tokens.typography.scale.sm,
                        color: tokens.colors.text.secondary,
                    }}>
                        #{roomId.slice(0, 8)}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    fontSize: tokens.typography.scale.sm,
                }}>
                    <div
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: connectionStatusColor,
                            boxShadow: `0 0 10px ${connectionStatusColor}`,
                        }}
                    />
                    <span style={{ color: connectionStatusColor }}>
                        {connectionStatus}
                    </span>
                </div>
            </GlassmorphicCard>

            {/* Messages Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        gap: tokens.spacing.base,
                    }}>
                        <CyberSpinner size="lg" color="cyan" />
                        <NeonText color="cyan">Loading messages...</NeonText>
                    </div>
                ) : (
                    <MessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        isLoading={false}
                        isTyping={isTyping}
                        typingUser={typingDisplay || undefined}
                    />
                )}
            </div>

            {/* Typing Indicator */}
            {typingDisplay && (
                <div style={{
                    padding: `${tokens.spacing.sm} ${tokens.spacing.base}`,
                    fontSize: tokens.typography.scale.sm,
                    color: tokens.colors.text.secondary,
                    fontStyle: 'italic',
                    minHeight: '32px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {typingDisplay}
                </div>
            )}

            {/* Message Input */}
            <MessageInput
                onSendMessage={async (content: string) => {
                    onTyping(false); // Stop typing when sending
                    await onSendMessage(content);
                }}
                disabled={!isConnected}
                placeholder={
                    isConnected
                        ? "Type a message..."
                        : "Connecting..."
                }
            />

            {/* Connection Status Overlay */}
            {!isConnected && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <GlassmorphicCard
                        variant="heavy"
                        style={{
                            padding: tokens.spacing.xl,
                            textAlign: 'center',
                        }}
                    >
                        <CyberSpinner size="lg" color="cyan" />
                        <div style={{
                            marginTop: tokens.spacing.base,
                            color: tokens.colors.text.primary,
                        }}>
                            {connectionStatus}
                        </div>
                    </GlassmorphicCard>
                </div>
            )}
        </div>
    );
};
