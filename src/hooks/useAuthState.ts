
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuthState = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/chat'
        }
      });

      if (error) {
        toast({
          title: "Påloggingsfeil",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magisk lenke sendt",
          description: "Sjekk e-posten din for påloggingslenken",
        });
      }
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke sende magisk lenke",
        variant: "destructive",
      });
    }
  };

  return {
    email,
    setEmail,
    handleMagicLinkLogin,
    handleSignOut
  };
};
