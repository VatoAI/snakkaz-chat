
import { supabase } from "@/integrations/supabase/client";

export const useProfileValidation = () => {
  const validateUsername = async (username: string, setUsernameError: (error: string | null) => void) => {
    if (!username) {
      setUsernameError("Brukernavn kan ikke være tomt");
      return false;
    }

    if (username.length < 3) {
      setUsernameError("Brukernavn må være minst 3 tegn");
      return false;
    }

    if (username.length > 20) {
      setUsernameError("Brukernavn kan ikke være lengre enn 20 tegn");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Brukernavn kan kun inneholde bokstaver, tall og underscore");
      return false;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setUsernameError("Du må være logget inn");
      return false;
    }

    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', session.user.id)
      .maybeSingle();

    if (existingUser) {
      setUsernameError("Dette brukernavnet er allerede i bruk");
      return false;
    }

    setUsernameError(null);
    return true;
  };

  return { validateUsername };
};
