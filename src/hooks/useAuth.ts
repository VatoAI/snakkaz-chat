import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAutoLogoutTime, setIsRemembered, session, user } = useAuthContext();

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

  const handleLogin = async (email: string, password: string, rememberMe: boolean = true) => {
    if (!validateForm(email, password)) {
      return;
    }

    setIsLoading(true);

    try {
      // Set session expiration based on rememberMe choice
      const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day in seconds
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          expiresIn: expiresIn
        }
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
        // Store the remember me preference in context and localStorage
        setIsRemembered(rememberMe);
        
        toast({
          title: "Suksess!",
          description: "Du er nå logget inn.",
        });
        navigate('/chat');
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
          emailRedirectTo: 'https://www.snakkaz.com/chat'
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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Utlogget",
        description: "Du er nå logget ut.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Utloggingsfeil",
        description: "Kunne ikke logge ut. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    emailError,
    passwordError,
    handleLogin,
    handleSignup,
    signOut,
    session,
    user
  };
};
