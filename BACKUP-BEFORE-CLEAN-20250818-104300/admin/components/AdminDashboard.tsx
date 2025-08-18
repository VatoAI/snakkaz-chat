import React, { useState, useEffect } from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';

interface SystemMetrics {
  reactStatus: 'healthy' | 'error' | 'unknown';
  dbStatus: 'connected' | 'disconnected' | 'unknown';
  emailStatus: 'operational' | 'error' | 'unknown';
  responseTime: number;
  activeUsers: number;
  errorCount: number;
}

export const AdminDashboard: React.FC = () => {
  const { metrics, loading, refresh } = useSystemStatus();
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'logs' | 'users'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'operational':
       return '#22c55e';
      case 'error':
      case 'disconnected':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent"></div>
      </div>

      <div className="relative z-10 p-6">
        <header className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text">
              🛠️ Snakkaz Admin Dashboard
            </h1>
            <button
              onClick={refresh}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🔄 Refresh
            </button>
          </div>
        </header>

        <nav className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 mb-8">
          <div className="flex space-x-2">
            {(['overview', 'health', 'logs', 'users'] as const).map(tab => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <main className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">React Application</h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(metrics?.reactStatus || 'unknown') }}
                  ></div>
                  <span className="text-white font-medium">
                    {metrics?.reactStatus || 'Checking...'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Database</h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(metrics?.dbStatus || 'unknown') }}
                  ></div>
                  <span className="text-white font-medium">
                    {metrics?.dbStatus || 'Checking...'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Email System</h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(metrics?.emailStatus || 'unknown') }}
                  ></div>
                  <span className="text-white font-medium">
                    {metrics?.emailStatus || 'Checking...'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Response Time</h3>
                <div className="text-2xl font-bold text-cyan-300">
                  {metrics?.responseTime ? `${metrics.responseTime}ms` : 'Measuring...'}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Active Users</h3>
                <div className="text-2xl font-bold text-cyan-300">
                  {metrics?.activeUsers || 0}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Error Count (24h)</h3>
                <div className="text-2xl font-bold text-cyan-300">
                  {metrics?.errorCount || 0}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text mb-6">
                🏥 System Health Monitoring
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl">
                  <span className="text-slate-200">Frontend Bundle Loading</span>
                  <span className={`px-3 py-1 rounded-lg font-medium ${metrics?.reactStatus === 'healthy'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}>
                    {metrics?.reactStatus === 'healthy' ? '✅ OK' : '❌ ERROR'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl">
                  <span className="text-slate-200">Database Connection</span>
                  <span className={`px-3 py-1 rounded-lg font-medium ${metrics?.dbStatus === 'connected'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}>
                    {metrics?.dbStatus === 'connected' ? '✅ OK' : '❌ ERROR'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl">
                  <span className="text-slate-200">Email Service</span>
                  <span className={`px-3 py-1 rounded-lg font-medium ${metrics?.emailStatus === 'operational'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}>
                    {metrics?.emailStatus === 'operational' ? '✅ OK' : '❌ ERROR'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text mb-6">
                📝 System Logs
              </h2>
              <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
                <div className="flex space-x-4 text-slate-300">
                  <span className="text-cyan-300">{new Date().toISOString()}</span>
                  <span className="text-blue-400 font-semibold">INFO</span>
                  <span>Admin dashboard initialized</span>
                </div>
                {/* More log entries would be loaded here */}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text mb-6">
                👥 User Management
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <p className="text-slate-200">Active users: <span className="text-cyan-300 font-bold">{metrics?.activeUsers || 0}</span></p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-xl">
                  <p className="text-slate-200">Total registered: <span className="text-cyan-300 font-bold">Loading...</span></p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
