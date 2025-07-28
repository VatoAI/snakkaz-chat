import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Shield,
    Loader,
    Check,
    Smartphone,
    Users
} from 'lucide-react';

const MobileRegister: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Basic info, 2: Password, 3: Confirmation

    const { signUp } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Password validation
    const isPasswordValid = password.length >= 8;
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const isUsernameValid = username.length >= 3;
    const isEmailValid = email.includes('@') && email.includes('.');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        if (!doPasswordsMatch) {
            setError('Passordene matcher ikke');
            return;
        }

        if (!isPasswordValid) {
            setError('Passordet må være minst 8 tegn');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await signUp(email, password, username);

            if (result.success) {
                toast({
                    title: "Velkommen til SnakkaZ! 🎉",
                    description: "Din konto er opprettet. Sjekk e-posten din for bekreftelse.",
                });
                navigate('/login');
            } else {
                setError(result.error || 'Registrering feilet');
            }
        } catch (err) {
            setError('En uventet feil oppstod');
        } finally {
            setLoading(false);
        }
    };

    const canProceedFromStep1 = isEmailValid && isUsernameValid;
    const canProceedFromStep2 = isPasswordValid && doPasswordsMatch;

    return (
        <div className="mobile-chat-container bg-slate-900">
            {/* Mobile Header */}
            <div className="mobile-chat-header">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                        className="mobile-button bg-white/10 flex items-center px-3 py-2 rounded-lg"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        <span className="text-sm">{step > 1 ? 'Forrige' : 'Tilbake'}</span>
                    </button>

                    <div className="flex items-center">
                        <div className="flex space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i === step ? 'bg-blue-400' :
                                            i < step ? 'bg-aurora-green' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Content */}
            <div className="mobile-chat-messages flex-1 flex items-center justify-center">
                <div className="mobile-card w-full max-w-sm mx-auto">
                    {/* Mobile Logo */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                            style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
                            }}>
                            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Orbitron, monospace' }}>
                                S
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                            SNAKKAZ
                        </h1>
                        <p className="text-white/70 text-sm">
                            {step === 1 && 'Opprett din konto'}
                            {step === 2 && 'Velg et sikkert passord'}
                            {step === 3 && 'Bekreft og fullfør'}
                        </p>
                    </div>

                    {/* Mobile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Brukernavn
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                            className="mobile-input pl-10"
                                            placeholder="dittbrukernavn"
                                            required
                                            autoComplete="username"
                                            autoCapitalize="none"
                                        />
                                        {username && isUsernameValid && (
                                            <Check size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-aurora-green" />
                                        )}
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">Minst 3 tegn, kun bokstaver, tall og _</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        E-post
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mobile-input pl-10"
                                            placeholder="din@epost.no"
                                            required
                                            autoComplete="email"
                                            autoCapitalize="none"
                                        />
                                        {email && isEmailValid && (
                                            <Check size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-aurora-green" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Password */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Passord
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mobile-input pl-10 pr-10"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <div className={`text-xs flex items-center ${isPasswordValid ? 'text-aurora-green' : 'text-white/50'}`}>
                                            {isPasswordValid ? <Check size={12} className="mr-1" /> : <span className="w-3 h-3 mr-1 border border-white/30 rounded-full"></span>}
                                            Minst 8 tegn
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                        Bekreft passord
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mobile-input pl-10 pr-10"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {confirmPassword && (
                                        <div className={`text-xs mt-1 flex items-center ${doPasswordsMatch ? 'text-aurora-green' : 'text-red-400'}`}>
                                            {doPasswordsMatch ? <Check size={12} className="mr-1" /> : <span className="w-3 h-3 mr-1 border border-red-400 rounded-full"></span>}
                                            {doPasswordsMatch ? 'Passordene matcher' : 'Passordene matcher ikke'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
                                    <h3 className="text-white font-medium mb-3 flex items-center">
                                        <Users size={16} className="mr-2" />
                                        Du er klar for SnakkaZ!
                                    </h3>
                                    <div className="space-y-2 text-sm text-white/70">
                                        <div><strong>Brukernavn:</strong> {username}</div>
                                        <div><strong>E-post:</strong> {email}</div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center text-xs text-white/70">
                                        <Check size={12} className="mr-2 text-aurora-green" />
                                        Gratis for alltid
                                    </div>
                                    <div className="flex items-center text-xs text-white/70">
                                        <Check size={12} className="mr-2 text-aurora-green" />
                                        Sikker norsk chat
                                    </div>
                                    <div className="flex items-center text-xs text-white/70">
                                        <Check size={12} className="mr-2 text-aurora-green" />
                                        Ingen reklame
                                    </div>
                                    <div className="flex items-center text-xs text-white/70">
                                        <Check size={12} className="mr-2 text-aurora-green" />
                                        Mobil optimalisert
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center">
                                <Shield size={16} className="text-red-400 mr-2 flex-shrink-0" />
                                <span className="text-red-300 text-sm">{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                (step === 1 && !canProceedFromStep1) ||
                                (step === 2 && !canProceedFromStep2)
                            }
                            className="mobile-button w-full flex items-center justify-center"
                            style={{
                                background: loading ||
                                    (step === 1 && !canProceedFromStep1) ||
                                    (step === 2 && !canProceedFromStep2)
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                boxShadow: loading ? 'none' : '0 8px 32px rgba(79, 172, 254, 0.3)'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Oppretter konto...
                                </>
                            ) : step < 3 ? (
                                <>
                                    Fortsett
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            ) : (
                                <>
                                    Opprett konto
                                    <Check className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mobile Navigation */}
                    <div className="mt-6 text-center space-y-4">
                        <div className="flex items-center justify-center text-xs text-white/50">
                            <Shield className="w-3 h-3 mr-1" />
                            Sikret med norsk teknologi
                        </div>

                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/70 text-sm mb-2">
                                Har du allerede konto?
                            </p>
                            <Link
                                to="/login"
                                className="mobile-button bg-white/10 hover:bg-white/20 w-full text-blue-400 border border-blue-400/30"
                            >
                                Logg inn her
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileRegister;
