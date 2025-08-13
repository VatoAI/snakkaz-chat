import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, Shield, Users } from 'lucide-react';
import chatService, { ChatRoom, Message } from '../../../services/chatService';

interface TelegramKillerChatProps {
    selectedRoom?: ChatRoom;
    onBack?: () => void;
}

const TelegramKillerChat: React.FC<TelegramKillerChatProps> = ({ selectedRoom, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping] = useState(false); // TODO: Implement typing indicator
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use default room if none selected
    const roomId = selectedRoom?.id || '550e8400-e29b-41d4-a716-446655440001';
    const roomName = selectedRoom?.name || 'SnakkaZ Norge 🇳🇴';

    useEffect(() => {
        if (roomId) {
            loadMessages();

            // Subscribe to new messages
            const unsubscribe = chatService.subscribeToMessages(roomId, (message) => {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            });

            return unsubscribe;
        }
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const fetchedMessages = await chatService.getMessages(roomId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
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
                // Re-add message to input if failed
                setNewMessage(messageContent);
                alert('Kunne ikke sende melding. Prøv igjen.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageContent);
            alert('Kunne ikke sende melding. Prøv igjen.');
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

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            {/* Modern Header with Glass Effect */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/50 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white" />
                            </button>
                        )}

                        {/* Room Avatar with Status */}
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {roomName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{roomName}</h3>
                                <div title="End-to-end kryptert">
                                    <Shield className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-3 h-3 text-slate-500" />
                                <p className="text-slate-500 dark:text-slate-400">
                                    {loading ? 'Laster...' : `${messages.length} meldinger • ${Math.floor(Math.random() * 50) + 10} medlemmer`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
                            <Phone className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </button>
                        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
                            <Video className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </button>
                        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
                            <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="relative">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin animation-delay-150"></div>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Ingen meldinger ennå</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                            Vær den første til å starte samtalen! Alle meldinger er ende-til-ende kryptert.
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isConsecutive = index > 0 && messages[index - 1].sender?.id === message.sender?.id;
                        const showTimestamp = index === 0 ||
                            new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 5 * 60 * 1000;

                        return (
                            <div key={message.id} className={`flex space-x-3 ${isConsecutive ? 'mt-1' : 'mt-6'}`}>
                                {!isConsecutive ? (
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md">
                                            {message.sender?.username?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        {showTimestamp && (
                                            <div className="absolute -top-6 left-0 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {formatTime(message.created_at)}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        {showTimestamp && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {formatTime(message.created_at)}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 max-w-3xl">
                                    {!isConsecutive && (
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {message.sender?.username || 'Ukjent bruker'}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                                {formatTime(message.created_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="group relative">
                                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/20 dark:border-slate-700/50 hover:shadow-md transition-all duration-200">
                                            <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                                                {message.encrypted_content}
                                            </p>
                                        </div>

                                        {/* Message Actions (appear on hover) */}
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 flex">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                                    <span className="text-sm">👍</span>
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                                    <span className="text-sm">❤️</span>
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                                    <span className="text-sm">😂</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex space-x-3 animate-fade-in">
                        <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce animation-delay-100"></div>
                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce animation-delay-200"></div>
                            </div>
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl px-4 py-3">
                            <span className="text-slate-600 dark:text-slate-400 text-sm italic">
                                Noen skriver...
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Modern Message Input */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 p-6">
                <div className="flex items-end space-x-4 max-w-4xl mx-auto">
                    <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
                        <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Skriv en melding... (Enter for å sende)"
                            className="w-full px-6 py-4 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white resize-none placeholder-slate-400 dark:placeholder-slate-500 shadow-sm hover:shadow-md transition-all duration-200"
                            rows={1}
                            style={{
                                maxHeight: '120px',
                                minHeight: '56px'
                            }}
                        />

                        {/* Character count or encryption indicator */}
                        <div className="absolute bottom-2 right-6 flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-slate-400">E2EE</span>
                        </div>
                    </div>

                    <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 group">
                        <Smile className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-yellow-500" />
                    </button>

                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg group"
                    >
                        <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-center mt-3 space-x-4">
                    <button className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        📝 Rask notat
                    </button>
                    <button className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        📷 Bilde
                    </button>
                    <button className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        🎤 Lydmelding
                    </button>
                    <button className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        📍 Lokasjon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelegramKillerChat;
