
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const {
    isLoading,
    emailError,
    passwordError,
    handleLogin,
    handleSignup
  } = useAuth();

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
