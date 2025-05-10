import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';

const formSchema = z.object({
  email: z.string().email({
    message: 'Vennligst oppgi en gyldig e-postadresse.',
  }),
});

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'E-post sendt',
        description: 'Sjekk e-posten din for instruksjoner om å tilbakestille passordet.',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Kunne ikke sende e-post for tilbakestilling av passord. Prøv igjen senere.');
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
              Glemt passord
            </CardTitle>
            <CardDescription className="text-center text-cybergold-600">
              Skriv inn e-postadressen din for å tilbakestille passordet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-900/20 mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-green-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">E-post sendt</h3>
                <p className="text-cybergold-500 mb-4">
                  Sjekk innboksen din for instruksjoner om hvordan du tilbakestiller passordet ditt. 
                  Sjekk også søppelpost hvis du ikke finner e-posten.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="border-cybergold-600 text-cybergold-300 hover:bg-cyberdark-800"
                >
                  Send på nytt
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Button
                    type="submit"
                    className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sender...' : 'Send tilbakestillingslenke'}
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

export default ForgotPassword;