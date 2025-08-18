import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './MainApp.css';

interface MainAppProps {
    children?: React.ReactNode;
}

const MainApp: React.FC<MainAppProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Determine if we're on mobile based on window width
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="main-app min-h-screen bg-cyberdark-950">
            {/* Simple Header */}
            <header className="sticky top-0 z-40 bg-cyberdark-900/95 backdrop-blur-xl border-b border-cyberdark-700/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-8">
                            <button 
                                onClick={() => navigate('/app')}
                                className="flex items-center space-x-2 group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-lg flex items-center justify-center">
                                    <span className="text-cyberdark-900 font-bold text-lg">S</span>
                                </div>
                                <span className="text-xl font-bold text-cybergold-400 group-hover:text-cybergold-300 transition-colors">
                                    SnakkaZ
                                </span>
                            </button>

                            {/* Desktop Navigation */}
                            {!isMobile && (
                                <nav className="hidden md:flex items-center space-x-1">
                                    <button
                                        onClick={() => navigate('/app/dashboard')}
                                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                                            location.pathname.includes('dashboard') 
                                                ? 'text-cybergold-400 bg-cyberdark-800/50' 
                                                : 'text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50'
                                        }`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/app/chat')}
                                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                                            location.pathname.includes('chat') 
                                                ? 'text-cybergold-400 bg-cyberdark-800/50' 
                                                : 'text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50'
                                        }`}
                                    >
                                        Chat
                                    </button>
                                    <button
                                        onClick={() => navigate('/app/profile')}
                                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                                            location.pathname.includes('profile') 
                                                ? 'text-cybergold-400 bg-cyberdark-800/50' 
                                                : 'text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50'
                                        }`}
                                    >
                                        Profil
                                    </button>
                                    <button
                                        onClick={() => navigate('/app/settings')}
                                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                                            location.pathname.includes('settings') 
                                                ? 'text-cybergold-400 bg-cyberdark-800/50' 
                                                : 'text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50'
                                        }`}
                                    >
                                        Innstillinger
                                    </button>
                                </nav>
                            )}
                        </div>

                        {/* Profile/Auth Section */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 rounded-lg transition-all duration-200">
                                🔔
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            </button>

                            {/* Profile */}
                            <button 
                                onClick={() => navigate('/app/profile')}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 transition-all duration-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                {!isMobile && (
                                    <span className="text-sm font-medium">Bruker</span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="p-2 text-cyberdark-300 hover:text-cybergold-400 hover:bg-cyberdark-800/50 rounded-lg transition-all duration-200"
                                >
                                    ☰
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children || <Outlet />}
            </main>

            {/* Mobile Menu Overlay */}
            {isMobile && showMobileMenu && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
                    <div className="fixed bottom-0 left-0 right-0 bg-cyberdark-900 rounded-t-2xl p-6">
                        <div className="w-16 h-1 rounded-full bg-cyberdark-600 mx-auto mb-6" />
                        
                        <h3 className="text-lg font-bold text-cybergold-400 mb-4">Navigasjon</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => {
                                    navigate('/app/dashboard');
                                    setShowMobileMenu(false);
                                }}
                                className="p-4 bg-cyberdark-800 rounded-lg text-center"
                            >
                                <div className="text-2xl mb-2">🏠</div>
                                <div className="text-cybergold-400 font-medium">Dashboard</div>
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/app/chat');
                                    setShowMobileMenu(false);
                                }}
                                className="p-4 bg-cyberdark-800 rounded-lg text-center"
                            >
                                <div className="text-2xl mb-2">💬</div>
                                <div className="text-cybergold-400 font-medium">Chat</div>
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/app/profile');
                                    setShowMobileMenu(false);
                                }}
                                className="p-4 bg-cyberdark-800 rounded-lg text-center"
                            >
                                <div className="text-2xl mb-2">👤</div>
                                <div className="text-cybergold-400 font-medium">Profil</div>
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/app/settings');
                                    setShowMobileMenu(false);
                                }}
                                className="p-4 bg-cyberdark-800 rounded-lg text-center"
                            >
                                <div className="text-2xl mb-2">⚙️</div>
                                <div className="text-cybergold-400 font-medium">Innstillinger</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainApp;