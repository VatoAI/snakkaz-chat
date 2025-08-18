import React from 'react';
import { NotificationData } from '../../../types/dashboard';

interface NotificationWidgetProps {
    data: NotificationData;
    loading?: boolean;
}

const NotificationWidget: React.FC<NotificationWidgetProps> = ({ data, loading }) => {
    const hasNotifications = data.unread > 0 || data.invitations > 0;

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
            {/* Notification Pulse */}
            {hasNotifications && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 10px #ef4444'
                }} />
            )}

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>🔔</span>
                <h3 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    NOTIFIKASJONER
                </h3>
            </div>

            {/* Notification Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
            }}>
                <div>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: data.unread > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '0.25rem'
                    }}>
                        {loading ? '...' : data.unread}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Uleste
                    </div>
                </div>

                <div>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: data.invitations > 0 ? 'var(--snakkaz-secondary)' : 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '0.25rem'
                    }}>
                        {loading ? '...' : data.invitations}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Invitasjoner
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            {!loading && data.unread > 0 && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '0.5rem'
                    }}>
                        <span>Kategorier:</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.7rem'
                    }}>
                        <span style={{ color: 'var(--snakkaz-primary)' }}>
                            💬 {data.categories.messages}
                        </span>
                        <span style={{ color: 'var(--snakkaz-secondary)' }}>
                            👥 {data.categories.groups}
                        </span>
                        <span style={{ color: '#f59e0b' }}>
                            ⚙️ {data.categories.system}
                        </span>
                    </div>
                </div>
            )}

            {/* No Notifications State */}
            {!loading && !hasNotifications && (
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.4)'
                }}>
                    ✨ Alt er oppdatert
                </div>
            )}
        </div>
    );
};

export default NotificationWidget;
