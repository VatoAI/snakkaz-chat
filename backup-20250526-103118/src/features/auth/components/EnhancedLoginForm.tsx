import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { TOTPVerification } from '../two-factor/TOTPVerification';

export const EnhancedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [totpSecret, setTotpSecret] = useState<string>('');

  const { signIn, completeTwoFactorAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('E-post og passord er påkrevd');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      
      if (result?.requiresTwoFactor) {
        // Show 2FA verification
        setPendingUser(result.user);
        setTotpSecret(result.totpSecret || '');
        setShowTwoFactor(true);
      } else if (!result?.success) {
        setError('Pålogging mislyktes. Sjekk e-post og passord.');
      }
      // If result.success is true, navigation is handled in useAuth
    } catch (err) {
      setError('Det oppstod en feil under pålogging');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    if (pendingUser) {
      setIsLoading(true);
      try {
        const result = await completeTwoFactorAuth(pendingUser);
        if (!result.success) {
          setError(result.error || 'Feil under 2FA pålogging');
        }
      } catch (err) {
        setError('Feil under 2FA pålogging');
      } finally {
        setIsLoading(false);
        setShowTwoFactor(false);
        setPendingUser(null);
        setTotpSecret('');
      }
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setPendingUser(null);
    setTotpSecret('');
    setError(null);
  };

  if (showTwoFactor) {
    return (
      <div className="w-full max-w-md mx-auto">
        <TOTPVerification
          secret={totpSecret}
          onVerificationSuccess={handleTwoFactorSuccess}
          onCancel={handleTwoFactorCancel}
          loading={isLoading}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-cybergold-500/20 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-8 w-8 text-cybergold-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-cybergold-300">Logg inn</CardTitle>
        <CardDescription className="text-cyberdark-300">
          Skriv inn dine påloggingsdetaljer
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-cybergold-300">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-cybergold-300">Passord</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 pr-10"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/40 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
          >
            {isLoading ? 'Logger inn...' : 'Logg inn'}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-cyberdark-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Sikret med 2FA-støtte</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
