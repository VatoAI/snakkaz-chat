
import { FormEvent } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { useAIChat } from './ai/hooks/useAIChat';
import { AIMessageList } from './ai/AIMessageList';
import { WorkflowDisplay } from './ai/features/WorkflowDisplay';
import { HelpDetails } from './ai/features/HelpDetails';
import { CommandHandler } from './CommandHandler';
import { CommandConfirmationDialog } from './ai/CommandConfirmationDialog';
import { COMMANDS } from './ai/types';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AIAgentChatProps {
  currentUserId: string;
}

export const AIAgentChat = ({ currentUserId }: AIAgentChatProps) => {
  const {
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
    handleCancelCommand,
  } = useAIChat(currentUserId);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden relative">
          <AIMessageList 
            messages={messages}
            currentUserId={currentUserId}
          />
          
          {activeWorkflow && (
            <WorkflowDisplay
              type={activeWorkflow.type}
              steps={activeWorkflow.steps}
              currentStep={activeWorkflow.currentStep}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
            />
          )}

          {helpDetails && (
            <HelpDetails details={helpDetails} />
          )}

          {activeCommand && (
            <CommandHandler
              action={activeCommand.action}
              payload={activeCommand.payload}
              onComplete={() => {}}
            />
          )}

          {pendingCommand && (
            <CommandConfirmationDialog
              isOpen={true}
              title="Bekreft kommando"
              description={`Er du sikker på at du vil ${COMMANDS[pendingCommand.action]?.description.toLowerCase() || 'utføre denne kommandoen'}?`}
              onConfirm={handleConfirmCommand}
              onCancel={handleCancelCommand}
            />
          )}
        </div>

        <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSubmit={onSubmit}
            isLoading={isLoading}
            ttl={null}
            setTtl={() => {}}
            editingMessage={null}
            onCancelEdit={() => {}}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
