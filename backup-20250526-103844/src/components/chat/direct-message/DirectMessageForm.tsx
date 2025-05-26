import { FormEvent, useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityLevel } from "@/types/security";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureMessageInput } from "@/components/message-input/SecureMessageInput";

interface DirectMessageFormProps {
  usingServerFallback: boolean;
  sendError: string | null;
  isLoading: boolean;
  onSendMessage: (e: FormEvent, text: string, options?: {
    ttl?: number | null,
    preventScreenshot?: boolean,
    mediaUrl?: string,
    mediaType?: string
  }) => Promise<boolean>;
  onSendMedia?: (mediaData: { url: string, thumbnailUrl?: string }) => Promise<void>;
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
  onSendMedia,
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
  const [showSuccess, setShowSuccess] = useState(false);
  
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

  // Hide success message after a short delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
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
      if (success) {
        console.log("Message sent successfully");
        setShowSuccess(true);
      } else {
        console.error("Message sending failed without throwing an error");
        setLocalError("Kunne ikke sende melding. Prøv igjen senere.");
      }
    } catch (error: unknown) {
      console.error("Error in form submission:", error);
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke sende melding. Prøv igjen senere.";
      setLocalError(errorMessage);
    }
  };

  const handleSendSecureMessage = async (message: string, options: {
    ttl?: number | null,
    preventScreenshot?: boolean,
    mediaUrl?: string,
    mediaType?: string
  }) => {
    if (message.trim() === '' && !options.mediaUrl) return;
    
    // Check network connection first
    if (networkStatus === 'offline') {
      setLocalError("Du er ikke tilkoblet internett. Sjekk din forbindelse og prøv igjen.");
      return;
    }
    
    setIsComposing(false);
    setLocalError(null);
    
    try {
      // Create a synthetic event object
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      const success = await onSendMessage(syntheticEvent, message, options);
      
      if (success) {
        console.log("Secure message sent successfully");
        setShowSuccess(true);
      } else {
        console.error("Message sending failed without throwing an error");
        setLocalError("Kunne ikke sende melding. Prøv igjen senere.");
      }
    } catch (error: unknown) {
      console.error("Error sending secure message:", error);
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke sende melding. Prøv igjen senere.";
      setLocalError(errorMessage);
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
    <div className="border-t border-cybergold-500/30 bg-cyberdark-900">
      {networkStatus === 'offline' && (
        <Alert variant="destructive" className="mb-2 mx-4 mt-4 bg-red-600/20 border-red-500/40">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm text-red-300">
            Du er ikke tilkoblet internett. Venligst sjekk din nettverksforbindelse.
          </AlertDescription>
        </Alert>
      )}
      
      {!isConnected && securityLevel === 'p2p_e2ee' && (
        <div className="mb-2 mx-4 mt-4 p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300 flex justify-between items-center">
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
      
      {showSuccess && (
        <Alert className="mb-2 mx-4 mt-4 bg-green-600/20 border-green-500/40">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-sm text-green-300">
            Melding sendt vellykket
          </AlertDescription>
        </Alert>
      )}
      
      {(sendError || localError) && (
        <Alert variant="destructive" className="mb-2 mx-4 mt-4 bg-red-600/20 border-red-500/40">
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
        <div className="mb-2 mx-4 mt-4 flex items-center justify-between p-2 bg-amber-600/20 border border-amber-500/40 rounded-md text-sm text-amber-300">
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
      
      <SecureMessageInput 
        onSend={handleSendSecureMessage}
        isLoading={isLoading || networkStatus === 'offline'}
        placeholder="Skriv en sikker melding..."
      />
    </div>
  );
};
