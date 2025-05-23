import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, AlertCircle, KeyRound, Smartphone } from "lucide-react";
import { useTOTP } from '../hooks/useTOTP';

interface TOTPVerificationProps {
  secret?: string;
  onVerificationSuccess: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const TOTPVerification: React.FC<TOTPVerificationProps> = ({
  secret,
  onVerificationSuccess,
  onCancel,
  loading = false
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'totp' | 'backup'>('totp');

  const { verifyTOTP, verifyBackupCode } = useTOTP();

  const handleTOTPVerification = async () => {
    if (!secret) {
      setError('Sikkerhetsnøkkel mangler');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verifiseringskoden må være 6 sifre');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const isValid = verifyTOTP(verificationCode, secret);
      
      if (isValid) {
        onVerificationSuccess();
      } else {
        setError('Ugyldig verifiseringskode. Prøv igjen.');
      }
    } catch (err) {
      setError('Feil under verifisering. Prøv igjen.');
    } finally {
      setVerifying(false);
    }
  };

  const handleBackupCodeVerification = async () => {
    if (backupCode.length !== 8) {
      setError('Backup-koden må være 8 tegn');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const result = await verifyBackupCode(backupCode);
      
      if (result.success) {
        onVerificationSuccess();
      } else {
        setError(result.error || 'Ugyldig backup-kode');
      }
    } catch (err) {
      setError('Feil under verifisering. Prøv igjen.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError(null);
  };

  const handleBackupCodeChange = (value: string) => {
    // Allow alphanumeric and limit to 8 characters
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setBackupCode(cleanValue);
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-cybergold-500/20 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="h-6 w-6 text-cybergold-400" />
        </div>
        <CardTitle className="text-xl">To-faktor verifisering</CardTitle>
        <CardDescription>
          Skriv inn koden fra din autentiseringsapp eller bruk en backup-kode
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'totp' | 'backup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totp" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Autentiseringsapp
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Backup-kode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="totp" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">6-sifret kode</Label>
              <Input
                id="verification-code"
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                disabled={loading || verifying}
              />
              <p className="text-sm text-muted-foreground text-center">
                Åpne din autentiseringsapp og skriv inn den 6-sifrede koden
              </p>
            </div>

            <Button
              onClick={handleTOTPVerification}
              disabled={loading || verifying || verificationCode.length !== 6}
              className="w-full"
            >
              {verifying ? 'Verifiserer...' : 'Verifiser kode'}
            </Button>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-code">Backup-kode</Label>
              <Input
                id="backup-code"
                type="text"
                value={backupCode}
                onChange={(e) => handleBackupCodeChange(e.target.value)}
                placeholder="ABCD1234"
                className="text-center text-lg tracking-wider font-mono"
                maxLength={8}
                disabled={loading || verifying}
              />
              <p className="text-sm text-muted-foreground text-center">
                Skriv inn en av dine 8-tegns backup-koder
              </p>
            </div>

            <Button
              onClick={handleBackupCodeVerification}
              disabled={loading || verifying || backupCode.length !== 8}
              className="w-full"
            >
              {verifying ? 'Verifiserer...' : 'Bruk backup-kode'}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Viktig:</strong> Backup-koder kan kun brukes én gang. 
                Sørg for å generere nye koder når du går tom.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {onCancel && (
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={onCancel}
              disabled={loading || verifying}
              className="w-full"
            >
              Avbryt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
