import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, UserPlus, Check, X } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import { TOTPVerification } from '../two-factor/TOTPVerification';
import { MathCaptcha } from '@/components/auth/MathCaptcha';

export const EnhancedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingUser, setPendingUser] = useState<unknown>(null);
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const { signIn, signUp, completeTwoFactorAuth, loading } = useAuth();

  // Password requirements
  const passwordRequirements = [
    { id: 'length', label: 'Minst 8 tegn', test: (pwd: string) => pwd.length >= 8 },
    { id: 'uppercase', label: 'Minst en stor bokstav', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { id: 'number', label: 'Minst ett tall', test: (pwd: string) => /[0-9]/.test(pwd) },
  ];

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!email) {
      errors.email = 'E-post er påkrevd';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ugyldig e-post format';
    }
    
    if (!password) {
      errors.password = 'Passord er påkrevd';
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      errors.confirmPassword = 'Passordene samsvarer ikke';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate on blur
  const handleEmailBlur = () => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationErrors(prev => ({ ...prev, email: 'Ugyldig e-post format' }));
    } else {
      setValidationErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always run validation and show errors
    const isValid = validateForm();
    
    if (!isValid) {
      return; // Stop here if validation fails
    }

    if (!captchaValid) {
      setError('Vennligst løs CAPTCHA-utfordringen');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const result = await signIn(email, password) as any;
        
        if (result?.requiresTwoFactor) {
          // Show 2FA verification
          setPendingUser(result.user);
          setTotpSecret(result.totpSecret || '');
          setShowTwoFactor(true);
        } else if (result && !result.success) {
          setError('Pålogging mislyktes. Sjekk e-post og passord.');
        }
      } else {
        // Register mode
        await signUp(email, password, { username: email.split('@')[0] });
        // Registration success is handled by the signUp function via toast
      }
    } catch (err) {
      setError(`Det oppstod en feil under ${mode === 'login' ? 'pålogging' : 'registrering'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    if (pendingUser) {
      setIsLoading(true);
      try {
        const result = await completeTwoFactorAuth(pendingUser) as any;
        if (result && !result.success) {
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

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setValidationErrors({});
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

  const currentLoading = isLoading || loading;

  return (
    <Card className="w-full max-w-md mx-auto liquid-glass">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-cybergold-500/20 rounded-full flex items-center justify-center mb-4">
          {mode === 'login' ? 
            <LogIn className="h-8 w-8 text-cybergold-400" /> : 
            <UserPlus className="h-8 w-8 text-cybergold-400" />
          }
        </div>
        <CardTitle className="text-2xl font-bold text-cybergold-300">
          {mode === 'login' ? 'Logg inn' : 'Registrer deg'}
        </CardTitle>
        <CardDescription className="text-cyberdark-300">
          {mode === 'login' ? 'Skriv inn dine påloggingsdetaljer' : 'Opprett en ny konto'}
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
              onBlur={handleEmailBlur}
              placeholder="din@epost.no"
              className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
              disabled={currentLoading}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-400">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-cybergold-300">Passord</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (mode === 'register') {
                    setShowPasswordRequirements(true);
                  }
                }}
                onFocus={() => mode === 'register' && setShowPasswordRequirements(true)}
                placeholder="••••••••"
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 pr-10"
                disabled={currentLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400"
                disabled={currentLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-400">{validationErrors.password}</p>
            )}
            
            {/* Password requirements for register mode */}
            {mode === 'register' && showPasswordRequirements && (
              <div className="mt-2 p-3 bg-cyberdark-950 border border-cybergold-500/20 rounded-md">
                <h4 className="text-cybergold-300 font-medium mb-2">Passordkrav:</h4>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li key={req.id} className="flex items-center text-sm">
                      {req.test(password) ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={req.test(password) ? "text-green-500" : "text-cybergold-400"}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-cybergold-300">Bekreft passord</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                disabled={currentLoading}
              />
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <MathCaptcha
              onVerificationChange={(valid, token) => {
                setCaptchaValid(valid);
                setCaptchaToken(token);
              }}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/40 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={currentLoading}
            className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
          >
            {currentLoading ? 
              (mode === 'login' ? 'Logger inn...' : 'Registrerer...') : 
              (mode === 'login' ? 'Logg inn' : 'Registrer')
            }
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-cyberdark-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Sikret med 2FA-støtte</span>
          </div>

          {/* Mode toggle */}
          <div className="text-center text-sm">
            {mode === 'login' ? (
              <span className="text-cyberdark-300">
                Har du ikke en konto?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-cybergold-500 hover:text-cybergold-400 underline"
                >
                  Registrer deg
                </button>
              </span>
            ) : (
              <span className="text-cyberdark-300">
                Har du allerede en konto?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-cybergold-500 hover:text-cybergold-400 underline"
                >
                  Logg inn
                </button>
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
