import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const {
    isLoading,
    emailError,
    passwordError,
    handleLogin,
    handleSignup
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Hent eventuell redirect-destinasjon fra location state
  const redirectTo = location.state?.redirectTo || '/chat';

  // Custom handler med remember me parameter og støtte for redirect
  const handleLoginWithRememberMe = async (email: string, password: string, rememberMe: boolean) => {
    const success = await handleLogin(email, password, rememberMe);
    if (success) {
      // Hvis innloggingen var vellykket, naviger til redirect-målet
      navigate(redirectTo);
    }
  };

  useEffect(() => {
    // Omdiriger autentiserte brukere bort fra login-siden hvis de allerede er logget inn
    const checked = async () => {
      try {
        const { data } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());
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
            onLogin={handleLoginWithRememberMe}
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
