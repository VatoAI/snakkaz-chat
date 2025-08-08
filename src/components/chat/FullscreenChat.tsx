import React, { useState, useEffect } from 'react';
import SnakkaZChatEpic from '../chat/SnakkaZChatEpic';
import { IconArrowLeft, IconMaximize, IconMinimize } from '@tabler/icons-react';

interface FullscreenChatProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

const FullscreenChat: React.FC<FullscreenChatProps> = ({
    onBack,
    showBackButton = false
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        // Add cyberpunk chat styles
        if (typeof document !== 'undefined' && !document.querySelector('#fullscreen-chat-styles')) {
            const style = document.createElement('style');
            style.id = 'fullscreen-chat-styles';
            style.textContent = `
        .fullscreen-chat-container {
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        
        .cyberpunk-grid {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 0.3;
        }

        .chat-header-glow {
          box-shadow: 
            0 0 20px rgba(6, 182, 212, 0.3),
            0 0 40px rgba(6, 182, 212, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(6, 182, 212, 0.3); }
          50% { border-color: rgba(6, 182, 212, 0.6); }
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `;
            document.head.appendChild(style);
        }
    }, []);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="fullscreen-chat-container fixed inset-0 z-50 flex flex-col">
            {/* Cyberpunk grid background */}
            <div className="cyberpunk-grid"></div>

            {/* Header */}
            <div className="chat-header-glow relative z-10 bg-gradient-to-r from-gray-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-xl border-b border-cyan-500/30 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl border border-cyan-500/30 transition-all duration-300 group"
                            >
                                <IconArrowLeft className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
                                <span className="text-cyan-300 group-hover:text-white font-medium">Tilbake</span>
                            </button>
                        )}

                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                                SnakkaZ Chat
                            </h1>
                            <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                                <span className="text-green-300 text-sm font-medium">LIVE</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Chat stats */}
                        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <span>End-to-End Kryptering</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span>AI Superpowers</span>
                            </div>
                        </div>

                        {/* Fullscreen toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
                            title={isFullscreen ? "Forlat fullskjerm" : "Fullskjerm"}
                        >
                            {isFullscreen ? <IconMinimize className="w-5 h-5" /> : <IconMaximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 relative z-10">
                <SnakkaZChatEpic />
            </div>

            {/* Floating elements for cyberpunk effect */}
            <div className="absolute top-1/4 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-3/4 left-10 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-75"></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-75"></div>
        </div>
    );
};

export default FullscreenChat;
