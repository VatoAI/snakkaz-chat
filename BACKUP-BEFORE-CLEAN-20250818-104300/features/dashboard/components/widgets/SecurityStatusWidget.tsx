import React, { useState, useEffect } from 'react';
import { SecurityStatusData } from '../../../types/dashboard';

interface SecurityStatusWidgetProps {
    data: SecurityStatusData;
    loading?: boolean;
}

const SecurityStatusWidget: React.FC<SecurityStatusWidgetProps> = ({ data, loading }) => {
    const [timeLeft, setTimeLeft] = useState(data.session.timeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    const getEncryptionColor = () => {
        switch (data.encryption.status) {
            case 'active': return '#22c55e';
            case 'warning': return '#f59e0b';
            case 'inactive': return '#ef4444';
            default: return 'rgba(255, 255, 255, 0.6)';
        }
    };

    return (
        <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--backdrop-blur)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '120px'
        }}>
            {/* Security Level Indicator */}
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getEncryptionColor(),
                animation: data.encryption.status === 'active' ? 'none' : 'pulse 2s infinite',
                boxShadow: `0 0 10px ${getEncryptionColor()}`
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <h3 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    SIKKERHET
                </h3>
            </div>

            {/* Security Stats */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                {/* Encryption Status */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        🔐 Kryptering
                    </span>
                    <span style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: getEncryptionColor()
                    }}>
                        {loading ? '...' : data.encryption.type}
                    </span>
                </div>

                {/* Session Timer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        ⏰ Sesjon
                    </span>
                    <span style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: timeLeft < 300 ? '#ef4444' : 'var(--snakkaz-primary)'
                    }}>
                        {loading ? '...' : formatTime(timeLeft)}
                    </span>
                </div>

                {/* Connected Devices */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        📱 Enheter
                    </span>
                    <span style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: data.devices.suspicious > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.8)'
                    }}>
                        {loading ? '...' : `${data.devices.loggedIn}${data.devices.suspicious > 0 ? ' ⚠️' : ''}`}
                    </span>
                </div>
            </div>

            {/* Renew Session Button */}
            {data.session.canRenew && timeLeft < 600 && (
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px'
                }}>
                    <button style={{
                        background: 'var(--snakkaz-primary)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: 0.8
                    }}>
                        Forny
                    </button>
                </div>
            )}
        </div>
    );
};

export default SecurityStatusWidget;
