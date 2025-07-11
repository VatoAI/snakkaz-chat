import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Terminal, 
  Server, 
  Code, 
  Globe, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Play,
  Settings
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'error';
  description: string;
  version: string;
  tools: string[];
  lastChecked: Date;
}

const MCPDashboard = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  const [servers, setServers] = useState<MCPServer[]>([
    {
      id: '1',
      name: 'Snakkaz AI Tools',
      url: 'mcp://localhost:3001',
      status: 'online',
      description: 'Main AI assistant tools and utilities',
      version: '1.0.0',
      tools: ['semantic_search', 'code_analysis', 'data_processing'],
      lastChecked: new Date()
    },
    {
      id: '2',
      name: 'GitHub Integration',
      url: 'mcp://localhost:3002',
      status: 'online',
      description: 'GitHub repository management and PR tools',
      version: '1.2.0',
      tools: ['github_pr_list', 'github_pr_review', 'github_issues', 'github_workflows'],
      lastChecked: new Date()
    },
    {
      id: '3',
      name: 'Terminal Commands',
      url: 'mcp://localhost:3003',
      status: 'online',
      description: 'Safe terminal command execution',
      version: '1.1.0',
      tools: ['execute_command', 'list_files', 'check_status'],
      lastChecked: new Date()
    },
    {
      id: '4',
      name: 'Python Environment',
      url: 'mcp://localhost:3004',
      status: 'offline',
      description: 'Python development tools and Poetry support',
      version: '0.9.0',
      tools: ['poetry_install', 'venv_create', 'pip_list'],
      lastChecked: new Date()
    },
    {
      id: '2',
      name: 'Developer Tools',
      url: 'mcp://dev.snakkaz.chat:3002',
      status: 'offline',
      description: 'Development and debugging utilities',
      version: '0.9.0',
      tools: ['git_operations', 'file_system', 'terminal_access'],
      lastChecked: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ]);
  
  const [isCreatingServer, setIsCreatingServer] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    url: '',
    description: ''
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);

  const handleCreateServer = () => {
    if (!newServer.name || !newServer.url) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut navn og URL.",
        variant: "destructive"
      });
      return;
    }

    const server: MCPServer = {
      id: Date.now().toString(),
      name: newServer.name,
      url: newServer.url,
      status: 'offline',
      description: newServer.description,
      version: '1.0.0',
      tools: [],
      lastChecked: new Date()
    };

    setServers(prev => [...prev, server]);
    setNewServer({ name: '', url: '', description: '' });
    setIsCreatingServer(false);
    
    toast({
      title: "MCP Server opprettet",
      description: `${newServer.name} er lagt til i dashboardet.`,
    });
  };

  const handleTestConnection = (serverId: string) => {
    // Mock connection test
    setServers(prev => prev.map(server => 
      server.id === serverId 
        ? { ...server, status: Math.random() > 0.5 ? 'online' : 'error', lastChecked: new Date() }
        : server
    ));
    
    toast({
      title: "Tilkobling testet",
      description: "Serverstatus oppdatert.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Tekst kopiert til utklippstavlen.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-cybergold-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'offline': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300">
      {/* Header */}
      <header className="bg-cyberdark-900 border-b border-cyberdark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-cybergold-400" />
              <h1 className="text-2xl font-bold text-cybergold-400">MCP Dashboard</h1>
            </div>
            <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
              mcp.snakkaz.chat
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-600 to-green-400 text-black">
              {servers.filter(s => s.status === 'online').length} Online
            </Badge>
            <Button 
              onClick={() => setIsCreatingServer(true)}
              className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
            >
              <Server className="h-4 w-4 mr-2" />
              Ny Server
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl py-8 px-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-cybergold-400" />
                <div>
                  <p className="text-sm text-cybergold-600">Totale Servere</p>
                  <p className="text-2xl font-bold text-cybergold-400">{servers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-cybergold-600">Online</p>
                  <p className="text-2xl font-bold text-green-400">
                    {servers.filter(s => s.status === 'online').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-cybergold-400" />
                <div>
                  <p className="text-sm text-cybergold-600">Totale Tools</p>
                  <p className="text-2xl font-bold text-cybergold-400">
                    {servers.reduce((acc, server) => acc + server.tools.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-cybergold-600">Aktive Sessioner</p>
                  <p className="text-2xl font-bold text-yellow-400">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-cyberdark-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              Oversikt
            </TabsTrigger>
            <TabsTrigger 
              value="servers" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              Servere
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-cybergold-400 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Systemstatus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cybergold-300">MCP Protocol</span>
                    <Badge className="bg-green-900/20 text-green-400 border-green-600">
                      v2.0
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cybergold-300">API Gateway</span>
                    <Badge className="bg-green-900/20 text-green-400 border-green-600">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cybergold-300">Load Balancer</span>
                    <Badge className="bg-green-900/20 text-green-400 border-green-600">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cybergold-300">Monitoring</span>
                    <Badge className="bg-green-900/20 text-green-400 border-green-600">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-cybergold-400">Nylig Aktivitet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-cyberdark-800 rounded">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm text-cybergold-300">Snakkaz AI Tools tilkoblet</p>
                      <p className="text-xs text-cybergold-600">2 minutter siden</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-cyberdark-800 rounded">
                    <Code className="h-4 w-4 text-cybergold-400" />
                    <div className="flex-1">
                      <p className="text-sm text-cybergold-300">Tool 'semantic_search' brukt</p>
                      <p className="text-xs text-cybergold-600">5 minutter siden</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-cyberdark-800 rounded">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-sm text-cybergold-300">Developer Tools frakoblet</p>
                      <p className="text-xs text-cybergold-600">12 minutter siden</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="servers">
            <div className="space-y-6">
              {/* Server List */}
              {servers.map((server) => (
                <Card 
                  key={server.id} 
                  className="bg-cyberdark-900 border-cyberdark-700 hover:border-cybergold-600/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedServer(server)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${getStatusColor(server.status)}`}>
                          {getStatusIcon(server.status)}
                          <h3 className="text-xl font-medium text-cybergold-400">{server.name}</h3>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`border-current ${getStatusColor(server.status)}`}
                        >
                          {server.status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestConnection(server.id);
                          }}
                          className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(server.url);
                          }}
                          className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-cybergold-600 mb-1">URL</p>
                        <p className="text-cybergold-300 font-mono text-xs">{server.url}</p>
                      </div>
                      <div>
                        <p className="text-cybergold-600 mb-1">Versjon</p>
                        <p className="text-cybergold-300">{server.version}</p>
                      </div>
                      <div>
                        <p className="text-cybergold-600 mb-1">Tools</p>
                        <p className="text-cybergold-300">{server.tools.length} tilgjengelige</p>
                      </div>
                    </div>
                    
                    {server.description && (
                      <div className="mt-4">
                        <p className="text-cybergold-600 text-sm mb-1">Beskrivelse</p>
                        <p className="text-cybergold-300 text-sm">{server.description}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {server.tools.map((tool, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-cybergold-600 text-cybergold-400 text-xs"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create New Server Form */}
              {isCreatingServer && (
                <Card className="bg-cyberdark-900 border-cybergold-600">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400">Opprett Ny MCP Server</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Server Navn</Label>
                      <Input
                        id="name"
                        placeholder="Min MCP Server"
                        value={newServer.name}
                        onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">MCP URL</Label>
                      <Input
                        id="url"
                        placeholder="mcp://localhost:3000 eller wss://your-server.com"
                        value={newServer.url}
                        onChange={(e) => setNewServer(prev => ({ ...prev, url: e.target.value }))}
                        className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Beskrivelse (valgfritt)</Label>
                      <Textarea
                        id="description"
                        placeholder="Beskriv hva denne serveren gjør..."
                        value={newServer.description}
                        onChange={(e) => setNewServer(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleCreateServer}
                        className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                      >
                        Opprett Server
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsCreatingServer(false)}
                        className="border-cyberdark-600 text-cybergold-400 hover:bg-cyberdark-800"
                      >
                        Avbryt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.flatMap(server => 
                server.tools.map((tool, index) => (
                  <Card key={`${server.id}-${index}`} className="bg-cyberdark-900 border-cyberdark-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-cybergold-400">{tool}</h3>
                        <Badge 
                          variant="outline" 
                          className={`border-current ${getStatusColor(server.status)}`}
                        >
                          {server.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-cybergold-600 mb-2">Fra: {server.name}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Bruk
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info section for Model Context Protocol */}
        <Card className="mt-8 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Terminal className="h-8 w-8 text-cybergold-400 mt-1" />
              <div>
                <h3 className="text-xl font-medium text-cybergold-400 mb-2">
                  Model Context Protocol (MCP)
                </h3>
                <p className="text-cybergold-300 mb-4">
                  MCP muliggjør sikker kommunikasjon mellom AI-modeller og eksterne tjenester. 
                  Dette dashboardet lar deg administrere og overvåke dine MCP-servere.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Dokumentasjon
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    API Reference
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MCPDashboard;
