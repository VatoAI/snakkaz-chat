
import { useState, FormEvent } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from "@/types/security";

interface DirectMessageFormProps {
  usingServerFallback: boolean;
  sendError: string | null;
  isLoading: boolean;
  onSendMessage: (e: React.FormEvent, text: string) => Promise<boolean>;
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
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;
    
    setIsComposing(false);
    await onSendMessage(e, newMessage);
  };
  
  const isConnected = 
    (securityLevel === 'p2p_e2ee' && (
      (connectionState === 'connected' && dataChannelState === 'open') || 
      usingServerFallback
    )) || 
    securityLevel === 'server_e2ee' || 
    securityLevel === 'standard';
  
  return (
    <div className="border-t border-cybergold-500/30 p-4 bg-cyberdark-900">
      {!isConnected && securityLevel === 'p2p_e2ee' && (
        <div className="mb-2 p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300">
          Venter på tilkobling. Meldingen vil sendes når tilkoblingen er etablert,
          eller faller tilbake til server etter en kort stund.
        </div>
      )}
      
      {sendError && (
        <div className="mb-2 p-2 bg-red-600/20 border border-red-500/40 rounded-md text-sm text-red-300">
          {sendError}
        </div>
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
