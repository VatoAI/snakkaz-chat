import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, AlertTriangle, QrCode, Copy } from 'lucide-react';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SecurityVerificationProps {
  userId: string;
  userName: string;
}

export const SecurityVerification: React.FC<SecurityVerificationProps> = ({
  userId,
  userName
}) => {
  const { user } = useAuth();
  const { verifyIdentity, getAnonymousId } = useAppEncryption();
  const { toast } = useToast();
  const [safetyNumber, setSafetyNumber] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const generateSafetyNumber = async () => {
      try {
        setIsLoading(true);
        
        // Get the user's public key from the database
        const { data, error } = await supabase
          .from('user_keys')
          .select('public_key')
          .eq('user_id', userId)
          .single();
          
        if (error || !data) {
          throw new Error('Could not fetch public key');
        }
        
        // Get own identity
        const myId = getAnonymousId();
        
        // Generate a safety number by combining and hashing both keys
        // In real implementation, this would use proper cryptographic functions
        const combinedKeys = myId + data.public_key;
        
        // Create a formatted safety number (like Signal)
        // This is a simplified version - real implementation would use SHA-256
        const fullHash = await createSha256Hash(combinedKeys);
        
        // Format the hash into 5-digit groups with spaces (Signal style)
        const formattedSafetyNumber = formatSafetyNumber(fullHash);
        setSafetyNumber(formattedSafetyNumber);
        
        // Check if this user is already verified
        const verified = await verifyIdentity(userId, data.public_key);
        setIsVerified(verified);
      } catch (error) {
        console.error('Error generating safety number:', error);
        setSafetyNumber('Error generating safety number');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && userId) {
      generateSafetyNumber();
    }
  }, [user, userId, verifyIdentity, getAnonymousId]);
  
  const createSha256Hash = async (text: string): Promise<string> => {
    // Create a hash of the input text using SHA-256
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };
  
  const formatSafetyNumber = (hash: string): string => {
    // Format the hash into groups of 5 digits separated by spaces
    const groups = [];
    for (let i = 0; i < 60; i += 5) {
      groups.push(hash.substring(i, i + 5));
    }
    return groups.join(' ');
  };
  
  const handleVerify = async () => {
    try {
      // In a real app, this would involve user confirmation after comparing numbers
      // For demo purposes, we'll simulate the verification
      
      // Get user's public key
      const { data, error } = await supabase
        .from('user_keys')
        .select('public_key')
        .eq('user_id', userId)
        .single();
        
      if (error || !data) {
        throw new Error('Could not fetch public key for verification');
      }
      
      // Store verification status
      await supabase
        .from('verified_identities')
        .upsert({
          verifier_id: user?.id,
          verified_user_id: userId,
          public_key: data.public_key,
          verified_at: new Date().toISOString()
        });
      
      setIsVerified(true);
      
      toast({
        title: "Identitet verifisert",
        description: `Du har bekreftet at dette er ${userName}. Fremtidige samtaler vil være sikre.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error verifying identity:', error);
      toast({
        title: "Verifisering mislyktes",
        description: "Kunne ikke verifisere brukerens identitet. Prøv igjen senere.",
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(safetyNumber);
    toast({
      title: "Sikkerhetsnummer kopiert",
      description: "Sikkerhetsnummeret er kopiert til utklippstavlen.",
      variant: "default"
    });
  };

  return (
    <div className="p-4 bg-cyberdark-850 border border-cybergold-500/20 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-cybergold-300">Sikkerhetsverifisering</h3>
        <Shield className="text-cybergold-500" size={20} />
      </div>
      
      {isLoading ? (
        <div className="py-4 flex justify-center">
          <div className="h-5 w-5 border-2 border-cybergold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-cyberdark-300 mb-2">
              Sikkerhetsnummer for {userName}:
            </p>
            <div className="relative">
              <pre className="bg-cyberdark-900 p-3 rounded-md text-xs font-mono text-cybergold-400 break-all">
                {safetyNumber}
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-cyberdark-400 hover:text-cybergold-400"
                onClick={copyToClipboard}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className={`mr-2 w-8 h-8 rounded-full flex items-center justify-center ${
              isVerified ? 'bg-green-600/20 text-green-500' : 'bg-cyberyellow-800/20 text-cyberyellow-500'
            }`}>
              {isVerified ? (
                <Check size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-cyberdark-100">
                {isVerified
                  ? "Identitet verifisert"
                  : "Identitet ikke verifisert"}
              </p>
              <p className="text-xs text-cyberdark-400">
                {isVerified
                  ? `Du har verifisert at dette er ${userName}`
                  : "Be brukeren dele sitt sikkerhetsnummer for å verifisere identiteten"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-cyberdark-800 border-cybergold-500/30 hover:bg-cyberdark-700"
              onClick={() => {
                toast({
                  title: "QR-kode funksjon",
                  description: "Skann brukerens QR-kode for å verifisere identiteten (prototype).",
                  variant: "default"
                });
              }}
            >
              <QrCode size={14} className="mr-2" />
              Skann QR-kode
            </Button>
            
            {!isVerified && (
              <Button 
                className="bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-900"
                onClick={handleVerify}
              >
                <Check size={14} className="mr-2" />
                Bekreft verifisering
              </Button>
            )}
          </div>
          
          <p className="mt-4 text-xs text-cyberdark-400">
            For å verifisere identiteten, sammenlign sikkerhetsnummeret med brukeren via en annen sikker kanal.
          </p>
        </>
      )}
    </div>
  );
};