
import { useState, FormEvent, useCallback } from "react";
import { Send, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from "@/types/security";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DirectMessageFormProps {
  usingServerFallback: boolean;
  sendError: string | null;
  isLoading: boolean;
  onSendMessage: (e: FormEvent, text: string) => Promise<boolean>;
  newMessage: string;
  onChangeMessage: (text: string) => void;
  connectionState: string;
  dataChannelState: string;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit: () => void;
  securityLevel: SecurityLevel;
}

export const DirectMessageForm = ({
  usingServerFallback,
  sendError,
  isLoading,
  onSendMessage,
  newMessage,
  onChangeMessage,
  connectionState,
  dataChannelState,
  editingMessage,
  onCancelEdit,
  securityLevel
}: DirectMessageFormProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;
    
    setIsComposing(false);
    setLocalError(null);
    
    try {
      const success = await onSendMessage(e, newMessage);
      if (!success) {
        setLocalError("Kunne ikke sende melding. Prøv igjen senere.");
      }
    } catch (error: any) {
      console.error("Error in form submission:", error);
      setLocalError(error.message || "Kunne ikke sende melding. Prøv igjen senere.");
    }
  };
  
  const isConnected = 
    (securityLevel === 'p2p_e2ee' && (
      (connectionState === 'connected' && dataChannelState === 'open') || 
      usingServerFallback
    )) || 
    securityLevel === 'server_e2ee' || 
    securityLevel === 'standard';

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);
  
  return (
    <div className="border-t border-cybergold-500/30 p-4 bg-cyberdark-900">
      {!isConnected && securityLevel === 'p2p_e2ee' && (
        <div className="mb-2 p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300">
          Venter på tilkobling. Meldingen vil sendes når tilkoblingen er etablert,
          eller faller tilbake til server etter en kort stund.
        </div>
      )}
      
      {(sendError || localError) && (
        <Alert variant="destructive" className="mb-2 bg-red-600/20 border-red-500/40">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm text-red-300">
            {sendError || localError}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocalError}
              className="ml-2 h-6 w-6 p-0 text-red-300 hover:text-red-200 hover:bg-red-900/40"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300">
          <span>Redigerer melding</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelEdit}
            className="h-6 w-6 text-amber-300 hover:text-amber-200 hover:bg-amber-900/40"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            value={newMessage}
            onChange={(e) => {
              onChangeMessage(e.target.value);
              setIsComposing(true);
              clearLocalError();
            }}
            placeholder="Skriv en melding..."
            rows={1}
            className="resize-none bg-cyberdark-800 border-cybergold-500/30 focus:border-cybergold-500/60 pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute bottom-2 right-2">
            <SecurityBadge
              securityLevel={securityLevel}
              connectionState={connectionState}
              dataChannelState={dataChannelState}
              usingServerFallback={usingServerFallback}
              size="sm"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          size="icon"
          className={`bg-cybergold-600 hover:bg-cybergold-700 text-black ${
            isLoading || (newMessage.trim() === '') 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
          disabled={isLoading || newMessage.trim() === ''}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
