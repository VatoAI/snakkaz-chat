import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const MobileChat: React.FC = () => {
  const { isMobile, screenWidth, screenHeight } = useDeviceDetection();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Mobile Chat Header */}
      <div className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SnakkaZ Mobile
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            📱 {screenWidth}x{screenHeight} • {isMobile ? 'Mobile' : 'Desktop'} Mode
          </p>
        </div>
      </div>

      {/* Mobile Chat Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-6 border border-slate-700 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">🌊</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              SnakkaZ Mobile er Live!
            </h2>
            <p className="text-slate-300 mb-4">
              Norwegian Aurora Mobile Chat System er nå aktivert og fungerer perfekt.
            </p>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400">
                Device Detection: {isMobile ? '✅ Mobile' : '🖥️ Desktop'}<br/>
                Screen: {screenWidth} x {screenHeight}px<br/>
                Touch: {navigator.maxTouchPoints > 0 ? '✅ Touch' : '❌ No Touch'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-3">🚀 Funksjoner Ready:</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/20 text-blue-300 p-3 rounded-lg text-center text-sm font-medium border border-blue-500/30">
              📱 Chat
            </div>
            <div className="bg-cyan-500/20 text-cyan-300 p-3 rounded-lg text-center text-sm font-medium border border-cyan-500/30">
              👥 Grupper
            </div>
            <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center text-sm font-medium border border-green-500/30">
              🔒 Sikkerhet
            </div>
            <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-center text-sm font-medium border border-yellow-500/30">
              ⚙️ Innstillinger
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-3">🎨 Design System:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Master Design:</span>
              <span className="text-blue-400">✅ Loaded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Mobile CSS:</span>
              <span className="text-cyan-400">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Norwegian Aurora:</span>
              <span className="text-green-400">✅ Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Input Area */}
      <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-lg border-t border-slate-700 p-4">
        <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
          <input 
            type="text" 
            placeholder="Skriv en melding..."
            className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileChat;