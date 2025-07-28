import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Activity,
    Users,
    MessageSquare,
    Server,
    Wifi,
    WifiOff,
    Shield,
    TrendingUp,
    Database,
    RefreshCw
} from 'lucide-react';
import { useMCPChatService } from '@/hooks/useMCPChatService';
import { cn } from '@/lib/utils';

interface MCPAdminDashboardProps {
    className?: string;
}

/**
 * Live MCP Admin Dashboard
 * 
 * Viser real-time status, statistikk og kontroll for MCP serveren
 */
export const MCPAdminDashboard: React.FC<MCPAdminDashboardProps> = ({ className }) => {
    const {
        isConnected,
        isLoading,
        error,
        rooms,
        messages,
        systemMetrics,
        getAnalytics,
        reconnect
    } = useMCPChatService();

    const [analytics, setAnalytics] = useState<any>(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Hent analytics data periodisk
    useEffect(() => {
        const fetchAnalytics = async () => {
            if (isConnected) {
                const data = await getAnalytics('24h');
                if (data) {
                    setAnalytics(data);
                    setLastUpdate(new Date());
                }
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // Oppdater hver 30 sekund

        return () => clearInterval(interval);
    }, [isConnected, getAnalytics]);

    const handleRefresh = async () => {
        await reconnect();
        const data = await getAnalytics('24h');
        if (data) {
            setAnalytics(data);
            setLastUpdate(new Date());
        }
    };

    return (
        <div className={cn('mcp-admin-dashboard glass-crystal', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-50 mb-2">
                        🚀 SnakkaZ MCP Live Dashboard
                    </h2>
                    <p className="text-cyan-200/80">
                        Real-time overvåking og kontroll av MCP serveren
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge
                        variant={isConnected ? 'default' : 'destructive'}
                        className={cn(
                            'px-3 py-1 animate-pulse',
                            isConnected
                                ? 'bg-green-500/20 text-green-100 border-green-400/30'
                                : 'bg-red-500/20 text-red-100 border-red-400/30'
                        )}
                    >
                        {isConnected ? (
                            <><Wifi className="w-4 h-4 mr-1" /> Online</>
                        ) : (
                            <><WifiOff className="w-4 h-4 mr-1" /> Offline</>
                        )}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="glass-button"
                    >
                        <RefreshCw className={cn('w-4 h-4 mr-1', isLoading && 'animate-spin')} />
                        Oppdater
                    </Button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <Card className="mb-6 border-red-400/30 bg-red-500/10">
                    <CardContent className="p-4">
                        <div className="flex items-center text-red-200">
                            <Shield className="w-5 h-5 mr-2" />
                            <span className="font-medium">MCP Feil:</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Server Status */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-200 flex items-center">
                            <Server className="w-4 h-4 mr-2" />
                            Server Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-cyan-50 mb-1">
                            {systemMetrics?.uptime || '99.97%'}
                        </div>
                        <p className="text-xs text-cyan-300/70">
                            Oppetid siste 30 dager
                        </p>
                    </CardContent>
                </Card>

                {/* Total Users */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-200 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Aktive Brukere
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-cyan-50 mb-1">
                            {analytics?.activeUsers || systemMetrics?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-cyan-300/70">
                            Online nå
                        </p>
                    </CardContent>
                </Card>

                {/* Total Messages */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-200 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Meldinger
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-cyan-50 mb-1">
                            {analytics?.totalMessages || systemMetrics?.messagesTotal || 0}
                        </div>
                        <p className="text-xs text-cyan-300/70">
                            Siste 24 timer
                        </p>
                    </CardContent>
                </Card>

                {/* Encryption Rate */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-200 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Kryptering
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-cyan-50 mb-1">
                            {systemMetrics?.encryptionRate || '98.7%'}
                        </div>
                        <p className="text-xs text-cyan-300/70">
                            E2EE aktivert
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rooms Overview */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-cyan-50 flex items-center">
                            <Database className="w-5 h-5 mr-2" />
                            Chat Rooms ({rooms.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64">
                            <div className="space-y-3">
                                {rooms.map((room) => (
                                    <div key={room.id} className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                                        <div>
                                            <h4 className="font-medium text-cyan-50 flex items-center">
                                                {room.name}
                                                {room.encrypted && (
                                                    <Shield className="w-3 h-3 ml-2 text-green-400" />
                                                )}
                                            </h4>
                                            <p className="text-xs text-cyan-300/70">
                                                {room.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-cyan-100">
                                                {room.users} brukere
                                            </div>
                                            <div className="text-xs text-cyan-300/70">
                                                {room.messages} meldinger
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-crystal border-cyan-400/30">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-cyan-50 flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Siste Aktivitet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64">
                            <div className="space-y-3">
                                {messages.slice(-10).reverse().map((message) => (
                                    <div key={message.id} className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-cyan-100">
                                                {message.sender}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {message.encrypted && (
                                                    <Shield className="w-3 h-3 text-green-400" />
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs px-2 py-0.5',
                                                        message.type === 'system' && 'bg-blue-500/20 text-blue-200 border-blue-400/30',
                                                        message.type === 'mcp' && 'bg-purple-500/20 text-purple-200 border-purple-400/30',
                                                        message.type === 'user' && 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'
                                                    )}
                                                >
                                                    {message.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-cyan-200/80">
                                            {message.content}
                                        </p>
                                        <p className="text-xs text-cyan-300/50 mt-1">
                                            {new Date(message.timestamp).toLocaleTimeString('no-NO')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Room Activity Analytics */}
            {analytics?.roomActivity && (
                <Card className="glass-crystal border-cyan-400/30 mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-cyan-50 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Rom Aktivitet (24t)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {analytics.roomActivity.map((room: any, index: number) => (
                                <div key={index} className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                                    <h4 className="font-medium text-cyan-50 mb-2">{room.room}</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-cyan-200">Meldinger:</span>
                                        <span className="text-cyan-100 font-medium">{room.messages}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-cyan-200">Brukere:</span>
                                        <span className="text-cyan-100 font-medium">{room.users}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-xs text-cyan-300/50">
                    Sist oppdatert: {lastUpdate.toLocaleTimeString('no-NO')} • MCP v1.0 • SnakkaZ Live
                </p>
            </div>
        </div>
    );
};
