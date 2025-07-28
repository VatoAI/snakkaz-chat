/**
 * FASE 6 MASTER DASHBOARD - PWA EXCELLENCE & DIGITAL VOKTER
 * Central control panel for all FASE 6 features
 * PWA status, Digital Vokter monitoring, Enterprise controls
 */

import React, { useState, useEffect } from 'react';
import PWAComponent from '../components/PWAComponent';
import DigitalVokter from '../components/DigitalVokter';
import { pwaManager } from '../utils/pwa-manager';

interface DashboardStats {
  pwaScore: number;
  securityScore: number;
  performanceScore: number;
  threatsBlocked: number;
  offlineSync: number;
  userEngagement: number;
}

interface SystemHealth {
  serviceWorker: 'active' | 'inactive' | 'error';
  digitalVokter: 'active' | 'inactive' | 'error';
  pushNotifications: 'enabled' | 'disabled' | 'blocked';
  backgroundSync: 'working' | 'pending' | 'failed';
  cacheStatus: 'healthy' | 'degraded' | 'critical';
}

const Fase6MasterDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pwaScore: 0,
    securityScore: 0,
    performanceScore: 0,
    threatsBlocked: 0,
    offlineSync: 0,
    userEngagement: 0
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    serviceWorker: 'inactive',
    digitalVokter: 'inactive',
    pushNotifications: 'disabled',
    backgroundSync: 'pending',
    cacheStatus: 'healthy'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dashboard
    initializeDashboard();
    
    // Set up real-time updates
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const initializeDashboard = async () => {
    try {
      // Get PWA status
      const pwaStatus = pwaManager.getPWAStatus();
      
      // Update system health
      setSystemHealth({
        serviceWorker: pwaStatus.serviceWorkerActive ? 'active' : 'inactive',
        digitalVokter: 'active', // Assume active for demo
        pushNotifications: pwaStatus.notificationsEnabled ? 'enabled' : 'disabled',
        backgroundSync: 'working',
        cacheStatus: 'healthy'
      });

      // Simulate loading stats
      setTimeout(() => {
        setStats({
          pwaScore: 95,
          securityScore: 88,
          performanceScore: 92,
          threatsBlocked: 12,
          offlineSync: 45,
          userEngagement: 78
        });
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('[Dashboard] Failed to initialize:', error);
      setIsLoading(false);
    }
  };

  const updateStats = () => {
    // Simulate real-time updates
    setStats(prev => ({
      ...prev,
      threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 2),
      offlineSync: prev.offlineSync + Math.floor(Math.random() * 3),
      userEngagement: Math.min(100, prev.userEngagement + Math.floor(Math.random() * 2))
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'enabled':
      case 'working':
      case 'healthy':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'inactive':
      case 'disabled':
      case 'failed':
      case 'critical':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Initialiserer FASE 6</h2>
          <p className="text-slate-400">PWA Excellence & Digital Vokter Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            FASE 6 Master Dashboard
          </h1>
          <p className="text-xl text-slate-400">
            PWA Excellence & Digital Vokter Control Center
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-slate-300">PWA Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-slate-300">AI Security Active</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">PWA Score</h3>
                <div className={`text-3xl font-bold ${getScoreColor(stats.pwaScore)}`}>
                  {stats.pwaScore}%
                </div>
              </div>
              <div className="text-4xl">📱</div>
            </div>
            <div className="mt-4 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.pwaScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Security Score</h3>
                <div className={`text-3xl font-bold ${getScoreColor(stats.securityScore)}`}>
                  {stats.securityScore}%
                </div>
              </div>
              <div className="text-4xl">🛡️</div>
            </div>
            <div className="mt-4 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.securityScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
                <div className={`text-3xl font-bold ${getScoreColor(stats.performanceScore)}`}>
                  {stats.performanceScore}%
                </div>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
            <div className="mt-4 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.performanceScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Threats Blocked</h3>
                <div className="text-3xl font-bold text-red-400">
                  {stats.threatsBlocked}
                </div>
              </div>
              <div className="text-4xl">🚨</div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Today</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Offline Sync</h3>
                <div className="text-3xl font-bold text-blue-400">
                  {stats.offlineSync}
                </div>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Items processed</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">User Engagement</h3>
                <div className={`text-3xl font-bold ${getScoreColor(stats.userEngagement)}`}>
                  {stats.userEngagement}%
                </div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-sm text-slate-400 mt-2">This week</p>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-sm text-slate-400 mb-1">Service Worker</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(systemHealth.serviceWorker)}`}>
                {systemHealth.serviceWorker}
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-sm text-slate-400 mb-1">Digital Vokter</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(systemHealth.digitalVokter)}`}>
                {systemHealth.digitalVokter}
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔔</div>
              <p className="text-sm text-slate-400 mb-1">Push Notifications</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(systemHealth.pushNotifications)}`}>
                {systemHealth.pushNotifications}
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-sm text-slate-400 mb-1">Background Sync</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(systemHealth.backgroundSync)}`}>
                {systemHealth.backgroundSync}
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💾</div>
              <p className="text-sm text-slate-400 mb-1">Cache Status</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(systemHealth.cacheStatus)}`}>
                {systemHealth.cacheStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Feature Demo */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">FASE 6 Features Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => pwaManager.showInstallPrompt()}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              <div className="text-2xl mb-2">📱</div>
              <div className="font-semibold">Test PWA Install</div>
              <div className="text-sm opacity-80">Show install prompt</div>
            </button>

            <button 
              onClick={() => pwaManager.requestNotificationPermission()}
              className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white hover:from-green-500 hover:to-blue-500 transition-all"
            >
              <div className="text-2xl mb-2">🔔</div>
              <div className="font-semibold">Enable Notifications</div>
              <div className="text-sm opacity-80">Request permission</div>
            </button>

            <button 
              onClick={() => pwaManager.addToOfflineQueue('analytics', { event: 'demo_click', timestamp: Date.now() })}
              className="p-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-lg text-white hover:from-purple-500 hover:to-red-500 transition-all"
            >
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-semibold">Test Offline Sync</div>
              <div className="text-sm opacity-80">Add to queue</div>
            </button>

            <button 
              onClick={() => navigator.vibrate && navigator.vibrate([200, 100, 200])}
              className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white hover:from-yellow-500 hover:to-orange-500 transition-all"
            >
              <div className="text-2xl mb-2">📳</div>
              <div className="font-semibold">Test Vibration</div>
              <div className="text-sm opacity-80">PWA haptic feedback</div>
            </button>

            <button 
              onClick={() => {
                if ('share' in navigator) {
                  navigator.share({
                    title: 'SnakkaZ FASE 6',
                    text: 'Check out the new PWA Excellence features!',
                    url: window.location.href
                  });
                }
              }}
              className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              <div className="text-2xl mb-2">📤</div>
              <div className="font-semibold">Test Web Share</div>
              <div className="text-sm opacity-80">Native share API</div>
            </button>

            <div className="p-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg text-white">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold">Glass Liquid UI</div>
              <div className="text-sm opacity-80">Modern design system</div>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Component Integration */}
      <PWAComponent 
        showInstallPrompt={true}
        showOfflineIndicator={true}
        showUpdateNotification={true}
        position="top-right"
      />

      {/* Digital Vokter Integration */}
      <DigitalVokter />
    </div>
  );
};

export default Fase6MasterDashboard;
