/**
 * Advanced Supabase Analytics Dashboard
 * 
 * Real-time dashboard showing:
 * - System health and performance metrics
 * - E2EE encryption status and performance  
 * - User activity and engagement stats
 * - Database query performance
 * - Realtime connection health
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Shield, 
  Users, 
  MessageCircle, 
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { performanceMonitor, SystemHealth } from '@/services/supabase/PerformanceMonitor';
import useRealtimeSupabase from '@/hooks/useRealtimeSupabase';
import { EncryptionIndicator } from '@/components/chat/security/EncryptionIndicator';

interface DashboardProps {
  className?: string;
}

export const SupabaseAnalyticsDashboard: React.FC<DashboardProps> = ({ className }) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [slowQueries, setSlowQueries] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { 
    isConnected, 
    connectionHealth, 
    metrics, 
    presence, 
    getOnlineUsersCount 
  } = useRealtimeSupabase({
    autoConnect: true,
    enablePresence: true,
    enableMetrics: true
  });

  // Refresh dashboard data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const health = performanceMonitor.getSystemHealth();
      const analyticsData = performanceMonitor.getAnalytics();
      const queries = performanceMonitor.getSlowQueries(5);
      
      setSystemHealth(health);
      setAnalytics(analyticsData);
      setSlowQueries(queries);
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'active':
        return 'text-green-500';
      case 'degraded':
      case 'reconnecting':
        return 'text-yellow-500';
      case 'down':
      case 'disconnected':
      case 'inactive':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
      case 'reconnecting':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'down':
      case 'disconnected':
      case 'inactive':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-cybergold-400">
            SnakkaZ Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time system performance and user activity monitoring
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
          className="border-cybergold-600 hover:bg-cybergold-900/20"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Database Health */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cybergold-300">
              Database Health
            </CardTitle>
            <Database className="h-4 w-4 text-cybergold-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth?.database.status || 'unknown')}
              <div className="text-2xl font-bold text-cybergold-400">
                {systemHealth?.database.status || 'Unknown'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Avg query: {formatDuration(systemHealth?.database.avgQueryTime || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Error rate: {systemHealth?.database.errorRate.toFixed(1) || 0}%
            </p>
          </CardContent>
        </Card>

        {/* Realtime Health */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cybergold-300">
              Realtime Status
            </CardTitle>
            <Activity className="h-4 w-4 text-cybergold-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusIcon(isConnected ? 'connected' : 'disconnected')}
              <div className="text-2xl font-bold text-cybergold-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Latency: {formatDuration(systemHealth?.realtime.messageLatency || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Messages: {metrics.messagesReceived + metrics.messagesSent}
            </p>
          </CardContent>
        </Card>

        {/* E2EE Performance */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cybergold-300">
              Encryption
            </CardTitle>
            <Shield className="h-4 w-4 text-cybergold-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <EncryptionIndicator 
                status="encrypted" 
                transmissionType="mcp" 
                className="!text-green-500"
              />
              <div className="text-2xl font-bold text-cybergold-400">
                {systemHealth?.e2ee.keyExchangeSuccessRate.toFixed(0) || 100}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Encrypt: {formatDuration(systemHealth?.e2ee.encryptionLatency || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Decrypt: {formatDuration(systemHealth?.e2ee.decryptionLatency || 0)}
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cybergold-300">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-cybergold-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cybergold-400">
              {getOnlineUsersCount()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total online now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Metrics */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader>
            <CardTitle className="text-cybergold-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              System performance over the last hour
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.categories?.map((category: any) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-cybergold-300">
                    {category.category}
                  </span>
                  <Badge 
                    variant={category.successRate > 95 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {category.successRate.toFixed(1)}% success
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{category.totalOperations} operations</span>
                  <span>avg: {formatDuration(category.avgDuration)}</span>
                </div>
                <Progress 
                  value={category.successRate} 
                  className="h-2"
                  style={{
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Slow Queries */}
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader>
            <CardTitle className="text-cybergold-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Slow Queries
            </CardTitle>
            <CardDescription>
              Top 5 slowest database operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slowQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-cyberdark-700">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cybergold-300">
                      {query.operation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(query.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={query.success ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {formatDuration(query.duration)}
                    </Badge>
                    {query.error && (
                      <p className="text-xs text-red-400 mt-1">
                        {query.error.substring(0, 30)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {slowQueries.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No slow queries detected
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users */}
      <Card className="bg-cyberdark-800 border-cybergold-800">
        <CardHeader>
          <CardTitle className="text-cybergold-400 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            User Presence
          </CardTitle>
          <CardDescription>
            Currently active users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(presence).map((user, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded bg-cyberdark-700">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    user.status === 'online' ? 'bg-green-500' :
                    user.status === 'away' ? 'bg-yellow-500' :
                    user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cybergold-300">
                    User {user.user_id.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.status} • {user.activity || 'active'}
                  </p>
                </div>
              </div>
            ))}
            {Object.keys(presence).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 col-span-full">
                No active users detected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Health Details */}
      {connectionHealth && (
        <Card className="bg-cyberdark-800 border-cybergold-800">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-cybergold-300">Status</p>
                <p className={`text-sm ${getStatusColor(connectionHealth.status)}`}>
                  {connectionHealth.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-cybergold-300">Active Channels</p>
                <p className="text-sm text-muted-foreground">
                  {connectionHealth.activeChannels}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-cybergold-300">User ID</p>
                <p className="text-sm text-muted-foreground">
                  {connectionHealth.userId?.substring(0, 16)}...
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-cybergold-300">Uptime</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(Date.now() - connectionHealth.uptime)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupabaseAnalyticsDashboard;
