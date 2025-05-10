import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Send, 
  Paperclip, 
  Clock, 
  ShieldCheck, 
  EyeOff, 
  Camera 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';

interface SecureMessageInputProps {
  onSend: (message: string, options: {
    ttl?: number | null,
    preventScreenshot?: boolean,
    mediaUrl?: string,
    mediaType?: string
  }) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SecureMessageInput: React.FC<SecureMessageInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = "Skriv en sikker melding..."
}) => {
  const [message, setMessage] = useState<string>('');
  const [ttl, setTtl] = useState<number | null>(null);
  const [ttlHours, setTtlHours] = useState<number>(24);
  const [preventScreenshot, setPreventScreenshot] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { screenCaptureProtection } = useAppEncryption();
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim() && !selectedFile) return;
    
    let mediaUrl = undefined;
    let mediaType = undefined;
    
    // In a real implementation, we would upload the file here
    // and only send the message after upload completes
    if (selectedFile) {
      mediaType = selectedFile.type;
      // Simulated media URL for demo purposes
      mediaUrl = URL.createObjectURL(selectedFile);
    }
    
    onSend(message, {
      ttl: ttl ? ttl * 60 : null, // Convert to seconds
      preventScreenshot,
      mediaUrl,
      mediaType
    });
    
    setMessage('');
    setSelectedFile(null);
  };
  
  const handleTtlChange = (value: number) => {
    setTtlHours(value);
    setTtl(value); // Hours
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "Filen er for stor",
          description: "Maksimal filstørrelse er 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "Fil valgt",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        variant: "default"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const toggleScreenshotProtection = () => {
    const newValue = !preventScreenshot;
    setPreventScreenshot(newValue);
    
    if (newValue) {
      screenCaptureProtection.enable();
      toast({
        title: "Skjermdumpbeskyttelse aktivert",
        description: "Skjermdumper er nå blokkert i denne chatten",
        variant: "default"
      });
    } else {
      screenCaptureProtection.disable();
    }
  };
  
  return (
    <div className="flex items-center space-x-2 p-2 bg-cyberdark-900 border-t border-cybergold-500/20 rounded-b-md">
      {selectedFile && (
        <div className="flex items-center mr-2 px-2 py-1 bg-cyberblue-900/40 rounded text-sm text-cyberblue-200">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-4 mr-1 text-cyberblue-300 hover:text-cyberblue-500"
            onClick={() => setSelectedFile(null)}
          >
            ✕
          </Button>
          {selectedFile.name.substring(0, 15)}
          {selectedFile.name.length > 15 ? "..." : ""}
        </div>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-cyberdark-400 hover:text-cyberdark-300"
          >
            <Paperclip size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 bg-cyberdark-800 border-cybergold-500/20">
          <div className="space-y-2">
            <p className="text-xs text-cyberdark-300">Legg til fil</p>
            <Button 
              variant="outline" 
              className="w-full bg-cyberdark-700 hover:bg-cyberdark-600"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} className="mr-2" />
              Velg media
            </Button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-cyberdark-400 hover:text-cyberdark-300"
          >
            <ShieldCheck size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-cyberdark-800 border-cybergold-500/20">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium text-cyberdark-100">Sikkerhet</h4>
                  <p className="text-xs text-cyberdark-300">
                    Konfigurasjon for ekstra sikkerhet
                  </p>
                </div>
                <ShieldCheck className="text-cybergold-400" size={18} />
              </div>
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-cyberdark-200">
                      <Clock className="h-3.5 w-3.5 inline-block mr-1" />
                      Selvdestruerende melding
                    </label>
                    <Switch
                      checked={ttl !== null}
                      onCheckedChange={(checked) => setTtl(checked ? ttlHours : null)}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                  {ttl !== null && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-xs text-cyberdark-300">Varighet: {ttlHours} timer</span>
                      </div>
                      <Slider
                        defaultValue={[24]}
                        value={[ttlHours]}
                        min={1}
                        max={72}
                        step={1}
                        onValueChange={(values) => handleTtlChange(values[0])}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 pt-2 border-t border-cyberdark-700/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-cyberdark-200">
                      <EyeOff className="h-3.5 w-3.5 inline-block mr-1" />
                      Skjermdumpbeskyttelse
                    </label>
                    <Switch
                      checked={preventScreenshot}
                      onCheckedChange={toggleScreenshotProtection}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                  <p className="text-xs text-cyberdark-400">
                    Hindrer at chatinnholdet kan tas skjermdump av
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="relative flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="pr-10 bg-cyberdark-800 border-cyberdark-600 focus:border-cybergold-500/50"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        {ttl !== null && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center mr-2 text-xs text-cyberdark-300">
            <Clock size={12} className="mr-1" />
            {ttlHours}t
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleSend} 
        size="icon" 
        className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-900"
        disabled={isLoading || (!message.trim() && !selectedFile)}
      >
        <Send size={18} />
      </Button>
    </div>
  );
};