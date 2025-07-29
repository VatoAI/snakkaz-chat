import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (result.success) {
        toast({
          title: "✅ Velkommen tilbake!",
          description: "Du er nå logget inn på SnakkaZ",
        });
        navigate('/chat');
      } else {
        setError(result.error || 'Innlogging feilet');
      }
    } catch (err: any) {
      setError(err.message || 'Innlogging feilet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Liquid Dream Background Effect */}
      <div style={{
        position: 'absolute',
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

      {/* Main Container - Perfect Glass Morphism */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        animation: 'fadeInUp 1s ease-out'
      }}>
        {/* Logo */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          textShadow: '0 0 30px rgba(100, 181, 246, 0.3)'
        }}>
          SNAKKAZ
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          fontWeight: 300
        }}>
          Logg inn for å chatte med vennene dine
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          {/* Email Input */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--snakkaz-primary)',
              fontWeight: 600
            }}>
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.com"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(100, 181, 246, 0.05)',
                border: '1px solid rgba(100, 181, 246, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--snakkaz-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(100, 181, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(100, 181, 246, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: 'var(--snakkaz-primary)',
              fontWeight: 600
            }}>
              Passord
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ditt passord"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingRight: '3rem',
                  background: 'rgba(100, 181, 246, 0.05)',
                  border: '1px solid rgba(100, 181, 246, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--snakkaz-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(100, 181, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 181, 246, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(229, 115, 115, 0.1)',
              border: '1px solid rgba(229, 115, 115, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#e57373',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading 
                ? 'rgba(100, 181, 246, 0.5)' 
                : 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
              color: 'var(--snakkaz-dark)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(100, 181, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.3)';
              }
            }}
          >
            {loading && <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />}
            Logg inn
          </button>
        </form>

        {/* Register Link */}
        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Har du ikke konto?{' '}
          <Link 
            to="/register" 
            style={{
              color: 'var(--snakkaz-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--snakkaz-secondary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--snakkaz-primary)';
            }}
          >
            Registrer deg her
          </Link>
        </div>

        {/* Demo Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(100, 181, 246, 0.05)',
          border: '1px solid rgba(100, 181, 246, 0.1)',
          borderRadius: '12px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div>🧪 Eller prøv demo (demo@snakkaz.com)</div>
          <div>🔒 Sikker chat</div>
          <div>🇳🇴 Norsk plattform</div>
          <div>⚡ Gratis å bruke</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
