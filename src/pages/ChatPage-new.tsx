import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import SnakkaZChat from '../components/SnakkaZChat';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Allow demo mode without authentication
    const isDemoMode = location.pathname === '/demo';

    if (!user && !isDemoMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">🔒 Ikke innlogget</h2>
                    <p className="text-gray-400">Du må være innlogget for å bruke SnakkaZ chat.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <SnakkaZChat />
        </div>
    );
};

export default ChatPage;
