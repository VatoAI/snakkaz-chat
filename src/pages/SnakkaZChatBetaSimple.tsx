import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

console.log('🌊 SnakkaZChatBetaSimple component loaded!');

const SnakkaZChatBetaSimple: React.FC = () => {
    console.log('🌊 SnakkaZChatBetaSimple component rendered!');
    const { user } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('🌊 SNAKKAZ LIQUID DREAM SYSTEM AKTIV - Mock Rooms Loaded!');
        console.log('🌊 Design: Liquid Glass ✅ | Colors: Blue/Cyan ✅');
        console.log('🌊 Emergency CSS overlays activated for guaranteed visibility!');
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return (
            <div className="h-screen bg-gradient-to-br from-liquid-dark via-liquid-primary/5 to-liquid-secondary/10 flex items-center justify-center">
                <div className="snakkaz-liquid-dream-panel px-6 py-4 text-white text-lg">
                    🌊 Loading Liquid Dream...
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-liquid-dark via-liquid-primary/5 to-liquid-secondary/10 flex flex-col overflow-hidden relative">
            {/* 🌊 LIQUID DREAM DEBUG OVERLAY SYSTEM - ALWAYS VISIBLE */}
            <div className="fixed top-4 left-4 z-[100] space-y-2">
                <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
                    🌊 SNAKKAZ LIQUID DREAM SYSTEM AKTIV
                </div>
                <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
                    User: {user?.email || 'Guest'} | Status: ✅ Online
                </div>
                <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
                    Design: Liquid Glass ✅ | Colors: Blue/Cyan ✅
                </div>
                <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
                    Mock Rooms: 3 | Mock Users: 5 | Mock Messages: Ready
                </div>
            </div>

            {/* 🌊 LIQUID DREAM GRADIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-liquid-primary/10 via-transparent to-liquid-secondary/5"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.1)_0%,_transparent_50%)]"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="text-center">
                    <h1 className="snakkaz-liquid-hero-text text-6xl font-bold mb-4">
                        SnakkaZ Liquid Dream
                    </h1>
                    <p className="text-liquid-primary text-xl mb-8">
                        Beautiful blue glass design system is now active!
                    </p>

                    {/* Mock Chat Preview */}
                    <div className="snakkaz-liquid-glass p-8 max-w-2xl mx-auto rounded-xl">
                        <h2 className="text-white text-2xl font-semibold mb-4">Chat Preview</h2>

                        {/* Mock Room List */}
                        <div className="snakkaz-liquid-dream-card p-4 mb-4 rounded-lg">
                            <h3 className="text-liquid-primary font-semibold mb-2">🌊 General Room</h3>
                            <p className="text-white text-sm">42 members online</p>
                        </div>

                        <div className="snakkaz-liquid-dream-card p-4 mb-4 rounded-lg">
                            <h3 className="text-liquid-primary font-semibold mb-2">💻 Tech Talk</h3>
                            <p className="text-white text-sm">23 members online</p>
                        </div>

                        <div className="snakkaz-liquid-dream-card p-4 mb-6 rounded-lg">
                            <h3 className="text-liquid-primary font-semibold mb-2">🎨 Liquid Design</h3>
                            <p className="text-white text-sm">15 members online</p>
                        </div>

                        {/* Mock Messages */}
                        <div className="space-y-3 text-left">
                            <div className="snakkaz-liquid-message">
                                <div className="font-semibold text-liquid-primary text-sm">Admin 🌊</div>
                                <div className="text-white">Welcome to Snakkaz Liquid Dream! Beautiful blue glass design is now active!</div>
                            </div>

                            <div className="snakkaz-liquid-message">
                                <div className="font-semibold text-liquid-secondary text-sm">Designer 🎨</div>
                                <div className="text-white">This is the new premium liquid design system with gorgeous gradients and glass effects!</div>
                            </div>

                            <div className="snakkaz-liquid-message">
                                <div className="font-semibold text-liquid-primary text-sm">You 🌊</div>
                                <div className="text-white">Amazing! The liquid design looks incredible! 🌊✨</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="snakkaz-liquid-dream-panel px-6 py-3 text-white">
                            🚀 Liquid Dream System: Ready for production!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZChatBetaSimple;
