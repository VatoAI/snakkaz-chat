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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Terminal, 
  Play, 
  Square, 
  Copy, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  History,
  Settings,
  Trash2
} from 'lucide-react';

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  status: 'running' | 'completed' | 'error' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  workingDirectory: string;
  autoApproved: boolean;
}

interface TerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommand?: string;
}

const SAFE_COMMANDS = [
  'ls', 'dir', 'pwd', 'whoami', 'date', 'uptime', 'ps',
  'npm', 'yarn', 'git status', 'git log', 'git branch',
  'node --version', 'npm --version', 'python --version',
  'cat', 'head', 'tail', 'grep', 'find', 'which'
];

export const TerminalDialog: React.FC<TerminalDialogProps> = ({
  isOpen,
  onClose,
  initialCommand = ''
}) => {
  const { toast } = useToast();
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState(initialCommand);
  const [workingDirectory, setWorkingDirectory] = useState('/workspace');
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load settings and history from localStorage
  useEffect(() => {
    const savedAutoApproval = localStorage.getItem('terminal_auto_approval');
    if (savedAutoApproval !== null) {
      setAutoApprovalEnabled(JSON.parse(savedAutoApproval));
    }

    const savedHistory = localStorage.getItem('terminal_command_history');
    if (savedHistory) {
      try {
        setCommandHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing command history:', error);
      }
    }

    const savedWorkingDir = localStorage.getItem('terminal_working_directory');
    if (savedWorkingDir) {
      setWorkingDirectory(savedWorkingDir);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('terminal_auto_approval', JSON.stringify(autoApprovalEnabled));
  }, [autoApprovalEnabled]);

  useEffect(() => {
    localStorage.setItem('terminal_working_directory', workingDirectory);
  }, [workingDirectory]);

  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('terminal_command_history', JSON.stringify(commandHistory.slice(-50))); // Keep last 50 commands
    }
  }, [commandHistory]);

  const isCommandSafe = (command: string): boolean => {
    const cmd = command.trim().toLowerCase();
    return SAFE_COMMANDS.some(safe => cmd.startsWith(safe));
  };

  const executeCommand = async (command: string, autoApproved: boolean = false) => {
    if (!command.trim()) return;

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: command.trim(),
      output: '',
      status: 'running',
      startTime: new Date(),
      workingDirectory,
      autoApproved
    };

    setCommands(prev => [...prev, newCommand]);
    
    // Add to command history
    if (!commandHistory.includes(command.trim())) {
      setCommandHistory(prev => [...prev, command.trim()]);
    }

    // Simulate command execution (in a real implementation, this would call a backend API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate different outputs based on command
      let output = '';
      const cmd = command.toLowerCase();
      
      if (cmd.includes('ls') || cmd.includes('dir')) {
        output = 'package.json\nsrc/\ndist/\nnode_modules/\n.gitignore\nREADME.md';
      } else if (cmd.includes('pwd')) {
        output = workingDirectory;
      } else if (cmd.includes('git status')) {
        output = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean';
      } else if (cmd.includes('npm --version')) {
        output = '10.2.4';
      } else if (cmd.includes('node --version')) {
        output = 'v18.17.0';
      } else if (cmd.includes('whoami')) {
        output = 'snakkaz-user';
      } else {
        output = `Command executed: ${command}\nOutput: [Simulated output for demonstration]`;
      }

      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { 
              ...cmd, 
              output, 
              status: 'completed' as const, 
              endTime: new Date() 
            }
          : cmd
      ));

      toast({
        title: "Kommando utført",
        description: `"${command}" ble utført vellykket`,
      });

    } catch (error) {
      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { 
              ...cmd, 
              output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              status: 'error' as const, 
              endTime: new Date() 
            }
          : cmd
      ));

      toast({
        title: "Kommandofeil",
        description: `Feil ved utføring av "${command}"`,
        variant: "destructive",
      });
    }
  };

  const handleSubmitCommand = () => {
    if (!currentCommand.trim()) return;

    const isSafe = isCommandSafe(currentCommand);
    const shouldAutoApprove = autoApprovalEnabled && isSafe;

    if (shouldAutoApprove) {
      executeCommand(currentCommand, true);
      setCurrentCommand('');
      setHistoryIndex(-1);
    } else {
      // Show confirmation dialog for potentially unsafe commands
      if (window.confirm(`Er du sikker på at du vil utføre: "${currentCommand}"?`)) {
        executeCommand(currentCommand, false);
        setCurrentCommand('');
        setHistoryIndex(-1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: "Tekst kopiert til utklippstavlen",
    });
  };

  const clearHistory = () => {
    setCommands([]);
    toast({
      title: "Historikk tømt",
      description: "Terminalhistorikk er slettet",
    });
  };

  const getStatusIcon = (status: TerminalCommand['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/40 max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-cybergold-400 flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            SnakkaZ Terminal
          </DialogTitle>
          <DialogDescription className="text-cybergold-600">
            Utfør kommandoer med auto-godkjenning for sikre operasjoner
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Terminal Controls */}
          <div className="flex items-center justify-between bg-cyberdark-800 p-3 rounded border border-cybergold-500/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-cybergold-400" />
                <span className="text-sm text-cybergold-300">Arbeidsområde:</span>
                <Input
                  value={workingDirectory}
                  onChange={(e) => setWorkingDirectory(e.target.value)}
                  className="bg-cyberdark-700 border-cybergold-500/40 text-cybergold-300 text-sm w-48"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoApprovalEnabled}
                  onChange={(e) => setAutoApprovalEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-cybergold-300">Auto-godkjenning</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clearHistory}
                className="border-cybergold-500/40"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Tøm historikk
              </Button>
            </div>
          </div>

          {/* Command Input */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-cyberdark-800 border border-cybergold-500/30 rounded">
              <span className="px-3 text-cybergold-400 font-mono">$</span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skriv kommando..."
                className="bg-transparent border-0 text-cybergold-300 font-mono focus:ring-0"
              />
            </div>
            <Button
              onClick={handleSubmitCommand}
              disabled={!currentCommand.trim()}
              className="bg-cybergold-600 text-black hover:bg-cybergold-500"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>

          {/* Command Output */}
          <ScrollArea className="flex-1 bg-cyberdark-800 border border-cybergold-500/30 rounded">
            <div className="p-4 space-y-4">
              {commands.length === 0 ? (
                <div className="text-center text-cybergold-600 py-8">
                  <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ingen kommandoer utført ennå</p>
                  <p className="text-sm mt-2">Skriv en kommando for å komme i gang</p>
                </div>
              ) : (
                commands.map((cmd) => (
                  <Card key={cmd.id} className="bg-cyberdark-700 border-cybergold-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(cmd.status)}
                          <span className="font-mono text-cybergold-300">$ {cmd.command}</span>
                          {cmd.autoApproved && (
                            <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                              Auto-godkjent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(cmd.command)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-cybergold-600">
                            {cmd.startTime.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {cmd.output && (
                        <div className="bg-black/30 p-3 rounded border border-cybergold-500/20 mt-2">
                          <pre className="text-sm text-cybergold-200 whitespace-pre-wrap font-mono">
                            {cmd.output}
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 text-xs text-cybergold-600">
                        <span>Arbeidsområde: {cmd.workingDirectory}</span>
                        {cmd.endTime && (
                          <span>
                            Varighet: {Math.round((cmd.endTime.getTime() - cmd.startTime.getTime()) / 1000)}s
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Command History Indicator */}
          {commandHistory.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-cybergold-600">
              <History className="h-3 w-3" />
              <span>{commandHistory.length} kommandoer i historikk</span>
              <span>• Bruk ↑/↓ for å navigere</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};