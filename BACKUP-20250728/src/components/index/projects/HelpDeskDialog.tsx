
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageSquare, Send, UserCircle, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HelpDeskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDeskDialog = ({ open, onOpenChange }: HelpDeskDialogProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is saved in localStorage
    const savedApiKey = localStorage.getItem("aiHelpApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    
    if (apiKey) {
      try {
        // Simulate AI response with a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setResponse("Takk for din henvendelse! Dette er et simulert AI-svar. I en fullverdig implementering ville vi her brukt API-nøkkelen til å generere et ekte AI-svar.");
        setSentMessage(true);
      } catch (error) {
        toast({
          title: "Feil",
          description: "Kunne ikke behandle forespørselen",
          variant: "destructive",
        });
      }
    } else {
      // Standard response without API key
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Melding sendt",
        description: "Takk for din henvendelse. Vi vil svare så snart som mulig.",
        duration: 5000,
      });
      
      setSentMessage(true);
    }
    
    setIsSending(false);
  };

  const handleClose = () => {
    setMessage("");
    setSentMessage(false);
    setResponse("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-cyberdark-900 text-gray-200 shadow-[0_0_30px_rgba(26,157,255,0.2)]"
        style={{
          borderImage: 'linear-gradient(90deg, #1a9dff, #d62828) 1',
          border: '2px solid',
        }}
      >
        <DialogHeader className="border-b border-cyberblue-500/30 pb-4">
          <DialogTitle className="flex items-center text-cyberblue-300">
            <div className="bg-cyberblue-500/20 p-1 rounded-md mr-2">
              <Bot className="text-cyberblue-400" size={18} />
            </div>
            SnakkaZ AI Hjelp
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {apiKey ? "AI-basert hjelp med SnakkaZ produkter" : "Spør om hjelp med SnakkaZ produkter eller tjenester"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-cyberdark-950/70 p-4 rounded-md border border-cyberdark-700 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-cyberblue-900/80 p-1.5 rounded-full">
              <Bot size={18} className="text-cyberblue-300" />
            </div>
            <div>
              <p className="text-xs text-cyberblue-400 mb-1">SnakkaZ {apiKey ? "AI" : "Assistant"}</p>
              <p className="text-sm text-gray-300">
                {sentMessage 
                  ? (response || "Takk for din henvendelse! Jeg vil sørge for at teamet vårt svarer deg så snart som mulig.")
                  : "Hei! Hvordan kan jeg hjelpe deg med SnakkaZ-produkter i dag?"}
              </p>
            </div>
          </div>
          
          {sentMessage && (
            <div className="flex items-start gap-3 mt-4 ml-6">
              <div className="bg-cyberblue-900/40 p-1.5 rounded-full">
                <UserCircle size={18} className="text-cyberblue-200" />
              </div>
              <div>
                <p className="text-xs text-cyberblue-400/70 mb-1">Du</p>
                <p className="text-sm text-gray-300/90">{message}</p>
              </div>
            </div>
          )}
        </div>
        
        {!sentMessage && (
          <Textarea 
            placeholder="Skriv din melding her..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-cyberdark-800 border-cyberdark-700 text-gray-300 focus:border-cyberblue-500 focus:ring-cyberblue-500"
          />
        )}
        
        <DialogFooter>
          {sentMessage ? (
            <Button 
              type="button" 
              onClick={handleClose}
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
                boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(214,40,40,0.4)'
              }}
            >
              Lukk
            </Button>
          ) : (
            <Button 
              type="submit" 
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
                boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(214,40,40,0.4)'
              }}
            >
              {isSending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-r-white border-b-white border-l-white rounded-full animate-spin mr-2"></div>
                  Sender...
                </div>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send melding
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
