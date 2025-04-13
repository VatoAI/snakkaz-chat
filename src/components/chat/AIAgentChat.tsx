import { useState, useEffect } from 'react';
import { aiAgent } from '@/services/ai-agent';
import { DecryptedMessage } from "@/types/message";
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, HelpCircle, Workflow, Command } from "lucide-react";
import { CommandHandler } from './CommandHandler';

interface AIAgentChatProps {
  currentUserId: string;
}

interface WorkflowDisplay {
  type: string;
  steps: string[];
  currentStep: number;
}

export const AIAgentChat = ({ currentUserId }: AIAgentChatProps) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowDisplay | null>(null);
  const [helpDetails, setHelpDetails] = useState<string[] | null>(null);
  const [activeCommand, setActiveCommand] = useState<{ action: string; payload: any } | null>(null);

  // Vis velkomstmelding når komponenten lastes
  useEffect(() => {
    const welcomeMessage: DecryptedMessage = {
      id: 'welcome',
      content: "Hei! Jeg er SnakkaZ Assistant. Jeg kan hjelpe deg med følgende:\n\n" +
        "1. 'workflow' - Guide deg gjennom ulike prosesser\n" +
        "2. 'hjelp' - Få hjelp med spesifikke temaer\n" +
        "3. 'kommando' - Utføre ulike handlinger\n\n" +
        "Du kan også spørre meg om profil, chat, sikkerhet eller andre SnakkaZ-relaterte temaer!",
      sender: {
        id: 'ai-agent',
        username: 'SnakkaZ Assistant',
        full_name: null
      },
      created_at: new Date().toISOString(),
      encryption_key: '',
      iv: '',
      is_encrypted: false
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Lag brukerens melding
      const userMessage: DecryptedMessage = {
        id: Date.now().toString(),
        content: newMessage,
        sender: {
          id: currentUserId,
          username: null,
          full_name: null
        },
        created_at: new Date().toISOString(),
        encryption_key: '',
        iv: '',
        is_encrypted: false
      };

      // Legg til brukerens melding
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Få svar fra AI agenten
      const response = await aiAgent.processMessage(userMessage);

      // Lag AI agentens svarmelding
      const agentMessage: DecryptedMessage = {
        id: `ai-${Date.now()}`,
        content: response.content,
        sender: {
          id: 'ai-agent',
          username: 'SnakkaZ Assistant',
          full_name: null
        },
        created_at: new Date().toISOString(),
        encryption_key: '',
        iv: '',
        is_encrypted: false
      };

      // Legg til AI agentens svar
      setMessages(prev => [...prev, agentMessage]);

      // Håndter eventuelle actions fra agenten
      if (response.action) {
        handleAgentAction(response.action);
      }
    } catch (error) {
      console.error('Error processing AI agent message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentAction = (action: { type: string; payload: any }) => {
    switch (action.type) {
      case 'workflow':
        setActiveWorkflow({
          type: action.payload.workflowType,
          steps: action.payload.steps,
          currentStep: 0
        });
        setHelpDetails(null);
        setActiveCommand(null);
        break;
      case 'help':
        if (action.payload.details) {
          setHelpDetails(action.payload.details);
          setActiveWorkflow(null);
          setActiveCommand(null);
        }
        break;
      case 'command':
        setActiveCommand({
          action: action.payload.action,
          payload: action.payload
        });
        setActiveWorkflow(null);
        setHelpDetails(null);
        break;
    }
  };

  const handleNextStep = () => {
    if (activeWorkflow && activeWorkflow.currentStep < activeWorkflow.steps.length - 1) {
      setActiveWorkflow({
        ...activeWorkflow,
        currentStep: activeWorkflow.currentStep + 1
      });
    }
  };

  const handlePrevStep = () => {
    if (activeWorkflow && activeWorkflow.currentStep > 0) {
      setActiveWorkflow({
        ...activeWorkflow,
        currentStep: activeWorkflow.currentStep - 1
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        <MessageList 
          messages={messages}
          currentUserId={currentUserId}
          onMessageExpired={() => {}}
          onEditMessage={() => {}}
          onDeleteMessage={() => {}}
        />
        
        {/* Workflow Display */}
        {activeWorkflow && (
          <Card className="absolute bottom-4 right-4 w-80 p-4 bg-cyberdark-800 border-cybergold-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Workflow className="h-5 w-5 text-cybergold-400" />
              <h3 className="text-sm font-medium text-cybergold-300">
                Workflow: {activeWorkflow.type}
              </h3>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-cybergold-200">
                Steg {activeWorkflow.currentStep + 1} av {activeWorkflow.steps.length}:
              </p>
              <p className="text-sm text-white">
                {activeWorkflow.steps[activeWorkflow.currentStep]}
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={activeWorkflow.currentStep === 0}
                className="text-cybergold-400 border-cybergold-500/30"
              >
                Forrige
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={activeWorkflow.currentStep === activeWorkflow.steps.length - 1}
                className="text-cybergold-400 border-cybergold-500/30"
              >
                Neste
              </Button>
            </div>
          </Card>
        )}

        {/* Help Details Display */}
        {helpDetails && (
          <Card className="absolute bottom-4 right-4 w-80 p-4 bg-cyberdark-800 border-cybergold-500/30">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-cybergold-400" />
              <h3 className="text-sm font-medium text-cybergold-300">
                Hjelpedetaljer
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-white">
              {helpDetails.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cybergold-400 mt-1">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Command Handler */}
        {activeCommand && (
          <CommandHandler
            action={activeCommand.action}
            payload={activeCommand.payload}
            onComplete={() => setActiveCommand(null)}
          />
        )}
      </div>

      <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          ttl={null}
          setTtl={() => {}}
          editingMessage={null}
          onCancelEdit={() => {}}
        />
      </div>
    </div>
  );
};