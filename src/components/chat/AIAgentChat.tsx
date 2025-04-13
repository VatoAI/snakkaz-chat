import { useState, useEffect } from 'react';
import { aiAgent } from '@/services/ai-agent';
import { DecryptedMessage } from "@/types/message";
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';

interface AIAgentChatProps {
  currentUserId: string;
}

export const AIAgentChat = ({ currentUserId }: AIAgentChatProps) => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // Implementer workflow handling
        console.log('Starting workflow:', action.payload);
        break;
      case 'help':
        // Vis hjelpeinformasjon
        console.log('Showing help:', action.payload);
        break;
      case 'command':
        // Utfør kommando
        console.log('Executing command:', action.payload);
        break;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          currentUserId={currentUserId}
          onMessageExpired={() => {}}
          onEditMessage={() => {}}
          onDeleteMessage={() => {}}
        />
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