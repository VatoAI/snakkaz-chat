import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passordene matcher ikke');
            setLoading(false);
            return;
        }

        try {
            // Supabase auth will be integrated here
            console.log('Register attempt:', { email, username });
            setTimeout(() => {
                setLoading(false);
                navigate('/login');
            }, 1000);
        } catch (err) {
            setError('Registrering feilet. Prøv igjen.');
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
                        Opprett ny konto
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Username Field */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--snakkaz-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            👤 Brukernavn
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? '🔄 Oppretter konto...' : '🚀 Opprett konto'}
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
                            e.target.style.color = 'var(--snakkaz-secondary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'var(--snakkaz-primary)';
                        }}
                    >
                        🔐 Logg inn her
                    </Link>
                </div>

                {/* Features */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        background: 'rgba(100, 181, 246, 0.05)',
                        border: '1px solid rgba(100, 181, 246, 0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>💎</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--snakkaz-primary)', fontWeight: '600' }}>
                            Crystal Design
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(77, 208, 225, 0.05)',
                        border: '1px solid rgba(77, 208, 225, 0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🌊</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--snakkaz-secondary)', fontWeight: '600' }}>
                            Liquid Dream
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(129, 199, 132, 0.05)',
                        border: '1px solid rgba(129, 199, 132, 0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🇳🇴</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--snakkaz-accent)', fontWeight: '600' }}>
                            Norwegian Tech
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
            `}</style>
        </div>
    );
};

export default Register;

        if (password.length < 6) {
            setError('Passordet må være minst 6 tegn');
            setLoading(false);
            return;
        }

        try {
            const result = await signUp(email, password, username);
            if (result.success) {
                toast({
                    title: "✅ Konto opprettet!",
                    description: "Sjekk e-posten din for å bekrefte kontoen",
                });
                navigate('/login');
            } else {
                setError(result.error || 'Registrering feilet');
            }
        } catch (err: any) {
            setError(err.message || 'Registrering feilet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Aurora background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent"></div>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                    <ArrowLeft size={20} />
                    <span>Tilbake</span>
                </button>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md">
                    {/* SnakkaZ Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-400/20 rounded-2xl mb-4">
                            <span className="text-3xl font-bold text-blue-400">S</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            SNAKKAZ
                        </h1>
                        <p className="text-white/70">
                            Opprett din konto og begynn å chatte
                        </p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                                    {error}
                                </div>
                            )}

                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                                    Brukernavn
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="Ditt brukernavn"
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                                    E-post
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="din@email.com"
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                    Passord
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Minst 6 tegn"
                                        className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                                    Bekreft passord
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Gjenta passordet"
                                        className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        <span>Oppretter konto...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        <span>Opprett konto</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/60">
                                Har du allerede en konto?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-400 hover:text-cyan-400 transition-colors font-medium"
                                >
                                    Logg inn her
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-6 text-center text-sm text-white/50">
                        Ved å opprette en konto godtar du våre{' '}
                        <a href="#" className="text-blue-400 hover:text-cyan-400 transition-colors">
                            brukervilkår
                        </a>{' '}
                        og{' '}
                        <a href="#" className="text-blue-400 hover:text-cyan-400 transition-colors">
                            personvernpolicy
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
        .aurora-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(79, 172, 254, 0.1) 0%,
            rgba(0, 242, 254, 0.05) 25%,
            transparent 50%
          );
          animation: aurora-rotate 20s linear infinite;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(79, 172, 254, 0.4), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(0, 242, 254, 0.3), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(79, 172, 254, 0.3), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: stars-twinkle 3s ease-in-out infinite alternate;
        }

        @keyframes aurora-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes stars-twinkle {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
      `}</style>
        </div>
    );
};

export default Register;
