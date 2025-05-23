import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useTOTP } from '../hooks/useTOTP';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Download, RefreshCw, AlertTriangle, Shield, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BackupCodeManager: React.FC = () => {
  const { generateBackupCodes, loading } = useTOTP();
  const { user } = useAuth();
  const { toast } = useToast();
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const loadBackupCodes = useCallback(() => {
    if (user?.user_metadata?.backup_codes) {
      setBackupCodes(user.user_metadata.backup_codes);
    }
  }, [user?.user_metadata?.backup_codes]);

  useEffect(() => {
    loadBackupCodes();
  }, [loadBackupCodes]);

  const handleGenerateNewCodes = async () => {
    setIsGenerating(true);
    try {
      const newCodes = generateBackupCodes();
      setBackupCodes(newCodes);
      toast({
        title: "Nye sikkerhetskoder generert",
        description: "Dine nye sikkerhetskoder er klare. Lagre dem på et sikkert sted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved generering",
        description: "Kunne ikke generere nye sikkerhetskoder. Prøv igjen.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Kopiert!",
        description: "Sikkerhetskoden er kopiert til utklippstavlen.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feil ved kopiering",
        description: "Kunne ikke kopiere koden. Prøv å markere og kopiere manuelt.",
      });
    }
  };

  const downloadCodes = () => {
    const codesText = backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n');
    const blob = new Blob([
      `Snakkaz Chat - Sikkerhetskoder for totrinnsgodkjenning\n`,
      `Generert: ${new Date().toLocaleString('no-NO')}\n\n`,
      `VIKTIG: Lagre disse kodene på et sikkert sted!\n`,
      `Hver kode kan kun brukes én gang.\n\n`,
      `Sikkerhetskoder:\n`,
      codesText
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snakkaz-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Koder lastet ned",
      description: "Sikkerhetskodene er lastet ned som en tekstfil.",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-cybergold-500" />
          <span className="ml-2 text-cybergold-300">Laster sikkerhetskoder...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-cyberdark-900/80 border-cyberdark-700">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-cybergold-500" />
          <CardTitle className="text-cybergold-300">Sikkerhetskoder</CardTitle>
        </div>
        <CardDescription className="text-cyberdark-300">
          Sikkerhetskoder kan brukes til å logge inn hvis du mister tilgang til autentiseringsappen din.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {backupCodes.length > 0 ? (
          <>
            <Alert className="bg-amber-900/20 border-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-amber-200">
                Hver sikkerhetskode kan kun brukes én gang. Lagre dem på et sikkert sted!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-cyberdark-800 rounded border border-cyberdark-600"
                >
                  <code className="text-cybergold-300 font-mono text-sm">
                    {code}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(code, index)}
                    className="h-6 w-6 p-0 hover:bg-cyberdark-700"
                  >
                    {copiedIndex === index ? (
                      <Badge variant="secondary" className="text-xs">
                        ✓
                      </Badge>
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={downloadCodes}
                className="flex-1 border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Last ned koder
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateNewCodes}
                disabled={isGenerating}
                className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Generer nye koder
              </Button>
            </div>
          </>
        ) : (
          <>
            <Alert className="bg-blue-900/20 border-blue-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                Du har ingen sikkerhetskoder ennå. Generer dem for å ha en backup-metode for pålogging.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleGenerateNewCodes}
              disabled={isGenerating}
              className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Generer sikkerhetskoder
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
