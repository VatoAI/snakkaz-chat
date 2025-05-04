import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({
    message: 'Vennligst oppgi en gyldig e-postadresse.',
  }),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'E-post sendt',
        description: 'Sjekk e-posten din for en lenke for å tilbakestille passordet.',
      });
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
              Glemt passord
            </CardTitle>
            <CardDescription className="text-center text-cybergold-600">
              Skriv inn e-postadressen din for å tilbakestille passordet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cybergold-300">E-post</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="din.epost@eksempel.no"
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
                  {isLoading ? 'Sender...' : 'Send tilbakestillingslenke'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-cybergold-500">
              <Link to="/" className="hover:text-cybergold-400 underline underline-offset-4">
                Tilbake til innlogging
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;