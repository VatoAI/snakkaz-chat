import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../services/WebSocketService';
import { AnalyticsService } from '../services/AnalyticsService';
import { SystemMetrics, ApplicationMetrics } from '../types/auth';
import './RealtimeDashboard.css';

/**
 * Real-time Dashboard Component
 * 
 * Displays live system metrics, user activity, and notifications
 * using WebSocket connections for real-time updates.
 */
const RealtimeDashboard: React.FC = () => {
  const { connect, subscribe, getConnectionStatus } = useWebSocket();
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [appMetrics, setAppMetrics] = useState<ApplicationMetrics | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  useEffect(() => {
    // Initialize WebSocket connection
    const initializeWebSocket = async () => {
      try {
        const token = localStorage.getItem('mcp_admin_token');
        if (token) {
          await connect(token);
          setConnectionStatus(getConnectionStatus());
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };
    
    initializeWebSocket();
    
    // Subscribe to real-time events
    const unsubscribeConnection = subscribe('connection', (data) => {
      setConnectionStatus(data.status);
    });
    
    const unsubscribeSystemMetrics = subscribe('system_metrics', (data) => {
      setSystemMetrics(data);
    });
    
    const unsubscribeUserActivity = subscribe('user_activity', (data) => {
      setUserActivity(prev => [data, ...prev.slice(0, 9)]);
    });
    
    const unsubscribeNotifications = subscribe('notification', (data) => {
      setNotifications(prev => [data, ...prev.slice(0, 4)]);
    });
    
    const unsubscribeAlerts = subscribe('admin_alert', (data) => {
      setAlerts(prev => [data, ...prev.slice(0, 4)]);
    });
    
    // Load initial data
    loadInitialData();
    
    return () => {
      unsubscribeConnection();
      unsubscribeSystemMetrics();
      unsubscribeUserActivity();
      unsubscribeNotifications();
      unsubscribeAlerts();
    };
  }, []);
  
  const loadInitialData = async () => {
    try {
      const dashboardData = await AnalyticsService.getDashboardData();
      setSystemMetrics(dashboardData.systemMetrics);
      setAppMetrics(dashboardData.appMetrics);
      setNotifications(dashboardData.recentNotifications || []);
      setUserActivity(dashboardData.recentActivity || []);
    } catch (error) {
      console.error('Failed to load initial dashboard data:', error);
    }
  };
  
  const getConnectionStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return '#4caf50';
      case 'connecting': return '#ff9800';
      case 'closed': return '#f44336';
      default: return '#666';
    }
  };
  
  const getConnectionStatusText = (status: string): string => {
    switch (status) {
      case 'open': return 'Tilkoblet';
      case 'connecting': return 'Kobler til...';
      case 'closed': return 'Frakoblet';
      default: return 'Ukjent';
    }
  };
  
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  return (
    <div className="realtime-dashboard">
      <div className="dashboard-header">
        <h2>Sanntids Dashboard</h2>
        <div className="connection-status">
          <div 
            className="status-indicator"
            style={{ backgroundColor: getConnectionStatusColor(connectionStatus) }}
          ></div>
          <span>{getConnectionStatusText(connectionStatus)}</span>
        </div>
      </div>
      
      <div className="dashboard-grid">
        {/* System Metrics */}
        <div className="dashboard-card system-metrics">
          <h3>System Metrikker</h3>
          {systemMetrics ? (
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-label">CPU Bruk</div>
                <div className="metric-value">{systemMetrics.cpu.usage.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill cpu"
                    style={{ width: `${systemMetrics.cpu.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-label">Minne Bruk</div>
                <div className="metric-value">{systemMetrics.memory.usage.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill memory"
                    style={{ width: `${systemMetrics.memory.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-label">Disk Bruk</div>
                <div className="metric-value">{systemMetrics.disk.usage.toFixed(1)}%</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill disk"
                    style={{ width: `${systemMetrics.disk.usage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item uptime">
                <div className="metric-label">Oppetid</div>
                <div className="metric-value">{formatUptime(systemMetrics.uptime)}</div>
              </div>
            </div>
          ) : (
            <div className="loading-placeholder">Laster systemmetrikker...</div>
          )}
        </div>
        
        {/* Application Metrics */}
        <div className="dashboard-card app-metrics">
          <h3>Applikasjon Metrikker</h3>
          {appMetrics ? (
            <div className="app-metrics-grid">
              <div className="app-metric">
                <div className="app-metric-icon">👥</div>
                <div className="app-metric-info">
                  <div className="app-metric-value">{appMetrics.activeUsers}</div>
                  <div className="app-metric-label">Aktive brukere</div>
                </div>
              </div>
              
              <div className="app-metric">
                <div className="app-metric-icon">🔗</div>
                <div className="app-metric-info">
                  <div className="app-metric-value">{appMetrics.totalSessions}</div>
                  <div className="app-metric-label">Sesjoner</div>
                </div>
              </div>
              
              <div className="app-metric">
                <div className="app-metric-icon">⚡</div>
                <div className="app-metric-info">
                  <div className="app-metric-value">{appMetrics.apiRequests.total}</div>
                  <div className="app-metric-label">API forespørsler</div>
                </div>
              </div>
              
              <div className="app-metric">
                <div className="app-metric-icon">🎯</div>
                <div className="app-metric-info">
                  <div className="app-metric-value">
                    {((appMetrics.apiRequests.success / appMetrics.apiRequests.total) * 100).toFixed(1)}%
                  </div>
                  <div className="app-metric-label">Suksessrate</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading-placeholder">Laster appmetrikker...</div>
          )}
        </div>
        
        {/* Real-time Notifications */}
        <div className="dashboard-card notifications">
          <h3>Varsler</h3>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-icon">📢</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Ingen nye varsler</div>
            )}
          </div>
        </div>
        
        {/* User Activity */}
        <div className="dashboard-card user-activity">
          <h3>Brukeraktivitet</h3>
          <div className="activity-list">
            {userActivity.length > 0 ? (
              userActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'login' && '🔐'}
                    {activity.type === 'message' && '💬'}
                    {activity.type === 'join_chat' && '👥'}
                    {activity.type === 'create_chat' && '✨'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-time">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Ingen nylig aktivitet</div>
            )}
          </div>
        </div>
        
        {/* Alerts */}
        <div className="dashboard-card alerts">
          <h3>Systemvarsler</h3>
          <div className="alerts-list">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className={`alert-item ${alert.severity}`}>
                  <div className="alert-icon">
                    {alert.severity === 'critical' && '🚨'}
                    {alert.severity === 'warning' && '⚠️'}
                    {alert.severity === 'info' && 'ℹ️'}
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Ingen aktive varsler</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
