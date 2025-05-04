import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z
  .object({
    password: z.string()
      .min(8, {
        message: 'Passordet må være minst 8 tegn.',
      })
      .regex(/[A-Z]/, {
        message: 'Passordet må inneholde minst én stor bokstav.',
      })
      .regex(/[0-9]/, {
        message: 'Passordet må inneholde minst ett tall.',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Passordet må inneholde minst ett spesialtegn.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passordene samsvarer ikke',
    path: ['confirmPassword'],
  });

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Sjekk om brukeren har en gyldig passord-tilbakestillingstoken i URL
    const checkResetToken = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      if (!params.get('type') || params.get('type') !== 'recovery') {
        toast({
          variant: 'destructive',
          title: 'Ugyldig lenke',
          description: 'Tilbakestillingslenken er ugyldig eller utløpt.',
        });
        setIsTokenValid(false);
      } else {
        setIsTokenValid(true);
      }
    };

    checkResetToken();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Passord oppdatert',
        description: 'Passordet ditt har blitt tilbakestilt.',
      });
      
      // Naviger til innloggingssiden etter vellykket passord-tilbakestilling
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Feil',
        description: error.message || 'Noe gikk galt. Prøv igjen senere.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyberdark-950 p-4">
      <div className="w-full max-w-md">
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
            {isTokenValid ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cybergold-300">Nytt passord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                            {...field}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Oppdaterer...' : 'Tilbakestill passord'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center text-cybergold-400">
                <p>Ugyldig eller utløpt tilbakestillingslenke.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-cybergold-500">
              <Button
                variant="link"
                className="text-cybergold-400"
                onClick={() => navigate('/')}
              >
                Tilbake til innlogging
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;