import React from 'react';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { cn } from '@/utils/cn';

const MobileTestPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Main content area */}
      <main className={cn(
        "pb-20", // Space for bottom navigation
        "min-h-screen p-4",
        "mobile-theme-dark"
      )}>
        <div className="max-w-sm mx-auto">
          <div className="pt-safe">
            <h1 className="text-2xl font-bold text-cybergold-400 mb-6">
              📱 SnakkaZ Mobile Test
            </h1>
            
            <div className="space-y-4">
              <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
                <h2 className="text-lg font-semibold text-white mb-2">🚀 Mobile Features</h2>
                <ul className="space-y-2 text-sm text-cyberdark-300">
                  <li>✅ Bottom Navigation</li>
                  <li>✅ Touch-friendly UI</li>
                  <li>✅ Safe Area Support</li>
                  <li>✅ Responsive Design</li>
                  <li>✅ Mobile Optimized</li>
                </ul>
              </div>

              <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
                <h2 className="text-lg font-semibold text-white mb-2">📱 Navigation Test</h2>
                <p className="text-sm text-cyberdark-300 mb-4">
                  Test the bottom navigation tabs below. Each tab shows active state and proper highlighting.
                </p>
                <div className="text-xs text-cybergold-400">
                  📍 Current: Test page shows mobile features
                </div>
              </div>

              <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
                <h2 className="text-lg font-semibold text-white mb-2">🎯 Touch Test</h2>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-cybergold-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]">
                    Chat Demo
                  </button>
                  <button className="bg-cyberblue-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]">
                    Friends
                  </button>
                  <button className="bg-cybergreen-500 text-cyberdark-900 py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]">
                    Groups
                  </button>
                  <button className="bg-cyberred-500 text-white py-3 px-4 rounded-lg font-medium mobile-touch-feedback min-h-[44px]">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
                <h2 className="text-lg font-semibold text-white mb-2">📲 Mobile Tips</h2>
                <ul className="text-xs text-cyberdark-300 space-y-1">
                  <li>• Touch targets are 44px minimum ✓</li>
                  <li>• Safe areas respected for iPhone ✓</li>
                  <li>• Optimized for dark OLED displays ✓</li>
                  <li>• Touch feedback on interactions ✓</li>
                  <li>• Responsive to screen size ✓</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30">
                <h2 className="text-lg font-semibold text-cybergold-400 mb-2">🌟 Next Steps</h2>
                <p className="text-sm text-white">
                  Ready to implement full mobile chat interface with gestures, animations, and all modern mobile patterns! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileTestPage;
