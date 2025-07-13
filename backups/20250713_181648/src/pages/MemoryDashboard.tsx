import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  Trash2, 
  Plus,
  TrendingUp,
  Clock,
  Star,
  Database,
  Settings,
  Users,
  BarChart3,
  Filter
} from 'lucide-react';
import { 
  memoryService, 
  MemoryEntry, 
  MemoryType, 
  MemoryStats,
  AdminMemoryOverview 
} from '@/services/ai/memoryService';

const MemoryDashboard: React.FC = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  // State
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [adminOverview, setAdminOverview] = useState<AdminMemoryOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('memories');
  
  // New memory form
  const [newMemory, setNewMemory] = useState({
    type: 'user_preference' as MemoryType,
    key: '',
    value: '',
    context: ''
  });

  const memoryTypes: { value: MemoryType; label: string; color: string }[] = [
    { value: 'user_preference', label: 'Brukerpreferanse', color: 'bg-blue-500' },
    { value: 'conversation_context', label: 'Samtale-kontekst', color: 'bg-green-500' },
    { value: 'learned_fact', label: 'Lært faktum', color: 'bg-purple-500' },
    { value: 'emotional_state', label: 'Følelsestilstand', color: 'bg-pink-500' },
    { value: 'task_context', label: 'Oppgave-kontekst', color: 'bg-orange-500' },
    { value: 'user_relationship', label: 'Brukerforhold', color: 'bg-red-500' },
    { value: 'interaction_pattern', label: 'Interaksjonsmønster', color: 'bg-indigo-500' }
  ];

  const getTypeInfo = (type: MemoryType) => {
    return memoryTypes.find(t => t.value === type) || memoryTypes[0];
  };

  // Load data functions with useCallback
  const loadMemories = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const memoryTypes = selectedType === 'all' ? undefined : [selectedType];
      const result = await memoryService.retrieveMemories(
        user.id,
        searchQuery || undefined,
        { memoryTypes, limit: 50 }
      );
      setMemories(result);
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke laste minner",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedType, searchQuery, toast]);

  const loadStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const result = await memoryService.analyzeMemoryPatterns(user.id);
      setStats(result);
    } catch (error) {
      console.error('Feil ved lasting av statistikk:', error);
    }
  }, [user]);

  const loadAdminOverview = useCallback(async () => {
    try {
      const result = await memoryService.getAdminOverview();
      setAdminOverview(result);
    } catch (error) {
      console.error('Feil ved lasting av admin oversikt:', error);
    }
  }, []);

  // Load data
  useEffect(() => {
    if (user) {
      loadMemories();
      loadStats();
      if (isPremium) {
        loadAdminOverview();
      }
    }
  }, [user, isPremium, loadMemories, loadStats, loadAdminOverview]);

  const handleCreateMemory = async () => {
    if (!user || !newMemory.key || !newMemory.value) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut nøkkel og verdi",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await memoryService.storeMemory(
        user.id,
        newMemory.type,
        newMemory.key,
        newMemory.value,
        {
          context: newMemory.context,
          source: 'manual_dashboard'
        }
      );

      if (result.success) {
        toast({
          title: "Minne lagret",
          description: `Minne ID: ${result.memory_id || 'Ukjent'}`
        });
        
        setNewMemory({
          type: 'user_preference',
          key: '',
          value: '',
          context: ''
        });
        
        loadMemories();
        loadStats();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke lagre minne",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMemory = async (key: string) => {
    if (!user) return;

    try {
      const result = await memoryService.forgetMemories(user.id, { key });
      
      if (result.success) {
        toast({
          title: "Minne slettet",
          description: `${result.deleted_count} minne(r) ble slettet`
        });
        loadMemories();
        loadStats();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette minne",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nb-NO');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center">
        <Card className="bg-cyberdark-900 border-cyberdark-700">
          <CardContent className="p-6">
            <p className="text-cybergold-400">Du må være logget inn for å bruke minnesystemet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300">
      {/* Header */}
      <header className="bg-cyberdark-900 border-b border-cyberdark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-cybergold-400" />
            <div>
              <h1 className="text-2xl font-bold text-cybergold-400">Minnesjstem</h1>
              <p className="text-cybergold-600">AI-drevet langtidsminne for personalisering</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-black">
              {memories.length} Minner
            </Badge>
            {isPremium && (
              <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
                Admin Tilgang
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl py-8 px-6">
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cybergold-400" />
                  <div>
                    <p className="text-sm text-cybergold-600">Totale Minner</p>
                    <p className="text-2xl font-bold text-cybergold-400">{stats.total_memories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-cybergold-600">Gj.snitt Viktighet</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {(stats.avg_importance * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-cybergold-600">Maks Tilgang</p>
                    <p className="text-2xl font-bold text-green-400">{stats.max_access_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-cybergold-600">Minnetyper</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.unique_types}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-cyberdark-800">
            <TabsTrigger 
              value="memories" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              <Database className="h-4 w-4 mr-2" />
              Minner
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analyse
            </TabsTrigger>
            {isPremium && (
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
              >
                <Users className="h-4 w-4 mr-2" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="memories">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-cybergold-600" />
                        <Input
                          placeholder="Søk i minner..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-cyberdark-800 border-cyberdark-700"
                        />
                      </div>
                    </div>
                    <div className="w-48">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as MemoryType | 'all')}
                        className="w-full p-2 bg-cyberdark-800 border border-cyberdark-700 rounded text-cybergold-300"
                      >
                        <option value="all">Alle typer</option>
                        {memoryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button 
                      onClick={loadMemories}
                      className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                      disabled={isLoading}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Søk
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Memory List */}
              <div className="space-y-4">
                {memories.map((memory) => {
                  const typeInfo = getTypeInfo(memory.memory_type);
                  return (
                    <Card key={memory.id} className="bg-cyberdark-900 border-cyberdark-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${typeInfo.color}`} />
                            <div>
                              <h3 className="font-medium text-cybergold-400">{memory.key}</h3>
                              <Badge variant="outline" className="mt-1 border-current text-xs">
                                {typeInfo.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="text-right text-sm">
                              <p className="text-cybergold-600">Viktighet</p>
                              <p className="text-cybergold-400 font-mono">
                                {(memory.importance * 100).toFixed(0)}%
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteMemory(memory.key)}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-cybergold-300 mb-4">{memory.value}</p>
                        
                        {memory.context && (
                          <div className="mb-4">
                            <p className="text-cybergold-600 text-sm mb-1">Kontekst</p>
                            <p className="text-cybergold-400 text-sm">{memory.context}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-cybergold-600">Tilgang</p>
                            <p className="text-cybergold-300">{memory.access_count}x</p>
                          </div>
                          <div>
                            <p className="text-cybergold-600">Opprettet</p>
                            <p className="text-cybergold-300">{formatDate(memory.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-cybergold-600">Sist brukt</p>
                            <p className="text-cybergold-300">{formatDate(memory.last_accessed)}</p>
                          </div>
                          <div>
                            <p className="text-cybergold-600">Kilde</p>
                            <p className="text-cybergold-300">{memory.source || 'Ukjent'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {memories.length === 0 && !isLoading && (
                  <Card className="bg-cyberdark-900 border-cyberdark-700">
                    <CardContent className="p-8 text-center">
                      <Brain className="h-12 w-12 text-cybergold-600 mx-auto mb-4" />
                      <p className="text-cybergold-400">Ingen minner funnet</p>
                      <p className="text-cybergold-600 text-sm mt-2">
                        Prøv å endre søkekriterier eller opprett ditt første minne.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Opprett Nytt Minne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type">Minnetype</Label>
                  <select
                    value={newMemory.type}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, type: e.target.value as MemoryType }))}
                    className="w-full p-2 mt-1 bg-cyberdark-800 border border-cyberdark-700 rounded text-cybergold-300"
                  >
                    {memoryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="key">Nøkkel</Label>
                  <Input
                    id="key"
                    placeholder="f.eks. 'favoritt_farge' eller 'musikk_preferanse'"
                    value={newMemory.key}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, key: e.target.value }))}
                    className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                  />
                </div>
                
                <div>
                  <Label htmlFor="value">Verdi</Label>
                  <Textarea
                    id="value"
                    placeholder="Skriv minneinnholdet her..."
                    value={newMemory.value}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, value: e.target.value }))}
                    className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="context">Kontekst (valgfritt)</Label>
                  <Input
                    id="context"
                    placeholder="f.eks. 'Fra samtale om musikk'"
                    value={newMemory.context}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, context: e.target.value }))}
                    className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateMemory}
                  className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Lagre Minne
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {stats && (
              <div className="space-y-6">
                {/* Type Distribution */}
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400">Minnefordeling etter Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.type_distribution.map((type) => {
                        const typeInfo = getTypeInfo(type.memory_type as MemoryType);
                        const percentage = (type.count / stats.total_memories) * 100;
                        
                        return (
                          <div key={type.memory_type} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${typeInfo.color}`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-cybergold-300">{typeInfo.label}</span>
                                <span className="text-cybergold-400 text-sm">{type.count}</span>
                              </div>
                              <div className="w-full bg-cyberdark-800 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${typeInfo.color} opacity-70`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {isPremium && adminOverview && (
            <TabsContent value="admin">
              <div className="space-y-6">
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400">Admin Oversikt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-cybergold-600 text-sm">Totale Brukere</p>
                        <p className="text-2xl font-bold text-cybergold-400">
                          {adminOverview.total_statistics.total_users}
                        </p>
                      </div>
                      <div>
                        <p className="text-cybergold-600 text-sm">Totale Minner</p>
                        <p className="text-2xl font-bold text-cybergold-400">
                          {adminOverview.total_statistics.total_memories}
                        </p>
                      </div>
                      <div>
                        <p className="text-cybergold-600 text-sm">Total Størrelse</p>
                        <p className="text-2xl font-bold text-cybergold-400">
                          {(adminOverview.total_statistics.total_size_bytes / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <div>
                        <p className="text-cybergold-600 text-sm">Gj.snitt Viktighet</p>
                        <p className="text-2xl font-bold text-cybergold-400">
                          {(adminOverview.total_statistics.avg_importance * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Users */}
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                  <CardHeader>
                    <CardTitle className="text-cybergold-400">Top Brukere (Minnebruk)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {adminOverview.top_users.slice(0, 10).map((user, index) => (
                        <div key={user.user_id} className="flex items-center justify-between p-3 bg-cyberdark-800 rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
                              #{index + 1}
                            </Badge>
                            <span className="text-cybergold-300 font-mono">{user.user_id.slice(0, 8)}...</span>
                          </div>
                          <div className="text-right">
                            <p className="text-cybergold-400">{user.total_memories} minner</p>
                            <p className="text-cybergold-600 text-sm">
                              {(user.total_size_bytes / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default MemoryDashboard;
