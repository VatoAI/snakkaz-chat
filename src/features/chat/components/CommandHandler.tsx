
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CommandHandlerProps {
  action: string;
  payload: any;
  onComplete: () => void;
}

export const CommandHandler: React.FC<CommandHandlerProps> = ({
  action,
  payload,
  onComplete
}) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Utfører kommando...');

  useEffect(() => {
    const executeCommand = async () => {
      try {
        // In a real implementation, this would perform API calls or other actions
        // based on the action and payload
        console.log('Executing command:', action, payload);
        
        // Simulate a processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('success');
        setMessage(`Kommando ${action} utført!`);
        
        // Call onComplete after a delay to allow the user to see the success message
        setTimeout(() => {
          onComplete();
        }, 1000);
      } catch (error) {
        console.error('Command execution failed:', error);
        setStatus('error');
        setMessage(`Feil ved utførelse av kommando: ${error}`);
      }
    };
    
    executeCommand();
  }, [action, payload]);

  return (
    <div className="fixed inset-0 bg-cyberdark-950/80 flex items-center justify-center z-50">
      <div className="bg-cyberdark-900 border border-cybergold-500/40 rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          {status === 'processing' && (
            <Loader2 className="h-12 w-12 text-cybergold-500 animate-spin mb-4" />
          )}
          {status === 'success' && (
            <div className="h-12 w-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
              ✓
            </div>
          )}
          {status === 'error' && (
            <div className="h-12 w-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
              !
            </div>
          )}
          
          <h3 className="text-xl font-medium text-cybergold-400 mb-2">
            {status === 'processing' ? 'Utfører kommando' : 
             status === 'success' ? 'Kommando utført' : 'Kommando feilet'}
          </h3>
          
          <p className="text-cybergold-600">{message}</p>
          
          {status === 'error' && (
            <button
              onClick={onComplete}
              className="mt-4 px-4 py-2 bg-cybergold-700 text-white rounded hover:bg-cybergold-600 transition-colors"
            >
              Lukk
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
