import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatView } from '../features/chat/components/ChatView';
import { useChatWebSocket, Message } from '../features/chat/components/EnhancedChatComponents';

// Error boundary for chat container
class ChatErrorBoundary extends React.Component<
    { children: React.ReactNode; onError?: (error: Error) => void },
    { hasError: boolean; error?: Error }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Chat container error:', error, errorInfo);
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                }}>
                    <h3>Something went wrong with the chat</h3>
                    <p>Please refresh the page to continue.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--color-cyan)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Chat container with full business logic
interface ChatContainerProps {
    roomId: string;
    userId: string;
    websocketUrl?: string;
    onError?: (error: Error) => void;
    onMessageSent?: (message: Message) => void;
    onUserTyping?: (isTyping: boolean) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    roomId,
    userId,
    websocketUrl = 'ws://localhost:3001',
    onError,
    onMessageSent,
    onUserTyping
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [typingUsers] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const lastTypingRef = useRef<number>(0);

    // WebSocket connection with enhanced features
    const { isConnected, sendMessage: wsSendMessage, connectionState } = useChatWebSocket(
        `${websocketUrl}?roomId=${roomId}&userId=${userId}`
    );

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Simulate API call - replace with actual implementation
                const response = await fetch(`/api/rooms/${roomId}/messages`);
                if (!response.ok) throw new Error('Failed to load messages');

                const data = await response.json();
                setMessages(data.messages || []);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to load messages');
                setError(error.message);
                onError?.(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) {
            loadMessages();
        }
    }, [roomId, onError]);

    // Handle incoming messages via WebSocket
    // Note: In a real implementation, this would be handled by the useChatWebSocket hook
    useEffect(() => {
        if (!isConnected) return;

        // This is a placeholder for WebSocket message handling
        // The actual message handling would be done by the useChatWebSocket hook

        return () => {
            // Cleanup if needed
        };
    }, [isConnected, userId, roomId]);    // Send message with optimistic updates
    const handleSendMessage = useCallback(async (content: string): Promise<void> => {
        if (!content.trim() || !isConnected) {
            throw new Error('Cannot send message: not connected or empty content');
        }

        // Create optimistic message
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            userId,
            roomId,
            timestamp: Date.now(),
            type: 'text',
            content: content.trim(),
            sender: { name: 'You' }, // This would come from user context
        };

        // Add optimistic message
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            // Send via WebSocket
            await wsSendMessage(JSON.stringify({
                type: 'message',
                roomId,
                userId,
                content: content.trim(),
                timestamp: Date.now(),
            }));

            onMessageSent?.(optimisticMessage);
        } catch (error) {
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));

            const err = error instanceof Error ? error : new Error('Failed to send message');
            setError(err.message);
            onError?.(err);
            throw err;
        }
    }, [isConnected, userId, roomId, wsSendMessage, onMessageSent, onError]);

    // Handle typing indicators with debouncing
    const handleTyping = useCallback((isCurrentlyTyping: boolean) => {
        const now = Date.now();

        if (isCurrentlyTyping) {
            // Send typing indicator if we haven't sent one recently
            if (now - lastTypingRef.current > 2000) {
                wsSendMessage(JSON.stringify({
                    type: 'typing',
                    roomId,
                    userId,
                    timestamp: now,
                }));
                lastTypingRef.current = now;
            }

            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set timeout to stop typing
            typingTimeoutRef.current = setTimeout(() => {
                wsSendMessage(JSON.stringify({
                    type: 'stop_typing',
                    roomId,
                    userId,
                    timestamp: Date.now(),
                }));
            }, 3000);
        } else {
            // Immediately stop typing
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            wsSendMessage(JSON.stringify({
                type: 'stop_typing',
                roomId,
                userId,
                timestamp: Date.now(),
            }));
        }

        onUserTyping?.(isCurrentlyTyping);
    }, [wsSendMessage, roomId, userId, onUserTyping]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Connection status for UI
    const connectionStatus = {
        [WebSocket.CONNECTING]: 'Connecting...',
        [WebSocket.OPEN]: 'Connected',
        [WebSocket.CLOSING]: 'Disconnecting...',
        [WebSocket.CLOSED]: 'Disconnected',
    }[connectionState as number] || 'Unknown';

    return (
        <ChatErrorBoundary onError={onError}>
            <ChatView
                messages={messages}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                isConnected={isConnected}
                isLoading={isLoading}
                isTyping={typingUsers.size > 0}
                typingUsers={Array.from(typingUsers)}
                currentUserId={userId}
                roomId={roomId}
                connectionStatus={connectionStatus}
                error={error}
                onRetry={() => window.location.reload()}
            />
        </ChatErrorBoundary>
    );
};
