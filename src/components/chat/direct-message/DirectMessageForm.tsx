
import { useState, FormEvent, useCallback, useEffect } from "react";
import { Send, X, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from "@/types/security";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onReconnect?: () => void; // Optional callback to trigger reconnection
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
  securityLevel,
  onReconnect
}: DirectMessageFormProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline');
  
  // Listen for network status changes
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;
    
    // Check network connection first
    if (networkStatus === 'offline') {
      setLocalError("Du er ikke tilkoblet internett. Sjekk din forbindelse og prøv igjen.");
      return;
    }
    
    setIsComposing(false);
    setLocalError(null);
    
    try {
      console.log("Attempting to send message...");
      const success = await onSendMessage(e, newMessage);
      if (!success) {
        console.error("Message sending failed without throwing an error");
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
      {networkStatus === 'offline' && (
        <Alert variant="destructive" className="mb-2 bg-red-600/20 border-red-500/40">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm text-red-300">
            Du er ikke tilkoblet internett. Venligst sjekk din nettverksforbindelse.
          </AlertDescription>
        </Alert>
      )}
      
      {!isConnected && securityLevel === 'p2p_e2ee' && (
        <div className="mb-2 p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300 flex justify-between items-center">
          <span>
            Venter på tilkobling. Meldingen vil sendes når tilkoblingen er etablert,
            eller faller tilbake til server etter en kort stund.
          </span>
          {onReconnect && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-amber-300 hover:text-amber-200"
                    onClick={onReconnect}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Prøv å koble til på nytt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
            disabled={networkStatus === 'offline'}
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
            isLoading || (newMessage.trim() === '') || networkStatus === 'offline'
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
          disabled={isLoading || newMessage.trim() === '' || networkStatus === 'offline'}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
