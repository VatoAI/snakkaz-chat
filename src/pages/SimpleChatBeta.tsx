import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { ChatInterface } from '../components/chat/ChatInterface';
import { LogOut, Settings, User } from 'lucide-react';

const SimpleChatBeta: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-cyberdark-950 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-cyberdark-900 border-b border-cyberdark-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-cyberblue-400 font-mono">
            SNAKKAZ
          </h1>
          <span className="px-2 py-1 bg-cyberblue-500/20 text-cyberblue-300 text-xs rounded-full border border-cyberblue-500/30">
            BETA
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyberblue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-cyberblue-300 text-sm hidden md:block">
              {user?.email || 'Demo User'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-cyberblue-300 hover:text-white hover:bg-cyberdark-700 rounded-lg transition-colors"
              title="Innstillinger"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
              title="Logg ut"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>

      {/* Settings Panel (if shown) */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-cyberdark-800 rounded-lg p-6 w-96 border border-cyberdark-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <User size={20} />
                Brukerinnstillinger
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-cyberblue-300 mb-2">E-post</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-cyberdark-700 text-gray-400 rounded px-3 py-2 border border-cyberdark-600"
                />
              </div>

              <div>
                <label className="block text-sm text-cyberblue-300 mb-2">Status</label>
                <select className="w-full bg-cyberdark-700 text-white rounded px-3 py-2 border border-cyberdark-600">
                  <option value="online">🟢 Tilgjengelig</option>
                  <option value="away">🟡 Borte</option>
                  <option value="busy">🔴 Opptatt</option>
                  <option value="offline">⚫ Ikke synlig</option>
                </select>
              </div>

              <div className="pt-4 border-t border-cyberdark-600">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-cyberblue-500 hover:bg-cyberblue-600 text-white py-2 rounded transition-colors"
                >
                  Lukk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatBeta;
