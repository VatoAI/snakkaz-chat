import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { IconBolt, IconShield, IconStar, IconUsers } from '@tabler/icons-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🌊 Attempting Supabase login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('✅ Supabase login successful:', data.user.email);
        navigate('/main');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login feilet. Sjekk e-post og passord.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--snakkaz-dark) 0%, var(--snakkaz-surface) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-body)',
      position: 'relative'
    }}>
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

      {/* Main Container */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        padding: '3rem',
        maxWidth: '450px',
        width: '100%',
        animation: 'fadeInUp 1s ease-out'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            SNAKKAZ
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '300'
          }}>
            Logg inn for å chatte med vennene dine
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--snakkaz-primary)',
              marginBottom: '0.5rem'
            }}>
              📧 E-post
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
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--snakkaz-primary)';
                e.target.style.boxShadow = '0 0 20px rgba(100, 181, 246, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--glass-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--snakkaz-primary)',
              marginBottom: '0.5rem'
            }}>
              🔒 Passord
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--snakkaz-primary)';
                  e.target.style.boxShadow = '0 0 20px rgba(100, 181, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--glass-border)';
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
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
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
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? 'rgba(255, 255, 255, 0.1)'
                : 'linear-gradient(135deg, var(--snakkaz-primary) 0%, var(--snakkaz-secondary) 100%)',
              color: loading ? 'rgba(255, 255, 255, 0.5)' : 'var(--snakkaz-dark)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: loading ? 'none' : 'translateY(-2px)',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(100, 181, 246, 0.4)'
            }}
          >
            {loading ? '🔄 Logger inn...' : '🚀 Logg inn'}
          </button>
        </form>

        {/* Register Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
            Har du ikke konto?
          </p>
          <Link
            to="/register"
            style={{
              color: 'var(--snakkaz-primary)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = 'var(--snakkaz-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = 'var(--snakkaz-primary)';
            }}
          >
            📝 Registrer deg her
          </Link>
        </div>

        {/* Demo Info - Telegram Style Superpower Cards */}
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gap: '1rem'
        }}>
          {/* Beta Tester Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
              Telegram Beta Testers Welcome!
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
              Group Chat + Marketplace Hybrid Platform
            </div>
          </div>

          {/* Demo Credentials */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
              🧪 Demo Login
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              demo@snakkaz.com / demo
            </div>
          </div>

          {/* Feature Grid - Superpower Style */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            fontSize: '0.8rem'
          }}>
            {/* Real-time Sync Feature */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Animated Background */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <IconBolt size={16} style={{ color: '#22d3ee', marginBottom: '0.25rem' }} />
                <div style={{ color: '#22d3ee', fontWeight: '600' }}>💬 Liquid Messaging</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Real-time Sync</div>
              </div>
            </div>

            {/* Group Features */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite 0.5s'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <IconUsers size={16} style={{ color: '#22c55e', marginBottom: '0.25rem' }} />
                <div style={{ color: '#22c55e', fontWeight: '600' }}>👥 Group Chat</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>200k+ members</div>
              </div>
            </div>

            {/* AI Superpowers */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite 1s'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <IconShield size={16} style={{ color: '#a855f7', marginBottom: '0.25rem' }} />
                <div style={{ color: '#a855f7', fontWeight: '600' }}>⚡ AI Superpowers</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Context Aware</div>
              </div>
            </div>

            {/* Marketplace */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite 1.5s'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <IconStar size={16} style={{ color: '#fbbf24', marginBottom: '0.25rem' }} />
                <div style={{ color: '#fbbf24', fontWeight: '600' }}>🛒 Marketplace</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Hybrid Platform</div>
              </div>
            </div>
          </div>

          {/* Telegram Integration Status */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 1s ease-in-out infinite'
              }} />
              <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>
                Ready for Telegram Testing
              </div>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
              Mobile Optimized 📱
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes liquidDream {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    33% { transform: scale(1.1) rotate(1deg); }
                    66% { transform: scale(0.9) rotate(-1deg); }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1) rotate(0deg);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: scale(1.1) rotate(2deg);
                        opacity: 0.6;
                    }
                }
            `}</style>
    </div>
  );
};

export default Login;
