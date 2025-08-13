import React from 'react';
import { ActivityItem } from '../../../types/dashboard';

interface RecentActivityWidgetProps {
    activities: ActivityItem[];
    loading?: boolean;
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activities, loading }) => {
    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Akkurat nå';
        if (minutes < 60) return `${minutes}m siden`;
        if (hours < 24) return `${hours}t siden`;
        return `${days}d siden`;
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
            minHeight: '200px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>📈</span>
                <h3 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    SISTE AKTIVITET
                </h3>
            </div>

            {/* Activity Timeline */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '150px',
                overflowY: 'auto'
            }}>
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: '2rem'
                    }}>
                        Laster aktivitet...
                    </div>
                ) : activities.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: '2rem'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
                        <div>Velkommen til SnakkaZ!</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            Din aktivitet vil vises her
                        </div>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Activity Icon */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--glass-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                flexShrink: 0
                            }}>
                                {activity.icon}
                            </div>

                            {/* Activity Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'white',
                                    marginBottom: '0.25rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {activity.description}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }}>
                                    {formatTimeAgo(activity.time)}
                                </div>
                            </div>

                            {/* Activity Type Indicator */}
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: activity.type === 'message' ? 'var(--snakkaz-primary)' :
                                    activity.type === 'login' ? '#22c55e' :
                                        activity.type === 'group_join' ? 'var(--snakkaz-secondary)' :
                                            '#f59e0b',
                                flexShrink: 0
                            }} />
                        </div>
                    ))
                )}
            </div>

            {/* System Status Footer */}
            <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    System status:
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem'
                }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>
                        Alt fungerer
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecentActivityWidget;
