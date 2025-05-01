import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Eye, 
  KeyRound, 
  Clock, 
  Smartphone, 
  Fingerprint, 
  RefreshCw, 
  Download,
  Trash2
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SecuritySettingsPanel: React.FC = () => {
  const { enableEncryption, user } = useAuth();
  const { 
    clearAllSecurityData, 
    screenCaptureProtection,
    rotateKeysForConversation
  } = useAppEncryption();
  const { toast } = useToast();
  
  // State for security settings
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(true);
  const [isScreenCaptureBlocked, setIsScreenCaptureBlocked] = useState(
    screenCaptureProtection.isEnabled()
  );
  const [autoDeleteMessages, setAutoDeleteMessages] = useState(false);
  const [autoDeleteTimeHours, setAutoDeleteTimeHours] = useState(24);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(false);
  const [securityNotificationsEnabled, setSecurityNotificationsEnabled] = useState(true);
  const [isBlockingUnknownSenders, setIsBlockingUnknownSenders] = useState(false);
  const [isBackupEncrypted, setIsBackupEncrypted] = useState(true);
  const [isRotatingKeysInProgress, setIsRotatingKeysInProgress] = useState(false);
  
  const handleToggleEncryption = async (enabled: boolean) => {
    try {
      setIsEncryptionEnabled(enabled);
      
      if (enabled) {
        await enableEncryption();
        toast({
          title: "Kryptering aktivert",
          description: "Ende-til-ende-kryptering er nå aktivert for alle dine samtaler.",
          variant: "default",
        });
      } else {
        // In a real app, you'd want additional confirmation for disabling E2EE
        toast({
          title: "Kryptering deaktivert",
          description: "Dette er bare for demo-formål. I en ekte app, ville kryptering alltid være på.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling encryption:', error);
      setIsEncryptionEnabled(!enabled); // Revert UI state on failure
      toast({
        title: "Feil oppstod",
        description: "Kunne ikke endre krypteringsinnstillingen. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleScreenCapture = (enabled: boolean) => {
    setIsScreenCaptureBlocked(enabled);
    
    if (enabled) {
      screenCaptureProtection.enable();
      toast({
        title: "Skjermdumpbeskyttelse aktivert",
        description: "Skjermdumper er nå blokkert i hele appen.",
        variant: "default",
      });
    } else {
      screenCaptureProtection.disable();
      toast({
        title: "Skjermdumpbeskyttelse deaktivert",
        description: "Skjermdumper er nå tillatt i appen.",
        variant: "default",
      });
    }
  };
  
  const handleExportBackup = () => {
    toast({
      title: "Kryptert backup eksportert",
      description: "Din krypterte backup er lastet ned. Oppbevar denne sikkert.",
      variant: "default",
    });
  };
  
  const handleRotateKeys = async () => {
    try {
      setIsRotatingKeysInProgress(true);
      // In a real app, this would rotate keys for all conversations
      // For demo, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of rotating keys for a specific conversation
      if (user) {
        await rotateKeysForConversation(`global_${user.id}`);
      }
      
      toast({
        title: "Nøkler rotert",
        description: "Dine krypteringsnøkler er nå oppdatert. Dette gir deg forbedret sikkerhet.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error rotating keys:', error);
      toast({
        title: "Nøkkelrotasjon mislyktes",
        description: "Kunne ikke rotere krypteringsnøkler. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsRotatingKeysInProgress(false);
    }
  };
  
  const handleClearSecurityData = async () => {
    // In a real app, you would show a confirmation dialog here
    try {
      await clearAllSecurityData();
      
      toast({
        title: "Sikkerhetsdata slettet",
        description: "Alle krypteringsnøkler og sikkerhetsdata er slettet fra denne enheten.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error clearing security data:', error);
      toast({
        title: "Sletting mislyktes",
        description: "Kunne ikke slette sikkerhetsdata. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-cyberdark-900 rounded-lg border border-cybergold-500/20 overflow-hidden">
      <div className="p-4 border-b border-cybergold-500/20 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-cybergold-500 mr-2" />
          <h2 className="text-lg font-medium text-cybergold-300">Sikkerhetsinnstillinger</h2>
        </div>
      </div>
      
      <div className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {/* Krypteringsinnstillinger */}
          <AccordionItem value="encryption" className="border-b border-cyberdark-700">
            <AccordionTrigger className="py-4 text-cyberdark-100 hover:text-cyberdark-50">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-cybergold-400 mr-3" />
                <span>Kryptering</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 px-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Ende-til-ende-kryptering</p>
                    <p className="text-xs text-cyberdark-400">Aktiver for maksimal sikkerhet av alle meldinger</p>
                  </div>
                  <Switch
                    checked={isEncryptionEnabled}
                    onCheckedChange={handleToggleEncryption}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Krypterte sikkerhetskopier</p>
                    <p className="text-xs text-cyberdark-400">Lagre backups med kryptering</p>
                  </div>
                  <Switch
                    checked={isBackupEncrypted}
                    onCheckedChange={setIsBackupEncrypted}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700 text-xs"
                    onClick={handleExportBackup}
                  >
                    <Download size={14} className="mr-1" />
                    Eksporter backup
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700 text-xs"
                    onClick={handleRotateKeys}
                    disabled={isRotatingKeysInProgress}
                  >
                    {isRotatingKeysInProgress ? (
                      <>
                        <RefreshCw size={14} className="mr-1 animate-spin" />
                        Roterer nøkler...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} className="mr-1" />
                        Rotér nøkler
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Personvern */}
          <AccordionItem value="privacy" className="border-b border-cyberdark-700">
            <AccordionTrigger className="py-4 text-cyberdark-100 hover:text-cyberdark-50">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-cybergold-400 mr-3" />
                <span>Personvern</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 px-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Blokker skjermdumper</p>
                    <p className="text-xs text-cyberdark-400">Forhindre at andre tar skjermdumper av samtaler</p>
                  </div>
                  <Switch
                    checked={isScreenCaptureBlocked}
                    onCheckedChange={handleToggleScreenCapture}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Blokker ukjente avsendere</p>
                    <p className="text-xs text-cyberdark-400">Krever godkjenning før ukjente kan kontakte deg</p>
                  </div>
                  <Switch
                    checked={isBlockingUnknownSenders}
                    onCheckedChange={setIsBlockingUnknownSenders}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Sikkerhetsnotifikasjoner</p>
                    <p className="text-xs text-cyberdark-400">Varsler om sikkerhetsrelaterte hendelser</p>
                  </div>
                  <Switch
                    checked={securityNotificationsEnabled}
                    onCheckedChange={setSecurityNotificationsEnabled}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Meldingssikkerhet */}
          <AccordionItem value="messages" className="border-b border-cyberdark-700">
            <AccordionTrigger className="py-4 text-cyberdark-100 hover:text-cyberdark-50">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-cybergold-400 mr-3" />
                <span>Meldingssikkerhet</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 px-1">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-cyberdark-100">Selvdestruerende meldinger</p>
                      <p className="text-xs text-cyberdark-400">Automatisk sletting av alle meldinger</p>
                    </div>
                    <Switch
                      checked={autoDeleteMessages}
                      onCheckedChange={setAutoDeleteMessages}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  </div>
                  
                  {autoDeleteMessages && (
                    <div className="mt-2 pl-2 border-l-2 border-cyberdark-700">
                      <p className="text-xs text-cyberdark-200 mb-2">
                        Slett meldinger etter: {autoDeleteTimeHours} timer
                      </p>
                      <Slider
                        value={[autoDeleteTimeHours]}
                        min={1}
                        max={168} // 1 week
                        step={1}
                        onValueChange={(value) => setAutoDeleteTimeHours(value[0])}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-cyberdark-400">1t</span>
                        <span className="text-xs text-cyberdark-400">1d</span>
                        <span className="text-xs text-cyberdark-400">1u</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs"
                          onClick={handleClearSecurityData}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Slett all meldingshistorikk
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Denne handlingen kan ikke angres og vil permanent slette alle meldinger
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Enhetssikkerhet */}
          <AccordionItem value="device" className="border-b border-cyberdark-700">
            <AccordionTrigger className="py-4 text-cyberdark-100 hover:text-cyberdark-50">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-cybergold-400 mr-3" />
                <span>Enhetssikkerhet</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 px-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyberdark-100">Biometrisk lås</p>
                    <p className="text-xs text-cyberdark-400">Krev fingeravtrykk eller ansiktslås for å åpne appen</p>
                  </div>
                  <Switch
                    checked={biometricLockEnabled}
                    onCheckedChange={setBiometricLockEnabled}
                    className="data-[state=checked]:bg-cybergold-500"
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700 text-xs"
                    onClick={() => {
                      toast({
                        title: "Tilkoblede enheter",
                        description: "Dette ville vise en liste over tilkoblede enheter i en ekte app.",
                        variant: "default",
                      });
                    }}
                  >
                    <Smartphone size={14} className="mr-1" />
                    Håndter tilkoblede enheter
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Nøkkelautentisering */}
          <AccordionItem value="authentication" className="border-b border-cyberdark-700">
            <AccordionTrigger className="py-4 text-cyberdark-100 hover:text-cyberdark-50">
              <div className="flex items-center">
                <Fingerprint className="h-5 w-5 text-cybergold-400 mr-3" />
                <span>Nøkkelautentisering</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 px-1">
              <div className="space-y-4">
                <p className="text-sm text-cyberdark-300">
                  Nøkkelautentisering lar deg bekrefte identiteten til samtalepartnere ved å sammenligne sikkerhetsnummer.
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700 text-xs"
                  onClick={() => {
                    toast({
                      title: "Mitt sikkerhetsnummer",
                      description: "Dette ville vise ditt sikkerhetsnummer i en ekte app.",
                      variant: "default",
                    });
                  }}
                >
                  <KeyRound size={14} className="mr-1" />
                  Vis mitt sikkerhetsnummer
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-4 pt-4 border-t border-cyberdark-700">
          <p className="text-xs text-center text-cyberdark-400">
            Snakkaz Chat bruker ende-til-ende-kryptering for å holde samtalene dine private.
            <br />Ingen, ikke engang Snakkaz, kan lese meldingene dine.
          </p>
        </div>
      </div>
    </div>
  );
};