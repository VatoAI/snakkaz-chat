import React from 'react';
import { MessageCountData } from '../../../types/dashboard';

interface MessageCountWidgetProps {
    data: MessageCountData;
    loading?: boolean;
}

const MessageCountWidget: React.FC<MessageCountWidgetProps> = ({ data, loading }) => {
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
            {/* Priority Indicator */}
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: data.unansweredMessages > 0 ? '#ef4444' : '#22c55e',
                animation: data.unansweredMessages > 0 ? 'pulse 2s infinite' : 'none'
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>📬</span>
                <h3 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    MELDINGER
                </h3>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
            }}>
                <div>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: 'var(--snakkaz-primary)',
                        marginBottom: '0.25rem'
                    }}>
                        {loading ? '...' : data.todayMessages}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Dagens
                    </div>
                </div>

                <div>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: data.unansweredMessages > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '0.25rem'
                    }}>
                        {loading ? '...' : data.unansweredMessages}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Ubesvarte
                    </div>
                </div>
            </div>

            {/* Trend Indicator */}
            {!loading && (
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    fontSize: '0.8rem',
                    color: data.trend === 'up' ? '#22c55e' : data.trend === 'down' ? '#ef4444' : 'rgba(255, 255, 255, 0.5)'
                }}>
                    {data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️'}
                </div>
            )}
        </div>
    );
};

export default MessageCountWidget;
