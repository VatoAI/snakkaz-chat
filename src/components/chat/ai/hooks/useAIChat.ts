
import { useState } from 'react';
import { aiAgent } from '@/services/ai-agent';
import { DecryptedMessage } from "@/types/message";

export const useAIChat = (currentUserId: string) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<{
    type: string;
    steps: string[];
    currentStep: number;
  } | null>(null);
  const [helpDetails, setHelpDetails] = useState<string[] | null>(null);
  const [activeCommand, setActiveCommand] = useState<{ action: string; payload: any } | null>(null);
  const [pendingCommand, setPendingCommand] = useState<{ action: string; payload: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const userMessage: DecryptedMessage = {
        id: Date.now().toString(),
        content: newMessage,
        sender: {
          id: currentUserId,
          username: null,
          full_name: null
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        encryption_key: '',
        iv: '',
        is_encrypted: false
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      const response = await aiAgent.processMessage(userMessage);

      const agentMessage: DecryptedMessage = {
        id: `ai-${Date.now()}`,
        content: response.content,
        sender: {
          id: 'ai-agent',
          username: 'SnakkaZ Assistant',
          full_name: null
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        encryption_key: '',
        iv: '',
        is_encrypted: false
      };

      setMessages(prev => [...prev, agentMessage]);

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
        if (action.payload.requiresConfirmation) {
          setPendingCommand({
            action: action.payload.action,
            payload: action.payload
          });
        } else {
          setActiveCommand({
            action: action.payload.action,
            payload: action.payload
          });
        }
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

  const handleConfirmCommand = () => {
    if (pendingCommand) {
      setActiveCommand(pendingCommand);
      setPendingCommand(null);
    }
  };

  const handleCancelCommand = () => {
    setPendingCommand(null);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    activeWorkflow,
    helpDetails,
    activeCommand,
    pendingCommand,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleConfirmCommand,
    handleCancelCommand
  };
};
