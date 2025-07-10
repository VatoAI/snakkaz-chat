import React from 'react';
import { EnhancedChatInterface } from '@/features/chat/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';

// Mock chat history for demonstration
const mockChatHistory = [
  {
    id: '1',
    message: 'Can you help me with Python environment setup?',
    response: 'I can help you set up a Python environment using Poetry or venv. Poetry is recommended for dependency management.',
    timestamp: new Date('2025-07-10T10:00:00Z'),
    mode: 'coding',
    model: 'claude-3-sonnet',
    tokens: 156,
    status: 'completed' as const
  },
  {
    id: '2',
    message: 'How do I create a custom instruction for code reviews?',
    response: 'You can create custom instructions by going to the chat settings and defining specific prompts for different tasks like code reviews.',
    timestamp: new Date('2025-07-10T11:30:00Z'),
    mode: 'general',
    model: 'claude-3-sonnet',
    tokens: 243,
    status: 'completed' as const
  },
  {
    id: '3',
    message: 'What terminal commands are safe to auto-approve?',
    response: 'Safe commands include ls, pwd, git status, npm --version, and other read-only operations. Write operations require manual approval.',
    timestamp: new Date('2025-07-10T14:15:00Z'),
    mode: 'coding',
    model: 'claude-3-sonnet',
    tokens: 189,
    status: 'completed' as const
  }
];

const June2025ReleasePage: React.FC = () => {
  const handleSendMessage = (message: string, mode: string) => {
    console.log(`Sending message in ${mode} mode:`, message);
    // In a real implementation, this would send the message to the AI service
  };

  return (
    <div className="min-h-screen bg-cyberdark-900">
      {/* Release Header */}
      <div className="bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 border-b border-cybergold-500/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cybergold-400 flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                June 2025 Release
                <Badge variant="outline" className="text-lg px-3 py-1 text-cybergold-400 border-cybergold-400">
                  v1.102
                </Badge>
              </h1>
              <p className="text-cybergold-600 mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Released: July 9, 2025
              </p>
            </div>
            <div className="text-right">
              <p className="text-cybergold-300 font-medium">SnakkaZ Chat Enhanced Edition</p>
              <p className="text-cybergold-600 text-sm">Norwegian Tech Community Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-cyberdark-800 border-cybergold-500/40 mb-6">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="text-cybergold-300 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Chat Enhancements
                </h3>
                <ul className="text-sm text-cybergold-600 space-y-1">
                  <li>• Custom instructions for AI interactions</li>
                  <li>• Multiple chat modes for tailored tasks</li>
                  <li>• Auto-approve terminal commands</li>
                  <li>• Edit and resubmit previous requests</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-cybergold-300 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Development Tools
                </h3>
                <ul className="text-sm text-cybergold-600 space-y-1">
                  <li>• Enhanced MCP server management</li>
                  <li>• GitHub PR integration with AI review</li>
                  <li>• Python environment with Poetry support</li>
                  <li>• Terminal command execution</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-cybergold-300 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  User Experience
                </h3>
                <ul className="text-sm text-cybergold-600 space-y-1">
                  <li>• Snooze code completions for focus</li>
                  <li>• Middle-click scroll support</li>
                  <li>• Sound notifications for actions</li>
                  <li>• Enhanced accessibility features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card className="bg-cyberdark-800 border-cybergold-500/40 mb-6">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Interactive Feature Demo</CardTitle>
            <p className="text-cybergold-600">
              Explore the new features introduced in this release. Click on different buttons to test functionality.
            </p>
          </CardHeader>
          <CardContent>
            <EnhancedChatInterface
              onSendMessage={handleSendMessage}
              chatHistory={mockChatHistory}
            />
          </CardContent>
        </Card>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-cyberdark-800 border-cybergold-500/40">
            <CardHeader>
              <CardTitle className="text-cybergold-400">Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-cybergold-300 font-medium mb-2">Architecture</h4>
                <ul className="text-sm text-cybergold-600 space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Modular component architecture</li>
                  <li>• LocalStorage for user preferences</li>
                  <li>• Responsive design with Tailwind CSS</li>
                </ul>
              </div>

              <div>
                <h4 className="text-cybergold-300 font-medium mb-2">Security</h4>
                <ul className="text-sm text-cybergold-600 space-y-1">
                  <li>• End-to-end encryption maintained</li>
                  <li>• Safe command validation</li>
                  <li>• Secure GitHub token handling</li>
                  <li>• Auto .gitignore for Python environments</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyberdark-800 border-cybergold-500/40">
            <CardHeader>
              <CardTitle className="text-cybergold-400">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-cybergold-300 font-medium mb-2">Quick Setup</h4>
                <ol className="text-sm text-cybergold-600 space-y-1 list-decimal list-inside">
                  <li>Navigate to the Enhanced Chat Interface</li>
                  <li>Select your preferred chat mode</li>
                  <li>Create custom instructions for your workflow</li>
                  <li>Configure GitHub integration (optional)</li>
                  <li>Set up Python environments as needed</li>
                </ol>
              </div>

              <div>
                <h4 className="text-cybergold-300 font-medium mb-2">Additional Resources</h4>
                <div className="space-y-2">
                  <a 
                    href="#"
                    className="text-cybergold-400 hover:text-cybergold-300 text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Feature Documentation
                  </a>
                  <a 
                    href="#"
                    className="text-cybergold-400 hover:text-cybergold-300 text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    GitHub Repository
                  </a>
                  <a 
                    href="#"
                    className="text-cybergold-400 hover:text-cybergold-300 text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Community Forum
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-cybergold-600 text-sm">
          <p>
            For more details, visit the official release notes on{' '}
            <a href="#" className="text-cybergold-400 hover:text-cybergold-300">
              code.visualstudio.com
            </a>
          </p>
          <p className="mt-2">
            Built with ❤️ for the Norwegian tech community
          </p>
        </div>
      </div>
    </div>
  );
};

export default June2025ReleasePage;