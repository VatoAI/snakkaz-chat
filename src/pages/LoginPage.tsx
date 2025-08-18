import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, Lock, Shield, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      console.log('🔐 Login attempt:', formData.email);
      navigate('/chat');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo Section */}
        <div className="login-header">
          <div className="snakkaz-logo">
            <MessageCircle size={48} className="logo-icon" />
            <h1 className="logo-text">SnakkaZ</h1>
          </div>
          <p className="tagline">
            <Shield size={16} />
            Premium • Sikker • Norsk 🇳🇴
          </p>
        </div>

        {/* Login Form */}
        <form className="login-form glass-panel" onSubmit={handleSubmit}>
          <h2>Velkommen tilbake</h2>
          <p className="subtitle">Logg inn på din sikre SnakkaZ-konto</p>

          <div className="form-group">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="din@epost.no"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passord</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Ditt sikre passord"
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Lock size={16} />
                Logg inn sikker
              </>
            )}
          </button>

          <div className="login-footer">
            <p>
              Har du ikke konto?
              <Link to="/register" className="register-link">
                Registrer deg her
              </Link>
            </p>
          </div>
        </form>

        {/* Security Note */}
        <div className="security-note">
          <Lock size={14} />
          <span>End-to-end kryptert med norsk eleganse</span>
        </div>
      </div>
    </div>
  );
};
