import React, { useState, useEffect } from 'react';
import { chatService, ChatRoom, Message } from '../../../services/chatService';
import { useAuth } from '../../authentication';

const TelegramKillerChat: React.FC = () => {
    const { user } = useAuth();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);

    // Initialize chat service and load rooms
    useEffect(() => {
        const initializeChat = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // Initialize user profile
                await chatService.initializeUserProfile();

                // Load user's rooms
                const rooms = await chatService.getUserRooms();
                setChatRooms(rooms);

                // Auto-join default rooms if user has no rooms
                if (rooms.length === 0) {
                    await chatService.joinRoom('550e8400-e29b-41d4-a716-446655440001'); // SnakkaZ Norge
                    const updatedRooms = await chatService.getUserRooms();
                    setChatRooms(updatedRooms);

                    // Select first room
                    if (updatedRooms.length > 0) {
                        setSelectedRoom(updatedRooms[0].id);
                    }
                } else if (rooms.length > 0) {
                    setSelectedRoom(rooms[0].id);
                }
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeChat();
    }, [user]);

    // Load messages when room is selected
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedRoom) return;

            try {
                const roomMessages = await chatService.getRoomMessages(selectedRoom, 50);
                setMessages(roomMessages);

                // Mark room as read
                await chatService.markRoomAsRead(selectedRoom);

                // Subscribe to real-time messages
                chatService.subscribeToRoom(selectedRoom, (newMessage) => {
                    setMessages(prev => [...prev, newMessage]);
                });
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadMessages();

        // Cleanup subscription when room changes
        return () => {
            if (selectedRoom) {
                chatService.unsubscribeFromRoom(selectedRoom);
            }
        };
    }, [selectedRoom]);

    // Send message function
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedRoom || sendingMessage) return;

        setSendingMessage(true);
        try {
            const message = await chatService.sendMessage(selectedRoom, newMessage.trim());
            if (message) {
                setNewMessage('');
                // Message will be added via real-time subscription
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    // Handle key press for sending messages
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'var(--font-body)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid rgba(100, 181, 246, 0.3)',
                        borderTop: '3px solid var(--snakkaz-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <h3>Loading Chat...</h3>
                </div>
            </div>
        );
    }

    const selectedRoomData = chatRooms.find(room => room.id === selectedRoom);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
            display: 'flex',
            fontFamily: 'var(--font-body)',
            color: 'white'
        }}>
            {/* Sidebar - Chat Rooms */}
            <div style={{
                width: '350px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(100, 181, 246, 0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(100, 181, 246, 0.1)'
                }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0,
                        marginBottom: '1rem'
                    }}>
                        SnakkaZ
                    </h1>

                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Søk i chatter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(100, 181, 246, 0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '0.9rem'
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            🔍
                        </span>
                    </div>
                </div>

                {/* Chat Rooms List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem 0'
                }}>
                    {chatRooms.filter(room =>
                        room.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(room => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                cursor: 'pointer',
                                background: selectedRoom === room.id ?
                                    'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(77, 208, 225, 0.1) 100%)' :
                                    'transparent',
                                borderLeft: selectedRoom === room.id ?
                                    '3px solid var(--snakkaz-primary)' : '3px solid transparent',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    background: 'rgba(100, 181, 246, 0.05)'
                                }
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                {/* Room Avatar */}
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    position: 'relative'
                                }}>
                                    {room.name.charAt(0).toUpperCase()}
                                    {room.e2ee_enabled && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-2px',
                                            right: '-2px',
                                            width: '16px',
                                            height: '16px',
                                            background: '#22c55e',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '8px'
                                        }}>
                                            🔒
                                        </div>
                                    )}
                                </div>

                                {/* Room Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            margin: 0,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {room.name}
                                        </h3>

                                        {room.marketplace_enabled && (
                                            <span style={{
                                                fontSize: '0.8rem',
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '6px',
                                                marginLeft: '0.5rem'
                                            }}>
                                                🛒
                                            </span>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            margin: 0,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '180px'
                                        }}>
                                            {room.last_message?.content || 'Ingen meldinger ennå'}
                                        </p>

                                        {room.unread_count && room.unread_count > 0 && (
                                            <div style={{
                                                minWidth: '20px',
                                                height: '20px',
                                                background: 'var(--snakkaz-primary)',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                marginLeft: '0.5rem'
                                            }}>
                                                {room.unread_count > 99 ? '99+' : room.unread_count}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {selectedRoomData ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid rgba(100, 181, 246, 0.1)',
                            background: 'rgba(15, 23, 42, 0.5)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {selectedRoomData.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h2 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            margin: 0,
                                            marginBottom: '0.25rem'
                                        }}>
                                            {selectedRoomData.name}
                                        </h2>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            margin: 0
                                        }}>
                                            {selectedRoomData.type === 'group' ? '👥 Gruppe' :
                                                selectedRoomData.type === 'marketplace' ? '🛒 Markedsplass' : '💬 Privat'}
                                            {selectedRoomData.e2ee_enabled && ' • 🔒 End-to-end kryptert'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={{
                            flex: 1,
                            padding: '1rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {messages.length > 0 ? (
                                messages.map(message => (
                                    <div
                                        key={message.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            background: message.sender_id === user?.id ?
                                                'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(77, 208, 225, 0.1) 100%)' :
                                                'rgba(255, 255, 255, 0.05)'
                                        }}
                                    >
                                        <div style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {message.sender?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.25rem'
                                            }}>
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: 'var(--snakkaz-primary)'
                                                }}>
                                                    {message.sender?.username || 'Unknown'}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: 'rgba(255, 255, 255, 0.5)'
                                                }}>
                                                    {new Date(message.created_at).toLocaleTimeString('no-NO', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.95rem',
                                                lineHeight: 1.5,
                                                color: 'rgba(255, 255, 255, 0.9)'
                                            }}>
                                                {message.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem'
                                    }}>
                                        💬
                                    </div>
                                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Ingen meldinger ennå</h3>
                                    <p style={{ margin: 0 }}>Vær den første til å sende en melding!</p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div style={{
                            padding: '1.5rem',
                            borderTop: '1px solid rgba(100, 181, 246, 0.1)',
                            background: 'rgba(15, 23, 42, 0.5)'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-end'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Skriv en melding..."
                                        style={{
                                            width: '100%',
                                            minHeight: '50px',
                                            maxHeight: '120px',
                                            padding: '0.75rem 1rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(100, 181, 246, 0.2)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            resize: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sendingMessage}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: newMessage.trim() && !sendingMessage ?
                                            'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)' :
                                            'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: newMessage.trim() && !sendingMessage ? 'pointer' : 'not-allowed',
                                        minWidth: '80px'
                                    }}
                                >
                                    {sendingMessage ? '⏳' : '🚀'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '4rem',
                                marginBottom: '1rem'
                            }}>
                                💬
                            </div>
                            <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Velg en chat</h2>
                            <p style={{ margin: 0 }}>Velg en chat fra listen for å begynne å chatte</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TelegramKillerChat;
