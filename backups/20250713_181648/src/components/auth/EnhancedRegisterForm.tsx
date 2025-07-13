import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, User, Mail, Lock, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { useUsernameValidation, useEmailValidation } from '@/hooks/useRealTimeValidation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface EnhancedRegisterFormProps {
  onSuccess?: () => void;
  inviteCode?: string;
}

export const EnhancedRegisterForm: React.FC<EnhancedRegisterFormProps> = ({ 
  onSuccess, 
  inviteCode 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const { signUp } = useAuth();
  const { toast } = useToast();
  const { validationState: usernameState, validateUsername } = useUsernameValidation();
  const { validationState: emailState, validateEmail } = useEmailValidation();

  // Real-time username validation with debounce
  useEffect(() => {
    if (formData.username && touchedFields.has('username')) {
      const timeoutId = setTimeout(() => {
        validateUsername(formData.username);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.username, validateUsername, touchedFields]);

  // Real-time email validation with debounce  
  useEffect(() => {
    if (formData.email && touchedFields.has('email')) {
      const timeoutId = setTimeout(() => {
        validateEmail(formData.email);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.email, validateEmail, touchedFields]);

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFieldBlur = (field: string) => () => {
    setTouchedFields(prev => new Set([...prev, field]));
  };

  const getValidationIcon = (field: 'username' | 'email') => {
    const state = field === 'username' ? usernameState : emailState;
    
    if (state.isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-cyberblue-400" />;
    }
    
    if (state.isAvailable === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (state.isAvailable === false || state.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    return null;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Svakt';
    if (passwordStrength <= 2) return 'Middels';
    if (passwordStrength <= 3) return 'Bra';
    if (passwordStrength <= 4) return 'Sterkt';
    return 'Veldig sterkt';
  };

  const isFormValid = () => {
    return (
      usernameState.isAvailable === true &&
      emailState.isAvailable === true &&
      passwordStrength >= 3 &&
      formData.password === formData.confirmPassword &&
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Registrering ikke komplett",
        description: "Vennligst fyll ut alle felt korrekt før du fortsetter.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        username: formData.username,
        inviteCode
      });

      if (result.success) {
        toast({
          title: "🎉 Velkommen til SnakkaZ Beta!",
          description: "Sjekk e-posten din for å bekrefte kontoen.",
        });
        onSuccess?.();
      } else {
        toast({
          title: "Registrering feilet",
          description: result.error || "En feil oppstod. Prøv igjen.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Uventet feil",
        description: "Noe gikk galt. Prøv igjen senere.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string, field: 'username' | 'email') => {
    if (field === 'username') {
      setFormData(prev => ({ ...prev, username: suggestion }));
      setTouchedFields(prev => new Set([...prev, 'username']));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-cyberdark-900 border-cybergold-500/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-cybergold-400">
          Bli med i SnakkaZ Beta
        </CardTitle>
        <CardDescription className="text-cybergold-300">
          Opprett din konto og start å chatte sikkert
          {inviteCode && (
            <div className="mt-2 px-3 py-1 bg-cybergold-500/20 rounded-full text-xs text-cybergold-400">
              🎉 Du er invitert til beta!
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-cybergold-300">
              Brukernavn
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" />
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange('username')}
                onBlur={handleFieldBlur('username')}
                placeholder="Velg ditt brukernavn"
                className={cn(
                  "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                  usernameState.isAvailable === true && "border-green-500/50",
                  usernameState.isAvailable === false && "border-red-500/50"
                )}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getValidationIcon('username')}
              </div>
            </div>
            
            {touchedFields.has('username') && usernameState.error && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {usernameState.error}
              </p>
            )}
            
            {touchedFields.has('username') && usernameState.isAvailable === true && (
              <p className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                ✅ Dette brukernavnet er tilgjengelig!
              </p>
            )}

            {usernameState.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-cybergold-400 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Forslag:
                </p>
                <div className="flex flex-wrap gap-2">
                  {usernameState.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion, 'username')}
                      className="px-2 py-1 text-xs bg-cybergold-500/20 text-cybergold-300 rounded-md hover:bg-cybergold-500/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-cybergold-300">
              E-postadresse
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleFieldBlur('email')}
                placeholder="din@epost.no"
                className={cn(
                  "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                  emailState.isAvailable === true && "border-green-500/50",
                  emailState.isAvailable === false && "border-red-500/50"
                )}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getValidationIcon('email')}
              </div>
            </div>
            
            {touchedFields.has('email') && emailState.error && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {emailState.error}
              </p>
            )}
            
            {touchedFields.has('email') && emailState.isAvailable === true && (
              <p className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                ✅ E-posten er tilgjengelig!
              </p>
            )}

            {emailState.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-cybergold-400">
                  {emailState.suggestions[0]}
                </p>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-cybergold-300">
              Passord
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Opprett et sterkt passord"
                className="pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-cyberdark-700 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        getPasswordStrengthColor()
                      )}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-cybergold-400">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <p className="text-xs text-cybergold-500">
                  Bruk minst 8 tegn med store og små bokstaver, tall og symboler
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-cybergold-300">
              Bekreft passord
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Gjenta passordet"
                className={cn(
                  "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                  formData.confirmPassword && formData.password === formData.confirmPassword && "border-green-500/50",
                  formData.confirmPassword && formData.password !== formData.confirmPassword && "border-red-500/50"
                )}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Passordene stemmer ikke overens
              </p>
            )}
            
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Passordene stemmer overens
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black font-medium h-12 text-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Oppretter konto...
              </>
            ) : (
              "🚀 Opprett SnakkaZ Beta konto"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
