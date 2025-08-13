import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/authentication';
import WidgetDashboard from '../features/dashboard/components/WidgetDashboard';

const LiquidDreamMain: React.FC = () => {
    const { user } = useAuth();
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

    return <WidgetDashboard />;
};

export default LiquidDreamMain;
