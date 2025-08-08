import React from 'react';
import TelegramStyleChat from '../components/chat/TelegramStyleChat';

const ChatPage: React.FC = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TelegramStyleChat />
        </div>
    );
};

export default ChatPage;
