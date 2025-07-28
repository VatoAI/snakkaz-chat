import React, { useState, useEffect } from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import './AdminDashboard.css';

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
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛠️ Snakkaz Admin Dashboard</h1>
        <button onClick={refresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </header>

      <nav className="admin-nav">
        {(['overview', 'health', 'logs', 'users'] as const).map(tab => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="metric-card">
              <h3>React Application</h3>
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(metrics?.reactStatus || 'unknown') }}
              >
                {metrics?.reactStatus || 'Checking...'}
              </div>
            </div>

            <div className="metric-card">
              <h3>Database</h3>
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(metrics?.dbStatus || 'unknown') }}
              >
                {metrics?.dbStatus || 'Checking...'}
              </div>
            </div>

            <div className="metric-card">
              <h3>Email System</h3>
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(metrics?.emailStatus || 'unknown') }}
              >
                {metrics?.emailStatus || 'Checking...'}
              </div>
            </div>

            <div className="metric-card">
              <h3>Response Time</h3>
              <div className="metric-value">
                {metrics?.responseTime ? `${metrics.responseTime}ms` : 'Measuring...'}
              </div>
            </div>

            <div className="metric-card">
              <h3>Active Users</h3>
              <div className="metric-value">
                {metrics?.activeUsers || 0}
              </div>
            </div>

            <div className="metric-card">
              <h3>Error Count (24h)</h3>
              <div className="metric-value">
                {metrics?.errorCount || 0}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="health-panel">
            <h2>🏥 System Health Monitoring</h2>
            <div className="health-checks">
              <div className="health-check">
                <span>Frontend Bundle Loading</span>
                <span className={`status ${metrics?.reactStatus === 'healthy' ? 'ok' : 'error'}`}>
                  {metrics?.reactStatus === 'healthy' ? '✅ OK' : '❌ ERROR'}
                </span>
              </div>
              <div className="health-check">
                <span>Database Connection</span>
                <span className={`status ${metrics?.dbStatus === 'connected' ? 'ok' : 'error'}`}>
                  {metrics?.dbStatus === 'connected' ? '✅ OK' : '❌ ERROR'}
                </span>
              </div>
              <div className="health-check">
                <span>Email Service</span>
                <span className={`status ${metrics?.emailStatus === 'operational' ? 'ok' : 'error'}`}>
                  {metrics?.emailStatus === 'operational' ? '✅ OK' : '❌ ERROR'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-panel">
            <h2>📝 System Logs</h2>
            <div className="log-viewer">
              <div className="log-entry">
                <span className="timestamp">{new Date().toISOString()}</span>
                <span className="level info">INFO</span>
                <span className="message">Admin dashboard initialized</span>
              </div>
              {/* More log entries would be loaded here */}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-panel">
            <h2>👥 User Management</h2>
            <div className="user-stats">
              <p>Active users: {metrics?.activeUsers || 0}</p>
              <p>Total registered: Loading...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
