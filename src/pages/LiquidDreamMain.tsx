import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/authentication';
import { useNavigate } from 'react-router-dom';
import WidgetDashboard from '../features/dashboard/components/WidgetDashboard';

const LiquidDreamMain: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Quick load for authenticated users
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            // Fallback timeout
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [user]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                    <h2 style={{
                        color: 'var(--snakkaz-primary)',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                    }}>
                        Laster SNAKKAZ...
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Forbereder din chat-opplevelse
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Apple Liquid Glass Chat Button */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999
            }}>
                <button
                    onClick={() => navigate('/chat')}
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.5)',
                        borderRadius: '20px',
                        padding: '12px 24px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
                    }}
                >
                    ✨ Apple Liquid Glass Chat
                </button>
            </div>
            <WidgetDashboard />
        </div>
    );
};

export default LiquidDreamMain;
