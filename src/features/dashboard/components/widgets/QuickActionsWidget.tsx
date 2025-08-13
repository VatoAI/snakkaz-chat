import React from 'react';
import { QuickAction } from '../../../types/dashboard';

interface QuickActionsWidgetProps {
    actions: QuickAction[];
    loading?: boolean;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ actions, loading }) => {
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
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                <h3 style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: 0
                }}>
                    HURTIGHANDLINGER
                </h3>
            </div>

            {/* Action Buttons */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.75rem'
            }}>
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.action}
                        disabled={loading}
                        style={{
                            background: action.highlight
                                ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border: action.highlight
                                ? '1px solid var(--snakkaz-primary)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '1rem 0.75rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.6 : 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minHeight: '80px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {/* Icon */}
                        <span style={{
                            fontSize: '1.5rem',
                            marginBottom: '0.25rem'
                        }}>
                            {action.icon}
                        </span>

                        {/* Label */}
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: '1.2'
                        }}>
                            {action.label}
                        </span>

                        {/* Highlight Effect */}
                        {action.highlight && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                                transform: 'translate(-50%, -50%)',
                                animation: 'pulse 3s ease-in-out infinite',
                                pointerEvents: 'none'
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Quick Stats */}
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
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <span>Siste aktivitet:</span>
                    <span style={{ color: 'var(--snakkaz-primary)' }}>
                        {loading ? '...' : '2 min siden'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsWidget;
