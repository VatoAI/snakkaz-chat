import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { IconMessage2, IconUsers, IconUser } from '@tabler/icons-react';

type ViewType = 'home' | 'chat' | 'profile' | 'settings';

const CleanDashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [currentView, setCurrentView] = useState<ViewType>('home');
    const [isMobile, setIsMobile] = useState(false);
    const { stats, loading } = useDashboardStats();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const renderContent = () => {
        switch (currentView) {
            case 'chat':
                return (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <h2>💬 Chat</h2>
                        <p>Chat-funksjonalitet kommer her</p>
                    </div>
                );
            case 'profile':
                return (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <h2>👤 Profil</h2>
                        <p>Profil-innstillinger kommer her</p>
                    </div>
                );
            case 'settings':
                return (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <h2>⚙️ Innstillinger</h2>
                        <p>App-innstillinger kommer her</p>
                    </div>
                );
            default:
                return (
                    <div style={{ padding: isMobile ? '1rem' : '3rem' }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: isMobile ? '2.5rem' : '3.5rem',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '0.5rem'
                            }}>
                                SNAKKAZ
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: '300'
                            }}>
                                Velkommen tilbake, {user?.email}
                            </p>
                        </div>

                        {/* Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                            gap: '1.5rem',
                            marginBottom: '3rem',
                            maxWidth: '600px',
                            margin: '0 auto 3rem auto'
                        }}>
                            <div style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'var(--backdrop-blur)',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <IconMessage2 size={24} style={{ color: 'var(--snakkaz-primary)', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                                    {loading ? '...' : stats.totalMessages}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                    Meldinger
                                </div>
                            </div>

                            <div style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'var(--backdrop-blur)',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <IconUsers size={24} style={{ color: 'var(--snakkaz-secondary)', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                                    {loading ? '...' : stats.activeUsers}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                    Aktive brukere
                                </div>
                            </div>

                            <div style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'var(--backdrop-blur)',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                padding: '1.5rem',
                                textAlign: 'center',
                                gridColumn: isMobile ? '1 / -1' : 'auto'
                            }}>
                                <IconUser size={24} style={{ color: '#4ade80', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
                                    Level {loading ? '...' : stats.userLevel}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                    Ditt nivå
                                </div>
                            </div>
                        </div>

                        {/* Main Actions */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                            gap: '1.5rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            <button
                                onClick={() => setCurrentView('chat')}
                                style={{
                                    background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                    color: 'var(--snakkaz-dark)',
                                    border: 'none',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <IconMessage2 size={32} />
                                <div>
                                    <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Start Chat</div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Send meldinger til venner</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setCurrentView('profile')}
                                style={{
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'var(--backdrop-blur)',
                                    color: 'white',
                                    border: '1px solid var(--glass-border)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.borderColor = 'var(--snakkaz-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                }}
                            >
                                <IconUser size={32} />
                                <div>
                                    <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Min Profil</div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Rediger profilinformasjon</div>
                                </div>
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
            fontFamily: 'var(--font-body)',
            position: 'relative'
        }}>
            {/* Background Effect - Same as Login */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(77, 208, 225, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)
                `,
                animation: 'liquidDream 20s ease-in-out infinite',
                zIndex: -1
            }} />

            {/* Navigation */}
            <nav style={{
                position: 'sticky',
                top: 0,
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--backdrop-blur)',
                borderBottom: '1px solid var(--glass-border)',
                zIndex: 100,
                padding: '1rem 2rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Logo */}
                    <button
                        onClick={() => setCurrentView('home')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--snakkaz-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '900',
                            cursor: 'pointer'
                        }}
                    >
                        SNAKKAZ
                    </button>

                    {/* Menu */}
                    {!isMobile ? (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            {[
                                { id: 'home', label: 'Hjem', icon: '🏠' },
                                { id: 'chat', label: 'Chat', icon: '💬' },
                                { id: 'profile', label: 'Profil', icon: '👤' },
                                { id: 'settings', label: 'Innstillinger', icon: '⚙️' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id as ViewType)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: currentView === item.id ? 'var(--snakkaz-primary)' : 'rgba(255, 255, 255, 0.7)',
                                        cursor: 'pointer',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                            <button
                                onClick={signOut}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                🚪 Logg ut
                            </button>
                        </div>
                    ) : (
                        // Mobile Menu Dropdown
                        <div style={{ position: 'relative' }}>
                            <select
                                value={currentView}
                                onChange={(e) => setCurrentView(e.target.value as ViewType)}
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="home">🏠 Hjem</option>
                                <option value="chat">💬 Chat</option>
                                <option value="profile">👤 Profil</option>
                                <option value="settings">⚙️ Innstillinger</option>
                            </select>
                            <button
                                onClick={signOut}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    marginLeft: '0.5rem'
                                }}
                            >
                                🚪
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                minHeight: 'calc(100vh - 80px)'
            }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default CleanDashboard;
