
import { Loader2, SendHorizonal, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRef, useEffect } from "react";

interface DirectMessageFormProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  onChangeMessage: (text: string) => void;
  isLoading: boolean;
  sendError: string | null;
  usingServerFallback: boolean;
  connectionState: string;
  dataChannelState: string;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit: () => void;
}

export const DirectMessageForm = ({
  onSendMessage,
  newMessage,
  onChangeMessage,
  isLoading,
  sendError,
  usingServerFallback,
  connectionState,
  dataChannelState,
  editingMessage,
  onCancelEdit
}: DirectMessageFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Determine if secure connection is established
  const isSecureConnection = (connectionState === 'connected' && dataChannelState === 'open') || usingServerFallback;
  
  // Focus textarea when editing
  useEffect(() => {
    if (editingMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && isSecureConnection) {
        onSendMessage(e as unknown as React.FormEvent);
      }
    }
    
    // Cancel editing on Escape
    if (e.key === 'Escape' && editingMessage) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={onSendMessage} className="p-3 border-t border-cybergold-500/30 bg-cyberdark-900">
      {sendError && (
        <Alert variant="destructive" className="mb-2 py-2">
          <AlertDescription>{sendError}</AlertDescription>
        </Alert>
      )}
      
      {editingMessage && (
        <div className="flex justify-between items-center mb-2 text-xs text-cybergold-300">
          <span>Redigerer melding</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onCancelEdit}
            className="text-xs h-6 px-2"
          >
            Avbryt
          </Button>
        </div>
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isSecureConnection || isLoading}
          placeholder={
            !isSecureConnection
              ? "Venter på sikker tilkobling..."
              : editingMessage
                ? "Rediger melding..."
                : "Skriv en melding..."
          }
          className="min-h-[70px] resize-none pr-10 bg-cyberdark-800 border-cybergold-500/40 text-white placeholder:text-cybergold-300/50"
        />
        
        <div className="absolute right-2 bottom-2 flex items-center">
          {/* Connection status indicator */}
          <div className="mr-2">
            {isSecureConnection ? (
              <ShieldCheck className="h-4 w-4 text-green-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-red-400 animate-pulse" />
            )}
          </div>
          
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !isSecureConnection || isLoading}
            className="bg-cyberblue-700 hover:bg-cyberblue-600 text-white h-8 w-8 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
