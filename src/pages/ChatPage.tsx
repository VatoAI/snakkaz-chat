import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import FreshChat from '../features/chat/components/FreshChat';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Allow demo mode without authentication
    const isDemoMode = location.pathname === '/demo';

    if (!user && !isDemoMode) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                flexDirection: 'column',
                background: '#f8f9fa'
            }}>
                <h2>Ikke innlogget</h2>
                <p>Du må logge inn for å bruke chatten.</p>
                <a href="/login" style={{
                    padding: '12px 24px',
                    background: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    marginTop: '20px'
                }}>
                    🔑 Logg inn
                </a>
            </div>
        );
    }

    // Clean and simple render
    return <FreshChat />;
};

export default ChatPage;