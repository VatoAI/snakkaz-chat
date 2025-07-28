import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, Shield, Crown, ArrowRight, Github, Chrome } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UltraPremiumAuthProps {
  onSuccess?: () => void;
}

const UltraPremiumAuth: React.FC<UltraPremiumAuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, { display_name: displayName });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Demo user for testing
      await signIn('demo@snakkaz.no', 'demo123456');
      onSuccess?.();
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ultra-premium-auth fade-in-ultra">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="aurora-particles">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }} />
          ))}
        </div>
      </div>

      <div className="auth-container">
        {/* Premium Header */}
        <div className="auth-header">
          <div className="logo-ultra aurora-glow">
            <h1 className="text-display">SNAKKAZ</h1>
            <div className="ultra-badge">
              <Sparkles size={14} />
              <span>ULTRA PREMIUM</span>
            </div>
          </div>
          
          <h2 className="auth-title text-luxury">
            {isLogin ? 'Velkommen tilbake' : 'Bli en del av fremtiden'}
          </h2>
          
          <p className="auth-subtitle text-elegant">
            {isLogin 
              ? 'Logg inn til din premium SnakkaZ konto' 
              : 'Opprett din eksklusive SnakkaZ konto'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="auth-form-container glass-luxury">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label className="input-label text-premium">Visningsnavn</label>
                <div className="input-wrapper">
                  <UserIcon size={18} className="input-icon" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ditt navn"
                    className="input-ultra"
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label text-premium">E-post</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="input-ultra"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label text-premium">Passord</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-ultra"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message glass-ultra">
                <Shield size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-ultra btn-primary-ultra auth-submit aurora-glow"
            >
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <span>{isLogin ? 'Logg inn' : 'Opprett konto'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="auth-actions">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-ultra btn-secondary-ultra demo-btn"
            >
              <Crown size={16} />
              <span>Demo Premium</span>
            </button>

            <div className="divider">
              <span className="text-muted">eller</span>
            </div>

            <div className="social-auth">
              <button className="btn-ultra btn-secondary-ultra social-btn" disabled>
                <Github size={18} />
                <span>GitHub</span>
              </button>
              
              <button className="btn-ultra btn-secondary-ultra social-btn" disabled>
                <Chrome size={18} />
                <span>Google</span>
              </button>
            </div>
          </div>

          {/* Switch Mode */}
          <div className="auth-switch">
            <span className="text-elegant">
              {isLogin ? 'Har du ikke konto?' : 'Har du allerede en konto?'}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="switch-btn text-premium"
            >
              {isLogin ? 'Opprett konto' : 'Logg inn'}
            </button>
          </div>
        </div>

        {/* Premium Features */}
        <div className="premium-features">
          <div className="feature-card glass-ultra">
            <Sparkles size={24} />
            <div>
              <h4 className="text-premium">4K Ultra Design</h4>
              <p className="text-elegant">Norwegian Aurora liquid glass</p>
            </div>
          </div>
          
          <div className="feature-card glass-ultra">
            <Shield size={24} />
            <div>
              <h4 className="text-premium">Enterprise Security</h4>
              <p className="text-elegant">E2E encryption & GDPR compliant</p>
            </div>
          </div>
          
          <div className="feature-card glass-ultra">
            <Crown size={24} />
            <div>
              <h4 className="text-premium">Premium Experience</h4>
              <p className="text-elegant">AI-powered Norwegian excellence</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ultra-premium-auth {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }

        .auth-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .aurora-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, var(--aurora-blue), var(--aurora-purple));
          border-radius: var(--radius-full);
          animation: float-particle linear infinite;
          opacity: 0.6;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .logo-ultra {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .logo-ultra h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .ultra-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background: linear-gradient(135deg, var(--aurora-green), var(--aurora-emerald));
          color: var(--aurora-primary);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .auth-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: var(--space-3);
        }

        .auth-subtitle {
          font-size: 1.125rem;
          opacity: 0.8;
        }

        .auth-form-container {
          padding: var(--space-8);
          border-radius: var(--radius-3xl);
          margin-bottom: var(--space-8);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .input-label {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: var(--space-4);
          color: var(--text-muted);
          z-index: 1;
        }

        .input-wrapper .input-ultra {
          padding-left: var(--space-12);
          padding-right: var(--space-12);
        }

        .password-toggle {
          position: absolute;
          right: var(--space-4);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .password-toggle:hover {
          color: var(--text-premium);
          background: var(--glass-ultra);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          color: var(--aurora-red);
          font-size: 0.875rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .auth-submit {
          padding: var(--space-4) var(--space-6);
          font-size: 1rem;
          font-weight: 700;
          justify-content: center;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: var(--radius-full);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .demo-btn {
          background: linear-gradient(135deg, var(--aurora-orange), var(--aurora-amber));
          color: var(--aurora-primary);
          font-weight: 600;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-premium);
        }

        .social-auth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .social-btn {
          justify-content: center;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-switch {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-ultra);
        }

        .switch-btn {
          background: transparent;
          border: none;
          color: var(--aurora-blue);
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
          transition: color var(--transition-fast);
        }

        .switch-btn:hover {
          color: var(--aurora-cyan);
        }

        .premium-features {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5);
          border-radius: var(--radius-xl);
          transition: all var(--transition-smooth);
        }

        .feature-card:hover {
          background: var(--glass-premium);
          transform: translateY(-2px);
        }

        .feature-card svg {
          color: var(--aurora-blue);
          flex-shrink: 0;
        }

        .feature-card h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .feature-card p {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .ultra-premium-auth {
            padding: var(--space-4);
          }

          .auth-form-container {
            padding: var(--space-6);
          }

          .logo-ultra h1 {
            font-size: 2.5rem;
          }

          .auth-title {
            font-size: 1.5rem;
          }

          .auth-subtitle {
            font-size: 1rem;
          }
        }

        @media (min-width: 768px) {
          .premium-features {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default UltraPremiumAuth;