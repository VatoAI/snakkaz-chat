import React, { useState } from 'react';
import { mockMessages, mockUsers, User, Message } from '../../../data/mockChatData';
import './FreshChat.css';

const FreshChat: React.FC = () => {
    const [messages] = useState<Message[]>(mockMessages);
    const [newMessage, setNewMessage] = useState('');

    const getUserById = (userId: string): User | undefined => {
        return mockUsers.find(user => user.id === userId);
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('no-NO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // For nå bare console.log
            console.log('Sending:', newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="fresh-chat">
            {/* Header */}
            <div className="chat-header">
                <h1>SnakkaZ Chat 💬</h1>
                <div className="online-count">
                    {mockUsers.filter(u => u.online).length} online
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map(message => {
                    const user = getUserById(message.userId);
                    return (
                        <div key={message.id} className="message">
                            <div className="message-avatar">
                                {user?.avatar || '👤'}
                            </div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="username">{user?.name || 'Unknown'}</span>
                                    <span className="timestamp">{formatTime(message.timestamp)}</span>
                                </div>
                                <div className="message-text">
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Skriv en melding..."
                    className="message-input"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    className="send-button"
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default FreshChat;
