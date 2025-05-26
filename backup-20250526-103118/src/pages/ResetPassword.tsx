import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';

const formSchema = z.object({
  password: z.string()
    .min(8, {
      message: 'Passord må være minst 8 tegn.',
    })
    .regex(/[A-Z]/, {
      message: 'Passord må inneholde minst én stor bokstav.',
    })
    .regex(/[0-9]/, {
      message: 'Passord må inneholde minst ett tall.',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Passord må inneholde minst ett spesialtegn.',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passordene samsvarer ikke.',
  path: ['confirmPassword'],
});

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Sjekk om bruker har en gyldig tilbakestillingstoken fra URL
  useEffect(() => {
    const checkForToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setErrorMessage('Kunne ikke verifisere tilbakestillingsforespørselen. Token kan være utløpt eller ugyldig.');
        return;
      }
      
      if (data && data.session) {
        setHasToken(true);
      } else {
        // Sjekk URL-parametere for token
        const fragmentString = window.location.hash.substring(1);
        const fragment = new URLSearchParams(fragmentString);
        
        const accessToken = fragment.get('access_token');
        const refreshToken = fragment.get('refresh_token');
        
        if (accessToken) {
          try {
            // Bruk token fra URL for å sette opp session
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            setHasToken(true);
          } catch (error) {
            console.error('Error setting session:', error);
            setErrorMessage('Ugyldig eller utløpt tilbakestillingslenke. Be om en ny lenke.');
          }
        } else {
          setErrorMessage('Ingen gyldig tilbakestillingstoken funnet. Vennligst be om en ny tilbakestillingslenke.');
        }
      }
    };
    
    checkForToken();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: 'Passord oppdatert',
        description: 'Ditt passord har blitt oppdatert. Du kan nå logge inn med ditt nye passord.',
      });
      
      // Vent litt før vi navigerer for å gi brukeren tid til å se toastmeldingen
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Kunne ikke oppdatere passord. Vennligst prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyberdark-950">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/logos/snakkaz-gold.svg" 
            alt="Snakkaz Logo" 
            className="h-16 w-auto"
            onError={(e) => {
              // Fallback til PNG hvis SVG ikke lastes
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/logos/snakkaz-gold.png";
            }}
          />
        </div>
        <Card className="border-cybergold-600/20 bg-cyberdark-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-cybergold-400">
              Tilbakestill passord
            </CardTitle>
            <CardDescription className="text-center text-cybergold-600">
              Opprett et nytt passord for kontoen din
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {!hasToken ? (
              <div className="text-center py-6">
                <p className="text-cybergold-500 mb-6">
                  Venter på verifisering av tilbakestillingsforespørselen...
                </p>
                <Link 
                  to="/forgot-password"
                  className="text-cybergold-400 hover:text-cybergold-300 underline underline-offset-4"
                >
                  Be om en ny tilbakestillingslenke
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cybergold-300">Nytt passord</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-cybergold-500" />
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-xs text-cybergold-500 hover:text-cybergold-400"
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
                        <FormLabel className="text-cybergold-300">Bekreft nytt passord</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-cybergold-500" />
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Oppdaterer...' : 'Oppdater passord'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-cybergold-500 hover:text-cybergold-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake til innlogging
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;