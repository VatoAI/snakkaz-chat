import React from 'react';

const SimpleModernChat: React.FC = () => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: '"Space Grotesk", sans-serif'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                🚀 MODERNE CHAT DESIGN ER AKTIVERT! 🚀
                <div style={{ fontSize: '16px', marginTop: '20px', opacity: 0.8 }}>
                    Dette er den nye spektakulære glassmorfisme chatten
                </div>
            </div>
        </div>
    );
};

export default SimpleModernChat;
