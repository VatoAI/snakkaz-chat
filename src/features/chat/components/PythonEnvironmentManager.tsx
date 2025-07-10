import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Python, 
  Package, 
  FolderPlus, 
  Play, 
  Square, 
  CheckCircle, 
  XCircle,
  Terminal,
  FileText,
  Settings,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';

interface PythonEnvironment {
  id: string;
  name: string;
  path: string;
  pythonVersion: string;
  type: 'venv' | 'conda' | 'poetry' | 'pipenv';
  isActive: boolean;
  packages: PythonPackage[];
  createdAt: Date;
  size: string;
}

interface PythonPackage {
  name: string;
  version: string;
  description: string;
  isRequired: boolean;
}

interface PythonEnvironmentManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonEnvironmentManager: React.FC<PythonEnvironmentManagerProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [environments, setEnvironments] = useState<PythonEnvironment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<PythonEnvironment | null>(null);
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvType, setNewEnvType] = useState<'venv' | 'poetry'>('poetry');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('environments');
  const [autoGitignore, setAutoGitignore] = useState(true);

  // Mock data for demonstration
  const mockEnvironments: PythonEnvironment[] = [
    {
      id: '1',
      name: 'snakkaz-chat',
      path: '/workspace/.venv',
      pythonVersion: '3.11.5',
      type: 'poetry',
      isActive: true,
      packages: [
        { name: 'fastapi', version: '0.104.1', description: 'FastAPI framework', isRequired: true },
        { name: 'uvicorn', version: '0.24.0', description: 'ASGI server', isRequired: true },
        { name: 'pydantic', version: '2.5.0', description: 'Data validation', isRequired: true },
        { name: 'requests', version: '2.31.0', description: 'HTTP library', isRequired: false },
      ],
      createdAt: new Date('2025-07-01T10:00:00Z'),
      size: '245 MB'
    },
    {
      id: '2',
      name: 'mcp-server',
      path: '/workspace/MCP SnakkaZ/.venv',
      pythonVersion: '3.11.5',
      type: 'poetry',
      isActive: false,
      packages: [
        { name: 'mcp', version: '1.0.0', description: 'Model Context Protocol', isRequired: true },
        { name: 'anthropic', version: '0.8.1', description: 'Anthropic API client', isRequired: true },
      ],
      createdAt: new Date('2025-07-05T14:30:00Z'),
      size: '156 MB'
    }
  ];

  useEffect(() => {
    // Load environments from localStorage or fetch from backend
    const saved = localStorage.getItem('python_environments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEnvironments(parsed);
      } catch (error) {
        console.error('Error parsing saved environments:', error);
        setEnvironments(mockEnvironments);
      }
    } else {
      setEnvironments(mockEnvironments);
    }

    // Load auto-gitignore setting
    const savedAutoGitignore = localStorage.getItem('python_auto_gitignore');
    if (savedAutoGitignore !== null) {
      setAutoGitignore(JSON.parse(savedAutoGitignore));
    }
  }, []);

  // Save environments to localStorage
  useEffect(() => {
    if (environments.length > 0) {
      localStorage.setItem('python_environments', JSON.stringify(environments));
    }
  }, [environments]);

  useEffect(() => {
    localStorage.setItem('python_auto_gitignore', JSON.stringify(autoGitignore));
  }, [autoGitignore]);

  const createEnvironment = async () => {
    if (!newEnvName.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst oppgi et navn for miljøet",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Simulate environment creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newEnv: PythonEnvironment = {
        id: Date.now().toString(),
        name: newEnvName,
        path: `/workspace/${newEnvName}/.venv`,
        pythonVersion: '3.11.5',
        type: newEnvType,
        isActive: false,
        packages: [],
        createdAt: new Date(),
        size: '12 MB'
      };

      setEnvironments(prev => [...prev, newEnv]);
      setNewEnvName('');

      // Auto-add to .gitignore if enabled
      if (autoGitignore) {
        await addToGitignore(newEnv.path);
      }

      toast({
        title: "Miljø opprettet",
        description: `Python-miljø "${newEnvName}" er opprettet med ${newEnvType}`,
      });

    } catch (error) {
      toast({
        title: "Opprettingsfeil",
        description: "Kunne ikke opprette Python-miljø",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const activateEnvironment = async (env: PythonEnvironment) => {
    try {
      // Deactivate all other environments
      setEnvironments(prev => prev.map(e => ({ ...e, isActive: false })));

      // Activate selected environment
      setEnvironments(prev => prev.map(e => 
        e.id === env.id ? { ...e, isActive: true } : e
      ));

      toast({
        title: "Miljø aktivert",
        description: `${env.name} er nå det aktive Python-miljøet`,
      });

    } catch (error) {
      toast({
        title: "Aktiveringsfeil",
        description: "Kunne ikke aktivere Python-miljø",
        variant: "destructive",
      });
    }
  };

  const deleteEnvironment = async (env: PythonEnvironment) => {
    if (!window.confirm(`Er du sikker på at du vil slette miljøet "${env.name}"?`)) {
      return;
    }

    try {
      setEnvironments(prev => prev.filter(e => e.id !== env.id));
      
      if (selectedEnv?.id === env.id) {
        setSelectedEnv(null);
      }

      toast({
        title: "Miljø slettet",
        description: `Python-miljø "${env.name}" er slettet`,
      });

    } catch (error) {
      toast({
        title: "Slettingsfeil",
        description: "Kunne ikke slette Python-miljø",
        variant: "destructive",
      });
    }
  };

  const addToGitignore = async (envPath: string) => {
    // In real implementation, this would modify the .gitignore file
    console.log(`Adding ${envPath} to .gitignore`);
    
    toast({
      title: "Lagt til .gitignore",
      description: `${envPath} er lagt til i .gitignore`,
    });
  };

  const installPackage = async (envId: string, packageName: string) => {
    try {
      // Simulate package installation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPackage: PythonPackage = {
        name: packageName,
        version: '1.0.0',
        description: `Package: ${packageName}`,
        isRequired: false
      };

      setEnvironments(prev => prev.map(env => 
        env.id === envId 
          ? { ...env, packages: [...env.packages, newPackage] }
          : env
      ));

      toast({
        title: "Pakke installert",
        description: `${packageName} er installert i miljøet`,
      });

    } catch (error) {
      toast({
        title: "Installasjonsfeil",
        description: `Kunne ikke installere ${packageName}`,
        variant: "destructive",
      });
    }
  };

  const getEnvTypeIcon = (type: PythonEnvironment['type']) => {
    switch (type) {
      case 'poetry':
        return '🎭';
      case 'venv':
        return '🐍';
      case 'conda':
        return '🅰️';
      case 'pipenv':
        return '📦';
      default:
        return '🐍';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/40 max-w-7xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400 flex items-center gap-2">
            <Python className="h-5 w-5" />
            Python Environment Manager
          </DialogTitle>
          <DialogDescription className="text-cybergold-600">
            Administrer Python-miljøer med Poetry og automatisk .gitignore støtte
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-cyberdark-800 border-cybergold-500/30">
            <TabsTrigger value="environments" className="text-cybergold-300">Miljøer</TabsTrigger>
            <TabsTrigger value="create" className="text-cybergold-300">Opprett</TabsTrigger>
            <TabsTrigger value="settings" className="text-cybergold-300">Innstillinger</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="flex-1">
            <Card className="bg-cyberdark-800 border-cybergold-500/30">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Innstillinger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={autoGitignore}
                    onChange={(e) => setAutoGitignore(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <div>
                    <label className="text-sm font-medium text-cybergold-300">
                      Automatisk .gitignore for .venv mapper
                    </label>
                    <p className="text-xs text-cybergold-600">
                      Legger automatisk til nye .venv mapper i .gitignore
                    </p>
                  </div>
                </div>

                <div className="bg-cyberdark-700 p-4 rounded border border-cybergold-500/30">
                  <h4 className="text-sm font-medium text-cybergold-300 mb-2">Støttede miljøtyper:</h4>
                  <div className="space-y-2 text-sm text-cybergold-600">
                    <div className="flex items-center gap-2">
                      <span>🎭</span>
                      <span>Poetry - Anbefalt for avhengighetshåndtering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🐍</span>
                      <span>venv - Standard Python virtuelle miljøer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="flex-1">
            <Card className="bg-cyberdark-800 border-cybergold-500/30">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Opprett nytt Python-miljø
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cybergold-300 mb-2">
                    Miljønavn
                  </label>
                  <Input
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    placeholder="mitt-prosjekt"
                    className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cybergold-300 mb-2">
                    Miljøtype
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="poetry"
                        checked={newEnvType === 'poetry'}
                        onChange={(e) => setNewEnvType(e.target.value as 'poetry')}
                      />
                      <span className="text-cybergold-300">🎭 Poetry</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="venv"
                        checked={newEnvType === 'venv'}
                        onChange={(e) => setNewEnvType(e.target.value as 'venv')}
                      />
                      <span className="text-cybergold-300">🐍 venv</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={createEnvironment}
                  disabled={isCreating || !newEnvName.trim()}
                  className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Oppretter...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Opprett miljø
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environments" className="flex-1 flex gap-4">
            {/* Environment List */}
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cybergold-400">
                  Python-miljøer ({environments.length})
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab('create')}
                  className="border-cybergold-500/40"
                >
                  <FolderPlus className="h-4 w-4 mr-1" />
                  Opprett
                </Button>
              </div>

              <ScrollArea className="flex-1 bg-cyberdark-800 border border-cybergold-500/30 rounded">
                <div className="p-4 space-y-3">
                  {environments.length === 0 ? (
                    <div className="text-center text-cybergold-600 py-8">
                      <Python className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Ingen Python-miljøer funnet</p>
                      <p className="text-sm mt-2">Opprett ditt første miljø</p>
                    </div>
                  ) : (
                    environments.map((env) => (
                      <Card 
                        key={env.id}
                        className={`cursor-pointer transition-all ${
                          selectedEnv?.id === env.id 
                            ? 'bg-cyberdark-700 border-cybergold-500/60 ring-2 ring-cybergold-500/30' 
                            : 'bg-cyberdark-700 border-cybergold-500/20 hover:bg-cyberdark-600'
                        }`}
                        onClick={() => setSelectedEnv(env)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getEnvTypeIcon(env.type)}</span>
                              <span className="font-medium text-cybergold-300">{env.name}</span>
                              {env.isActive && (
                                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                                  Aktiv
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                              {env.type}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-xs text-cybergold-600">
                            <p>Python {env.pythonVersion}</p>
                            <p>{env.packages.length} pakker • {env.size}</p>
                            <p>Opprettet: {formatDate(env.createdAt)}</p>
                          </div>

                          <div className="flex gap-2 mt-3">
                            {!env.isActive && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  activateEnvironment(env);
                                }}
                                className="bg-green-600 hover:bg-green-500 text-xs"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Aktiver
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEnvironment(env);
                              }}
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Environment Details */}
            <div className="w-1/2 flex flex-col">
              {selectedEnv ? (
                <div className="flex-1 flex flex-col">
                  <Card className="bg-cyberdark-800 border-cybergold-500/30 mb-4">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <span className="text-lg">{getEnvTypeIcon(selectedEnv.type)}</span>
                        {selectedEnv.name}
                        {selectedEnv.isActive && (
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                            Aktiv
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-cybergold-600">Type:</span>
                          <span className="text-cybergold-300 ml-2">{selectedEnv.type}</span>
                        </div>
                        <div>
                          <span className="text-cybergold-600">Python:</span>
                          <span className="text-cybergold-300 ml-2">{selectedEnv.pythonVersion}</span>
                        </div>
                        <div>
                          <span className="text-cybergold-600">Størrelse:</span>
                          <span className="text-cybergold-300 ml-2">{selectedEnv.size}</span>
                        </div>
                        <div>
                          <span className="text-cybergold-600">Pakker:</span>
                          <span className="text-cybergold-300 ml-2">{selectedEnv.packages.length}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="text-cybergold-600 text-sm">Bane:</span>
                        <div className="bg-cyberdark-700 p-2 rounded border border-cybergold-500/20 mt-1">
                          <code className="text-xs text-cybergold-300 font-mono">{selectedEnv.path}</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyberdark-800 border-cybergold-500/30 flex-1">
                    <CardHeader>
                      <CardTitle className="text-cybergold-400 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Installerte pakker ({selectedEnv.packages.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {selectedEnv.packages.length === 0 ? (
                            <div className="text-center text-cybergold-600 py-4">
                              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Ingen pakker installert</p>
                            </div>
                          ) : (
                            selectedEnv.packages.map((pkg, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between p-2 bg-cyberdark-700 rounded border border-cybergold-500/20"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-cybergold-300">{pkg.name}</span>
                                    <span className="text-xs text-cybergold-600">v{pkg.version}</span>
                                    {pkg.isRequired && (
                                      <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                                        Påkrevd
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-cybergold-600">{pkg.description}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>

                      <div className="flex gap-2 mt-4">
                        <Input
                          placeholder="pakkenavn"
                          className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              installPackage(selectedEnv.id, e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Installer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-cybergold-600">
                    <Python className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Velg et Python-miljø</p>
                    <p className="text-sm mt-2">Klikk på et miljø fra listen for å se detaljer</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};