import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Activity,
    Brain,
    Database,
    Globe,
    Server,
    Shield,
    Zap,
    Users,
    MessageSquare,
    Wifi,
    HardDrive,
    Cpu,
    MemoryStick,
    Network,
    Eye,
    Settings,
    Download,
    Play,
    Pause,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LLMModel {
    id: string;
    name: string;
    size: string;
    type: 'chat' | 'code' | 'embedding' | 'vision';
    status: 'available' | 'downloading' | 'running' | 'stopped' | 'error';
    provider: 'ollama' | 'huggingface' | 'local';
    description: string;
    capabilities: string[];
    downloadProgress?: number;
    memoryUsage?: number;
    requestCount?: number;
}

const SystemArchitecture: React.FC = () => {
    const [models, setModels] = useState<LLMModel[]>([]);
    const [systemStatus, setSystemStatus] = useState({
        cpu: 45,
        memory: 67,
        gpu: 23,
        disk: 78,
        network: 'online',
        ollama: 'running',
        supabase: 'connected',
        mcp: 'active'
    });

    // Mock data for LLM models
    useEffect(() => {
        setModels([
            {
                id: 'llama3.2-3b',
                name: 'Llama 3.2 3B',
                size: '2.0 GB',
                type: 'chat',
                status: 'running',
                provider: 'ollama',
                description: 'Rask og effektiv norsk chat-modell',
                capabilities: ['norsk', 'chat', 'samtale', 'hjelpsom'],
                memoryUsage: 2.1,
                requestCount: 247
            },
            {
                id: 'codellama-7b',
                name: 'CodeLlama 7B',
                size: '3.8 GB',
                type: 'code',
                status: 'running',
                provider: 'ollama',
                description: 'Kode-assistent for TypeScript og React',
                capabilities: ['typescript', 'react', 'debugging', 'kode'],
                memoryUsage: 4.2,
                requestCount: 89
            },
            {
                id: 'mistral-7b',
                name: 'Mistral 7B Instruct',
                size: '4.1 GB',
                type: 'chat',
                status: 'available',
                provider: 'ollama',
                description: 'Avansert flerspråklig modell',
                capabilities: ['multilingual', 'reasoning', 'analysis']
            },
            {
                id: 'llava-7b',
                name: 'LLaVA 7B Vision',
                size: '4.5 GB',
                type: 'vision',
                status: 'downloading',
                provider: 'ollama',
                description: 'Multimodal modell for bilde-analyse',
                capabilities: ['vision', 'image-analysis', 'multimodal'],
                downloadProgress: 67
            },
            {
                id: 'nomic-embed',
                name: 'Nomic Embed Text',
                size: '274 MB',
                type: 'embedding',
                status: 'running',
                provider: 'ollama',
                description: 'Tekstembeddings for semantisk søk',
                capabilities: ['embeddings', 'search', 'semantic'],
                memoryUsage: 0.3,
                requestCount: 1205
            }
        ]);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'bg-green-500';
            case 'available': return 'bg-blue-500';
            case 'downloading': return 'bg-yellow-500';
            case 'stopped': return 'bg-gray-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'chat': return <MessageSquare className="h-4 w-4" />;
            case 'code': return <Zap className="h-4 w-4" />;
            case 'vision': return <Eye className="h-4 w-4" />;
            case 'embedding': return <Brain className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    const runningModels = models.filter(m => m.status === 'running');
    const totalMemoryUsage = runningModels.reduce((sum, m) => sum + (m.memoryUsage || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🏗️ SnakkaZ System Arkitektur</h1>
                    <p className="text-gray-600 mt-1">Full oversikt over AI modeller, infrastruktur og integrasjoner</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="default" className="px-3 py-1">
                        <Brain className="h-4 w-4 mr-2" />
                        {runningModels.length} AI Modeller Aktive
                    </Badge>
                    <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Oppdater Status
                    </Button>
                </div>
            </div>

            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CPU Bruk</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{systemStatus.cpu}%</div>
                        <Progress value={systemStatus.cpu} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">AI workload: 23%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GPU Minne</CardTitle>
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMemoryUsage.toFixed(1)} GB</div>
                        <Progress value={(totalMemoryUsage / 16) * 100} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">av 16 GB tilgjengelig</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nettverk</CardTitle>
                        <Network className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Online</div>
                        <p className="text-xs text-muted-foreground mt-1">Alle tjenester tilkoblet</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lagring</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{systemStatus.disk}%</div>
                        <Progress value={systemStatus.disk} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">AI modeller: 45 GB</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Architecture Tabs */}
            <Tabs defaultValue="models" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="models">🤖 AI Modeller</TabsTrigger>
                    <TabsTrigger value="infrastructure">🏗️ Infrastruktur</TabsTrigger>
                    <TabsTrigger value="integrations">🔗 Integrasjoner</TabsTrigger>
                    <TabsTrigger value="deployment">🚀 Deployment</TabsTrigger>
                </TabsList>

                {/* AI Models Tab */}
                <TabsContent value="models" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {models.map((model) => (
                            <Card key={model.id} className="transition-all hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getTypeIcon(model.type)}
                                            <div>
                                                <CardTitle className="text-lg">{model.name}</CardTitle>
                                                <CardDescription>{model.description}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", getStatusColor(model.status))} />
                                            <Badge variant="outline" className="text-xs">
                                                {model.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Model Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Størrelse</p>
                                            <p className="font-semibold">{model.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Provider</p>
                                            <p className="font-semibold capitalize">{model.provider}</p>
                                        </div>
                                        {model.memoryUsage && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Minnebruk</p>
                                                <p className="font-semibold">{model.memoryUsage} GB</p>
                                            </div>
                                        )}
                                        {model.requestCount && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Forespørsler</p>
                                                <p className="font-semibold">{model.requestCount.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Download Progress */}
                                    {model.downloadProgress && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Nedlasting</span>
                                                <span>{model.downloadProgress}%</span>
                                            </div>
                                            <Progress value={model.downloadProgress} />
                                        </div>
                                    )}

                                    {/* Capabilities */}
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground mb-2">Evner:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {model.capabilities.map((cap) => (
                                                <Badge key={cap} variant="secondary" className="text-xs">
                                                    {cap}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {model.status === 'available' && (
                                            <Button size="sm" variant="default">
                                                <Play className="h-4 w-4 mr-2" />
                                                Start
                                            </Button>
                                        )}
                                        {model.status === 'running' && (
                                            <Button size="sm" variant="outline">
                                                <Pause className="h-4 w-4 mr-2" />
                                                Stopp
                                            </Button>
                                        )}
                                        {!['running', 'downloading'].includes(model.status) && (
                                            <Button size="sm" variant="outline">
                                                <Download className="h-4 w-4 mr-2" />
                                                Last ned
                                            </Button>
                                        )}
                                        <Button size="sm" variant="ghost">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Konfigurer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Infrastructure Tab */}
                <TabsContent value="infrastructure" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Frontend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Frontend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>React 18</span>
                                        <Badge variant="default">Aktiv</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>TypeScript</span>
                                        <Badge variant="default">Aktiv</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Vite Dev Server</span>
                                        <Badge variant="default">:4000</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Norwegian Aurora UI</span>
                                        <Badge variant="default">✨</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Backend Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="h-5 w-5" />
                                    Backend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Supabase</span>
                                        <Badge variant="default">Tilkoblet</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>MCP Server</span>
                                        <Badge variant="default">Aktiv</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>WebRTC</span>
                                        <Badge variant="default">P2P</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ollama Server</span>
                                        <Badge variant="default">Kjører</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Infrastructure */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    AI Infrastruktur
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Ollama Runtime</span>
                                        <Badge variant="default">v0.3.12</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Local Models</span>
                                        <Badge variant="default">{models.length}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>GPU Acceleration</span>
                                        <Badge variant="secondary">CUDA</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Model Cache</span>
                                        <Badge variant="default">45 GB</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>🔗 Eksterne Integrasjoner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Database className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <p className="font-semibold">Supabase Database</p>
                                                <p className="text-sm text-muted-foreground">PostgreSQL + Auth</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">Tilkoblet</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="font-semibold">Namecheap Hosting</p>
                                                <p className="text-sm text-muted-foreground">Production deployment</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Konfigurert</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Brain className="h-5 w-5 text-purple-500" />
                                            <div>
                                                <p className="font-semibold">Hugging Face Hub</p>
                                                <p className="text-sm text-muted-foreground">Model repository</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">API Ready</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>⚙️ System Tjenester</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-5 w-5 text-orange-500" />
                                            <div>
                                                <p className="font-semibold">Monitoring</p>
                                                <p className="text-sm text-muted-foreground">System metrics</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">Aktiv</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Wifi className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <p className="font-semibold">WebRTC Signaling</p>
                                                <p className="text-sm text-muted-foreground">P2P kommunikasjon</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">Kjører</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="font-semibold">User Management</p>
                                                <p className="text-sm text-muted-foreground">Auth & sessions</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">Supabase</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Deployment Tab */}
                <TabsContent value="deployment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>🚀 Deployment Pipeline</CardTitle>
                            <CardDescription>Automatisert deployment til produksjon</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Development */}
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-blue-700">Development</h4>
                                    <p className="text-sm text-muted-foreground">Local development with Vite HMR</p>
                                    <Badge variant="default" className="mt-2">localhost:4000</Badge>
                                </div>

                                {/* Staging */}
                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <h4 className="font-semibold text-yellow-700">Staging</h4>
                                    <p className="text-sm text-muted-foreground">Testing environment with production data</p>
                                    <Badge variant="secondary" className="mt-2">beta.snakkaz.com</Badge>
                                </div>

                                {/* Production */}
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-green-700">Production</h4>
                                    <p className="text-sm text-muted-foreground">Namecheap hosting with CDN</p>
                                    <Badge variant="default" className="mt-2">snakkaz.com</Badge>
                                </div>

                                {/* Terminal Commands */}
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h5 className="font-semibold mb-2">Deployment Commands:</h5>
                                    <div className="space-y-2 text-sm font-mono">
                                        <div><span className="text-blue-600">npm run build:prod</span> - Build for production</div>
                                        <div><span className="text-blue-600">npm run prepare-deploy</span> - Prepare deployment package</div>
                                        <div><span className="text-blue-600">./AUTOMATIC-DEPLOY-LFTP.sh</span> - Deploy to Namecheap</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SystemArchitecture;
