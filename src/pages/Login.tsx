import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedSupabaseAuth from '../components/auth/ProtectedSupabaseAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/chat');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-body)',
        position: 'relative'
      }}
    >
      {/* Liquid Dream Background Effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(77, 208, 225, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)
        `,
        animation: 'liquidDream 20s ease-in-out infinite',
        zIndex: -1
      }} />

      <div className="protected-auth-container liquid-glass css-protection-lock relative z-10">
        <ProtectedSupabaseAuth
          mode="login"
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default Login;
