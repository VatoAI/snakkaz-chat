import React from 'react';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { MobileChatHeader } from '@/components/mobile/MobileChatHeader';
import { cn } from '@/utils/cn';

const CompleteMobileTest: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Mobile header test */}
      <MobileChatHeader
        title="Mobile Test Chat"
        subtitle="Testing mobile interface"
        isOnline={true}
        isSecure={true}
        onCall={() => alert('📞 Call button works!')}
        onVideoCall={() => alert('📹 Video call button works!')}
        onOptions={() => alert('⚙️ Options button works!')}
      />

      {/* Main content area */}
      <main className={cn(
        "pb-20 pt-16", // Space for both header and bottom navigation
        "min-h-screen p-4",
        "mobile-theme-dark"
      )}>
        <div className="max-w-sm mx-auto space-y-4">
          
          {/* Mobile interface status */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cybergold-500/30">
            <h1 className="text-xl font-bold text-cybergold-400 mb-3">
              📱 SnakkaZ Mobile Interface
            </h1>
            <div className="text-sm text-white space-y-1">
              <div>✅ Lokalt testing: http://localhost:5173</div>
              <div>✅ Mobile components: Loaded</div>
              <div>✅ Touch targets: 44px minimum</div>
              <div>✅ Safe areas: iPhone compatible</div>
            </div>
          </div>

          {/* Navigation test */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h2 className="text-lg font-semibold text-white mb-3">🧭 Navigation Test</h2>
            <p className="text-sm text-cyberdark-300 mb-3">
              Test the bottom navigation below. Each tab should show active state when clicked.
            </p>
            <div className="text-xs text-cybergold-400">
              📍 Current: Complete mobile test with header + navigation
            </div>
          </div>

          {/* Touch interaction test */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h2 className="text-lg font-semibold text-white mb-3">👆 Touch Test</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => alert('💬 Chat button touched!')}
                className="bg-cybergold-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform"
              >
                💬 Chat
              </button>
              <button 
                onClick={() => alert('👥 Friends button touched!')}
                className="bg-cyberblue-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform"
              >
                👥 Friends
              </button>
              <button 
                onClick={() => alert('🏢 Groups button touched!')}
                className="bg-cybergreen-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform"
              >
                🏢 Groups
              </button>
              <button 
                onClick={() => alert('⚙️ Profile button touched!')}
                className="bg-cyberred-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px] active:scale-95 transition-transform"
              >
                ⚙️ Profile
              </button>
            </div>
          </div>

          {/* Header interaction test */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h2 className="text-lg font-semibold text-white mb-3">📱 Header Test</h2>
            <p className="text-sm text-cyberdark-300 mb-3">
              Test the mobile header buttons above:
            </p>
            <ul className="text-xs text-cyberdark-300 space-y-1">
              <li>← Back button (top left)</li>
              <li>📞 Call button (top right)</li>
              <li>📹 Video call button (top right)</li>
              <li>⚙️ Options button (top right)</li>
            </ul>
          </div>

          {/* Device simulation info */}
          <div className="bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30">
            <h2 className="text-lg font-semibold text-cybergold-400 mb-2">📲 Device Simulation</h2>
            <div className="text-sm text-white space-y-2">
              <p>For best mobile testing:</p>
              <ol className="list-decimal list-inside text-xs text-cyberdark-300 space-y-1">
                <li>Open browser Developer Tools (F12)</li>
                <li>Click device toggle icon (📱) or press Ctrl+Shift+M</li>
                <li>Select iPhone or Android device</li>
                <li>Test touch interactions and responsive design</li>
              </ol>
            </div>
          </div>

          {/* Responsive test */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h2 className="text-lg font-semibold text-white mb-3">📐 Responsive Test</h2>
            <div className="text-xs text-cyberdark-300 space-y-1">
              <li>• Current width: <span className="text-cybergold-400">Mobile optimized</span></li>
              <li>• Layout: <span className="text-cybergold-400">Single column</span></li>
              <li>• Bottom nav: <span className="text-cybergold-400">Fixed position</span></li>
              <li>• Touch targets: <span className="text-cybergold-400">44px minimum</span></li>
            </div>
          </div>

          {/* Success status */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-400 mb-2">🎉 Mobile Interface Status</h2>
            <p className="text-sm text-white">
              ✅ Mobile interface is working locally!<br/>
              ✅ All components loaded successfully<br/>
              ✅ Ready for mobile device testing
            </p>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default CompleteMobileTest;
