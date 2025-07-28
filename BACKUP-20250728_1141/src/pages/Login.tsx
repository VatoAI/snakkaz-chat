import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Shield, Lock, Users, ArrowLeft, Mail, Eye, EyeOff, Sparkles, Crown, Github, Chrome, ArrowRight } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      toast({
        title: "✅ Innlogget!",
        description: "Velkommen tilbake til SnakkaZ",
      });
    } catch (err: any) {
      setError(err.message || 'Innlogging feilet');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('demo@snakkaz.no', 'demo123456');
      toast({
        title: "👑 Demo innlogget!",
        description: "Velkommen til premium opplevelsen",
      });
    } catch (err: any) {
      setError('Demo innlogging feilet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="norwegian-aurora-login">
      {/* Animated Aurora Background */}
      <div className="aurora-background">
        <div className="aurora-particles">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }} />
          ))}
        </div>
        <div className="aurora-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>

      <div className="login-container">
        {/* Back Button */}
        <Link to="/beta" className="back-button glass-morphism">
          <ArrowLeft size={16} />
          <span>Tilbake</span>
        </Link>

        {/* Premium Header */}
        <div className="login-header">
          <div className="logo-container aurora-glow">
            <div className="logo-circle">
              <span className="logo-text">S</span>
            </div>
            <h1 className="brand-title">SNAKKAZ</h1>
            <div className="premium-badge">
              <Sparkles size={12} />
              <span>NORWEGIAN PREMIUM</span>
            </div>
          </div>
          
          <h2 className="welcome-title">Velkommen tilbake</h2>
          <p className="welcome-subtitle">Logg inn til din premium SnakkaZ konto</p>
        </div>

        {/* Login Form */}
        <div className="login-form-container glass-morphism-ultra">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label className="input-label">E-post</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="premium-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Passord</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="premium-input"
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
              <div className="error-message glass-morphism">
                <Shield size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn aurora-glow"
            >
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <span>Logg inn</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Premium Actions */}
          <div className="login-actions">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="demo-btn glass-morphism"
            >
              <Crown size={16} />
              <span>Demo Premium</span>
            </button>

            <div className="divider">
              <span>eller fortsett med</span>
            </div>

            {/* Custom Premium Social Buttons */}
            <div className="social-login">
              <button className="social-btn github-premium glass-morphism" disabled>
                <div className="social-icon-wrapper">
                  <Github size={18} />
                </div>
                <div className="social-content">
                  <span className="social-title">GitHub</span>
                  <span className="social-subtitle">Developer account</span>
                </div>
                <div className="social-status">Soon</div>
              </button>
              
              <button className="social-btn google-premium glass-morphism" disabled>
                <div className="social-icon-wrapper">
                  <Chrome size={18} />
                </div>
                <div className="social-content">
                  <span className="social-title">Google</span>
                  <span className="social-subtitle">Business account</span>
                </div>
                <div className="social-status">Soon</div>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="auth-switch">
            <span>Har du ikke konto?</span>
            <Link to="/register" className="switch-link">
              Opprett konto
            </Link>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">
              Glemt passord?
            </Link>
          </div>
        </div>

        {/* Premium Features */}
        <div className="premium-features">
          <div className="feature-card glass-morphism">
            <Shield size={20} />
            <div>
              <h4>Enterprise Security</h4>
              <p>E2E encryption & GDPR compliant</p>
            </div>
            <div className="feature-status verified">✅</div>
          </div>
          
          <div className="feature-card glass-morphism">
            <Users size={20} />
            <div>
              <h4>Norwegian Community</h4>
              <p>Premium norsk business chat</p>
            </div>
            <div className="feature-status norwegian">🇳🇴</div>
          </div>
          
          <div className="feature-card glass-morphism">
            <Lock size={20} />
            <div>
              <h4>Private & Secure</h4>
              <p>Military-grade protection</p>
            </div>
            <div className="feature-status secure">🔒</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .norwegian-aurora-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          background: #0a0a0f;
        }

        .aurora-background {
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
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          border-radius: 50%;
          animation: float-particle linear infinite;
          opacity: 0.7;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }

        .aurora-waves {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, 
            rgba(79, 172, 254, 0.1) 0%, 
            rgba(0, 242, 254, 0.1) 25%,
            rgba(120, 119, 198, 0.1) 50%,
            rgba(255, 111, 97, 0.1) 75%,
            rgba(79, 172, 254, 0.1) 100%);
          background-size: 400% 400%;
          animation: aurora-wave 15s ease-in-out infinite;
        }

        @keyframes aurora-wave {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          width: fit-content;
        }

        .back-button:hover {
          color: white;
          transform: translateX(-2px);
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1rem;
        }

        .glass-morphism-ultra {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo-circle {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #7877c6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(79, 172, 254, 0.4);
        }

        .logo-text {
          font-size: 1.75rem;
          font-weight: 900;
          color: white;
          font-family: 'Orbitron', monospace;
        }

        .brand-title {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #7877c6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.1em;
          font-family: 'Orbitron', monospace;
        }

        .premium-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00f2fe, #4facfe);
          color: #0a0a0f;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .welcome-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .welcome-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Space Grotesk', sans-serif;
        }

        .login-form-container {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-family: 'Space Grotesk', sans-serif;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .premium-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
        }

        .premium-input:focus {
          outline: none;
          border-color: #4facfe;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 20px rgba(79, 172, 254, 0.2);
        }

        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: #ff6b6b;
          font-size: 0.875rem;
          border: 1px solid rgba(255, 107, 107, 0.3);
          background: rgba(255, 107, 107, 0.1);
        }

        .login-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: #0a0a0f;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
          box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
        }

        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(79, 172, 254, 0.4);
        }

        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .demo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #0a0a0f;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
        }

        .demo-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: none;
          border-radius: 0.75rem;
          cursor: not-allowed;
          transition: all 0.3s ease;
          opacity: 0.7;
          font-family: 'Space Grotesk', sans-serif;
        }

        .social-icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
        }

        .github-premium .social-icon-wrapper {
          background: linear-gradient(135deg, #333, #555);
          color: white;
        }

        .google-premium .social-icon-wrapper {
          background: linear-gradient(135deg, #4285f4, #34a853);
          color: white;
        }

        .social-content {
          flex: 1;
          text-align: left;
        }

        .social-title {
          display: block;
          font-weight: 600;
          color: white;
          font-size: 0.875rem;
        }

        .social-subtitle {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        .social-status {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .auth-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .switch-link {
          color: #4facfe;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .switch-link:hover {
          color: #00f2fe;
        }

        .forgot-password {
          text-align: center;
          margin-top: 1rem;
        }

        .forgot-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #4facfe;
        }

        .premium-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .feature-card svg {
          color: #4facfe;
          flex-shrink: 0;
        }

        .feature-card div {
          flex: 1;
        }

        .feature-card h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .feature-card p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Space Grotesk', sans-serif;
        }

        .feature-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .feature-status.verified {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .feature-status.norwegian {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .feature-status.secure {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
        }

        .aurora-glow {
          box-shadow: 0 0 20px rgba(79, 172, 254, 0.2);
        }

        @media (max-width: 768px) {
          .norwegian-aurora-login {
            padding: 1rem;
          }

          .login-form-container {
            padding: 1.5rem;
          }

          .brand-title {
            font-size: 2rem;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .social-login {
            gap: 0.5rem;
          }

          .social-btn {
            padding: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
