import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/snakkaz-unified-design-system.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        acceptTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passordene matcher ikke');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Passordet må være minst 6 tegn');
            setLoading(false);
            return;
        }

        if (!formData.acceptTerms) {
            setError('Du må akseptere vilkårene');
            setLoading(false);
            return;
        }

        try {
            console.log('🌊 Attempting Supabase registration for:', formData.email);

            // Real Supabase registration
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim(),
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        display_name: formData.fullName
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                console.log('✅ Supabase registration successful:', data.user.email);
                // Check if user needs to confirm email
                if (!data.session) {
                    setError('Sjekk e-posten din for bekreftelseslink!');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    navigate('/main');
                }
            }
        } catch (err: any) {
            console.error('❌ Registration error:', err);
            setError(err.message || 'Registrering feilet. Prøv igjen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="snakkaz-page snakkaz-flex snakkaz-flex-center">
            {/* Universal Aurora Background */}
            <div className="snakkaz-aurora-bg">
                <div className="snakkaz-aurora-layer-1"></div>
                <div className="snakkaz-aurora-layer-2"></div>
            </div>

            {/* Main Container */}
            <div className="snakkaz-container snakkaz-container-elevated" style={{ maxWidth: '500px', width: '100%' }}>
                {/* Header */}
                <div className="snakkaz-text-center" style={{ marginBottom: 'var(--snakkaz-space-xl)' }}>
                    <h1 className="snakkaz-header-title">SNAKKAZ</h1>
                    <p className="snakkaz-header-subtitle">Opprett din konto og start å chatte</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="snakkaz-form">
                    {/* Full Name Field */}
                    <div className="snakkaz-form-group">
                        <label className="snakkaz-form-label">
                            👤 Fullt navn
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            placeholder="Ditt fulle navn"
                            required
                            className="snakkaz-input"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="snakkaz-form-group">
                        <label className="snakkaz-form-label">
                            📧 E-post
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="din@email.com"
                            required
                            className="snakkaz-input"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="snakkaz-form-group">
                        <label className="snakkaz-form-label">
                            🔒 Passord (min 6 tegn)
                        </label>
                        <div className="snakkaz-relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Velg et sikkert passord"
                                required
                                className="snakkaz-input"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="snakkaz-absolute"
                                style={{
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

                    {/* Confirm Password Field */}
                    <div className="snakkaz-form-group">
                        <label className="snakkaz-form-label">
                            🔒 Bekreft passord
                        </label>
                        <div className="snakkaz-relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                placeholder="Skriv passordet igjen"
                                required
                                className="snakkaz-input"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="snakkaz-absolute"
                                style={{
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
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="snakkaz-flex" style={{ alignItems: 'center', gap: 'var(--snakkaz-space-sm)' }}>
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                            style={{
                                width: '20px',
                                height: '20px',
                                accentColor: 'var(--snakkaz-primary)'
                            }}
                        />
                        <label htmlFor="acceptTerms" style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}>
                            Jeg aksepterer{' '}
                            <Link to="/terms" style={{
                                color: 'var(--snakkaz-primary)',
                                textDecoration: 'underline'
                            }}>
                                vilkårene
                            </Link>
                            {' '}og{' '}
                            <Link to="/privacy" style={{
                                color: 'var(--snakkaz-primary)',
                                textDecoration: 'underline'
                            }}>
                                personvernreglene
                            </Link>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="snakkaz-form-error snakkaz-text-center" style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            borderRadius: 'var(--snakkaz-radius-sm)',
                            padding: 'var(--snakkaz-space-sm)',
                            color: 'var(--snakkaz-error)'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={loading ? 'snakkaz-button' : 'snakkaz-button snakkaz-button-primary'}
                        style={{ width: '100%' }}
                    >
                        {loading ? (
                            <div className="snakkaz-flex snakkaz-flex-center" style={{ gap: 'var(--snakkaz-space-sm)' }}>
                                <div className="snakkaz-spinner"></div>
                                Oppretter konto...
                            </div>
                        ) : (
                            '🎉 Opprett konto'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="snakkaz-text-center" style={{
                    marginTop: 'var(--snakkaz-space-xl)',
                    paddingTop: 'var(--snakkaz-space-xl)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 'var(--snakkaz-space-md)' }}>
                        Har du allerede konto?
                    </p>
                    <Link
                        to="/login"
                        className="snakkaz-button snakkaz-button-secondary"
                        style={{ textDecoration: 'none' }}
                    >
                        🔑 Logg inn her
                    </Link>
                </div>

                {/* Features Preview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'var(--snakkaz-space-sm)',
                    marginTop: 'var(--snakkaz-space-xl)'
                }}>
                    <div className="snakkaz-badge snakkaz-badge-success">💬 Gratis chat</div>
                    <div className="snakkaz-badge snakkaz-badge-success">🔒 E2E Kryptering</div>
                    <div className="snakkaz-badge snakkaz-badge-success">🇳🇴 På norsk</div>
                    <div className="snakkaz-badge snakkaz-badge-success">⚡ Lynrask</div>
                </div>
            </div>

        </div>
    );
};

export default Register;
