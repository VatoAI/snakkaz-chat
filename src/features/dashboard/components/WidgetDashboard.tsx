import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authentication';
import { useDashboardRealtime } from '../../../core/hooks/useDashboardRealtime';

// Widget Components
import MessageCountWidget from './widgets/MessageCountWidget';
import SecurityStatusWidget from './widgets/SecurityStatusWidget';
import NotificationWidget from './widgets/NotificationWidget';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import SnakkaZHomePage from '../../../shared/components/SnakkaZHomePage';
import UserProfile from '../../profile/components/UserProfile';
import SettingsPanel from '../../settings/components/SettingsPanel';

type ViewType = 'home' | 'dashboard' | 'chat' | 'profile' | 'settings';

const WidgetDashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [currentView, setCurrentView] = useState<ViewType>('home');
    const [isMobile, setIsMobile] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const { data, loading, error, refresh } = useDashboardRealtime();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 🎯 Check if this is first-time login
    useEffect(() => {
        if (user && !loading) {
            // Check if user has completed profile setup
            const profileCompleted = localStorage.getItem(`profile-completed-${user.id}`);
            if (!profileCompleted) {
                setIsFirstTime(true);
            }
        }
    }, [user, loading]);

    // 📝 Handle profile completion
    const handleProfileComplete = () => {
        if (user) {
            localStorage.setItem(`profile-completed-${user.id}`, 'true');
            setIsFirstTime(false);
        }
    };

    // 🎉 First-time user welcome flow
    if (isFirstTime) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
                fontFamily: 'var(--font-body)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    padding: '3rem',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Velkommen til SnakkaZ!
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        Du er nå med i Norges tryggeste chat-plattform! 🇳🇴
                        <br />
                        La oss fullføre profilen din for å komme i gang.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => setCurrentView('profile')}
                            style={{
                                background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '1rem 2rem',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 181, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            👤 Fullfør Profil
                        </button>

                        <button
                            onClick={handleProfileComplete}
                            style={{
                                background: 'none',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '12px',
                                padding: '0.75rem 1.5rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            Hopp over for nå
                        </button>
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(100, 181, 246, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(100, 181, 246, 0.2)'
                    }}>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.5'
                        }}>
                            🔒 <strong>E2E-kryptert</strong> • 🇳🇴 <strong>Norsk server</strong> • ⚡ <strong>Sanntid</strong>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderDashboardContent = () => {
        return (
            <div style={{
                padding: isMobile ? '1rem' : '2rem',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Error State */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        color: '#ef4444',
                        textAlign: 'center'
                    }}>
                        <span>⚠️ {error}</span>
                        <button
                            onClick={refresh}
                            style={{
                                marginLeft: '1rem',
                                background: 'none',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                borderRadius: '6px',
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            Prøv igjen
                        </button>
                    </div>
                )}

                {/* Dashboard Header */}
                <div style={{
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        color: 'white',
                        fontSize: isMobile ? '1.8rem' : '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        📊 SnakkaZ Dashboard
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        Velkommen tilbake, {user?.email?.split('@')[0]} 👋
                    </p>
                </div>

                {/* FASE 1: MVP Widgets - Kritiske funksjoner */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                        ? '1fr'
                        : 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* 🥇 KRITISK: Meldinger - Hovedfunksjon */}
                    <MessageCountWidget
                        data={data.messageCount}
                        loading={loading}
                    />

                    {/* 🥇 KRITISK: Sikkerhetsstatus - E2EE indikator */}
                    <SecurityStatusWidget
                        data={data.securityStatus}
                        loading={loading}
                    />

                    {/* 🥇 KRITISK: Notifikasjoner - Invitasjoner/varsler */}
                    <NotificationWidget
                        data={data.notifications}
                        loading={loading}
                    />
                </div>

                {/* 🥇 KRITISK: Siste aktivitet - System status */}
                <RecentActivityWidget
                    activities={data.recentActivity.activities}
                    loading={loading}
                />

                {/* Dashboard Footer - Quick Stats */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--backdrop-blur)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: '1rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                        <div>
                            <div style={{ color: 'var(--snakkaz-primary)', fontWeight: '600' }}>
                                🔒 E2EE
                            </div>
                            <div>Kryptert</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--snakkaz-secondary)', fontWeight: '600' }}>
                                🇳🇴 Norge
                            </div>
                            <div>Lokalt</div>
                        </div>
                        <div>
                            <div style={{ color: '#22c55e', fontWeight: '600' }}>
                                ⚡ WebRTC
                            </div>
                            <div>Sanntid</div>
                        </div>
                        <div>
                            <div style={{ color: '#f59e0b', fontWeight: '600' }}>
                                🚀 Beta
                            </div>
                            <div>v1.0</div>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.4)'
                }}>
                    Sist oppdatert: {new Date().toLocaleTimeString('no-NO')}
                    <button
                        onClick={refresh}
                        style={{
                            marginLeft: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--snakkaz-primary)',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        🔄 Oppdater
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <SnakkaZHomePage />;
            case 'chat':
                return (
                    <div className="h-full relative overflow-hidden">
                        {/* SPEKTAKULÆR BACKGROUND */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                        </div>

                        {/* INNHOLD */}
                        <div className="relative z-10 h-full flex flex-col">
                            {/* HEADER */}
                            <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                                        S
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">SnakkaZ Norge 🇳🇴</h2>
                                        <p className="text-blue-200">✨ Spektakulær chat er her! ✨</p>
                                    </div>
                                </div>
                            </div>

                            {/* CHAT AREA */}
                            <div className="flex-1 p-6 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <span className="text-6xl">🚀</span>
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-4">SPEKTAKULÆR CHAT!</h3>
                                    <p className="text-blue-200 text-xl">Det nye designet virker! 🎉</p>
                                </div>
                            </div>

                            {/* INPUT */}
                            <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 p-6">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Skriv en spektakulær melding... ✨"
                                        className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:ring-4 focus:ring-blue-500/50"
                                    />
                                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl text-white font-bold hover:scale-105 transition-transform shadow-2xl">
                                        Send 🚀
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return <UserProfile />;
            case 'settings':
                return <SettingsPanel />;
            default:
                return renderDashboardContent();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
            fontFamily: 'var(--font-body)',
            position: 'relative'
        }}>
            {/* Liquid Background Effect */}
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

            {/* Compact Navigation */}
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
                    maxWidth: '1400px',
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
                                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
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
                        /* Mobile Menu */
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => setCurrentView('chat')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--snakkaz-primary)',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                💬
                            </button>
                            <button
                                onClick={signOut}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer'
                                }}
                            >
                                🚪
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            {renderContent()}
        </div>
    );
};

export default WidgetDashboard;
