import React from 'react';
import SpectacularChat from '../features/chat/components/SpectacularChat';

const ChatPage: React.FC = () => {
    console.log('🎪 ChatPage: Rendering ChatPage component');

    return (
        <div
            className="h-screen flex flex-col liquid-glass css-protection-lock"
            style={{
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: 'var(--font-body, "Space Grotesk", sans-serif)',
                color: 'white',
                minHeight: '100vh'
            }}
        >
            <SpectacularChat />
        </div>
    );
};

export default ChatPage;
