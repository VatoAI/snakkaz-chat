
import { useState, FormEvent } from 'react';
import { DecryptedMessage } from '@/types/message';

// Define the workflow structure
interface Workflow {
  type: string;
  steps: string[];
  currentStep: number;
}

// Define the help details structure
interface HelpDetails {
  title: string;
  content: string;
}

// Define the command structure
interface Command {
  action: string;
  payload: any;
}

export const useAIChat = (currentUserId: string) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [helpDetails, setHelpDetails] = useState<HelpDetails | null>(null);
  const [activeCommand, setActiveCommand] = useState<Command | null>(null);
  const [pendingCommand, setPendingCommand] = useState<Command | null>(null);

  const sendMessageToAI = async (message: string) => {
    setIsLoading(true);
    try {
      // Mock AI response for now
      const aiMessage: DecryptedMessage = {
        id: Date.now().toString(),
        content: `AI response to: ${message}`,
        created_at: new Date().toISOString(),
        sender: {
          id: 'ai-assistant',
          username: 'AI Assistant',
          full_name: 'AI Assistant',
          avatar_url: null
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setError('');
    } catch (err) {
      setError('Failed to send message to AI');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message: string) => {
    const newMsg: DecryptedMessage = {
      id: Date.now().toString(),
      content: message,
      created_at: new Date().toISOString(),
      sender: {
        id: currentUserId,
        username: 'You',
        full_name: 'You',
        avatar_url: null
      }
    };
    
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    addMessage(newMessage);
    const msgToSend = newMessage;
    setNewMessage('');
    await sendMessageToAI(msgToSend);
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
    error,
    activeWorkflow,
    helpDetails,
    activeCommand,
    pendingCommand,
    sendMessageToAI,
    addMessage,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleConfirmCommand,
    handleCancelCommand,
  };
};
