import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ValidationState {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  suggestions: string[];
}

export const useUsernameValidation = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isChecking: false,
    isAvailable: null,
    error: null,
    suggestions: []
  });
  const { toast } = useToast();

  const generateSuggestions = (baseUsername: string): string[] => {
    const suggestions = [
      `${baseUsername}_${new Date().getFullYear()}`,
      `${baseUsername}${Math.floor(Math.random() * 999)}`,
      `${baseUsername}_beta`,
      `${baseUsername}_chat`,
      `${baseUsername}${Math.floor(Math.random() * 99)}`
    ];
    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  const validateUsername = useCallback(async (username: string, currentUserId?: string) => {
    // Reset state
    setValidationState({
      isChecking: true,
      isAvailable: null,
      error: null,
      suggestions: []
    });

    // Basic validation
    if (!username) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan ikke være tomt",
        suggestions: []
      });
      return false;
    }

    if (username.length < 3) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn må være minst 3 tegn",
        suggestions: []
      });
      return false;
    }

    if (username.length > 20) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan ikke være lengre enn 20 tegn",
        suggestions: []
      });
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan kun inneholde bokstaver, tall og underscore",
        suggestions: []
      });
      return false;
    }

    // Reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'user', 'test', 'guest', 
      'snakkaz', 'support', 'help', 'beta', 'api', 'www', 'mail',
      'chat', 'group', 'team', 'system', 'official', 'bot'
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      setValidationState({
        isChecking: false,
        isAvailable: false,
        error: "Dette brukernavnet er reservert",
        suggestions: generateSuggestions(username)
      });
      return false;
    }

    try {
      // Check if username is already taken
      const { data: existingUser, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        setValidationState({
          isChecking: false,
          isAvailable: null,
          error: "Kunne ikke sjekke brukernavn. Prøv igjen.",
          suggestions: []
        });
        return false;
      }

      // If user exists and it's not the current user, username is taken
      if (existingUser && existingUser.id !== currentUserId) {
        setValidationState({
          isChecking: false,
          isAvailable: false,
          error: "❌ Dette brukernavnet er allerede tatt",
          suggestions: generateSuggestions(username)
        });
        return false;
      }

      // Username is available
      setValidationState({
        isChecking: false,
        isAvailable: true,
        error: null,
        suggestions: []
      });
      return true;

    } catch (error) {
      console.error('Username validation error:', error);
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Nettverksfeil. Sjekk internettforbindelsen.",
        suggestions: []
      });
      return false;
    }
  }, []);

  return { validationState, validateUsername };
};

export const useEmailValidation = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isChecking: false,
    isAvailable: null,
    error: null,
    suggestions: []
  });
  const { toast } = useToast();

  const validateEmail = useCallback(async (email: string) => {
    setValidationState({
      isChecking: true,
      isAvailable: null,
      error: null,
      suggestions: []
    });

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Vennligst oppgi en gyldig e-postadresse",
        suggestions: []
      });
      return false;
    }

    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'temp-mail.org'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setValidationState({
        isChecking: false,
        isAvailable: false,
        error: "Midlertidige e-postadresser er ikke tillatt",
        suggestions: ["Bruk en permanent e-postadresse som Gmail, Outlook eller din egen domain"]
      });
      return false;
    }

    try {
      // Check if email is already registered
      const { data: existingUser, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking email:', error);
        setValidationState({
          isChecking: false,
          isAvailable: null,
          error: "Kunne ikke sjekke e-post. Prøv igjen.",
          suggestions: []
        });
        return false;
      }

      if (existingUser) {
        setValidationState({
          isChecking: false,
          isAvailable: false,
          error: "❌ E-posten er allerede registrert",
          suggestions: [`Vil du logge inn som ${existingUser.username}?`]
        });
        return false;
      }

      // Email is available
      setValidationState({
        isChecking: false,
        isAvailable: true,
        error: null,
        suggestions: []
      });
      return true;

    } catch (error) {
      console.error('Email validation error:', error);
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Nettverksfeil. Sjekk internettforbindelsen.",
        suggestions: []
      });
      return false;
    }
  }, []);

  return { validationState, validateEmail };
};
