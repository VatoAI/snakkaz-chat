import { useState, FormEvent } from "react";
import { Send, X, Shield, Crown, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from "@/types/security";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  isPageEncrypted?: boolean;
  isPremiumMember?: boolean;
  maxFileSize?: number;
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
  isPageEncrypted = false,
  isPremiumMember = false,
  maxFileSize = 50 * 1024 * 1024 // Default: 50MB
}: DirectMessageFormProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !selectedFile || isLoading) return;
    
    setIsComposing(false);
    await onSendMessage(e, newMessage);
    setSelectedFile(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    if (file.size > maxFileSize) {
      alert(`Filen er for stor (${formatFileSize(file.size)}). Maksimal størrelse er ${formatFileSize(maxFileSize)}`);
      e.target.value = '';
      return;
    }
    
    setSelectedFile(file);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
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
      {/* Premium indicator */}
      {isPremiumMember && (
        <div className="mb-2 p-2 bg-gradient-to-r from-cybergold-900 to-cyberdark-800 border border-cybergold-500/30 rounded-md text-sm text-cybergold-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-cybergold-400" />
            <span>Premium-funksjoner aktivert</span>
          </div>
          <span className="text-xs text-cybergold-500/80">
            Maks filstørrelse: {formatFileSize(maxFileSize)}
          </span>
        </div>
      )}
      
      {/* Page encryption indicator */}
      {isPageEncrypted && (
        <div className="mb-2 p-2 bg-cyberblue-600/10 border border-cyberblue-500/30 rounded-md text-sm text-cyberblue-300 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>
            {isPremiumMember 
              ? "Denne samtalen er beskyttet med 256-bit kryptering" 
              : "Denne samtalen er helside-kryptert"}
          </span>
        </div>
      )}
      
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
      
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between p-2 bg-cyberblue-600/20 border border-cyberblue-500/40 rounded-md text-sm text-cyberblue-300">
          <div className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span>{selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6 text-cyberblue-300 hover:text-cyberblue-200 hover:bg-cyberblue-900/40"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
              isPremium={isPremiumMember}
              size="sm"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="relative">
            <Input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Label 
              htmlFor="file-upload"
              className={cn(
                "flex items-center gap-1 py-1 px-2 rounded cursor-pointer text-sm",
                isPremiumMember 
                  ? "bg-gradient-to-r from-cybergold-900 to-cyberdark-700 hover:from-cybergold-800 hover:to-cyberdark-600" 
                  : "bg-cyberdark-700 hover:bg-cyberdark-600"
              )}
            >
              <FileUp className="h-4 w-4" />
              <span>
                {isPremiumMember 
                  ? `Fil (opp til ${formatFileSize(maxFileSize)})` 
                  : "Fil"}
              </span>
            </Label>
          </div>
          
          <Button
            type="submit"
            className={`bg-cybergold-600 hover:bg-cybergold-700 text-black px-4 ${
              isLoading || (newMessage.trim() === '' && !selectedFile) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            disabled={isLoading || (newMessage.trim() === '' && !selectedFile)}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
