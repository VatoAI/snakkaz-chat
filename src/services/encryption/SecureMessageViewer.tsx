/**
 * Secure Message Viewer
 * 
 * Component for viewing securely shared encrypted messages
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EncryptionService } from './encryptionService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Loader2, Lock, AlertTriangle, Copy, Shield } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

// Encryption service instance
const encryptionService = new EncryptionService();

const SecureMessageViewer: React.FC = () => {
  // Get the encrypted data from URL
  const { encryptedData } = useParams<{ encryptedData: string }>();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Toast
  const { toast } = useToast();
  
  // Parse and validate encrypted data
  useEffect(() => {
    if (!encryptedData) {
      setError('Ingen kryptert data funnet');
      setIsLoading(false);
      return;
    }
    
    try {
      // Decode base64 and JSON data
      const decodedData = JSON.parse(atob(decodeURIComponent(encryptedData)));
      
      // Check if expired
      if (decodedData.exp && decodedData.exp < Date.now()) {
        setIsExpired(true);
        setError('Denne meldingen har utløpt og er ikke lenger tilgjengelig.');
        setIsLoading(false);
        return;
      }
      
      // Check if password protected
      if (decodedData.pwd) {
        setNeedsPassword(true);
        setIsLoading(false);
        return;
      }
      
      // Auto-decrypt non-password protected messages
      decryptMessage(decodedData.data);
    } catch (error) {
      console.error('Error parsing encrypted data:', error);
      setError('Ugyldig eller skadet kryptert data');
      setIsLoading(false);
    }
  }, [encryptedData]);
  
  // Function to decrypt the message
  const decryptMessage = async (data: string, pwd?: string) => {
    setIsDecrypting(true);
    
    try {
      // Decode data if needed
      const encryptedData = data;
      
      // Try to decrypt
      const decrypted = pwd
        ? await encryptionService.decryptWithPassword(encryptedData, pwd)
        : await encryptionService.decrypt(encryptedData, "defaultKey") as string;
        
      setDecryptedMessage(decrypted);
      setError(null);
    } catch (error) {
      console.error('Decryption error:', error);
      setError(pwd 
        ? 'Feil passord eller skadet data' 
        : 'Kunne ikke dekryptere meldingen'
      );
    } finally {
      setIsDecrypting(false);
      setIsLoading(false);
    }
  };
  
  // Handle password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: 'Passord mangler',
        description: 'Skriv inn passordet for å åpne den krypterte meldingen.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Get the encrypted data again
      const decodedData = JSON.parse(atob(decodeURIComponent(encryptedData || '')));
      await decryptMessage(decodedData.data, password);
    } catch (error) {
      console.error('Error decrypting with password:', error);
      setError('Feil ved dekryptering. Kontroller passordet og prøv igjen.');
    }
  };
  
  // Copy message to clipboard
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(decryptedMessage || '');
      
      toast({
        title: 'Kopiert til utklippstavlen',
        description: 'Meldingen er kopiert til utklippstavlen.'
      });
    } catch (error) {
      console.error('Failed to copy message:', error);
      toast({
        title: 'Kunne ikke kopiere',
        description: 'Prøv å kopiere teksten manuelt.'
      });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-cybergold-500" />
        <p className="mt-4 text-cybergold-300">Laster sikker melding...</p>
      </div>
    );
  }
  
  // Error state
  if (error && !needsPassword && !decryptedMessage) {
    return (
      <Card className="max-w-md mx-auto bg-cyberdark-900 border-red-800/50">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-center text-cybergold-100">Kan ikke vise melding</CardTitle>
          <CardDescription className="text-center text-cybergold-400">
            {isExpired 
              ? 'Denne sikre meldingen har utløpt.'
              : 'Det oppstod et problem under dekryptering av meldingen.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-400 text-center">{error}</p>
          
          {isExpired && (
            <p className="mt-4 text-cybergold-500 text-center text-sm">
              Av sikkerhetsgrunner blir utløpte meldinger slettet permanent.
              Be avsenderen om å dele en ny sikker melding.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Password required state
  if (needsPassword && !decryptedMessage) {
    return (
      <Card className="max-w-md mx-auto bg-cyberdark-900 border-cybergold-800/50">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-cybergold-500" />
          </div>
          <CardTitle className="text-center text-cybergold-100">Passordbeskyttet melding</CardTitle>
          <CardDescription className="text-center text-cybergold-400">
            Denne sikre meldingen er beskyttet med et passord.
            Skriv inn passordet for å dekryptere og se innholdet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Skriv inn passord..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-700"
              />
              
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isDecrypting || !password.trim()}
              >
                {isDecrypting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dekrypterer...
                  </>
                ) : (
                  'Dekrypter melding'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
  
  // Decrypted message state
  return (
    <Card className="max-w-2xl mx-auto bg-cyberdark-900 border-cybergold-800/50">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-center text-cybergold-100">Sikker melding</CardTitle>
        <CardDescription className="text-center text-cybergold-400">
          Denne meldingen er ende-til-ende-kryptert og vil være tilgjengelig kun for en begrenset tid.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-cyberdark-800 border border-cyberdark-700 rounded-md p-4 whitespace-pre-wrap">
          {decryptedMessage}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          variant="outline" 
          className="border-cybergold-700 text-cybergold-400"
          onClick={copyMessage}
        >
          <Copy className="mr-2 h-4 w-4" />
          Kopier melding
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecureMessageViewer;
