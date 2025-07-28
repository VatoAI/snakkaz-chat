import React from 'react';
import { SimpleMobileLayout } from '@/components/mobile/SimpleMobileLayout';
import { cn } from '@/utils/cn';

const MobileDemoPage: React.FC = () => {
  return (
    <SimpleMobileLayout>
      <div className="min-h-screen bg-cyberdark-950 text-white p-4">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-cybergold-400 mb-6">
            📱 SnakkaZ Mobile Demo
          </h1>
          
          <div className="space-y-4">
            <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
              <h2 className="text-lg font-semibold mb-2">🚀 Mobile Features</h2>
              <ul className="space-y-2 text-sm text-cyberdark-300">
                <li>✅ Bottom Navigation</li>
                <li>✅ Touch-friendly UI</li>
                <li>✅ Safe Area Support</li>
                <li>✅ Gesture Recognition</li>
                <li>✅ Mobile Optimized</li>
              </ul>
            </div>

            <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
              <h2 className="text-lg font-semibold mb-2">📱 Test Areas</h2>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-cybergold-500 text-cyberdark-900 py-2 px-4 rounded-lg font-medium mobile-touch-feedback">
                  Chat
                </button>
                <button className="bg-cyberblue-500 text-white py-2 px-4 rounded-lg font-medium mobile-touch-feedback">
                  Friends
                </button>
                <button className="bg-cybergreen-500 text-cyberdark-900 py-2 px-4 rounded-lg font-medium mobile-touch-feedback">
                  Groups
                </button>
                <button className="bg-cyberred-500 text-white py-2 px-4 rounded-lg font-medium mobile-touch-feedback">
                  Profile
                </button>
              </div>
            </div>

            <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
              <h2 className="text-lg font-semibold mb-2">🎯 Navigation Test</h2>
              <p className="text-sm text-cyberdark-300 mb-4">
                Try the bottom navigation tabs below to test the mobile interface.
              </p>
              <div className="text-xs text-cybergold-400">
                📍 Current page has active highlighting
              </div>
            </div>

            <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
              <h2 className="text-lg font-semibold mb-2">📲 Mobile Tips</h2>
              <ul className="text-xs text-cyberdark-300 space-y-1">
                <li>• Touch targets are 44px minimum</li>
                <li>• Safe areas respected for iPhone</li>
                <li>• Optimized for dark OLED displays</li>
                <li>• Gesture-friendly interactions</li>
                <li>• Responsive to screen rotation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SimpleMobileLayout>
  );
};

export default MobileDemoPage;
