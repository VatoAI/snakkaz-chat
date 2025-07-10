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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Github, 
  GitPullRequest, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Code,
  FileText,
  Plus,
  Minus,
  Bot,
  Settings,
  ExternalLink,
  Refresh
} from 'lucide-react';

interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  branch: string;
  targetBranch: string;
  createdAt: Date;
  updatedAt: Date;
  commits: number;
  additions: number;
  deletions: number;
  files: string[];
  reviewStatus: 'pending' | 'approved' | 'requested_changes' | 'dismissed';
  url: string;
}

interface GitHubIntegrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubIntegrationDialog: React.FC<GitHubIntegrationDialogProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [githubToken, setGithubToken] = useState('');
  const [repository, setRepository] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('prs');

  // Mock data for demonstration
  const mockPRs: PullRequest[] = [
    {
      id: '1',
      number: 123,
      title: 'Add new chat features and MCP integration',
      description: 'This PR adds several new chat features including custom instructions, chat modes, and enhanced MCP support.',
      author: 'developer',
      status: 'open',
      branch: 'feature/chat-enhancements',
      targetBranch: 'main',
      createdAt: new Date('2025-07-10T10:00:00Z'),
      updatedAt: new Date('2025-07-10T14:30:00Z'),
      commits: 8,
      additions: 450,
      deletions: 32,
      files: ['src/features/chat/components/CustomInstructionsDialog.tsx', 'src/features/chat/components/ChatModeSelector.tsx'],
      reviewStatus: 'pending',
      url: 'https://github.com/VatoAI/snakkaz-chat/pull/123'
    },
    {
      id: '2',
      number: 122,
      title: 'Fix terminal command execution',
      description: 'Fixes issues with terminal command auto-approval and adds better error handling.',
      author: 'contributor',
      status: 'open',
      branch: 'fix/terminal-commands',
      targetBranch: 'main',
      createdAt: new Date('2025-07-09T16:00:00Z'),
      updatedAt: new Date('2025-07-10T09:15:00Z'),
      commits: 3,
      additions: 120,
      deletions: 15,
      files: ['src/features/chat/components/TerminalDialog.tsx'],
      reviewStatus: 'requested_changes',
      url: 'https://github.com/VatoAI/snakkaz-chat/pull/122'
    }
  ];

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    const savedRepo = localStorage.getItem('github_repository');
    
    if (savedToken && savedRepo) {
      setGithubToken(savedToken);
      setRepository(savedRepo);
      setIsConnected(true);
      setPullRequests(mockPRs); // In real implementation, fetch from GitHub API
    }
  }, []);

  const handleConnect = async () => {
    if (!githubToken || !repository) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn GitHub token og repository",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In real implementation, validate token and fetch data from GitHub API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('github_token', githubToken);
      localStorage.setItem('github_repository', repository);
      
      setIsConnected(true);
      setPullRequests(mockPRs);
      
      toast({
        title: "Tilkobling vellykket",
        description: `Koblet til ${repository}`,
      });
    } catch (error) {
      toast({
        title: "Tilkoblingsfeil",
        description: "Kunne ikke koble til GitHub",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_repository');
    setIsConnected(false);
    setGithubToken('');
    setRepository('');
    setPullRequests([]);
    setSelectedPR(null);
    
    toast({
      title: "Frakoblet",
      description: "GitHub-tilkobling fjernet",
    });
  };

  const refreshPRs = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      // In real implementation, fetch fresh data from GitHub API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPullRequests(mockPRs);
      
      toast({
        title: "Oppdatert",
        description: "Pull requests er oppdatert",
      });
    } catch (error) {
      toast({
        title: "Oppdateringsfeil",
        description: "Kunne ikke oppdatere pull requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIReview = async (pr: PullRequest) => {
    toast({
      title: "AI-gjennomgang startet",
      description: `Genererer AI-gjennomgang for PR #${pr.number}`,
    });

    // In real implementation, call AI service to review the PR
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "AI-gjennomgang fullført",
      description: "AI-gjennomgang er lagt til PR-kommentarene",
    });
  };

  const getStatusIcon = (status: PullRequest['status']) => {
    switch (status) {
      case 'open':
        return <GitPullRequest className="h-4 w-4 text-green-400" />;
      case 'merged':
        return <CheckCircle className="h-4 w-4 text-purple-400" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getReviewStatusColor = (status: PullRequest['reviewStatus']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'requested_changes':
        return 'bg-red-500';
      case 'dismissed':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('no-NO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/40 max-w-7xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400 flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
          </DialogTitle>
          <DialogDescription className="text-cybergold-600">
            Administrer pull requests og få AI-assistert kodegjennomgang
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-cyberdark-800 border-cybergold-500/30">
            <TabsTrigger value="prs" className="text-cybergold-300">Pull Requests</TabsTrigger>
            <TabsTrigger value="settings" className="text-cybergold-300">Innstillinger</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="flex-1">
            <Card className="bg-cyberdark-800 border-cybergold-500/30">
              <CardHeader>
                <CardTitle className="text-cybergold-400 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  GitHub-tilkobling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-cybergold-300 mb-2">
                        GitHub Token
                      </label>
                      <Input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxx"
                        className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300"
                      />
                      <p className="text-xs text-cybergold-600 mt-1">
                        Opprett en Personal Access Token på GitHub med 'repo' tillatelser
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cybergold-300 mb-2">
                        Repository
                      </label>
                      <Input
                        value={repository}
                        onChange={(e) => setRepository(e.target.value)}
                        placeholder="owner/repository-name"
                        className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300"
                      />
                      <p className="text-xs text-cybergold-600 mt-1">
                        Format: owner/repository-name (f.eks. VatoAI/snakkaz-chat)
                      </p>
                    </div>

                    <Button
                      onClick={handleConnect}
                      disabled={isLoading || !githubToken || !repository}
                      className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                    >
                      {isLoading ? 'Kobler til...' : 'Koble til GitHub'}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-cyberdark-700 rounded border border-cybergold-500/30">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-cybergold-300 font-medium">Tilkoblet til GitHub</span>
                        </div>
                        <p className="text-sm text-cybergold-600 mt-1">Repository: {repository}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleDisconnect}
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                      >
                        Koble fra
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-cyberdark-700 border-cybergold-500/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <GitPullRequest className="h-8 w-8 mx-auto mb-2 text-cybergold-400" />
                            <p className="text-lg font-semibold text-cybergold-300">{pullRequests.length}</p>
                            <p className="text-sm text-cybergold-600">Pull Requests</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-cyberdark-700 border-cybergold-500/20">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Bot className="h-8 w-8 mx-auto mb-2 text-cybergold-400" />
                            <p className="text-lg font-semibold text-cybergold-300">AI</p>
                            <p className="text-sm text-cybergold-600">Aktivert</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prs" className="flex-1 flex gap-4">
            {!isConnected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-cybergold-600">
                  <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ikke tilkoblet GitHub</p>
                  <p className="text-sm mt-2">Gå til Innstillinger for å koble til</p>
                </div>
              </div>
            ) : (
              <>
                {/* PR List */}
                <div className="w-1/2 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-cybergold-400">
                      Pull Requests ({pullRequests.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refreshPRs}
                      disabled={isLoading}
                      className="border-cybergold-500/40"
                    >
                      <Refresh className="h-4 w-4 mr-1" />
                      Oppdater
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 bg-cyberdark-800 border border-cybergold-500/30 rounded">
                    <div className="p-4 space-y-3">
                      {pullRequests.map((pr) => (
                        <Card 
                          key={pr.id}
                          className={`cursor-pointer transition-all ${
                            selectedPR?.id === pr.id 
                              ? 'bg-cyberdark-700 border-cybergold-500/60 ring-2 ring-cybergold-500/30' 
                              : 'bg-cyberdark-700 border-cybergold-500/20 hover:bg-cyberdark-600'
                          }`}
                          onClick={() => setSelectedPR(pr)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(pr.status)}
                                <span className="font-medium text-cybergold-300">#{pr.number}</span>
                                <div className={`w-2 h-2 rounded-full ${getReviewStatusColor(pr.reviewStatus)}`} />
                              </div>
                              <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                                {pr.status}
                              </Badge>
                            </div>

                            <h4 className="text-sm font-medium text-cybergold-300 mb-1 line-clamp-2">
                              {pr.title}
                            </h4>

                            <p className="text-xs text-cybergold-600 mb-3 line-clamp-2">
                              {pr.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-cybergold-600">
                              <span>av {pr.author}</span>
                              <span>{formatDate(pr.updatedAt)}</span>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-xs text-cybergold-600">
                              <span className="flex items-center gap-1">
                                <Plus className="h-3 w-3 text-green-400" />
                                {pr.additions}
                              </span>
                              <span className="flex items-center gap-1">
                                <Minus className="h-3 w-3 text-red-400" />
                                {pr.deletions}
                              </span>
                              <span>{pr.commits} commits</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* PR Details */}
                <div className="w-1/2 flex flex-col">
                  {selectedPR ? (
                    <div className="flex-1 flex flex-col">
                      <Card className="bg-cyberdark-800 border-cybergold-500/30 mb-4">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-cybergold-400 flex items-center gap-2">
                              {getStatusIcon(selectedPR.status)}
                              #{selectedPR.number} - {selectedPR.title}
                            </CardTitle>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(selectedPR.url, '_blank')}
                              className="border-cybergold-500/40"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              GitHub
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-cyberdark-700 p-3 rounded border border-cybergold-500/20">
                              <p className="text-sm text-cybergold-300 whitespace-pre-wrap">
                                {selectedPR.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-cybergold-600">Branch:</span>
                                <span className="text-cybergold-300 ml-2">{selectedPR.branch}</span>
                              </div>
                              <div>
                                <span className="text-cybergold-600">Target:</span>
                                <span className="text-cybergold-300 ml-2">{selectedPR.targetBranch}</span>
                              </div>
                              <div>
                                <span className="text-cybergold-600">Forfatter:</span>
                                <span className="text-cybergold-300 ml-2">{selectedPR.author}</span>
                              </div>
                              <div>
                                <span className="text-cybergold-600">Status:</span>
                                <Badge variant="outline" className="ml-2 text-xs text-cybergold-400 border-cybergold-400">
                                  {selectedPR.reviewStatus}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => generateAIReview(selectedPR)}
                                className="bg-cybergold-600 text-black hover:bg-cybergold-500"
                              >
                                <Bot className="h-3 w-3 mr-1" />
                                AI-gjennomgang
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cybergold-500/40"
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Kommentarer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-cyberdark-800 border-cybergold-500/30 flex-1">
                        <CardHeader>
                          <CardTitle className="text-cybergold-400 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Endrede filer ({selectedPR.files.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-48">
                            <div className="space-y-2">
                              {selectedPR.files.map((file, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-cyberdark-700 rounded border border-cybergold-500/20"
                                >
                                  <Code className="h-4 w-4 text-cybergold-400" />
                                  <span className="text-sm text-cybergold-300 font-mono">{file}</span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-cybergold-600">
                        <GitPullRequest className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Velg en pull request</p>
                        <p className="text-sm mt-2">Klikk på en PR fra listen for å se detaljer</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};