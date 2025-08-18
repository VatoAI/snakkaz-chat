import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MathCaptcha } from '@/components/ui/math-captcha';
import { Shield, Users, ArrowLeft, Gift, User, Mail, Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedRegisterForm } from '@/components/auth/EnhancedRegisterForm';
import { EnhancedAvatarUpload } from '@/components/profile/EnhancedAvatarUpload';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(3, 'Brukernavn må være minst 3 tegn').max(20, 'Maks 20 tegn'),
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(8, 'Passord må være minst 8 tegn'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Du må akseptere vilkårene'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passordene stemmer ikke overens",
  path: ["confirmPassword"],
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'register' | 'avatar'>('register');
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const inviteCode = searchParams.get('ref');
  const isInvited = Boolean(inviteCode);

  const handleRegistrationSuccess = (user: any) => {
    setRegisteredUser(user);
    setCurrentStep('avatar');
    toast({
      title: "🎉 Registrering vellykket!",
      description: "Nå kan du laste opp et profilbilde.",
    });
  };

  const handleAvatarUpload = (avatarUrl: string) => {
    toast({
      title: "Profilbilde oppdatert!",
      description: "Du kan endre dette senere i innstillingene.",
    });
  };

  const handleSkipAvatar = () => {
    navigate('/beta-chat');
  };

  const handleCompleteSetup = () => {
    navigate('/beta-chat');
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!captchaValid) {
      setErrorMessage('Vennligst løs CAPTCHA-utfordringen');
      setIsLoading(false);
      return;
    }

    try {
      // Store email for potential resend
      localStorage.setItem('snakkaz_pending_email', values.email);
      
      // Registrer brukeren med brukernavnet inkludert i metadata
      await signUp(values.email, values.password, {
        username: values.username,
        full_name: '',  // Kan fylles ut senere i profilen
      });
      
      setRegistrationSuccess(true);
      
      toast({
        title: '🎉 Velkommen til SnakkaZ Beta!',
        description: 'Kontoen din er opprettet. Du blir omdirigert til chat...',
      });
      
      // Store beta signup flag
      localStorage.setItem('snakkaz_beta_user', 'true');
      
      // Redirect to beta chat after brief delay
      setTimeout(() => {
        navigate('/beta-chat');
      }, 2000);
      
      // Reseteer skjemaet etter vellykket registrering
      form.reset();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Kunne ikke registrere konto. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/logos/snakkaz-gold.png";
  }, []);

  return (
    <div className="app-background" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Glass Liquid Background Effects */}
      <div className="liquid-blob liquid-blob-1"></div>
      <div className="liquid-blob liquid-blob-2"></div>
      <div className="liquid-blob liquid-blob-3"></div>
      <div className="neural-network"></div>
      <div className="noise-overlay"></div>
      
      <div className="flex min-h-screen items-center justify-center py-8 relative z-10">
        <div className="w-full max-w-md px-4">
          {/* Logo Section with Glass Effect */}
          <div className="flex justify-center mb-8">
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="/logos/snakkaz-gold.svg" 
                alt="Snakkaz Logo" 
                className="h-16 w-auto"
                onError={handleImageError}
              />
            </div>
          </div>
          
          {/* Glass Container for Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div className="space-y-1 mb-6">
              <h2 className="text-center text-2xl font-bold text-white">
                Opprett konto
              </h2>
              <p className="text-center text-white/70">
                Registrer deg for å starte med Snakkaz
              </p>
            </div>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Brukernavn</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <FormControl>
                          <Input
                            placeholder="ditt_brukernavn"
                            style={{
                              paddingLeft: '40px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">E-post</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <FormControl>
                          <Input
                            placeholder="din.epost@eksempel.no"
                            style={{
                              paddingLeft: '40px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Passord</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            style={{
                              paddingLeft: '40px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-xs text-white/50 hover:text-white/80"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 'Skjul' : 'Vis'}
                        </button>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Bekreft passord</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            style={{
                              paddingLeft: '40px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <MathCaptcha
                    onVerificationChange={(valid, token) => {
                      setCaptchaValid(valid);
                      setCaptchaToken(token);
                    }}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white/80">
                          Jeg godtar{' '}
                          <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
                            vilkårene
                          </Link>{' '}
                          og{' '}
                          <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                            personvernerklæringen
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'Registrerer...' : 'Registrer deg'}
                </button>
              </form>
            </Form>
            
            {/* Link to login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Har du allerede en konto?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: 'rgba(102, 126, 234, 0.8)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(102, 126, 234, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(102, 126, 234, 0.8)';
                  }}
                >
                  Logg inn her
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
