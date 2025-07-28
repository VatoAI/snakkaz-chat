import React from 'react';

const SimpleChatBeta: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SnakkaZ Chat Beta
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🌊</div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Velkommen til SnakkaZ Beta
              </h2>
              <p className="text-slate-300 mb-6">
                Norwegian Aurora Chat System - Desktop Edition
              </p>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400">
                  🖥️ Desktop Mode Active<br/>
                  🇳🇴 Norwegian Aurora Design<br/>
                  ✅ All Systems Operational
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-white mb-2">Chat</h3>
              <p className="text-sm text-slate-300">Real-time messaging med Norwegian Aurora</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-white mb-2">Grupper</h3>
              <p className="text-sm text-slate-300">Opprett og deltag i chatgrupper</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-white mb-2">Sikkerhet</h3>
              <p className="text-sm text-slate-300">End-to-end kryptering</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-yellow-500/50 transition-all">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-sm text-slate-300">SnakkaZ AI hjelper deg</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold text-white mb-2">MCP</h3>
              <p className="text-sm text-slate-300">Model Context Protocol</p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-white mb-2">Dashboard</h3>
              <p className="text-sm text-slate-300">System oversikt og statistikk</p>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-slate-800/60 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">🚀 System Status</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Norwegian Aurora:</span>
                  <span className="text-green-400">✅ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Design System:</span>
                  <span className="text-blue-400">✅ Loaded</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Device Detection:</span>
                  <span className="text-cyan-400">✅ Working</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Backend:</span>
                  <span className="text-green-400">✅ Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">WebRTC:</span>
                  <span className="text-blue-400">✅ Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Security:</span>
                  <span className="text-cyan-400">✅ Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatBeta;