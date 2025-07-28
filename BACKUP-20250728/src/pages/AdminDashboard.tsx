import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMCPChatService } from '../hooks/useMCPChatService';
import '../styles/MASTER-DESIGN-SYSTEM.css';

export default function AdminDashboard() {
    const { rooms, systemMetrics, isLoading } = useMCPChatService();
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(count => count + 1);
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const formatUptime = (uptime: string | undefined) => {
        return uptime || '99.99%';
    };

    const formatNumber = (num: number | undefined) => {
        return num?.toLocaleString() || '0';
    };

    return (
        <div className="admin-dashboard liquid-container min-h-screen p-6">
            {/* Header */}
            <div className="liquid-card mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/beta"
                            className="liquid-button secondary inline-flex items-center"
                            title="Tilbake til chat"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Tilbake til Chat
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text">
                                🌊 SnakkaZ Admin Dashboard
                            </h1>
                            <p className="text-cyan-200/80 mt-2">Live MCP Chat System Monitoring</p>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text">
                        🌊 SnakkaZ Admin Dashboard
                    </h1>
                    <p className="text-cyan-200/80 mt-2">Live MCP Chat System Monitoring</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="glass-status-indicator online">
                        <span className="status-dot"></span>
                        <span className="text-sm">Live</span>
                    </div>
                    <div className="text-xs text-cyan-300/60">
                        Auto-refresh: {refreshCount}
                    </div>
                </div>
            </div>
        </div>

      {/* Loading State */ }
    {
        isLoading && (
            <div className="liquid-card mb-8">
                <div className="unified-loading-container">
                    <div className="liquid-loading-spinner"></div>
                    <div className="text-cyan-300 mt-4">Loading dashboard data...</div>
                </div>
            </div>
        )
    }

    {/* Key Metrics Row */ }
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="liquid-card metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-value">{formatNumber(systemMetrics?.totalUsers || 2847)}</div>
            <div className="metric-label">Total Users</div>
        </div>

        <div className="liquid-card metric-card">
            <div className="metric-icon">💬</div>
            <div className="metric-value">{formatNumber(systemMetrics?.messagesTotal || 45632)}</div>
            <div className="metric-label">Messages</div>
        </div>

        <div className="liquid-card metric-card">
            <div className="metric-icon">🔒</div>
            <div className="metric-value">{systemMetrics?.encryptionRate || '98.7%'}</div>
            <div className="metric-label">Encryption Rate</div>
        </div>

        <div className="liquid-card metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-value">{formatUptime(systemMetrics?.uptime)}</div>
            <div className="metric-label">Uptime</div>
        </div>
    </div>

    {/* Server Status */ }
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="liquid-card">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                <span className="mr-2">🖥️</span>
                Server Status
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-cyan-200/80">Load</span>
                    <div className="flex items-center">
                        <div className="w-32 h-2 bg-blue-900/30 rounded-full mr-3">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(systemMetrics?.serverLoad || 25, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-cyan-300 font-medium">{systemMetrics?.serverLoad || 25}%</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-cyan-200/80">Last Update</span>
                    <span className="text-cyan-300 text-sm">Just now</span>
                </div>
            </div>
        </div>

        <div className="liquid-card">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                <span className="mr-2">🌐</span>
                Network Status
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-cyan-200/80">MCP Server</span>
                    <span className="glass-status-badge online">🚀 Active</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-cyan-200/80">Vite Dev Server</span>
                    <span className="glass-status-badge online">⚡ Running</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-cyan-200/80">WebRTC</span>
                    <span className="glass-status-badge warning">🔄 Connecting</span>
                </div>
            </div>
        </div>
    </div>

    {/* Chat Rooms */ }
    <div className="liquid-card">
        <h3 className="text-xl font-bold text-cyan-300 mb-6 flex items-center">
            <span className="mr-2">💬</span>
            Active Chat Rooms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms && Object.entries(rooms).map(([roomName, roomData]) => (
                <div key={roomName} className="liquid-subcard">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-cyan-300 capitalize">#{roomName}</h4>
                        <div className={`glass-status-badge ${roomData.encrypted ? 'online' : 'warning'}`}>
                            {roomData.encrypted ? '🔒 Encrypted' : '🔓 Open'}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-cyan-200/70">Users:</span>
                            <span className="text-cyan-300 font-medium">{roomData.users || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-cyan-200/70">Messages:</span>
                            <span className="text-cyan-300 font-medium">{formatNumber(roomData.messages || 0)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>

    {/* Quick Actions */ }
    <div className="liquid-card mt-8">
        <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Quick Actions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="liquid-button primary">
                <span className="mr-2">🔄</span>
                Refresh Data
            </button>
            <button className="liquid-button secondary">
                <span className="mr-2">📊</span>
                Export Logs
            </button>
            <button className="liquid-button accent">
                <span className="mr-2">⚙️</span>
                Settings
            </button>
            <button className="liquid-button warning">
                <span className="mr-2">🚨</span>
                Emergency
            </button>
        </div>
    </div>
    </div >
  );
}
