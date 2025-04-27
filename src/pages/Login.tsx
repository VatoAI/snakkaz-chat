
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get redirect destination from location state
  const redirectTo = location.state?.redirectTo || '/chat';

  // Handle login with remember me parameter and support for redirect
  const handleLogin = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setEmailError("");
    setPasswordError("");
    
    if (!email) {
      setEmailError("Email er påkrevd");
      return;
    }
    
    if (!password) {
      setPasswordError("Passord er påkrevd");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("email")) {
          setEmailError(error.message);
        } else if (error.message.includes("password")) {
          setPasswordError(error.message);
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
        navigate(redirectTo);
        return;
      }
    } catch (error: any) {
      toast({
        title: "Påloggingsfeil",
        description: error.message || "Kunne ikke logge inn",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup functionality
  const handleSignup = async (email: string, password: string) => {
    setEmailError("");
    setPasswordError("");
    
    if (!email) {
      setEmailError("Email er påkrevd");
      return;
    }
    
    if (!password || password.length < 6) {
      setPasswordError("Passord må være minst 6 tegn");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("email")) {
          setEmailError(error.message);
        } else {
          toast({
            title: "Registreringsfeil",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }
      
      toast({
        title: "Registrering fullført",
        description: "Sjekk e-posten din for bekreftelseslenke",
      });
    } catch (error: any) {
      toast({
        title: "Registreringsfeil",
        description: error.message || "Kunne ikke registrere bruker",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Redirect authenticated users away from login page if they're already logged in
    const checked = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate(redirectTo);
        }
      } catch (e) { /* Ignore */ }
    };
    checked();
  }, [navigate, redirectTo]);

  return (
    <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-cyberblue-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-cyberred-500/20 rounded-full filter blur-3xl animate-pulse-slow delay-200"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginLayout>
          <LoginForm
            onLogin={handleLogin}
            onSignup={handleSignup}
            isLoading={isLoading}
            emailError={emailError}
            passwordError={passwordError}
          />
        </LoginLayout>
      </div>
    </div>
  );
};

export default Login;
