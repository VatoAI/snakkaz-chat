import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminLogin.css';

/**
 * Admin Login Component for MCP Dashboard
 * 
 * Provides secure authentication for administrators accessing the MCP system.
 * Includes two-factor authentication and session management.
 */
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAdminAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpCode: ''
  });
  
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    try {
      // First step: username and password
      if (!showTwoFactor) {
        const response = await login({
          username: formData.username,
          password: formData.password,
          step: 'credentials'
        });
        
        if (response.requiresTwoFactor) {
          setShowTwoFactor(true);
        } else if (response.success) {
          navigate('/admin');
        }
      } else {
        // Second step: TOTP code
        const response = await login({
          username: formData.username,
          password: formData.password,
          totpCode: formData.totpCode,
          rememberMe,
          step: 'totp'
        });
        
        if (response.success) {
          navigate('/admin');
        }
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      
      // Lock account after 5 failed attempts
      if (loginAttempts >= 4) {
        setIsLocked(true);
        setLockoutTime(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      console.error('Login failed:', error);
    }
  };
  
  const getRemainingLockoutTime = (): string => {
    if (!lockoutTime) return '';
    const remaining = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
    return `${remaining} minutter`;
  };
  
  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="mcp-logo">⚡</div>
            <h1>Snakkaz MCP</h1>
            <p>Administrator Panel</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {isLocked ? (
            <div className="lockout-message">
              <div className="lockout-icon">🔒</div>
              <h3>Konto låst</h3>
              <p>For mange mislykkede påloggingsforsøk.</p>
              <p>Prøv igjen om {getRemainingLockoutTime()}.</p>
            </div>
          ) : (
            <>
              {!showTwoFactor ? (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Administratorbrukernavn</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      autoComplete="username"
                      placeholder="admin@snakkaz.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Passord</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading || !formData.username || !formData.password}
                  >
                    {loading ? 'Bekrefter...' : 'Fortsett'}
                  </button>
                </>
              ) : (
                <>
                  <div className="two-factor-header">
                    <h3>To-faktor autentisering</h3>
                    <p>Skriv inn 6-sifret kode fra autentiseringsappen din</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="totpCode">Autentiseringskode</label>
                    <input
                      type="text"
                      id="totpCode"
                      name="totpCode"
                      value={formData.totpCode}
                      onChange={handleInputChange}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="123456"
                      autoComplete="one-time-code"
                    />
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Husk denne enheten i 30 dager</label>
                  </div>
                  
                  <div className="button-group">
                    <button 
                      type="button" 
                      className="back-button"
                      onClick={() => setShowTwoFactor(false)}
                    >
                      Tilbake
                    </button>
                    <button 
                      type="submit" 
                      className="login-button"
                      disabled={loading || formData.totpCode.length !== 6}
                    >
                      {loading ? 'Bekrefter...' : 'Logg inn'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
        
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <span>{error}</span>
          </div>
        )}
        
        {loginAttempts > 0 && loginAttempts < 5 && (
          <div className="warning-message">
            Gjenværende forsøk: {5 - loginAttempts}
          </div>
        )}
        
        <div className="login-footer">
          <div className="security-info">
            <div className="security-item">
              <span className="security-icon">🔐</span>
              End-to-end kryptert
            </div>
            <div className="security-item">
              <span className="security-icon">📱</span>
              To-faktor autentisering
            </div>
            <div className="security-item">
              <span className="security-icon">🛡️</span>
              Sikker tilkobling
            </div>
          </div>
          
          <div className="contact-info">
            <p>Problemer med pålogging? Kontakt teknisk support.</p>
            <a href="mailto:support@snakkaz.com">support@snakkaz.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
