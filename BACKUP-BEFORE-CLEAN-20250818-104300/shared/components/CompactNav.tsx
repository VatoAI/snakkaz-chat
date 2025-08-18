import React from 'react';
import {
    IconMessage2,
    IconUser,
    IconBolt,
    IconSettings,
    IconLogout,
    IconHome,
    IconShield
} from '@tabler/icons-react';
import { GlassmorphicCard, CyberButton } from '../ui/CyberpunkComponents';

type MainView = 'home' | 'chat' | 'profile' | 'superpowers' | 'settings';

interface CompactNavProps {
    currentView: MainView;
    setCurrentView: (view: MainView) => void;
    onSignOut: () => void;
    isMobile?: boolean;
}

const CompactNav: React.FC<CompactNavProps> = ({
    currentView,
    setCurrentView,
    onSignOut,
    isMobile = false
}) => {
    const navItems = [
        { id: 'home' as MainView, icon: IconHome, label: 'Home', shortLabel: 'H' },
        { id: 'chat' as MainView, icon: IconMessage2, label: 'Chat', shortLabel: 'C' },
        { id: 'profile' as MainView, icon: IconUser, label: 'Profil', shortLabel: 'P' },
        { id: 'superpowers' as MainView, icon: IconBolt, label: 'Superpowers', shortLabel: 'S' },
        { id: 'settings' as MainView, icon: IconSettings, label: 'Innstillinger', shortLabel: 'I' },
    ];

    if (isMobile) {
        // Mobile: Cyberpunk bottom navigation med GlassmorphicCard stil
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="mx-4 mb-4">
                    <GlassmorphicCard
                        variant="heavy"
                        neon={true}
                        neonColor="cyan"
                        className="rounded-2xl border border-cyan-400/20"
                    >
                        <div className="flex justify-around items-center py-3 px-2">
                            {navItems.map(({ id, icon: Icon, shortLabel }) => (
                                <div key={id} className="relative">
                                    <CyberButton
                                        onClick={() => setCurrentView(id)}
                                        variant={currentView === id ? "primary" : "ghost"}
                                        className="!w-12 !h-12 !p-0 flex-col"
                                    >
                                        <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${currentView === id ? 'drop-shadow-lg drop-shadow-cyan-500/50' : ''
                                            }`} />
                                        <span className="text-xs font-medium">{shortLabel}</span>
                                    </CyberButton>

                                    {/* Active indicator for mobile */}
                                    {currentView === id && (
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Sign out button */}
                            <div className="relative">
                                <CyberButton
                                    onClick={onSignOut}
                                    variant="secondary"
                                    className="!w-12 !h-12 !p-0 !bg-red-500/20 hover:!bg-red-500/30 !text-red-300 flex-col"
                                >
                                    <IconLogout className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">Out</span>
                                </CyberButton>
                            </div>
                        </div>
                    </GlassmorphicCard>
                </div>
            </div>
        );
    }

    // Desktop: Cyberpunk glassmorphic sidebar med samme stil som Superpowers
    return (
        <div className="fixed left-0 top-0 bottom-0 z-40 w-20 flex flex-col">
            <GlassmorphicCard
                variant="heavy"
                neon={true}
                neonColor="cyan"
                className="h-full flex flex-col border-r border-cyan-400/20"
            >
                {/* Logo/Brand med cyberpunk glow */}
                <div className="relative flex items-center justify-center h-20 border-b border-cyan-400/20">
                    <GlassmorphicCard
                        variant="medium"
                        neon={true}
                        neonColor="cyan"
                        className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40"
                    >
                        <IconShield className="w-7 h-7 text-white drop-shadow-lg" />
                    </GlassmorphicCard>
                </div>

                {/* Navigation Items med CyberButton stil */}
                <div className="relative flex-1 flex flex-col items-center py-8 space-y-4">
                    {navItems.map(({ id, icon: Icon, label }) => (
                        <div key={id} className="relative group">
                            <CyberButton
                                onClick={() => setCurrentView(id)}
                                variant={currentView === id ? "primary" : "ghost"}
                                className="!w-14 !h-14 !p-0"
                            >
                                <Icon className={`w-7 h-7 transition-all duration-300 ${currentView === id ? 'drop-shadow-lg drop-shadow-cyan-500/50' : ''
                                    }`} />
                            </CyberButton>

                            {/* Enhanced Tooltip med cyberpunk stil */}
                            <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 backdrop-blur-xl text-cyan-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                                {label}
                                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-b border-cyan-500/30 rotate-45"></div>
                            </div>

                            {/* Active indicator med glow */}
                            {currentView === id && (
                                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sign out button med cyberpunk styling */}
                <div className="relative p-4 border-t border-cyan-400/20">
                    <div className="relative group">
                        <CyberButton
                            onClick={onSignOut}
                            variant="secondary"
                            className="!w-14 !h-14 !p-0 !bg-red-500/20 hover:!bg-red-500/30 !text-red-300"
                        >
                            <IconLogout className="w-7 h-7" />
                        </CyberButton>

                        {/* Enhanced Tooltip */}
                        <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 backdrop-blur-xl text-red-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-red-500/30 shadow-lg shadow-red-500/20">
                            Logg ut
                            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-b border-red-500/30 rotate-45"></div>
                        </div>
                    </div>
                </div>
            </GlassmorphicCard>
        </div>
    );
};

export default CompactNav;
export type { MainView };
