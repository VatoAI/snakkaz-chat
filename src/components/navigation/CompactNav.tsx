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
        // Mobile: Bottom navigation bar with liquid dream styling
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-t border-cyan-400/20">
                <div className="relative">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40"></div>

                    <div className="relative flex justify-around items-center py-2 px-2">
                        {navItems.map(({ id, icon: Icon, shortLabel }) => (
                            <button
                                key={id}
                                onClick={() => setCurrentView(id)}
                                className={`
                  relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group
                  ${currentView === id
                                        ? 'bg-gradient-to-t from-cyan-500/30 to-blue-500/30 text-cyan-300 shadow-lg shadow-cyan-500/40 scale-105'
                                        : 'text-gray-300 hover:text-cyan-300 hover:bg-white/10 hover:scale-105'
                                    }
                `}
                            >
                                <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${currentView === id ? 'drop-shadow-lg drop-shadow-cyan-500/50' : ''}`} />
                                <span className="text-xs font-medium">{shortLabel}</span>
                                {currentView === id && (
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                                )}

                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-t from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentView === id ? 'opacity-30' : ''}`}></div>
                            </button>
                        ))}

                        {/* Sign out button */}
                        <button
                            onClick={onSignOut}
                            className="relative flex flex-col items-center justify-center p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 group hover:scale-105"
                        >
                            <IconLogout className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Out</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-red-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop: Liquid Dream cyberpunk sidebar
    return (
        <div className="fixed left-0 top-0 bottom-0 z-40 w-20 bg-black/20 backdrop-blur-xl border-r border-cyan-400/20 flex flex-col">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-purple-900/40 to-indigo-900/40"></div>

            {/* Logo/Brand with glow effect */}
            <div className="relative flex items-center justify-center h-20 border-b border-cyan-400/20">
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <IconShield className="w-7 h-7 text-white drop-shadow-lg" />

                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-blue-500/50 rounded-xl animate-pulse"></div>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="relative flex-1 flex flex-col items-center py-8 space-y-4">
                {navItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setCurrentView(id)}
                        title={label}
                        className={`
              group relative flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300
              ${currentView === id
                                ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-cyan-300 shadow-lg shadow-cyan-500/40 scale-110'
                                : 'text-gray-300 hover:text-cyan-300 hover:bg-white/10 hover:scale-105'
                            }
            `}
                    >
                        <Icon className={`w-7 h-7 transition-all duration-300 ${currentView === id ? 'drop-shadow-lg drop-shadow-cyan-500/50' : ''}`} />

                        {/* Enhanced Tooltip with liquid dream styling */}
                        <div className="absolute left-full ml-4 px-3 py-2 bg-black/80 backdrop-blur-xl text-cyan-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                            {label}
                            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/80 border-l border-b border-cyan-500/30 rotate-45"></div>
                        </div>

                        {/* Active indicator with glow */}
                        {currentView === id && (
                            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"></div>
                        )}

                        {/* Hover glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentView === id ? 'opacity-30' : ''}`}></div>
                    </button>
                ))}
            </div>

            {/* Sign out button with liquid dream styling */}
            <div className="relative p-4 border-t border-cyan-400/20">
                <button
                    onClick={onSignOut}
                    title="Logg ut"
                    className="group relative flex items-center justify-center w-14 h-14 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 hover:scale-105"
                >
                    <IconLogout className="w-7 h-7" />

                    {/* Enhanced Tooltip */}
                    <div className="absolute left-full ml-4 px-3 py-2 bg-black/80 backdrop-blur-xl text-red-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-red-500/30 shadow-lg shadow-red-500/20">
                        Logg ut
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/80 border-l border-b border-red-500/30 rotate-45"></div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    );
};

export default CompactNav;
export type { MainView };
