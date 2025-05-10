import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Schema for validering av passordendring
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Gjeldende passord er påkrevd' }),
  newPassword: z.string().min(8, { message: 'Det nye passordet må være minst 8 tegn' }),
  confirmPassword: z.string().min(1, { message: 'Bekreft det nye passordet' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passordene må være like",
  path: ["confirmPassword"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordSettings: React.FC = () => {
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      setIsLoading(true);
      await updatePassword(values.currentPassword, values.newPassword);
      
      // Tilbakestill skjema etter vellykket endring
      form.reset();
      
      toast({
        title: "Passordet er oppdatert",
        description: "Passordet ditt er endret. Husk å bruke det nye passordet neste gang du logger inn.",
        variant: "default"
      });
    } catch (error) {
      console.error('Passordoppdatering feilet:', error);
      toast({
        title: "Kunne ikke oppdatere passordet",
        description: error instanceof Error ? error.message : "En feil oppsto under passordoppdateringen",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" /> Endre passord
        </CardTitle>
        <CardDescription>
          Oppdater ditt passord for å holde kontoen din sikker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nåværende passord</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Skriv inn ditt nåværende passord" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nytt passord</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Skriv inn nytt passord" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bekreft nytt passord</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Bekreft ditt nye passord" 
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Oppdaterer...' : 'Oppdater passord'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};