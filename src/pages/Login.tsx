
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    isLoading,
    emailError,
    passwordError,
    handleLogin,
    handleSignup
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users out of login page if already logged in
    const checked = async () => {
      try {
        const { data } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());
        if (data.session) {
          navigate('/chat');
        }
      } catch (e) { /* Ignore */ }
    };
    checked();
  }, [navigate]);

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
