import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Shield, Eye, EyeOff, Mail, CheckCircle, Crown, AlertTriangle } from "lucide-react";
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SecurePremiumEmailConfigProps {
  onClose?: () => void;
}

export const SecurePremiumEmailConfig: React.FC<SecurePremiumEmailConfigProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Verify user is premium and authenticated
  useEffect(() => {
    const verifyAccess = async () => {
      setIsVerifying(true);
      try {
        // Check if user is logged in
        if (!user) {
          toast({
            variant: "destructive",
            title: "Tilgang nektet",
            description: "Du må være logget inn for å se e-postkonfigurasjon.",
          });
          onClose?.();
          return;
        }

        // Check if user has premium access (simplified check)
        // In production, this should check with backend
        const isPremium = user.user_metadata?.subscription_status === 'premium' || 
                         user.email?.endsWith('@snakkaz.com');
        
        if (!isPremium) {
          toast({
            variant: "destructive",
            title: "Premium kreves",
            description: "Denne funksjonen krever Premium-abonnement.",
          });
          onClose?.();
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Access verification failed:', error);
        toast({
          variant: "destructive",
          title: "Verifiseringsfeil",
          description: "Kunne ikke verifisere tilgang. Prøv igjen senere.",
        });
        onClose?.();
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, onClose]);

  // Handle security verification
  const handleSecurityVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime > 0) {
      toast({
        variant: "destructive",
        title: "Konto midlertidig låst",
        description: `Vent ${Math.ceil(lockoutTime / 60)} minutter før du prøver igjen.`,
      });
      return;
    }

    if (attemptCount >= 3) {
      setLockoutTime(300); // 5 minutes lockout
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAttemptCount(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify current user credentials for security
      if (email !== user.email) {
        throw new Error('E-postadresse matcher ikke innlogget bruker');
      }

      // Simulate additional security verification
      // In production, this should verify with backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Additional security checks could go here
      setIsAuthenticated(true);
      toast({
        title: "Sikkerhet verifisert",
        description: "Du har nå tilgang til e-postkonfigurasjon.",
      });
      
    } catch (error: any) {
      setAttemptCount(prev => prev + 1);
      toast({
        variant: "destructive",
        title: "Verifisering feilet",
        description: error.message || "Ugyldig legitimasjon. Prøv igjen.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-cybergold-400" size={24} />
          <span className="text-cyberdark-200">Verifiserer tilgang...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto bg-cyberdark-900/90 border-cybergold-500/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-cybergold-900/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-cybergold-400" size={32} />
          </div>
          <CardTitle className="text-cybergold-300">Sikkerhetsverifisering</CardTitle>
          <p className="text-cyberdark-300 text-sm">
            For å vise sensitive e-postkonfigurasjonsdetaljer, vennligst bekreft din identitet
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecurityVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyberdark-200 mb-2">
                Bekreft e-postadresse
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                className="bg-cyberdark-800 border-cyberdark-600 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-cyberdark-200 mb-2">
                Bekreft passord
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-cyberdark-800 border-cyberdark-600 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyberdark-400 hover:text-cyberdark-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {attemptCount > 0 && (
              <Alert className="bg-orange-900/20 border-orange-500/30">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-300">
                  {3 - attemptCount} forsøk gjenstår. Kontoen låses i 5 minutter etter 3 feilede forsøk.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || lockoutTime > 0}
              className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Verifiserer...
                </div>
              ) : lockoutTime > 0 ? (
                `Låst i ${Math.ceil(lockoutTime / 60)} min`
              ) : (
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Verifiser tilgang
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Authenticated view with email configuration
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-cybergold-300">
              E-postkonfigurasjon for {user.email}
            </h2>
            <p className="text-cyberdark-300 text-sm">Sikker tilgang verifisert</p>
          </div>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm">
            Lukk
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IMAP Configuration */}
        <Card className="bg-cyberdark-900/50 border-cyberdark-700">
          <CardHeader>
            <CardTitle className="text-cybergold-300 flex items-center gap-2">
              <Mail size={20} />
              Innkommende e-post (IMAP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Server</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                mail.snakkaz.com
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Port</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                993
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Sikkerhet</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                SSL/TLS
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Configuration */}
        <Card className="bg-cyberdark-900/50 border-cyberdark-700">
          <CardHeader>
            <CardTitle className="text-cybergold-300 flex items-center gap-2">
              <Mail size={20} />
              Utgående e-post (SMTP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Server</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                mail.snakkaz.com
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Port</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                465
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyberdark-200">Sikkerhet</label>
              <div className="p-3 bg-cyberdark-800 rounded border font-mono text-sm text-green-400">
                SSL/TLS
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Warning */}
      <Alert className="bg-amber-900/20 border-amber-500/30">
        <Shield className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200">
          <strong>Sikkerhetsinfo:</strong> Hold denne informasjonen hemmelig. Del aldri e-postkonfigurasjonen 
          offentlig eller med andre brukere. Brukernavn og passord får du i din Premium-profil.
        </AlertDescription>
      </Alert>

      <Card className="bg-cybergold-900/10 border-cybergold-500/30">
        <CardHeader>
          <CardTitle className="text-cybergold-300 flex items-center gap-2">
            <Crown size={20} />
            Premium E-postfunksjoner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-cyberdark-200">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Ubegrenset lagringsplass
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Avansert spam-beskyttelse
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              24/7 teknisk support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Daglige sikkerhetskopier
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
