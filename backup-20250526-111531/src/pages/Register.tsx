import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Brukernavn må være minst 3 tegn.',
  }).max(20, {
    message: 'Brukernavn kan ikke være mer enn 20 tegn.',
  }),
  email: z.string().email({
    message: 'Vennligst oppgi en gyldig e-postadresse.',
  }),
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
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Du må godta vilkårene for å fortsette.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passordene samsvarer ikke.',
  path: ['confirmPassword'],
});

const Register: React.FC = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      // Registrer brukeren med brukernavnet inkludert i metadata
      await signUp(values.email, values.password, {
        username: values.username,
        full_name: '',  // Kan fylles ut senere i profilen
      });
      
      toast({
        title: 'Registrering vellykket!',
        description: 'Sjekk e-posten din for å bekrefte kontoen.',
      });
      
      // Reseteer skjemaet etter vellykket registrering
      form.reset();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Kunne ikke registrere konto. Prøv igjen senere.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyberdark-950 py-8">
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
              Opprett konto
            </CardTitle>
            <CardDescription className="text-center text-cybergold-600">
              Registrer deg for å starte med Snakkaz
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <FormLabel className="text-cybergold-300">Brukernavn</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-cybergold-500" />
                        <FormControl>
                          <Input
                            placeholder="ditt_brukernavn"
                            className="pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
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
                      <FormLabel className="text-cybergold-300">E-post</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-cybergold-500" />
                        <FormControl>
                          <Input
                            placeholder="din.epost@eksempel.no"
                            className="pl-10 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
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
                      <FormLabel className="text-cybergold-300">Passord</FormLabel>
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
                      <FormLabel className="text-cybergold-300">Bekreft passord</FormLabel>
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
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-cybergold-600 data-[state=checked]:border-cybergold-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-cybergold-400">
                          Jeg godtar{' '}
                          <Link to="/terms" className="text-cybergold-300 hover:underline underline-offset-4">
                            vilkårene
                          </Link>{' '}
                          og{' '}
                          <Link to="/privacy" className="text-cybergold-300 hover:underline underline-offset-4">
                            personvernerklæringen
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrerer...' : 'Registrer deg'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-cybergold-500">
              Har du allerede en konto?{' '}
              <Link to="/" className="font-medium text-cybergold-400 hover:underline underline-offset-4">
                Logg inn
              </Link>
            </div>
            
            <div className="mt-4 p-3 bg-cyberdark-800/80 border border-cybergold-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-cybergold-300">Hvorfor velge Snakkaz framfor andre apper?</span>
                </div>
                <Link 
                  to="/info" 
                  className="px-3 py-1 rounded bg-cybergold-600/30 text-xs font-medium text-cybergold-400 hover:bg-cybergold-600/40 transition-colors"
                >
                  Se fordeler
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
