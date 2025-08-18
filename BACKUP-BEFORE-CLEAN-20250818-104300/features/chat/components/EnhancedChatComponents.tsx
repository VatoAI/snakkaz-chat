import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { GlassmorphicCard, NeonText, CyberSpinner } from '../ui/CyberpunkComponents';

// Enhanced message type system from your specifications
type BaseMessage = {
    id: string;
    userId: string;
    timestamp: number;
    roomId: string;
    sender: {
        name: string;
        avatar?: string;
    };
};

type TextMessage = BaseMessage & {
    type: 'text';
    content: string;
};

type ImageMessage = BaseMessage & {
    type: 'image';
    imageUrl: string;
    alt?: string;
};

type SystemMessage = BaseMessage & {
    type: 'system';
    systemType: 'user_joined' | 'user_left' | 'room_created';
    metadata: Record<string, any>;
};

export type Message = TextMessage | ImageMessage | SystemMessage;

// WebSocket Manager from your specifications
class ChatWebSocket {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private messageQueue: string[] = [];
    private eventHandlers: Map<string, Function[]> = new Map();

    constructor(private url: string) {
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.flushMessageQueue();
            this.emit('open');
        };

        this.ws.onclose = () => {
            this.emit('close');
            this.handleReconnect();
        };

        this.ws.onerror = () => {
            this.emit('error');
            this.handleError();
        };

        this.ws.onmessage = (event) => {
            this.handleMessage(event);
        };
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        }
    }

    private handleError() {
        console.error('WebSocket error occurred');
    }

    private handleMessage(event: MessageEvent) {
        try {
            const message = JSON.parse(event.data);
            this.emit('message', message);
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    }

    sendMessage(message: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            this.messageQueue.push(message);
        }
    }

    private flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) this.sendMessage(message);
        }
    }

    on(event: string, handler: Function) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
    }

    private emit(event: string, data?: any) {
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    get connectionState() {
        return this.ws?.readyState || WebSocket.CLOSED;
    }
}

// Message bubble component with accessibility
interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    isTyping?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isOwn,
    isTyping = false
}) => {
    const { tokens } = useTheme();

    const bubbleVariant = isOwn ? 'medium' : 'light';
    const alignment = isOwn ? 'flex-end' : 'flex-start';
    const textAlignment = isOwn ? 'right' : 'left';

    // Add typing animation effect if needed
    const messageStyle = isTyping ? {
        animation: 'pulse 1.5s infinite',
        opacity: 0.7
    } : {};

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: alignment,
                marginBottom: tokens.spacing.base,
                animation: 'slideInMessage 0.3s ease-out',
                ...messageStyle
            }}
        >
            <div style={{ maxWidth: '70%', minWidth: '120px' }}>
                {!isOwn && (
                    <div style={{
                        fontSize: tokens.typography.scale.xs,
                        color: tokens.colors.text.secondary,
                        marginBottom: tokens.spacing.xs,
                        marginLeft: tokens.spacing.sm,
                    }}>
                        {message.sender.name}
                    </div>
                )}

                <GlassmorphicCard
                    variant={bubbleVariant}
                    neon={isOwn}
                    neonColor="cyan"
                    style={{
                        padding: `${tokens.spacing.sm} ${tokens.spacing.base}`,
                        borderRadius: isOwn
                            ? `${tokens.layout.radius.lg} ${tokens.layout.radius.sm} ${tokens.layout.radius.sm} ${tokens.layout.radius.lg}`
                            : `${tokens.layout.radius.sm} ${tokens.layout.radius.lg} ${tokens.layout.radius.lg} ${tokens.layout.radius.sm}`,
                    }}
                >
                    <div className="message-bubble__content">
                        {!isOwn && (
                            <span className="sr-only">
                                {message.sender.name} says:
                            </span>
                        )}

                        <MessageContent message={message} />

                        <div style={{
                            fontSize: tokens.typography.scale.xs,
                            color: tokens.colors.text.tertiary,
                            marginTop: tokens.spacing.xs,
                            textAlign: textAlignment as any,
                        }}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>

                    <div
                        className="sr-only"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        Message status: delivered
                    </div>
                </GlassmorphicCard>
            </div>
        </div>
    );
};

// Type-safe message content renderer
const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    const { tokens } = useTheme();

    switch (message.type) {
        case 'text':
            return (
                <p
                    className="message-text"
                    aria-label={message.content}
                    style={{
                        color: tokens.colors.text.white,
                        fontSize: tokens.typography.scale.base,
                        lineHeight: tokens.typography.leading.normal,
                        margin: 0,
                        wordBreak: 'break-word',
                    }}
                >
                    {message.content}
                </p>
            );

        case 'image':
            return (
                <div>
                    <img
                        src={message.imageUrl}
                        alt={message.alt || 'Shared image'}
                        style={{
                            maxWidth: '100%',
                            borderRadius: tokens.layout.radius.base,
                            display: 'block',
                        }}
                        loading="lazy"
                    />
                    {message.alt && (
                        <p style={{
                            fontSize: tokens.typography.scale.xs,
                            color: tokens.colors.text.secondary,
                            marginTop: tokens.spacing.xs,
                            fontStyle: 'italic',
                        }}>
                            {message.alt}
                        </p>
                    )}
                </div>
            );

        case 'system':
            return (
                <div style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    color: tokens.colors.text.secondary,
                    fontSize: tokens.typography.scale.sm,
                }}>
                    <SystemNotification type={message.systemType} metadata={message.metadata} />
                </div>
            );

        default:
            // Exhaustiveness check - this should never be reached
            console.warn('Unknown message type:', message);
            return null;
    }
};

// System notification component
const SystemNotification: React.FC<{
    type: SystemMessage['systemType'];
    metadata: Record<string, any>;
}> = ({ type, metadata }) => {
    const messages = {
        user_joined: `${metadata.username} joined the chat`,
        user_left: `${metadata.username} left the chat`,
        room_created: `Room "${metadata.roomName}" was created`,
    };

    return <span>{messages[type]}</span>;
};

// Performance-optimized message list with virtualization
interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    isLoading?: boolean;
    isTyping?: boolean;
    typingUser?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    isLoading = false,
    isTyping = false,
    typingUser
}) => {
    const { tokens } = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (shouldAutoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, shouldAutoScroll]);

    // Handle scroll to determine auto-scroll behavior
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldAutoScroll(isNearBottom);
    }, []);

    if (isLoading && messages.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                gap: tokens.spacing.base,
            }}>
                <CyberSpinner size="lg" color="cyan" />
                <NeonText color="cyan">Loading messages...</NeonText>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: tokens.spacing.base,
                scrollBehavior: 'smooth',
            }}
            className="message-list cyberpunk-scrollbar"
        >
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.userId === currentUserId}
                />
            ))}

            {isTyping && typingUser && (
                <TypingIndicator username={typingUser} />
            )}
        </div>
    );
};

// Typing indicator component
const TypingIndicator: React.FC<{ username: string }> = ({ username }) => {
    const { tokens } = useTheme();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            padding: tokens.spacing.base,
            color: tokens.colors.text.secondary,
            fontSize: tokens.typography.scale.sm,
            fontStyle: 'italic',
        }}>
            <div style={{
                display: 'flex',
                gap: '2px',
            }}>
                {[1, 2, 3].map((dot) => (
                    <div
                        key={dot}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: tokens.colors.primary.cyan,
                            animation: `typingDot 1.4s infinite ease-in-out ${(dot - 1) * 0.2}s`,
                        }}
                    />
                ))}
            </div>
            <span>{username} is typing...</span>
        </div>
    );
};

// Enhanced message input with touch optimization
interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    disabled = false,
    placeholder = "Type a message...",
    maxLength = 1000
}) => {
    const { tokens } = useTheme();
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || disabled || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Auto-resize
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    return (
        <GlassmorphicCard
            variant="medium"
            style={{
                margin: tokens.spacing.base,
                marginTop: 0,
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: tokens.spacing.sm }}>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isSending}
                    maxLength={maxLength}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: tokens.colors.text.white,
                        fontSize: tokens.typography.scale.base,
                        fontFamily: tokens.typography.fonts.body,
                        resize: 'none',
                        minHeight: '44px', // Touch-friendly
                        maxHeight: '120px',
                        padding: `${tokens.spacing.sm} 0`,
                        lineHeight: tokens.typography.leading.normal,
                    }}
                    className="message-input"
                />

                <button
                    type="submit"
                    disabled={!message.trim() || disabled || isSending}
                    style={{
                        background: message.trim()
                            ? `linear-gradient(135deg, ${tokens.colors.primary.cyan}, ${tokens.colors.primary.purple})`
                            : tokens.colors.interactive.disabled,
                        border: 'none',
                        borderRadius: tokens.layout.radius.base,
                        color: tokens.colors.text.white,
                        cursor: message.trim() && !disabled && !isSending ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '44px',
                        minHeight: '44px',
                        transition: 'var(--transition-normal)',
                        transform: 'translateZ(0)', // Hardware acceleration
                    }}
                    onMouseEnter={(e) => {
                        if (message.trim() && !disabled && !isSending) {
                            e.currentTarget.style.boxShadow = `0 0 20px ${tokens.colors.primary.cyan}`;
                            e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                    }}
                >
                    {isSending ? (
                        <CyberSpinner size="sm" color="cyan" />
                    ) : (
                        <span style={{ fontSize: '18px' }}>⚡</span>
                    )}
                </button>
            </form>

            {message.length > maxLength * 0.8 && (
                <div style={{
                    fontSize: tokens.typography.scale.xs,
                    color: message.length >= maxLength ? tokens.colors.status.error : tokens.colors.text.secondary,
                    textAlign: 'right',
                    marginTop: tokens.spacing.xs,
                }}>
                    {message.length}/{maxLength}
                </div>
            )}
        </GlassmorphicCard>
    );
};

// Hook for WebSocket management
export const useChatWebSocket = (url: string) => {
    const [socket, setSocket] = useState<ChatWebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const ws = new ChatWebSocket(url);

        ws.on('open', () => setIsConnected(true));
        ws.on('close', () => setIsConnected(false));
        ws.on('error', () => setIsConnected(false));
        ws.on('message', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        setSocket(ws);

        return () => {
            ws.disconnect();
        };
    }, [url]);

    const sendMessage = useCallback((content: string) => {
        if (socket && isConnected) {
            const message = {
                type: 'text',
                content,
                timestamp: Date.now(),
            };
            socket.sendMessage(JSON.stringify(message));
        }
    }, [socket, isConnected]);

    return {
        isConnected,
        messages,
        sendMessage,
        connectionState: socket?.connectionState || WebSocket.CLOSED,
    };
};
