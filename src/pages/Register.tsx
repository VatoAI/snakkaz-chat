import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
                maxWidth: '500px',
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
                        Opprett din konto og start å chatte
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Full Name Field */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--snakkaz-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            👤 Fullt navn
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            placeholder="Ditt fulle navn"
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
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
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
                            🔒 Passord (min 6 tegn)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Velg et sikkert passord"
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

                    {/* Confirm Password Field */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--snakkaz-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            🔒 Bekreft passord
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                placeholder="Skriv passordet igjen"
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                            fontSize: '0.9rem',
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
                        {loading ? '🔄 Oppretter konto...' : '🎉 Opprett konto'}
                    </button>
                </form>

                {/* Login Link */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
                        Har du allerede konto?
                    </p>
                    <Link
                        to="/login"
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
                        🔑 Logg inn her
                    </Link>
                </div>

                {/* Features Preview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    marginTop: '2rem',
                    fontSize: '0.8rem'
                }}>
                    <div style={{
                        background: 'rgba(100, 181, 246, 0.05)',
                        border: '1px solid rgba(100, 181, 246, 0.1)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: 'var(--snakkaz-primary)'
                    }}>
                        💬 Gratis chat
                    </div>
                    <div style={{
                        background: 'rgba(77, 208, 225, 0.05)',
                        border: '1px solid rgba(77, 208, 225, 0.1)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: 'var(--snakkaz-secondary)'
                    }}>
                        🔒 End-to-end kryptering
                    </div>
                    <div style={{
                        background: 'rgba(129, 199, 132, 0.05)',
                        border: '1px solid rgba(129, 199, 132, 0.1)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: 'var(--snakkaz-accent)'
                    }}>
                        🇳🇴 På norsk
                    </div>
                    <div style={{
                        background: 'rgba(100, 181, 246, 0.05)',
                        border: '1px solid rgba(100, 181, 246, 0.1)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: 'var(--snakkaz-primary)'
                    }}>
                        ⚡ Lynrask
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
            `}</style>
        </div>
    );
};

export default Register;
