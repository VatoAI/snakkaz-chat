/**
 * Enhanced MCP Dashboard with Real-time Integration
 * 
 * This is the upgraded version of the MCP Dashboard with full API integration,
 * real-time updates, and advanced analytics.
 */

import React, { useState, useEffect } from 'react';
import { mcpAdminAPI } from './api/mcpAdminAPI';
import { 
  useRealTimeMetrics, 
  useRealTimeUsers, 
  useRealTimeChats, 
  useRealTimeAlerts,
  useRealTimeEmail,
  useNotifications,
  useWebSocketStatus 
} from './api/realTimeHooks';

// Enhanced components
import EnhancedSystemStatus from './components/EnhancedSystemStatus';
import EnhancedUserManagement from './components/EnhancedUserManagement';
import EnhancedChatManagement from './components/EnhancedChatManagement';
import EnhancedEmailIntegration from './components/EnhancedEmailIntegration';
import EnhancedMetrics from './components/EnhancedMetrics';
import RealTimeNotifications from './components/RealTimeNotifications';
import SystemAlerts from './components/SystemAlerts';

import './EnhancedMCPDashboard.css';

/**
 * Enhanced MCP Admin Dashboard
 * 
 * Features:
 * - Real-time data updates via WebSocket
 * - Advanced system monitoring
 * - Predictive analytics
 * - Multi-service integration (Supabase, email providers, CRM)
 * - Enhanced security and audit logging
 */
const EnhancedMCPDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real-time hooks
  const { metrics, isConnected: metricsConnected, lastUpdate } = useRealTimeMetrics();
  const { users, onlineUsers, userActivity } = useRealTimeUsers();
  const { chats, messages, activeChats } = useRealTimeChats();
  const { alerts, criticalAlerts, dismissAlert } = useRealTimeAlerts();
  const { emailStats, recentEmails } = useRealTimeEmail();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isConnected, reconnectAttempts } = useWebSocketStatus();
  
  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Connect WebSocket for real-time updates
        mcpAdminAPI.connectWebSocket();
        
        // Get current user info
        const userResponse = await mcpAdminAPI.apiCall('/auth/me');
        if (userResponse.success) {
          setUser(userResponse.data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        setIsLoading(false);
      }
    };
    
    initializeDashboard();
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => {
      mcpAdminAPI.disconnectWebSocket();
    };
  }, []);
  
  // Auto-refresh data every 30 seconds as fallback
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isConnected) {
        // Fallback refresh when WebSocket is disconnected
        try {
          const metricsResponse = await mcpAdminAPI.getSystemMetrics();
          // Handle fallback data update
        } catch (error) {
          console.error('Fallback refresh failed:', error);
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected]);
  
  if (isLoading) {
    return (
      <div className="enhanced-dashboard-loading">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <h2>Initialiserer MCP Dashboard...</h2>
          <p>Kobler til sanntidsdata og systemmetrikker</p>
        </div>
      </div>
    );
  }
  
  const systemHealthScore = metrics ? calculateHealthScore(metrics) : 0;
  
  return (
    <div className="enhanced-mcp-dashboard">
      <header className="enhanced-dashboard-header">
        <div className="header-left">
          <div className="dashboard-logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <h1>Snakkaz MCP</h1>
              <span className="version">v2.0 Enhanced</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢' : '🔴'}
            </div>
            <span>
              {isConnected ? 'Sanntidskobling aktiv' : `Frakoblet (${reconnectAttempts} forsøk)`}
            </span>
          </div>
          
          <div className="system-health">
            <div className="health-score">
              <span className="score-value">{systemHealthScore}%</span>
              <span className="score-label">Systemhelse</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <RealTimeNotifications 
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
          
          {criticalAlerts.length > 0 && (
            <div className="critical-alerts-indicator">
              <span className="alert-count">{criticalAlerts.length}</span>
              <span className="alert-icon">🚨</span>
            </div>
          )}
          
          <div className="user-menu">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="username">{user?.username || 'Admin'}</span>
          </div>
        </div>
      </header>
      
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <SystemAlerts 
          alerts={criticalAlerts}
          onDismiss={dismissAlert}
        />
      )}
      
      <div className="enhanced-dashboard-content">
        <aside className="enhanced-sidebar">
          <nav className="enhanced-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Oversikt</span>
              {lastUpdate && (
                <span className="last-update">
                  {formatTimeAgo(lastUpdate)}
                </span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Brukere</span>
              <span className="nav-badge">{users?.length || 0}</span>
              {onlineUsers.length > 0 && (
                <span className="online-indicator">{onlineUsers.length} online</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              <span className="nav-icon">💬</span>
              <span className="nav-label">Chatter</span>
              <span className="nav-badge">{chats?.length || 0}</span>
              {activeChats.length > 0 && (
                <span className="activity-indicator">{activeChats.length} aktive</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              <span className="nav-icon">📧</span>
              <span className="nav-label">E-post</span>
              {emailStats && (
                <span className="nav-badge">{emailStats.pending || 0}</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">Analyser</span>
              <span className="nav-badge">Ny</span>
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-label">Aktive brukere</span>
                <span className="stat-value">{onlineUsers.length}</span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Siste aktivitet</span>
                <span className="stat-value">
                  {userActivity.length > 0 ? formatTimeAgo(new Date(userActivity[0].timestamp)) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="enhanced-main-content">
          {activeTab === 'overview' && (
            <EnhancedSystemStatus 
              metrics={metrics}
              systemHealth={systemHealthScore}
              alerts={alerts}
              onlineUsers={onlineUsers}
              userActivity={userActivity}
              activeChats={activeChats}
              emailStats={emailStats}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'users' && (
            <EnhancedUserManagement 
              users={users}
              onlineUsers={onlineUsers}
              userActivity={userActivity}
              api={mcpAdminAPI}
            />
          )}
          
          {activeTab === 'chats' && (
            <EnhancedChatManagement 
              chats={chats}
              messages={messages}
              activeChats={activeChats}
              users={users}
              api={mcpAdminAPI}
            />
          )}
          
          {activeTab === 'email' && (
            <EnhancedEmailIntegration 
              emailStats={emailStats}
              recentEmails={recentEmails}
              api={mcpAdminAPI}
            />
          )}
          
          {activeTab === 'analytics' && (
            <EnhancedMetrics 
              metrics={metrics}
              users={users}
              chats={chats}
              emailStats={emailStats}
              timeRange="24h"
            />
          )}
        </main>
      </div>
      
      <footer className="enhanced-dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>Snakkaz MCP Dashboard © 2025 | Enhanced Edition</p>
            <span className="build-info">Build: {process.env.REACT_APP_BUILD_VERSION || 'dev'}</span>
          </div>
          
          <div className="footer-right">
            <span className="connection-indicator">
              WebSocket: {isConnected ? '✅ Tilkoblet' : '❌ Frakoblet'}
            </span>
            <span className="last-sync">
              Sist synkronisert: {lastUpdate?.toLocaleTimeString() || 'Aldri'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper functions
function calculateHealthScore(metrics: any): number {
  if (!metrics) return 0;
  
  const factors = [
    metrics.system?.uptime > 0.95 ? 25 : metrics.system?.uptime * 25,
    metrics.system?.memory < 0.8 ? 25 : (1 - metrics.system?.memory) * 25,
    metrics.system?.cpu < 0.7 ? 25 : (1 - metrics.system?.cpu) * 25,
    metrics.system?.errors === 0 ? 25 : Math.max(0, 25 - metrics.system?.errors)
  ];
  
  return Math.round(factors.reduce((sum, factor) => sum + factor, 0));
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Nå';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}t`;
  return `${Math.floor(minutes / 1440)}d`;
}

export default EnhancedMCPDashboard;
