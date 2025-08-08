import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import CompactNav, { type MainView } from '../navigation/CompactNav';
import FullscreenChat from '../chat/FullscreenChat';
import UserProfile from '../profile/UserProfile';
import SuperpowerDashboard from '../SuperpowerDashboard';
import SettingsPanel from '../settings/SettingsPanel';
import {
    IconBolt,
    IconShield,
    IconMessage2,
    IconUsers
} from '@tabler/icons-react';

interface DashboardStats {
    totalMessages: number;
    activeUsers: number;
    superpowerLevel: number;
    securityScore: number;
}

const ModernDashboard: React.FC = () => {
    const { signOut } = useAuth();
    const [currentView, setCurrentView] = useState<MainView>('home');
    const [isMobile, setIsMobile] = useState(false);
    const [stats] = useState<DashboardStats>({
        totalMessages: 1247,
        activeUsers: 23,
        superpowerLevel: 7,
        securityScore: 98
    });

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Add cyberpunk styles
    useEffect(() => {
        if (typeof document !== 'undefined' && !document.querySelector('#modern-dashboard-styles')) {
            const style = document.createElement('style');
            style.id = 'modern-dashboard-styles';
            style.textContent = `
        .dashboard-bg {
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        
        .cyberpunk-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(6, 182, 212, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .cyberpunk-card:hover {
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(6, 182, 212, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .stat-glow {
          text-shadow: 0 0 10px currentColor;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `;
            document.head.appendChild(style);
        }
    }, []);

    // Navigation padding based on layout
    const getContentPadding = () => {
        if (currentView === 'chat') return '';
        return isMobile ? 'pb-24' : 'pl-20';
    };

    const renderContent = () => {
        switch (currentView) {
            case 'chat':
                return (
                    <FullscreenChat
                        onBack={() => setCurrentView('home')}
                        showBackButton={isMobile}
                    />
                );

            case 'profile':
                return (
                    <div className="p-6">
                        <UserProfile
                            isOpen={true}
                            onClose={() => setCurrentView('home')}
                        />
                    </div>
                );

            case 'superpowers':
                return (
                    <div className="p-6">
                        <SuperpowerDashboard />
                    </div>
                );

            case 'settings':
                return (
                    <SettingsPanel />
                );

            default: // home
                return (
                    <div className="p-6 max-w-7xl mx-auto">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
                                Velkommen til SnakkaZ
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl">
                                Din avanserte, krypterte chat med AI-assistenter og superpowers
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                            <div className="cyberpunk-card rounded-xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Meldinger</p>
                                        <p className="text-2xl md:text-3xl font-bold text-cyan-300 stat-glow">{stats.totalMessages}</p>
                                    </div>
                                    <IconMessage2 className="w-8 h-8 text-cyan-400" />
                                </div>
                            </div>

                            <div className="cyberpunk-card rounded-xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Aktive</p>
                                        <p className="text-2xl md:text-3xl font-bold text-green-300 stat-glow">{stats.activeUsers}</p>
                                    </div>
                                    <IconUsers className="w-8 h-8 text-green-400" />
                                </div>
                            </div>

                            <div className="cyberpunk-card rounded-xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Level</p>
                                        <p className="text-2xl md:text-3xl font-bold text-purple-300 stat-glow">{stats.superpowerLevel}</p>
                                    </div>
                                    <IconBolt className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>

                            <div className="cyberpunk-card rounded-xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Sikkerhet</p>
                                        <p className="text-2xl md:text-3xl font-bold text-blue-300 stat-glow">{stats.securityScore}%</p>
                                    </div>
                                    <IconShield className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <button
                                onClick={() => setCurrentView('chat')}
                                className="cyberpunk-card rounded-2xl p-8 text-left hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-cyan-300 group-hover:text-white transition-colors">
                                        Start Chat
                                    </h3>
                                    <IconMessage2 className="w-8 h-8 text-cyan-400 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    Åpne fullskjerm chat med end-to-end kryptering og AI-assistenter
                                </p>
                            </button>

                            <button
                                onClick={() => setCurrentView('superpowers')}
                                className="cyberpunk-card rounded-2xl p-8 text-left hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-purple-300 group-hover:text-white transition-colors">
                                        Superpowers
                                    </h3>
                                    <IconBolt className="w-8 h-8 text-purple-400 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    Utforsk AI-superpowers og avanserte funksjoner
                                </p>
                            </button>
                        </div>
                    </div>
                );
        }
    };

    if (currentView === 'chat') {
        return renderContent();
    }

    return (
        <div className="dashboard-bg min-h-screen relative">
            {/* Navigation */}
            <CompactNav
                currentView={currentView}
                setCurrentView={setCurrentView}
                onSignOut={signOut}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <div className={`min-h-screen ${getContentPadding()}`}>
                {renderContent()}
            </div>

            {/* Floating cyberpunk elements */}
            <div className="fixed top-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30 pointer-events-none"></div>
            <div className="fixed bottom-20 left-10 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30 pointer-events-none"></div>
            <div className="fixed top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-30 pointer-events-none"></div>
        </div>
    );
};

export default ModernDashboard;
