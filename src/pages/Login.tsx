
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = (email: string, password: string) => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('E-post er påkrevd');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Vennligst skriv inn en gyldig e-postadresse');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Passord er påkrevd');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Passordet må være minst 6 tegn');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (email: string, password: string) => {
    if (!validateForm(email, password)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error details:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Påloggingsfeil",
            description: "Feil e-post eller passord. Hvis du nettopp registrerte deg, sjekk at du har bekreftet e-posten din.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "E-post ikke bekreftet",
            description: "Vennligst bekreft e-posten din før du logger inn. Sjekk innboksen din for en bekreftelseslenke.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Påloggingsfeil",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Suksess!",
          description: "Du er nå logget inn.",
        });
        window.location.href = 'https://www.SnakkaZ.com/chat';
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Uventet feil",
        description: "Kunne ikke logge inn. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    if (!validateForm(email, password)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://www.SnakkaZ.com/chat'
        }
      });

      if (error) {
        console.error('Signup error details:', error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Registreringsfeil",
            description: "En bruker med denne e-postadressen eksisterer allerede. Prøv å logge inn i stedet.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registreringsfeil",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Registrering vellykket",
          description: "Vi har sendt deg en e-post med en bekreftelseslenke. Vennligst bekreft e-posten din før du logger inn.",
        });
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Uventet feil",
        description: "Kunne ikke registrere bruker. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout>
      <LoginForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        isLoading={isLoading}
        emailError={emailError}
        passwordError={passwordError}
      />
    </LoginLayout>
  );
};

export default Login;
