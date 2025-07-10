import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  ChatModeSelector,
  useChatMode,
  CustomInstructionsDialog,
  TerminalDialog,
  EditChatRequestDialog,
  GitHubIntegrationDialog,
  PythonEnvironmentManager,
  type ChatRequest
} from './index';
import { 
  Settings, 
  Terminal, 
  Github, 
  Python, 
  Edit3, 
  Code,
  Zap,
  MessageSquare,
  Bot,
  Command,
  Sparkles
} from 'lucide-react';

interface EnhancedChatInterfaceProps {
  onSendMessage?: (message: string, mode: string) => void;
  chatHistory?: ChatRequest[];
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  onSendMessage,
  chatHistory = []
}) => {
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { currentMode, changeMode } = useChatMode();
  
  // Dialog states
  const [showCustomInstructions, setShowCustomInstructions] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showEditChat, setShowEditChat] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [showPythonEnv, setShowPythonEnv] = useState(false);
  
  // Feature states
  const [activeInstruction, setActiveInstruction] = useState<any>(null);
  const [completionsSnoozeEnabled, setCompletionsSnoozeEnabled] = useState(false);
  const [middleClickScrollEnabled, setMiddleClickScrollEnabled] = useState(true);
  const [soundNotificationsEnabled, setSoundNotificationsEnabled] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedCompletionsSnooze = localStorage.getItem('completions_snooze_enabled');
    if (savedCompletionsSnooze !== null) {
      setCompletionsSnoozeEnabled(JSON.parse(savedCompletionsSnooze));
    }

    const savedMiddleClickScroll = localStorage.getItem('middle_click_scroll_enabled');
    if (savedMiddleClickScroll !== null) {
      setMiddleClickScrollEnabled(JSON.parse(savedMiddleClickScroll));
    }

    const savedSoundNotifications = localStorage.getItem('sound_notifications_enabled');
    if (savedSoundNotifications !== null) {
      setSoundNotificationsEnabled(JSON.parse(savedSoundNotifications));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('completions_snooze_enabled', JSON.stringify(completionsSnoozeEnabled));
  }, [completionsSnoozeEnabled]);

  useEffect(() => {
    localStorage.setItem('middle_click_scroll_enabled', JSON.stringify(middleClickScrollEnabled));
  }, [middleClickScrollEnabled]);

  useEffect(() => {
    localStorage.setItem('sound_notifications_enabled', JSON.stringify(soundNotificationsEnabled));
  }, [soundNotificationsEnabled]);

  const handleInstructionSelect = (instruction: any) => {
    setActiveInstruction(instruction);
    toast({
      title: "Tilpasset instruksjon aktivert",
      description: `Bruker instruksjon: ${instruction.name}`,
    });
  };

  const handleResubmitChat = (editedMessage: string, originalRequest: ChatRequest) => {
    if (onSendMessage) {
      onSendMessage(editedMessage, currentMode.id);
    }
    
    toast({
      title: "Melding sendt på nytt",
      description: "Din redigerte melding er sendt",
    });
  };

  const playNotificationSound = () => {
    if (soundNotificationsEnabled) {
      // In a real implementation, this would play an actual sound
      console.log('🔊 Notification sound played');
      toast({
        title: "Handlingsvarsel",
        description: "En handling krever din oppmerksomhet",
      });
    }
  };

  const toggleCompletionsSnooze = () => {
    setCompletionsSnoozeEnabled(!completionsSnoozeEnabled);
    toast({
      title: completionsSnoozeEnabled ? "Kodefullføring aktivert" : "Kodefullføring snoozet",
      description: completionsSnoozeEnabled 
        ? "Kodefullføring er nå aktivert" 
        : "Kodefullføring er midlertidig deaktivert for fokusert arbeid",
    });
  };

  return (
    <div className="min-h-screen bg-cyberdark-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-cyberdark-800 border-cybergold-500/40">
          <CardHeader>
            <CardTitle className="text-cybergold-400 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              SnakkaZ Chat - June 2025 Enhanced Edition
              <Badge variant="outline" className="text-xs text-cybergold-400 border-cybergold-400">
                v1.102
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ChatModeSelector
                  selectedMode={currentMode}
                  onModeChange={changeMode}
                />
                
                {activeInstruction && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    📝 {activeInstruction.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {completionsSnoozeEnabled && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    💤 Fullføring snoozet
                  </Badge>
                )}
                
                {isPremium && (
                  <Badge variant="outline" className="text-cybergold-400 border-cybergold-400">
                    ⭐ Premium
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chat Enhancements */}
          <Card className="bg-cyberdark-800 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-400 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={() => setShowCustomInstructions(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Tilpassede instruksjoner
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={() => setShowEditChat(true)}
                disabled={chatHistory.length === 0}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Rediger og send på nytt
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={playNotificationSound}
              >
                <Zap className="h-4 w-4 mr-2" />
                Test handlingsvarsel
              </Button>
            </CardContent>
          </Card>

          {/* Development Tools */}
          <Card className="bg-cyberdark-800 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-400 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Development Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={() => setShowTerminal(true)}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Terminal Commands
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={() => setShowGitHub(true)}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub Integration
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-cybergold-500/40"
                onClick={() => setShowPythonEnv(true)}
              >
                <Python className="h-4 w-4 mr-2" />
                Python Environment
              </Button>
            </CardContent>
          </Card>

          {/* Editor Features */}
          <Card className="bg-cyberdark-800 border-cybergold-500/30">
            <CardHeader>
              <CardTitle className="text-cybergold-400 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Editor Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cybergold-300">Snooze completions</span>
                <Button
                  size="sm"
                  variant={completionsSnoozeEnabled ? "default" : "outline"}
                  onClick={toggleCompletionsSnooze}
                  className={completionsSnoozeEnabled 
                    ? "bg-yellow-600 text-black hover:bg-yellow-500" 
                    : "border-cybergold-500/40"
                  }
                >
                  {completionsSnoozeEnabled ? '💤 ON' : '⚡ OFF'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-cybergold-300">Middle-click scroll</span>
                <Button
                  size="sm"
                  variant={middleClickScrollEnabled ? "default" : "outline"}
                  onClick={() => setMiddleClickScrollEnabled(!middleClickScrollEnabled)}
                  className={middleClickScrollEnabled 
                    ? "bg-green-600 text-black hover:bg-green-500" 
                    : "border-cybergold-500/40"
                  }
                >
                  {middleClickScrollEnabled ? '✓ ON' : '✗ OFF'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-cybergold-300">Sound notifications</span>
                <Button
                  size="sm"
                  variant={soundNotificationsEnabled ? "default" : "outline"}
                  onClick={() => setSoundNotificationsEnabled(!soundNotificationsEnabled)}
                  className={soundNotificationsEnabled 
                    ? "bg-blue-600 text-black hover:bg-blue-500" 
                    : "border-cybergold-500/40"
                  }
                >
                  {soundNotificationsEnabled ? '🔊 ON' : '🔇 OFF'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Status */}
        <Card className="bg-cyberdark-800 border-cybergold-500/30">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Feature Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">MCP Support - Tilgjengelig</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Custom Instructions - Aktivt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Terminal Auto-approval - Aktivt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">GitHub Integration - Tilgjengelig</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Python Support - Aktivt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Edit & Resubmit - Aktivt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Chat Modes - Aktivt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-cybergold-300">Sound Notifications - Aktivt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CustomInstructionsDialog
        isOpen={showCustomInstructions}
        onClose={() => setShowCustomInstructions(false)}
        onInstructionSelect={handleInstructionSelect}
      />

      <TerminalDialog
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
      />

      <EditChatRequestDialog
        isOpen={showEditChat}
        onClose={() => setShowEditChat(false)}
        onResubmit={handleResubmitChat}
        chatHistory={chatHistory}
      />

      <GitHubIntegrationDialog
        isOpen={showGitHub}
        onClose={() => setShowGitHub(false)}
      />

      <PythonEnvironmentManager
        isOpen={showPythonEnv}
        onClose={() => setShowPythonEnv(false)}
      />
    </div>
  );
};