import React, { useState } from 'react';
import { MessageCircle, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passordene stemmer ikke overens');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Supabase registration
      console.log('Registrering med:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler API call
    } catch (error) {
      console.error('Registreringsfeil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page glass-morphism-dark">
      <div className="register-container">
        <div className="register-header">
          <div className="snakkaz-logo">
            <MessageCircle className="logo-icon" size={48} />
            <h1 className="logo-text">SnakkaZ</h1>
          </div>
          <div className="tagline">
            <Shield size={16} />
            <span>End-to-end kryptert chat for Norge</span>
          </div>
        </div>

        <form className="register-form glass-morphism-light" onSubmit={handleSubmit}>
          <Link to="/" className="back-button">
            <ArrowLeft size={16} />
            Tilbake til innlogging
          </Link>

          <h2>Opprett konto</h2>
          <p className="subtitle">Bli med i det tryggeste chat-nettverket i Norge</p>

          <div className="form-group">
            <label htmlFor="fullName">Fullt navn</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="Ola Nordmann"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-postadresse</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="din.epost@eksempel.no"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passord</label>
            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Opprett et sterkt passord"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Vis/skjul passord"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Bekreft passord</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Skriv passordet på nytt"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Vis/skjul bekreftelsespassord"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Oppretter konto...
              </>
            ) : (
              <>
                <Shield size={18} />
                Opprett sikker konto
              </>
            )}
          </button>

          <div className="terms-notice">
            <p>
              Ved å opprette en konto godtar du våre{' '}
              <a href="/terms" target="_blank">vilkår for bruk</a> og{' '}
              <a href="/privacy" target="_blank">personvernregler</a>.
            </p>
          </div>
        </form>

        <div className="security-note">
          <Shield size={14} />
          <span>Alle data krypteres med AES-256 og zero-knowledge arkitektur</span>
        </div>
      </div>
    </div>
  );
};
