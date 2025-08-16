/**
 * Protected Supabase Auth Component
 * MCP Server Guided - Preserves Liquid Glass Design
 */

import React, { useEffect, useState } from 'react';
import { supabase, designProtection } from '../../lib/supabase-protected';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';

interface ProtectedAuthProps {
  mode?: 'login' | 'register';
  onAuthSuccess?: () => void;
}

export const ProtectedSupabaseAuth: React.FC<ProtectedAuthProps> = ({
  mode = 'login',
  onAuthSuccess
}) => {
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Apply design protection when component mounts
    designProtection.applyLiquidGlass('.protected-auth-container');

    // If user is already logged in, trigger success
    if (user) {
      setSuccess('✅ Innlogging vellykket!');
      setTimeout(() => {
        onAuthSuccess?.();
      }, 500);
    }
  }, [user, onAuthSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passordene matcher ikke');
        }

        await signUp(email.trim(), password, email.split('@')[0]);
        setSuccess('🎉 Registrering vellykket! Sjekk e-posten din for bekreftelse.');
      } else {
        await signIn(email.trim(), password);
        setSuccess('✅ Innlogging vellykket!');
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1000);
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'En feil oppstod. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'transparent',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Force proper styling with hardcoded values */}
      <div
        style={{
          background: 'rgba(100, 181, 246, 0.08) !important',
          backdropFilter: 'blur(12px) !important',
          WebkitBackdropFilter: 'blur(12px) !important',
          borderRadius: '24px !important',
          border: '1px solid rgba(100, 181, 246, 0.2) !important',
          boxShadow: '0 8px 32px rgba(100, 181, 246, 0.15) !important',
          padding: '2rem !important',
          maxWidth: '400px !important',
          width: '100% !important',
          fontFamily: '"Space Grotesk", sans-serif !important',
          color: 'white !important'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
              textShadow: '0 0 30px rgba(100, 181, 246, 0.3)'
            }}>
              {mode === 'register' ? 'REGISTRER' : 'LOGG INN'}
            </h1>
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '32px',
              height: '32px',
              background: 'rgba(255, 193, 7, 0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'bounce 1s infinite'
            }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#f57c00' }} />
            </div>
          </div>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '1.5rem',
            fontWeight: 300
          }}>
            {mode === 'register'
              ? 'Opprett din SnakkaZ konto'
              : 'Velkommen tilbake til SnakkaZ'}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px'
          }}>
            <Shield style={{ width: '20px', height: '20px', color: '#4caf50' }} />
            <span style={{ color: '#4caf50', fontSize: '14px', fontWeight: 600 }}>Sikker norsk chat</span>
            <Zap style={{ width: '16px', height: '16px', color: '#ffeb3b', animation: 'pulse 2s infinite' }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              <Mail style={{ width: '16px', height: '16px' }} />
              <span>E-post</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.com"
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  background: 'rgba(100, 181, 246, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(100, 181, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(100, 181, 246, 0.6)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(100, 181, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 181, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              <Lock style={{ width: '16px', height: '16px' }} />
              <span>Passord</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ditt passord"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 1.5rem',
                  background: 'rgba(100, 181, 246, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(100, 181, 246, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(100, 181, 246, 0.6)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(100, 181, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(100, 181, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.background = 'none';
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Eye style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                <Lock style={{ width: '16px', height: '16px' }} />
                <span>Bekreft passord</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Gjenta passord"
                  required
                  minLength={6}
                  className="w-full px-6 py-4 bg-black/30 backdrop-blur-xl border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-lg transition-all duration-300 hover:bg-black/40"
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 rounded-2xl p-4 text-green-200 text-center">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl p-4 text-red-200 text-center">
              🚫 {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-indigo-600/80 hover:from-blue-700/90 hover:via-purple-700/90 hover:to-indigo-700/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-bold text-lg shadow-2xl backdrop-blur-sm border border-white/20 disabled:hover:shadow-none transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{mode === 'register' ? 'Registrerer...' : 'Logger inn...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🚀 {mode === 'register' ? 'Registrer' : 'Logg inn'}</span>
              </div>
            )}
          </button>

          {/* Demo Login Button - For Development */}
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => {
                // Set demo user in session for development
                sessionStorage.setItem('demo-user', JSON.stringify({
                  id: 'demo-user',
                  email: 'demo@snakkaz.no',
                  created_at: new Date().toISOString()
                }));
                
                setSuccess('✅ Demo innlogging vellykket!');
                setTimeout(() => {
                  onAuthSuccess?.();
                }, 500);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.8), rgba(255, 140, 0, 0.8))',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '12px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 165, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🧪 Demo Login (Utvikling)
            </button>
          )}
        </form>

        {/* Footer with design protection indicator */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#4caf50',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '8px 16px',
            borderRadius: '9999px',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: '0 auto',
            width: 'fit-content'
          }}>
            <Shield style={{ width: '16px', height: '16px' }} />
            <span>Supabase + Liquid Glass Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedSupabaseAuth;
