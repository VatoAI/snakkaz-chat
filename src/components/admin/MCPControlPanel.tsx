import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Server, 
  Activity, 
  Zap, 
  MessageSquare, 
  Users, 
  Settings,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Database,
  Globe,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MCPServerStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error' | 'starting';
  url: string;
  uptime: number;
  requests: number;
  errors: number;
  lastActivity: Date;
  version: string;
  tools: MCPTool[];
}

interface MCPTool {
  name: string;
  description: string;
  usage: number;
  lastUsed: Date;
  enabled: boolean;
}

interface MCPMetrics {
  totalRequests: number;
  averageResponseTime: number;
  activeConnections: number;
  errorRate: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export const MCPControlPanel: React.FC = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<MCPServerStatus[]>([]);
  const [metrics, setMetrics] = useState<MCPMetrics>({
    totalRequests: 0,
    averageResponseTime: 0,
    activeConnections: 0,
    errorRate: 0,
    uptime: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  // Initialize MCP servers
  useEffect(() => {
    initializeMCPServers();
    if (autoRefresh) {
      const interval = setInterval(refreshMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const initializeMCPServers = async () => {
    setIsLoading(true);
    try {
      // Simulate loading MCP servers
      const mockServers: MCPServerStatus[] = [
        {
          id: 'snakkaz-main',
          name: 'SnakkaZ Main MCP',
          status: 'online',
          url: 'mcp://localhost:3001',
          uptime: 86400, // 1 day
          requests: 1547,
          errors: 2,
          lastActivity: new Date(),
          version: '2.1.0',
          tools: [
            {
              name: 'chat_manager',
              description: 'Manages chat operations and routing',
              usage: 847,
              lastUsed: new Date(),
              enabled: true
            },
            {
              name: 'user_lookup',
              description: 'User information and status lookup',
              usage: 234,
              lastUsed: new Date(Date.now() - 300000),
              enabled: true
            },
            {
              name: 'message_encrypt',
              description: 'End-to-end encryption for messages',
              usage: 1547,
              lastUsed: new Date(),
              enabled: true
            }
          ]
        },
        {
          id: 'snakkaz-ai',
          name: 'SnakkaZ AI Assistant',
          status: 'online',
          url: 'mcp://localhost:3002',
          uptime: 43200, // 12 hours
          requests: 789,
          errors: 0,
          lastActivity: new Date(Date.now() - 60000),
          version: '1.8.3',
          tools: [
            {
              name: 'ai_response',
              description: 'AI-powered chat responses',
              usage: 456,
              lastUsed: new Date(Date.now() - 60000),
              enabled: true
            },
            {
              name: 'content_filter',
              description: 'Content moderation and filtering',
              usage: 234,
              lastUsed: new Date(Date.now() - 120000),
              enabled: true
            }
          ]
        },
        {
          id: 'snakkaz-security',
          name: 'SnakkaZ Security',
          status: 'online',
          url: 'mcp://localhost:3003',
          uptime: 86400,
          requests: 2103,
          errors: 1,
          lastActivity: new Date(),
          version: '3.0.1',
          tools: [
            {
              name: 'threat_detection',
              description: 'Real-time threat detection',
              usage: 1203,
              lastUsed: new Date(),
              enabled: true
            },
            {
              name: 'audit_logger',
              description: 'Security audit logging',
              usage: 900,
              lastUsed: new Date(Date.now() - 30000),
              enabled: true
            }
          ]
        }
      ];

      setServers(mockServers);
      updateMetrics(mockServers);
      addTerminalLog('✅ MCP Control Panel initialized successfully');
    } catch (error) {
      toast({
        title: "❌ Initialization Error",
        description: "Failed to initialize MCP servers",
        variant: "destructive"
      });
      addTerminalLog(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMetrics = (serverList: MCPServerStatus[]) => {
    const totalRequests = serverList.reduce((sum, s) => sum + s.requests, 0);
    const totalErrors = serverList.reduce((sum, s) => sum + s.errors, 0);
    const avgUptime = serverList.reduce((sum, s) => sum + s.uptime, 0) / serverList.length;

    setMetrics({
      totalRequests,
      averageResponseTime: Math.random() * 100 + 50, // Mock response time
      activeConnections: serverList.filter(s => s.status === 'online').length,
      errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
      uptime: avgUptime,
      memoryUsage: Math.random() * 30 + 40, // Mock memory usage
      cpuUsage: Math.random() * 20 + 10 // Mock CPU usage
    });
  };

  const refreshMetrics = async () => {
    // Simulate real-time updates
    setServers(current => 
      current.map(server => ({
        ...server,
        requests: server.requests + Math.floor(Math.random() * 5),
        lastActivity: Math.random() > 0.7 ? new Date() : server.lastActivity
      }))
    );
  };

  const addTerminalLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalOutput(current => [
      ...current.slice(-19), // Keep last 20 lines
      `[${timestamp}] ${message}`
    ]);
  };

  const handleServerAction = async (serverId: string, action: 'start' | 'stop' | 'restart') => {
    addTerminalLog(`🔧 ${action.toUpperCase()} server ${serverId}...`);
    
    setServers(current =>
      current.map(server =>
        server.id === serverId
          ? { ...server, status: action === 'stop' ? 'offline' : 'starting' }
          : server
      )
    );

    // Simulate server action
    setTimeout(() => {
      setServers(current =>
        current.map(server =>
          server.id === serverId
            ? { 
                ...server, 
                status: action === 'stop' ? 'offline' : 'online',
                uptime: action === 'restart' ? 0 : server.uptime
              }
            : server
        )
      );
      addTerminalLog(`✅ Server ${serverId} ${action} completed`);
      
      toast({
        title: `🔧 Server ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        description: `Server ${serverId} has been ${action}ed successfully`
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="snakkaz-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Initializing MCP Control Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">MCP Control Panel</h1>
          <p className="text-gray-400">Real-time monitoring and control of SnakkaZ MCP servers</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <span className="text-sm text-gray-400">Auto-refresh</span>
          </div>
          <Button onClick={() => refreshMetrics()} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="snakkaz-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="snakkaz-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Connections</p>
                <p className="text-2xl font-bold text-white">{metrics.activeConnections}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="snakkaz-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-white">{Math.round(metrics.averageResponseTime)}ms</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="snakkaz-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-white">{metrics.errorRate.toFixed(2)}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="snakkaz-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  {server.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></div>
                  <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                    {server.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Version</p>
                    <p className="text-white font-mono">{server.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Uptime</p>
                    <p className="text-white">{formatUptime(server.uptime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Requests</p>
                    <p className="text-white">{server.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Errors</p>
                    <p className="text-white">{server.errors}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Tools ({server.tools.length})</p>
                  <div className="space-y-1">
                    {server.tools.slice(0, 3).map((tool) => (
                      <div key={tool.name} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{tool.name}</span>
                        <span className="text-gray-400">{tool.usage} uses</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleServerAction(server.id, 'restart')}
                    disabled={server.status === 'starting'}
                    className="flex-1"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => 
                      server.status === 'online' 
                        ? handleServerAction(server.id, 'stop')
                        : handleServerAction(server.id, 'start')
                    }
                    disabled={server.status === 'starting'}
                  >
                    {server.status === 'online' ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Terminal Output */}
      <Card className="snakkaz-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            System Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {terminalOutput.length === 0 ? (
              <p className="text-gray-500">No log entries yet...</p>
            ) : (
              terminalOutput.map((line, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {line}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};