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
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({
    message: 'Vennligst oppgi en gyldig e-postadresse.',
  }),
  password: z.string().min(8, {
    message: 'Passord må være minst 8 tegn.',
  }),
});

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signIn(values.email, values.password);
      // Siden useAuth håndterer navigering, trenger vi ikke gjøre det her
    } catch (error: unknown) {
      console.error('Login error:', error);
      setErrorMessage('Kunne ikke logge inn. Sjekk e-post og passord.');
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
              Velkommen tilbake
            </CardTitle>
            <CardDescription className="text-center text-cybergold-600">
              Logg inn med din Snakkaz-konto
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
                      <div className="text-right text-sm">
                        <Link to="/forgot-password" className="text-cybergold-500 hover:text-cybergold-400 underline-offset-4 hover:underline">
                          Glemt passord?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-cybergold-600 text-black hover:bg-cybergold-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logger inn...' : 'Logg inn'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-cyberdark-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-cyberdark-900 px-2 text-cybergold-500">eller</span>
              </div>
            </div>

            <div className="text-center text-sm text-cybergold-500">
              Har du ikke en konto?{' '}
              <Link to="/register" className="font-medium text-cybergold-400 hover:underline underline-offset-4">
                Registrer deg
              </Link>
            </div>
            
            <div className="text-center text-sm text-cybergold-500 mt-2">
              <Link to="/info" className="font-medium text-cybergold-400 hover:underline underline-offset-4">
                Mer om Snakkaz Chat
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
