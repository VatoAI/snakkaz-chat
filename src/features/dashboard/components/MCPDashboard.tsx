import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    Brain,
    Database,
    Eye,
    Globe,
    MemoryStick,
    Network,
    Play,
    Pause,
    RefreshCw,
    Server,
    Settings,
    Trash2,
    Users,
    Wifi,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMCPChatService } from '@/hooks/useMCPChatService';

interface MCPAgent {
    id: string;
    name: string;
    type: 'llm' | 'tool' | 'memory' | 'network';
    status: 'active' | 'idle' | 'error' | 'offline';
    description: string;
    metrics: {
        uptime: string;
        requests: number;
        errors: number;
        responseTime: number;
    };
    capabilities: string[];
}

interface SystemMetrics {
    cpu: number;
    memory: number;
    network: number;
    activeConnections: number;
    totalRequests: number;
    errorRate: number;
}

const MCPDashboard: React.FC = () => {
    const { systemMetrics, isInitialized } = useMCPChatService();
    const [agents, setAgents] = useState<MCPAgent[]>([]);
    const [metrics, setMetrics] = useState<SystemMetrics>({
        cpu: 45,
        memory: 67,
        network: 23,
        activeConnections: 12,
        totalRequests: 1247,
        errorRate: 0.2
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock MCP agents data
    useEffect(() => {
        setAgents([
            {
                id: 'snakkaz-llm-primary',
                name: 'SnakkaZ LLM Engine',
                type: 'llm',
                status: 'active',
                description: 'Hovedspråkmodell for chat og samtaler',
                metrics: { uptime: '2d 14h', requests: 342, errors: 1, responseTime: 150 },
                capabilities: ['chat', 'translation', 'reasoning', 'norwegian']
            },
            {
                id: 'claude-integration',
                name: 'Claude Code Assistant',
                type: 'llm',
                status: 'active',
                description: 'Kodeassistent og teknisk support',
                metrics: { uptime: '1d 8h', requests: 89, errors: 0, responseTime: 280 },
                capabilities: ['code', 'debugging', 'architecture', 'typescript']
            },
            {
                id: 'memory-manager',
                name: 'Memory Manager',
                type: 'memory',
                status: 'active',
                description: 'Håndterer langtidsminne og kontekst',
                metrics: { uptime: '3d 2h', requests: 567, errors: 2, responseTime: 45 },
                capabilities: ['memory', 'context', 'storage', 'retrieval']
            },
            {
                id: 'network-monitor',
                name: 'Network Monitor',
                type: 'network',
                status: 'active',
                description: 'Overvåker nettverksstatus og forbindelser',
                metrics: { uptime: '5d 12h', requests: 1203, errors: 5, responseTime: 12 },
                capabilities: ['monitoring', 'diagnostics', 'webrtc', 'websockets']
            },
            {
                id: 'supabase-tools',
                name: 'Supabase Tools',
                type: 'tool',
                status: 'active',
                description: 'Database verktøy og integrasjoner',
                metrics: { uptime: '2d 6h', requests: 445, errors: 3, responseTime: 95 },
                capabilities: ['database', 'auth', 'storage', 'realtime']
            }
        ]);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getAgentIcon = (type: string) => {
        switch (type) {
            case 'llm': return <Brain className="h-5 w-5" />;
            case 'tool': return <Zap className="h-5 w-5" />;
            case 'memory': return <MemoryStick className="h-5 w-5" />;
            case 'network': return <Network className="h-5 w-5" />;
            default: return <Activity className="h-5 w-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🌊 SnakkaZ MCP Dashboard</h1>
                    <p className="text-gray-600 mt-1">Model Context Protocol - Live System Oversikt</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={isInitialized ? "default" : "destructive"} className="px-3 py-1">
                        <Wifi className="h-4 w-4 mr-2" />
                        {isInitialized ? 'TILKOBLET' : 'FRAKOBLET'}
                    </Badge>
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                        Oppdater
                    </Button>
                </div>
            </div>

            {/* System Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CPU Bruk</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.cpu}%</div>
                        <Progress value={metrics.cpu} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Minne</CardTitle>
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.memory}%</div>
                        <Progress value={metrics.memory} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktive Forbindelser</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeConnections}</div>
                        <p className="text-xs text-muted-foreground mt-1">+2 fra i går</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Feilrate</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.errorRate}%</div>
                        <p className="text-xs text-green-600 mt-1">Meget bra!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="agents" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="agents">🤖 AI Agenter</TabsTrigger>
                    <TabsTrigger value="memory">🧠 Minne</TabsTrigger>
                    <TabsTrigger value="network">🌐 Nettverk</TabsTrigger>
                    <TabsTrigger value="tools">🔧 Verktøy</TabsTrigger>
                </TabsList>

                {/* AI Agents Tab */}
                <TabsContent value="agents" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {agents.map((agent) => (
                            <Card key={agent.id} className="transition-all hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getAgentIcon(agent.type)}
                                            <div>
                                                <CardTitle className="text-lg">{agent.name}</CardTitle>
                                                <CardDescription>{agent.description}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", getStatusColor(agent.status))} />
                                            <Badge variant="outline" className="text-xs">
                                                {agent.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Oppetid</p>
                                            <p className="font-semibold">{agent.metrics.uptime}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Forespørsler</p>
                                            <p className="font-semibold">{agent.metrics.requests.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Responstid</p>
                                            <p className="font-semibold">{agent.metrics.responseTime}ms</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Feil</p>
                                            <p className="font-semibold text-red-600">{agent.metrics.errors}</p>
                                        </div>
                                    </div>

                                    {/* Capabilities */}
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground mb-2">Evner:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {agent.capabilities.map((cap) => (
                                                <Badge key={cap} variant="secondary" className="text-xs">
                                                    {cap}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Vis Detaljer
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Konfigurer
                                        </Button>
                                        <Button size="sm" variant="destructive" disabled={agent.status === 'active'}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Stopp
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Memory Tab */}
                <TabsContent value="memory" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🧠 Minnehåndtering</CardTitle>
                            <CardDescription>Langtidsminne og kontekstlagring for AI agenter</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <Database className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                                    <h3 className="font-semibold mb-2">Kontekstlager</h3>
                                    <p className="text-2xl font-bold">847 MB</p>
                                    <p className="text-sm text-muted-foreground">Brukt av 2.1 GB</p>
                                </div>
                                <div className="text-center">
                                    <MemoryStick className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                    <h3 className="font-semibold mb-2">Samtalehistorikk</h3>
                                    <p className="text-2xl font-bold">234</p>
                                    <p className="text-sm text-muted-foreground">Aktive samtaler</p>
                                </div>
                                <div className="text-center">
                                    <Brain className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                                    <h3 className="font-semibold mb-2">Vector Database</h3>
                                    <p className="text-2xl font-bold">12.4K</p>
                                    <p className="text-sm text-muted-foreground">Embeddings lagret</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Network Tab */}
                <TabsContent value="network" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🌐 Nettverksstatus</CardTitle>
                            <CardDescription>WebRTC, WebSocket og API forbindelser</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Wifi className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="font-semibold">WebRTC P2P</p>
                                            <p className="text-sm text-muted-foreground">Direkte forbindelser</p>
                                        </div>
                                    </div>
                                    <Badge variant="default">8 aktive</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="font-semibold">WebSocket Server</p>
                                            <p className="text-sm text-muted-foreground">MCP kommunikasjon</p>
                                        </div>
                                    </div>
                                    <Badge variant="default">Tilkoblet</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Server className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="font-semibold">Supabase API</p>
                                            <p className="text-sm text-muted-foreground">Database forbindelse</p>
                                        </div>
                                    </div>
                                    <Badge variant="default">Stabil</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tools Tab */}
                <TabsContent value="tools" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🔧 MCP Verktøy</CardTitle>
                            <CardDescription>Tilgjengelige verktøy og integrasjoner</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Database className="h-6 w-6" />
                                    <span>Database Manager</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Settings className="h-6 w-6" />
                                    <span>System Config</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Activity className="h-6 w-6" />
                                    <span>Performance Monitor</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Zap className="h-6 w-6" />
                                    <span>API Gateway</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MCPDashboard;
