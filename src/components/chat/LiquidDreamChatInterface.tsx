import React, { useState, useEffect, useRef } from 'react';
import { StandardLoading } from '../common/StandardLoading';
import { useMessages, useChatRooms } from '../../hooks/useChat';
import { 
    Send, 
    Hash, 
    Users, 
    Plus, 
    Sparkles, 
    Zap,
    Heart,
    Smile,
    MoreHorizontal,
    Mic,
    Paperclip,
    Image,
    Phone,
    Video
} from 'lucide-react';

interface ChatMessage {
    id: string;
    content: string;
    user_id: string;
    user_email?: string;
    created_at: string;
    isOwn?: boolean;
}

export const LiquidDreamChatInterface: React.FC = () => {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chat rooms
    const { rooms, loading: roomsLoading, createRoom } = useChatRooms();

    // Load messages for selected room
    const {
        messages,
        loading: messagesLoading,
        sendMessage
    } = useMessages(selectedRoomId);

    // Auto-select first room when rooms load
    useEffect(() => {
        if (rooms.length > 0 && !selectedRoomId) {
            setSelectedRoomId(rooms[0].id);
        }
    }, [rooms, selectedRoomId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending messages with Matrix effect
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedRoomId || sending) {
            return;
        }

        setSending(true);
        setShowMatrix(true);
        
        const success = await sendMessage(messageInput);
        if (success) {
            setMessageInput('');
        }
        
        setSending(false);
        setTimeout(() => setShowMatrix(false), 1500);
    };

    // Handle key press in message input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Create a demo room if none exist
    const handleCreateDemoRoom = async () => {
        await createRoom('🌊 Liquid Dream Chat', 'Hovedrom for team-kommunikasjon med superkrefter!');
    };

    // Show loading screen while rooms are loading
    if (roomsLoading) {
        return <StandardLoading message="Starter Liquid Dream Chat..." />;
    }

    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

    return (
        <div
            style={{
                height: '100vh',
                background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
                position: 'relative',
                fontFamily: 'var(--font-body)',
                overflow: 'hidden'
            }}
            className="flex"
        >
            {/* Matrix Rain Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                background: showMatrix 
                    ? `
                        radial-gradient(circle at 50% 50%, rgba(77, 208, 225, 0.2) 0%, transparent 70%),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 2px,
                            rgba(77, 208, 225, 0.1) 2px,
                            rgba(77, 208, 225, 0.1) 4px
                        )
                    `
                    : 'transparent',
                animation: showMatrix ? 'matrixPulse 1.5s ease-in-out' : 'none'
            }} />

            {/* Liquid Dream Background Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 50%, rgba(77, 208, 225, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(129, 199, 132, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)
                `,
                animation: 'liquidDream 25s ease-in-out infinite',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            {/* Sidebar - Room List */}
            <div
                style={{
                    width: '380px',
                    background: `
                        linear-gradient(135deg, 
                            rgba(255,255,255,0.1) 0%, 
                            rgba(255,255,255,0.05) 50%, 
                            rgba(77, 208, 225, 0.1) 100%
                        )
                    `,
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    position: 'relative',
                    zIndex: 2,
                    borderTopLeftRadius: '24px',
                    borderBottomLeftRadius: '24px'
                }}
                className="flex flex-col"
            >
                {/* Floating Orbs */}
                <div style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    zIndex: 1,
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(77, 208, 225, 0.3), rgba(77, 208, 225, 0.1))',
                    backdropFilter: 'blur(10px)',
                    animation: 'liquidFloat 3s ease-in-out infinite'
                }} />
                <div style={{ 
                    position: 'absolute', 
                    bottom: '30px', 
                    left: '20px', 
                    zIndex: 1,
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(129, 199, 132, 0.3), rgba(129, 199, 132, 0.1))',
                    backdropFilter: 'blur(10px)',
                    animation: 'liquidFloat 4s ease-in-out infinite reverse'
                }} />

                {/* Sidebar Header */}
                <div style={{
                    padding: '2rem 1.5rem 1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div className="flex items-center justify-between">
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0 0 20px rgba(77, 208, 225, 0.3)'
                        }} className="flex items-center gap-3">
                            <Hash size={24} style={{ color: 'var(--snakkaz-primary)' }} />
                            LIQUID ROOMS
                        </h2>
                        <button
                            onClick={handleCreateDemoRoom}
                            style={{
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 20px rgba(77, 208, 225, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(10px)'
                            }}
                            className="hover:scale-110"
                            title="Lag nytt rom"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    {/* Active Users Count */}
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Users size={16} style={{ color: 'var(--snakkaz-secondary)' }} />
                        <span style={{ 
                            color: 'var(--text-primary)', 
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            {rooms.length} aktive rom
                        </span>
                    </div>
                </div>

                {/* Room List */}
                <div className="flex-1 overflow-y-auto" style={{ padding: '1rem' }}>
                    {rooms.length === 0 ? (
                        <div style={{ 
                            padding: '2rem 1rem', 
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: '1rem'
                            }}>🌊</div>
                            <h3 style={{
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                            }}>
                                Ingen chatrom enda
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                marginBottom: '1.5rem'
                            }}>
                                Lag ditt første Liquid Dream chatrom!
                            </p>
                            <button
                                onClick={handleCreateDemoRoom}
                                style={{
                                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 20px rgba(77, 208, 225, 0.3)'
                                }}
                                className="hover:scale-105"
                            >
                                <Plus size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                                Lag første rom
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => setSelectedRoomId(room.id)}
                                    style={{
                                        padding: '1rem',
                                        background: selectedRoomId === room.id 
                                            ? `linear-gradient(135deg, 
                                                rgba(77, 208, 225, 0.2) 0%, 
                                                rgba(77, 208, 225, 0.1) 100%
                                            )`
                                            : 'rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        border: selectedRoomId === room.id 
                                            ? '1px solid rgba(77, 208, 225, 0.4)'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(10px)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    className="hover:bg-opacity-80"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 style={{
                                                color: 'var(--text-primary)',
                                                fontWeight: '600',
                                                fontSize: '0.95rem',
                                                marginBottom: '0.25rem'
                                            }}>
                                                {room.name}
                                            </h4>
                                            {room.description && (
                                                <p style={{
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.8rem',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {room.description}
                                                </p>
                                            )}
                                        </div>
                                        {/* room.unread_count && room.unread_count > 0 && (
                                            <div style={{
                                                background: 'var(--snakkaz-primary)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {room.unread_count}
                                            </div>
                                        ) */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div
                style={{
                    flex: 1,
                    background: `
                        linear-gradient(135deg, 
                            rgba(255,255,255,0.08) 0%, 
                            rgba(255,255,255,0.03) 50%, 
                            rgba(99, 102, 241, 0.08) 100%
                        )
                    `,
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderTopRightRadius: '24px',
                    borderBottomRightRadius: '24px',
                    position: 'relative',
                    zIndex: 2
                }}
                className="flex flex-col"
            >
                {selectedRoom ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div className="flex items-center gap-3">
                                <div style={{
                                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Hash size={20} color="white" />
                                </div>
                                <div>
                                    <h3 style={{
                                        color: 'var(--text-primary)',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {selectedRoom.name}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.85rem'
                                    }}>
                                        {messages.length} meldinger • aktiv nå
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-opacity-20">
                                    <Phone size={16} />
                                </button>
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-opacity-20">
                                    <Video size={16} />
                                </button>
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-opacity-20">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            className="flex-1 overflow-y-auto"
                            style={{ 
                                padding: '1rem 2rem',
                                position: 'relative'
                            }}
                        >
                            {messagesLoading ? (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    height: '100%' 
                                }}>
                                    <StandardLoading message="Laster meldinger..." />
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                                    <h3 style={{
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.5rem',
                                        fontWeight: '600'
                                    }}>
                                        Start samtalen!
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        maxWidth: '300px'
                                    }}>
                                        Send den første meldingen i {selectedRoom.name} og få samtalen i gang.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message: ChatMessage) => (
                                        <div
                                            key={message.id}
                                            onMouseEnter={() => setHoveredMessage(message.id)}
                                            onMouseLeave={() => setHoveredMessage(null)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                                                marginBottom: '0.75rem'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: '70%',
                                                    padding: '1rem 1.25rem',
                                                    background: message.isOwn
                                                        ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                                        : `linear-gradient(135deg, 
                                                            rgba(255,255,255,0.1) 0%, 
                                                            rgba(255,255,255,0.05) 100%
                                                        )`,
                                                    borderRadius: message.isOwn 
                                                        ? '18px 18px 4px 18px'
                                                        : '18px 18px 18px 4px',
                                                    border: message.isOwn 
                                                        ? '1px solid rgba(255,255,255,0.3)'
                                                        : '1px solid rgba(255,255,255,0.2)',
                                                    color: message.isOwn ? 'white' : 'var(--text-primary)',
                                                    backdropFilter: 'blur(15px)',
                                                    WebkitBackdropFilter: 'blur(15px)',
                                                    transition: 'all 0.3s ease',
                                                    transform: hoveredMessage === message.id ? 'scale(1.02)' : 'scale(1)',
                                                    boxShadow: message.isOwn
                                                        ? '0 8px 20px rgba(77, 208, 225, 0.3)'
                                                        : '0 4px 15px rgba(0,0,0,0.1)',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '0.95rem',
                                                    lineHeight: '1.5',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    {message.content}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    opacity: 0.7,
                                                    marginTop: '0.5rem'
                                                }}>
                                                    {new Date(message.created_at).toLocaleTimeString('no-NO', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                
                                                {/* Message Actions on Hover */}
                                                {hoveredMessage === message.id && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '-15px',
                                                        right: message.isOwn ? 'auto' : '10px',
                                                        left: message.isOwn ? '10px' : 'auto',
                                                        display: 'flex',
                                                        gap: '0.25rem',
                                                        background: 'rgba(0,0,0,0.8)',
                                                        borderRadius: '8px',
                                                        padding: '0.25rem'
                                                    }}>
                                                        <button style={{
                                                            padding: '0.25rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#f59e0b',
                                                            cursor: 'pointer',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.2s ease'
                                                        }}>
                                                            <Heart size={12} />
                                                        </button>
                                                        <button style={{
                                                            padding: '0.25rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#6366f1',
                                                            cursor: 'pointer',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.2s ease'
                                                        }}>
                                                            <Smile size={12} />
                                                        </button>
                                                        <button style={{
                                                            padding: '0.25rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#10b981',
                                                            cursor: 'pointer',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.2s ease'
                                                        }}>
                                                            <Zap size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input Area */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255, 255, 255, 0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: `
                                    linear-gradient(135deg, 
                                        rgba(255,255,255,0.1) 0%, 
                                        rgba(255,255,255,0.05) 100%
                                    )
                                `,
                                borderRadius: '20px',
                                padding: '0.75rem 1.25rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(15px)',
                                WebkitBackdropFilter: 'blur(15px)'
                            }}>
                                {/* Attachment Button */}
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-white hover:bg-opacity-10">
                                    <Paperclip size={18} />
                                </button>

                                {/* Image Button */}
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-white hover:bg-opacity-10">
                                    <Image size={18} />
                                </button>

                                {/* Message Input */}
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Skriv en melding..."
                                    disabled={sending}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'inherit'
                                    }}
                                />

                                {/* Voice Message Button */}
                                <button style={{
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }} className="hover:bg-white hover:bg-opacity-10">
                                    <Mic size={18} />
                                </button>

                                {/* Send Button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || sending}
                                    style={{
                                        padding: '0.75rem',
                                        background: messageInput.trim() 
                                            ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                            : 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: messageInput.trim() 
                                            ? '0 8px 20px rgba(77, 208, 225, 0.3)'
                                            : 'none',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    className={messageInput.trim() ? 'hover:scale-105' : ''}
                                >
                                    {sending ? (
                                        <div style={{ 
                                            animation: 'spin 1s linear infinite',
                                            filter: 'drop-shadow(0 0 4px currentColor)'
                                        }}>⚡</div>
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                            
                            {/* Typing Indicator */}
                            {sending && (
                                <div style={{
                                    marginTop: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Sparkles size={14} style={{ color: 'var(--snakkaz-primary)' }} />
                                    Sender melding med Matrix power...
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                        padding: '2rem'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🌊</div>
                        <h2 style={{
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            fontWeight: '700',
                            fontSize: '1.5rem'
                        }}>
                            Velg et chatrom
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            maxWidth: '400px',
                            lineHeight: '1.6'
                        }}>
                            Velg et rom fra sidebaren for å starte å chatte med ditt team. 
                            Liquid Dream Chat gir deg superkrefter for kommunikasjon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiquidDreamChatInterface;

// Add CSS animations
if (typeof document !== 'undefined' && !document.querySelector('#liquid-chat-animations')) {
    const style = document.createElement('style');
    style.id = 'liquid-chat-animations';
    style.textContent = `
        @keyframes liquidDream {
            0% { transform: translate(0%, 0%) rotate(0deg); }
            33% { transform: translate(30%, -30%) rotate(120deg); }
            66% { transform: translate(-20%, 20%) rotate(240deg); }
            100% { transform: translate(0%, 0%) rotate(360deg); }
        }
        
        @keyframes liquidFloat {
            0% { transform: translateY(0px) scale(1); opacity: 0.7; }
            50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
            100% { transform: translateY(0px) scale(1); opacity: 0.7; }
        }
        
        @keyframes matrixPulse {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .hover\\:scale-105:hover {
            transform: scale(1.05);
        }

        .hover\\:scale-110:hover {
            transform: scale(1.10);
        }

        .hover\\:bg-opacity-20:hover {
            background-color: rgba(255,255,255,0.2) !important;
        }

        .hover\\:bg-opacity-80:hover {
            background-color: rgba(255,255,255,0.08) !important;
        }

        .hover\\:bg-white:hover {
            background-color: rgba(255,255,255,0.1) !important;
        }
    `;
    document.head.appendChild(style);
}
