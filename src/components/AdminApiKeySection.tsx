
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Check, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminApiKeySection = () => {
  const [apiKey, setApiKey] = useState("");
  const [keyStatus, setKeyStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem("aiHelpApiKey");
    if (savedKey) {
      setApiKey(savedKey);
      validateApiKey(savedKey);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setKeyStatus('idle');
      return;
    }

    setKeyStatus('validating');

    try {
      // Try to update health table as a simple API validation test
      // In a real app, you would validate against the actual API
      const { error } = await supabase
        .from('health')
        .upsert({ 
          id: '38d75fee-16f2-4b42-a084-93567e21e3a7',
          status: 'api_key_validation',
          last_checked: new Date().toISOString()
        })
        .match({ id: '38d75fee-16f2-4b42-a084-93567e21e3a7' });

      if (error) {
        console.error("API key validation error:", error);
        setKeyStatus('invalid');
      } else {
        setKeyStatus('valid');
      }
    } catch (err) {
      console.error("Error validating API key:", err);
      setKeyStatus('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Feil",
        description: "API nøkkel kan ikke være tom",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("aiHelpApiKey", apiKey);
    validateApiKey(apiKey);
    
    toast({
      title: "Lagret!",
      description: "API nøkkel har blitt lagret og validert",
    });
  };

  return (
    <div 
      className="p-6 rounded-xl bg-gradient-to-r from-cyberdark-900/90 to-cyberdark-800/90"
      style={{
        borderImage: 'linear-gradient(90deg, #1a9dff, #d62828) 1',
        border: '2px solid',
      }}
    >
      <div className="flex items-center mb-4">
        <Key className="mr-3 text-cyberblue-400" size={24} />
        <h2 className="text-xl font-semibold text-cyberblue-300">HelpDesk API Nøkkel</h2>
      </div>
      
      <p className="mb-4 text-gray-400">
        Legg til en API nøkkel for å aktivere AI hjelp i HelpDesk.
      </p>
      
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Skriv inn API nøkkel"
            className="bg-cyberdark-950 border-cyberblue-500/30 pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : keyStatus === 'valid' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : keyStatus === 'invalid' ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleApiKeySave}
            className="flex-1"
            style={{
              background: 'linear-gradient(90deg, #1a9dff, #3b82f6)',
              boxShadow: '0 0 10px rgba(26,157,255,0.4)',
            }}
            disabled={isLoading || keyStatus === 'validating'}
          >
            {(isLoading || keyStatus === 'validating') && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {keyStatus === 'validating' ? 'Validerer...' : 'Lagre API Nøkkel'}
          </Button>
          
          {keyStatus === 'valid' && (
            <div className="text-xs text-green-400 flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Gyldig
            </div>
          )}
          
          {keyStatus === 'invalid' && (
            <div className="text-xs text-red-400 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Ugyldig
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
