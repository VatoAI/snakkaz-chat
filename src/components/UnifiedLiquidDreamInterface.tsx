import React, { useState } from 'react';
import { 
    Settings, 
    MessageCircle, 
    Sparkles, 
    Zap, 
    Layers
} from 'lucide-react';
import SuperpowerDashboard from './SuperpowerDashboard';
import LiquidDreamChatInterface from './chat/LiquidDreamChatInterface';

type ViewMode = 'superpowers' | 'chat' | 'unified';

interface DeployedSuperpower {
    id: string;
    name: string;
    active: boolean;
    color: string;
    icon: string;
}

export const UnifiedLiquidDreamInterface: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('unified');
    const [deployedSuperpowers, setDeployedSuperpowers] = useState<DeployedSuperpower[]>([
        { id: 'liquid-messaging', name: 'Liquid Messaging', active: false, color: '#4dd0e1', icon: '🌊' },
        { id: 'instant-reactions', name: 'Instant Reactions', active: false, color: '#f59e0b', icon: '⚡' },
        { id: 'smart-ai', name: 'Smart AI Assist', active: false, color: '#6366f1', icon: '🧠' },
        { id: 'analytics', name: 'Analytics Dashboard', active: false, color: '#10b981', icon: '📊' },
        { id: 'magic-responses', name: 'Magic Responses', active: false, color: '#8b5cf6', icon: '🔮' },
        { id: 'theme-generator', name: 'Theme Generator', active: false, color: '#ec4899', icon: '🎨' }
    ]);
    const [showMatrixTransition, setShowMatrixTransition] = useState(false);

    // Handle superpower deployment from dashboard
    const handleSuperpowerDeploy = (superpowerId: string) => {
        setDeployedSuperpowers(prev => 
            prev.map(sp => 
                sp.id === superpowerId 
                    ? { ...sp, active: true }
                    : sp
            )
        );
        
        // Trigger Matrix transition effect
        setShowMatrixTransition(true);
        setTimeout(() => setShowMatrixTransition(false), 2000);
    };

    // Get active superpowers for chat
    const activeSuperpowers = deployedSuperpowers.filter(sp => sp.active);

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
            position: 'relative',
            fontFamily: 'var(--font-body)',
            overflow: 'hidden'
        }}>
            {/* Global Matrix Transition Effect */}
            {showMatrixTransition && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `
                        radial-gradient(circle at 50% 50%, rgba(77, 208, 225, 0.3) 0%, transparent 70%),
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(77, 208, 225, 0.1) 2px,
                            rgba(77, 208, 225, 0.1) 4px
                        )
                    `,
                    zIndex: 999,
                    pointerEvents: 'none',
                    animation: 'matrixTransition 2s ease-in-out'
                }} />
            )}

            {/* Unified Navigation Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: `
                    linear-gradient(135deg, 
                        rgba(255,255,255,0.1) 0%, 
                        rgba(255,255,255,0.05) 100%
                    )
                `,
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0 0 24px 24px',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.25rem'
                        }}>
                            SNAKKAZ LIQUID DREAM
                        </h1>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            {activeSuperpowers.length} superpowers aktive
                        </p>
                    </div>
                </div>

                {/* Active Superpowers Indicator */}
                <div className="flex items-center gap-2">
                    {activeSuperpowers.slice(0, 4).map((sp, index) => (
                        <div
                            key={sp.id}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${sp.color} 0%, ${sp.color}80 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                boxShadow: `0 4px 15px ${sp.color}30`,
                                animation: `superpowerPulse 2s ease-in-out infinite ${index * 0.2}s`,
                                border: '1px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(10px)'
                            }}
                            title={sp.name}
                        >
                            {sp.icon}
                        </div>
                    ))}
                    {activeSuperpowers.length > 4 && (
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            +{activeSuperpowers.length - 4}
                        </div>
                    )}
                </div>

                {/* View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '16px',
                    padding: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <button
                        onClick={() => setViewMode('superpowers')}
                        style={{
                            padding: '0.75rem 1rem',
                            background: viewMode === 'superpowers' 
                                ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                : 'transparent',
                            color: viewMode === 'superpowers' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Settings size={16} />
                        Superpowers
                    </button>
                    <button
                        onClick={() => setViewMode('unified')}
                        style={{
                            padding: '0.75rem 1rem',
                            background: viewMode === 'unified' 
                                ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                : 'transparent',
                            color: viewMode === 'unified' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Layers size={16} />
                        Unified
                    </button>
                    <button
                        onClick={() => setViewMode('chat')}
                        style={{
                            padding: '0.75rem 1rem',
                            background: viewMode === 'chat' 
                                ? 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)'
                                : 'transparent',
                            color: viewMode === 'chat' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <MessageCircle size={16} />
                        Chat
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                paddingTop: '120px', // Space for header
                height: '100%',
                display: 'flex',
                position: 'relative'
            }}>
                {viewMode === 'superpowers' && (
                    <div style={{ width: '100%', height: '100%' }}>
                        <SuperpowerDashboard />
                    </div>
                )}

                {viewMode === 'chat' && (
                    <div style={{ width: '100%', height: '100%' }}>
                        <LiquidDreamChatInterface />
                    </div>
                )}

                {viewMode === 'unified' && (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem'
                    }}>
                        {/* Left Panel - Superpowers Sidebar */}
                        <div style={{
                            width: '400px',
                            background: `
                                linear-gradient(135deg, 
                                    rgba(255,255,255,0.1) 0%, 
                                    rgba(255,255,255,0.05) 100%
                                )
                            `,
                            backdropFilter: 'blur(25px)',
                            WebkitBackdropFilter: 'blur(25px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '1rem'
                            }}>
                                <h3 style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: '700',
                                    fontSize: '1.2rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    🚀 Deploy Superpowers
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    Aktiver funksjoner for å forbedre chatten
                                </p>
                            </div>

                            {/* Superpowers Quick Deploy */}
                            <div className="space-y-3">
                                {deployedSuperpowers.map((sp) => (
                                    <div
                                        key={sp.id}
                                        style={{
                                            padding: '1rem',
                                            background: sp.active 
                                                ? `linear-gradient(135deg, ${sp.color}20 0%, ${sp.color}10 100%)`
                                                : 'rgba(255,255,255,0.05)',
                                            borderRadius: '16px',
                                            border: sp.active 
                                                ? `1px solid ${sp.color}40`
                                                : '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div style={{
                                                fontSize: '1.5rem',
                                                filter: sp.active ? 'none' : 'grayscale(1)'
                                            }}>
                                                {sp.icon}
                                            </div>
                                            <div>
                                                <h4 style={{
                                                    color: sp.active ? sp.color : 'var(--text-primary)',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {sp.name}
                                                </h4>
                                                <p style={{
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {sp.active ? 'Aktiv i chat' : 'Ikke deployed'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSuperpowerDeploy(sp.id)}
                                            disabled={sp.active}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: sp.active 
                                                    ? 'rgba(16, 185, 129, 0.8)'
                                                    : `linear-gradient(135deg, ${sp.color} 0%, ${sp.color}80 100%)`,
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                cursor: sp.active ? 'default' : 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {sp.active ? '✓ Aktiv' : 'Deploy'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div style={{
                                marginTop: 'auto',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: 'var(--text-secondary)' }}>Deployed:</span>
                                    <span style={{ 
                                        color: 'var(--snakkaz-primary)',
                                        fontWeight: '700'
                                    }}>
                                        {activeSuperpowers.length}/{deployedSuperpowers.length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span style={{ color: 'var(--text-secondary)' }}>Chat Power:</span>
                                    <span style={{ 
                                        color: activeSuperpowers.length > 3 ? '#10b981' : '#f59e0b',
                                        fontWeight: '700'
                                    }}>
                                        {activeSuperpowers.length === 0 ? 'Basic' :
                                         activeSuperpowers.length < 3 ? 'Enhanced' :
                                         activeSuperpowers.length < 5 ? 'Super' : 'ULTIMATE'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Enhanced Chat */}
                        <div style={{
                            flex: 1,
                            position: 'relative'
                        }}>
                            {/* Chat with Superpower Overlay */}
                            <div style={{ 
                                position: 'relative', 
                                height: '100%',
                                borderRadius: '24px',
                                overflow: 'hidden'
                            }}>
                                <LiquidDreamChatInterface />
                                
                                {/* Superpower Status Overlay */}
                                {activeSuperpowers.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(0,0,0,0.8)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        zIndex: 10
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: 'var(--snakkaz-primary)',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            <Zap size={14} />
                                            {activeSuperpowers.length} superpowers aktive
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedLiquidDreamInterface;

// Add CSS animations
if (typeof document !== 'undefined' && !document.querySelector('#unified-liquid-animations')) {
    const style = document.createElement('style');
    style.id = 'unified-liquid-animations';
    style.textContent = `
        @keyframes matrixTransition {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1); }
        }
        
        @keyframes superpowerPulse {
            0% { transform: scale(1); box-shadow: 0 4px 15px rgba(77, 208, 225, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(77, 208, 225, 0.5); }
            100% { transform: scale(1); box-shadow: 0 4px 15px rgba(77, 208, 225, 0.3); }
        }
    `;
    document.head.appendChild(style);
}
