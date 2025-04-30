import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BiometricsSettings: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sjekk om biometrisk autentisering er støttet av enheten
    const checkBiometricsSupport = async () => {
      try {
        // I en faktisk implementasjon ville vi sjekket med WebAuthn eller FaceID/TouchID API
        // Dette er en forenklet simulering for demonstrasjonsformål
        const supported = 'PublicKeyCredential' in window;
        setIsSupported(supported);

        // Sjekk om brukeren allerede har aktivert biometri
        const savedPreference = localStorage.getItem('biometricsEnabled');
        if (savedPreference) {
          setIsEnabled(savedPreference === 'true');
        }
      } catch (error) {
        console.error('Feil ved sjekking av biometristøtte:', error);
        setIsSupported(false);
      }
    };

    checkBiometricsSupport();
  }, []);

  const handleToggle = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      // I en faktisk implementasjon ville vi registrert/fjernet biometriske legitimasjon
      // Dette er en forenklet simulering
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler API-kall
      
      // Lagre preferanse
      localStorage.setItem('biometricsEnabled', String(enabled));
      setIsEnabled(enabled);
      
      toast({
        title: enabled ? 'Biometrisk autentisering aktivert' : 'Biometrisk autentisering deaktivert',
        description: enabled 
          ? 'Du kan nå logge inn med fingeravtrykk eller ansiktsgjenkjenning'
          : 'Biometrisk autentisering er deaktivert',
        variant: 'success'
      });
    } catch (error) {
      console.error('Feil ved endring av biometriinnstillinger:', error);
      toast({
        title: 'Kunne ikke endre biometriske innstillinger',
        description: error instanceof Error ? error.message : 'En ukjent feil oppsto',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="mr-2 h-5 w-5" /> Biometrisk autentisering
        </CardTitle>
        <CardDescription>
          Logg inn og autoriser med fingeravtrykk eller ansiktsgjenkjenning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported ? (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">
              Biometrisk autentisering er ikke støttet på denne enheten.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="biometrics-toggle" className="flex flex-col space-y-1">
                <span>Aktiver biometrisk autentisering</span>
                <span className="text-xs text-muted-foreground">
                  Bruk fingeravtrykk eller ansiktsgjenkjenning for å logge inn
                </span>
              </Label>
              <Switch 
                id="biometrics-toggle"
                checked={isEnabled}
                disabled={isLoading}
                onCheckedChange={handleToggle}
              />
            </div>
            
            {isEnabled && (
              <>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm">
                    Biometrisk autentisering er aktivert. Neste gang du logger inn, kan du bruke fingeravtrykk eller ansiktsgjenkjenning i stedet for passord.
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleToggle(false)}
                  disabled={isLoading}
                >
                  Fjern biometrisk tilgang
                </Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};