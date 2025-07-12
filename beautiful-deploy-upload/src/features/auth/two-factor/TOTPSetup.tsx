/**
 * TOTP (Time-based One-Time Password) Setup Component
 * 
 * Implementerer 2FA setup med QR-kode for autentisering apps som Google Authenticator
 * Del av STRATEGISK UTVIKLINGSPLAN - FASE 1: Sikkerhet
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Smartphone, Key, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateTOTPSecret, generateTOTPToken, verifyTOTPToken, generateQRCodeURL } from './useTOTP';

interface TOTPSetupProps {
  userId: string;
  userEmail: string;
  onSetupComplete: (secret: string, backupCodes: string[]) => void;
  onCancel: () => void;
}

export const TOTPSetup: React.FC<TOTPSetupProps> = ({
  userId,
  userEmail,
  onSetupComplete,
  onCancel
}) => {
  const [secret, setSecret] = useState<string>('');
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentTab, setCurrentTab] = useState('qr-setup');

  useEffect(() => {
    // Generer nytt TOTP secret og QR-kode
    const newSecret = generateTOTPSecret();
    const qrURL = generateQRCodeURL(newSecret, userEmail, 'Snakkaz Chat');
    
    setSecret(newSecret);
    setQrCodeURL(qrURL);

    // Generer backup-koder
    const codes = generateBackupCodes();
    setBackupCodes(codes);
  }, [userEmail]);

  const generateBackupCodes = (): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      // Generer 8-tegns alfanumerisk backup-kode
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Vennligst skriv inn en 6-tegns verifikasjonskode');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = verifyTOTPToken(secret, verificationCode);
      
      if (isValid) {
        setIsSetupComplete(true);
        setCurrentTab('backup-codes');
      } else {
        setError('Ugyldig verifikasjonskode. Prøv igjen.');
      }
    } catch (err) {
      setError('Feil ved verifisering av kode');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteSetup = () => {
    onSetupComplete(secret, backupCodes);
  };

  const downloadBackupCodes = () => {
    const content = `SNAKKAZ CHAT - 2FA BACKUP KODER
Generert: ${new Date().toLocaleDateString('no-NO')}
Bruker: ${userEmail}

VIKTIG: Lagre disse kodene på et sikkert sted!
Hver kode kan kun brukes én gang.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

IKKE DEL DISSE KODENE MED ANDRE!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snakkaz-2fa-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-md mx-auto bg-cyberdark-900 border-cybergold-600">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-cybergold-600/20 rounded-full w-16 h-16 flex items-center justify-center">
          <Shield className="h-8 w-8 text-cybergold-400" />
        </div>
        <CardTitle className="text-cybergold-200">Sett opp To-faktor autentisering</CardTitle>
        <CardDescription className="text-cyberdark-300">
          Sikre kontoen din med et ekstra lag beskyttelse
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="qr-setup" className="text-xs">
              <QrCode className="h-4 w-4 mr-1" />
              QR-kode
            </TabsTrigger>
            <TabsTrigger value="manual-setup" className="text-xs">
              <Key className="h-4 w-4 mr-1" />
              Manuell
            </TabsTrigger>
            <TabsTrigger value="backup-codes" disabled={!isSetupComplete} className="text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Backup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-setup" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                <QRCodeSVG value={qrCodeURL} size={200} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-cybergold-200">
                  <Smartphone className="inline h-4 w-4 mr-2" />
                  Skann QR-koden
                </h3>
                <p className="text-sm text-cyberdark-300">
                  Bruk en autentisering app som Google Authenticator, Authy, eller Microsoft Authenticator
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code" className="text-cybergold-300">
                  Skriv inn 6-tegns koden fra appen
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest bg-cyberdark-800 border-cybergold-500/30"
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-cyberred-600 bg-cyberred-900/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1 border-cyberdark-600 text-cyberdark-300"
                >
                  Avbryt
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="flex-1 bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-900"
                >
                  {isVerifying ? 'Verifiserer...' : 'Verifiser'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual-setup" className="space-y-4">
            <div className="space-y-4">
              <Alert className="border-cybergold-600 bg-cybergold-900/20">
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Hvis du ikke kan skanne QR-koden, skriv inn denne hemmeligheten manuelt i autentisering appen din:
                </AlertDescription>
              </Alert>

              <div className="bg-cyberdark-800 p-3 rounded border border-cybergold-500/30">
                <code className="text-cybergold-400 break-all font-mono text-sm">
                  {secret}
                </code>
              </div>

              <div className="text-sm text-cyberdark-300 space-y-1">
                <p><strong>Konto:</strong> {userEmail}</p>
                <p><strong>Type:</strong> Time-based (TOTP)</p>
                <p><strong>Algorithm:</strong> SHA1</p>
                <p><strong>Intervall:</strong> 30 sekunder</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-verification-code" className="text-cybergold-300">
                  Skriv inn 6-tegns koden fra appen
                </Label>
                <Input
                  id="manual-verification-code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest bg-cyberdark-800 border-cybergold-500/30"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1 border-cyberdark-600 text-cyberdark-300"
                >
                  Avbryt
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="flex-1 bg-cybergold-600 hover:bg-cybergold-700 text-cyberdark-900"
                >
                  {isVerifying ? 'Verifiserer...' : 'Verifiser'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backup-codes" className="space-y-4">
            <Alert className="border-cybergreen-600 bg-cybergreen-900/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                2FA er nå aktivert! Lagre backup-kodene dine på et sikkert sted.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-cybergold-200">Backup-koder</h3>
              <p className="text-sm text-cyberdark-300">
                Disse kodene kan brukes hvis du mister tilgang til autentisering appen din. 
                Hver kode kan kun brukes én gang.
              </p>

              <div className="bg-cyberdark-800 p-3 rounded border border-cybergold-500/30">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="text-cybergold-400">
                      {index + 1}. {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={downloadBackupCodes}
                  className="flex-1 border-cybergold-600 text-cybergold-300"
                >
                  Last ned kodene
                </Button>
                <Button 
                  onClick={handleCompleteSetup}
                  className="flex-1 bg-cybergreen-600 hover:bg-cybergreen-700 text-cyberdark-900"
                >
                  Fullfør oppsett
                </Button>
              </div>

              <Alert className="border-cyberred-600 bg-cyberred-900/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>VIKTIG:</strong> Lagre disse kodene på et sikkert sted nå! 
                  Du vil ikke se dem igjen.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TOTPSetup;
