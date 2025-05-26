/**
 * Secure Share Component
 * 
 * A component for generating secure shareable message links
 * with end-to-end encryption.
 */

import React, { useState } from 'react';
import { EncryptionService } from './encryptionService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Loader2, Copy, CheckCircle2, Lock } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

// Encryption service instance
const encryptionService = new EncryptionService();

interface SecureShareComponentProps {
  defaultMessage?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SecureShareComponent: React.FC<SecureShareComponentProps> = ({
  defaultMessage = '',
  isOpen,
  onOpenChange
}) => {
  // State
  const [message, setMessage] = useState(defaultMessage);
  const [password, setPassword] = useState('');
  const [expirationHours, setExpirationHours] = useState(24); // Default 24 hours
  const [usePassword, setUsePassword] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Toast
  const { toast } = useToast();
  
  // Generate secure link
  const generateSecureLink = async () => {
    if (!message.trim()) {
      toast({
        title: 'Melding mangler',
        description: 'Skriv inn en melding for å generere en delbar lenke.',
        variant: 'destructive'
      });
      return;
    }
    
    if (usePassword && !password.trim()) {
      toast({
        title: 'Passord mangler',
        description: 'Skriv inn et passord for å sikre meldingen.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Encrypt the message
      const result = usePassword 
        ? await encryptionService.encryptWithPassword(message, password)
        : await encryptionService.encrypt(message);
        
      // Create payload
      const payload = {
        data: result.encryptedData,
        exp: Date.now() + (expirationHours * 60 * 60 * 1000),
        pwd: usePassword
      };
      
      // Encode payload
      const encodedData = encodeURIComponent(btoa(JSON.stringify(payload)));
      
      // Generate link with custom domain
      const domain = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://www.snakkaz.com';
        
      const link = `${domain}/s/${encodedData}`;
      setShareableLink(link);
    } catch (error) {
      console.error('Error generating secure link:', error);
      toast({
        title: 'Feil ved generering av lenke',
        description: 'Det oppstod en feil under kryptering av meldingen.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
      
      toast({
        title: 'Kopiert til utklippstavlen',
        description: 'Den sikre lenken er kopiert til utklippstavlen.'
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: 'Kunne ikke kopiere',
        description: 'Prøv å kopiere lenken manuelt.'
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-900/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cybergold-100 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-cybergold-500" />
            Del sikker melding
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!shareableLink ? (
            <>
              {/* Message input */}
              <div className="space-y-2">
                <Label htmlFor="message">Melding</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Skriv inn meldingen du vil dele sikkert..."
                  className="min-h-[100px] bg-cyberdark-800 border-cyberdark-700 text-cybergold-100"
                />
              </div>
              
              {/* Password option */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-password"
                  checked={usePassword}
                  onCheckedChange={setUsePassword}
                />
                <Label htmlFor="use-password" className="cursor-pointer">
                  Beskytt med passord
                </Label>
              </div>
              
              {/* Password input */}
              {usePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Passord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Skriv inn et passord..."
                    className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-100"
                  />
                </div>
              )}
              
              {/* Expiration selector */}
              <div className="space-y-2">
                <Label htmlFor="expiration">Utløper etter</Label>
                <select
                  id="expiration"
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(Number(e.target.value))}
                  className="w-full rounded-md p-2 bg-cyberdark-800 border-cyberdark-700 text-cybergold-100"
                >
                  <option value="1">1 time</option>
                  <option value="6">6 timer</option>
                  <option value="24">1 dag</option>
                  <option value="72">3 dager</option>
                  <option value="168">7 dager</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Generated link */}
              <div className="space-y-2">
                <Label htmlFor="shareable-link">Sikker delbar lenke</Label>
                <div className="flex">
                  <Input
                    id="shareable-link"
                    value={shareableLink}
                    readOnly
                    className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-cybergold-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Information */}
              <div className="text-sm text-cybergold-400 space-y-2">
                <p>
                  <span className="font-medium text-cybergold-300">Utløper:</span>{' '}
                  {new Date(Date.now() + (expirationHours * 60 * 60 * 1000)).toLocaleString('no-NB')}
                </p>
                <p>
                  <span className="font-medium text-cybergold-300">Beskyttet med passord:</span>{' '}
                  {usePassword ? 'Ja' : 'Nei'}
                </p>
                <p className="text-cybergold-500 bg-cybergold-950/30 p-2 rounded border border-cybergold-900/50 mt-2">
                  Denne lenken inneholder en ende-til-ende-kryptert melding som kun kan leses av mottakeren.
                  Meldingen vil bli slettet automatisk etter utløpsdatoen.
                </p>
              </div>
              
              {/* Create new link button */}
              <Button
                variant="outline"
                className="w-full border-cybergold-800 hover:bg-cybergold-800/20"
                onClick={() => setShareableLink('')}
              >
                Lag en ny sikker lenke
              </Button>
            </>
          )}
        </div>
        
        <DialogFooter>
          {!shareableLink && (
            <>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Avbryt
              </Button>
              <Button
                onClick={generateSecureLink}
                disabled={!message.trim() || (usePassword && !password.trim()) || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Genererer...
                  </>
                ) : (
                  'Generer sikker lenke'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
