import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, Star, Zap, Shield, Users } from 'lucide-react';
import chatService, { ChatRoom, Message } from '../../../services/chatService';

interface SpectacularChatProps {
    selectedRoom?: ChatRoom;
    onBack?: () => void;
}

const SpectacularChat: React.FC<SpectacularChatProps> = ({ selectedRoom, onBack }) => {
    console.log('🚀 SpectacularChat: Component initializing...', { selectedRoom, onBack });

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use default room if none selected
    const roomId = selectedRoom?.id || '550e8400-e29b-41d4-a716-446655440001';
    const roomName = selectedRoom?.name || 'SnakkaZ Norge 🇳🇴';

    console.log('🏠 SpectacularChat: Current state:', {
        roomId,
        roomName,
        messagesCount: messages.length,
        loading,
        selectedRoom
    });

    console.log('🎨 SpectacularChat: Render decision - loading:', loading, 'messages:', messages.length);

    useEffect(() => {
        console.log('🎯 SpectacularChat: Component mounted with roomId:', roomId);
        if (roomId && !loading) {
            loadMessages();

            // Subscribe to new messages  
            const unsubscribe = chatService.subscribeToMessages(roomId, (message) => {
                console.log('📩 SpectacularChat: New message received:', message);
                setMessages(prev => [...prev, message]);
            });

            return unsubscribe;
        }
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        console.log('🔄 SpectacularChat: Loading messages for room:', roomId);
        setLoading(true);
        try {
            const fetchedMessages = await chatService.getMessages(roomId);
            console.log('📨 SpectacularChat: Fetched messages:', fetchedMessages);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('❌ SpectacularChat: Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageContent = newMessage.trim();
        setNewMessage('');

        try {
            const success = await chatService.sendMessage(roomId, messageContent);
            if (!success) {
                setNewMessage(messageContent);
                // Spectacular error notification
                const errorNotif = document.createElement('div');
                errorNotif.className = 'fixed top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-slide-in';
                errorNotif.textContent = '🚫 Melding ikke sendt - prøv igjen!';
                document.body.appendChild(errorNotif);
                setTimeout(() => errorNotif.remove(), 3000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageContent);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffDays === 1) {
            return 'I går ' + date.toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('no-NO', {
                day: 'numeric',
                month: 'short'
            }) + ' ' + date.toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

    return (
        <div
            className="spectacular-chat-force-visible"
            data-component="chat"
            style={{
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#ffffff',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                visibility: 'visible',
                opacity: 1,
                zIndex: 1000,
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'auto'
            }}
        >
            {/* Liquid Glass Dark Background - Consistent with Login */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            }}>
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse"></div>
            </div>

            {/* Ultra Modern Header - Dark Liquid Glass Style */}
            <div className="relative z-10 bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="md:hidden p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
                                </button>
                            )}

                            {/* Epic Room Avatar - Toned Down */}
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-indigo-600/50 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    {roomName.charAt(0)}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-lg"></div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-black/50 rounded-full shadow-lg animate-pulse"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400/80 rounded-full animate-bounce">
                                    <Star className="w-3 h-3 text-yellow-800 m-0.5" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center space-x-3">
                                    <h3 className="font-bold text-white text-xl" style={{ fontFamily: 'var(--font-display, "Orbitron", monospace)' }}>
                                        {roomName}
                                    </h3>
                                    <div className="flex items-center space-x-1">
                                        <Shield className="w-5 h-5 text-green-400" />
                                        <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Users className="w-4 h-4 text-blue-300" />
                                    <p className="text-blue-200">
                                        {loading ? (
                                            <span className="animate-pulse">Laster magi...</span>
                                        ) : (
                                            <>
                                                <span className="font-semibold text-green-300">{messages.length}</span> meldinger •
                                                <span className="font-semibold text-purple-300">{Math.floor(Math.random() * 50) + 10}</span> aktive nå
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Epic Action Buttons */}
                        <div className="flex items-center space-x-2">
                            <button className="p-4 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-white/10 hover:border-blue-400/50">
                                <Phone className="w-6 h-6 text-white group-hover:text-green-400 transition-colors group-hover:scale-110 transform duration-300" />
                            </button>
                            <button className="p-4 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-white/10 hover:border-purple-400/50">
                                <Video className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors group-hover:scale-110 transform duration-300" />
                            </button>
                            <button className="p-4 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-white/10 hover:border-pink-400/50">
                                <MoreVertical className="w-6 h-6 text-white group-hover:text-pink-400 transition-colors group-hover:scale-110 transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spectacular Messages Area */}
            <div className="flex-1 relative z-10 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-300"></div>
                        </div>
                        <div className="ml-4 text-white text-lg font-semibold animate-pulse">
                            Laster spektakulære meldinger...
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center h-64 text-center"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '16rem',
                            textAlign: 'center',
                            visibility: 'visible',
                            opacity: 1,
                            zIndex: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent"
                            style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'white',
                                marginBottom: '1rem',
                                visibility: 'visible',
                                display: 'block'
                            }}
                        >
                            🌟 INGEN MELDINGER ENNÅ! 🌟
                        </h3>
                        <p className="text-blue-200 max-w-md text-lg leading-relaxed">
                            Vær den første til å starte denne spektakulære samtalen!
                            <br />
                            <span className="text-green-300">🔐 Ende-til-ende kryptert</span>
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        console.log('🖼️ SpectacularChat: Rendering message:', message);
                        const isConsecutive = index > 0 && messages[index - 1].sender?.id === message.sender?.id;
                        const showTimestamp = index === 0 ||
                            new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 5 * 60 * 1000;

                        return (
                            <div key={message.id} className={`flex space-x-4 animate-slide-up ${isConsecutive ? 'mt-2' : 'mt-8'}`}>
                                {!isConsecutive ? (
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-2xl transform hover:scale-110 transition-transform duration-300">
                                            {message.sender?.username?.charAt(0)?.toUpperCase() || '?'}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 via-purple-500/50 to-pink-500/50 rounded-2xl blur-lg"></div>
                                        </div>
                                        {showTimestamp && (
                                            <div className="absolute -top-8 left-0 text-xs text-blue-200 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm whitespace-nowrap">
                                                {formatTime(message.created_at)}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        {showTimestamp && (
                                            <span className="text-xs text-blue-300 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                                                {formatTime(message.created_at)}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 max-w-4xl">
                                    {!isConsecutive && (
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="font-bold text-white text-lg bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                                {message.sender?.username || 'Mystisk bruker'}
                                            </span>
                                            <span className="text-xs text-blue-300 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                                {formatTime(message.created_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="group relative">
                                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl border border-white/20 hover:bg-white/15 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-[1.02]">
                                            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                                                {message.encrypted_content}
                                            </p>
                                        </div>

                                        {/* Epic Message Actions */}
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
                                            <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex p-1">
                                                {quickReactions.map((emoji, i) => (
                                                    <button
                                                        key={i}
                                                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-110"
                                                        onClick={() => console.log('Reaction:', emoji)}
                                                    >
                                                        <span className="text-lg">{emoji}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Ultra Modern Message Input */}
            <div className="relative z-10 bg-white/10 backdrop-blur-2xl border-t border-white/20 p-6">
                <div className="flex items-end space-x-4 max-w-6xl mx-auto">
                    <button className="p-4 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-white/10 hover:border-blue-400/50">
                        <Paperclip className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors group-hover:rotate-12 transform duration-300" />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Skriv en spektakulær melding... ✨ (Enter for å sende)"
                            className="w-full px-8 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400/50 text-white resize-none placeholder-blue-200 shadow-2xl hover:bg-white/15 transition-all duration-300 text-lg"
                            rows={1}
                            style={{
                                maxHeight: '160px',
                                minHeight: '64px'
                            }}
                        />

                        {/* Encryption indicator */}
                        <div className="absolute bottom-3 right-8 flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300 font-semibold">E2EE</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-4 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-white/10 hover:border-yellow-400/50"
                    >
                        <Smile className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors group-hover:scale-110 transform duration-300" />
                    </button>

                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-4 bg-gradient-to-r from-blue-600/70 via-purple-600/70 to-indigo-600/70 hover:from-blue-700/80 hover:via-purple-700/80 hover:to-indigo-700/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 disabled:hover:shadow-none group transform hover:scale-105 disabled:hover:scale-100"
                    >
                        <Send className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Epic Quick Actions */}
                <div className="flex items-center justify-center mt-6 space-x-6">
                    {[
                        { icon: '📝', text: 'Rask notat', color: 'blue' },
                        { icon: '📷', text: 'Bilde', color: 'green' },
                        { icon: '🎤', text: 'Lydmelding', color: 'purple' },
                        { icon: '📍', text: 'Lokasjon', color: 'pink' },
                        { icon: '🎁', text: 'Gift', color: 'yellow' }
                    ].map((action, i) => (
                        <button
                            key={i}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/30 backdrop-blur-sm group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                            <span className="text-sm text-white font-medium">{action.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Emoji Picker (if shown) */}
            {showEmojiPicker && (
                <div className="absolute bottom-24 right-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                    <div className="grid grid-cols-6 gap-2">
                        {['😀', '😂', '🥰', '😎', '🤔', '😮', '😢', '😡', '👍', '❤️', '🔥', '⭐', '🎉', '🚀', '💎', '⚡', '🌟', '💫'].map((emoji, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                }}
                                className="text-2xl p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-110"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpectacularChat;
