import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    ArrowRight,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Loader,
    Github,
    Smartphone
} from 'lucide-react';

const MobileLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn(email, password);

            if (result.success) {
                toast({
                    title: "Velkommen tilbake! 🚀",
                    description: "Du er nå logget inn i SnakkaZ",
                });
                navigate('/chat');
            } else {
                setError(result.error || 'Innlogging feilet');
            }
        } catch (err) {
            setError('En uventet feil oppstod');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-chat-container bg-slate-900">
            {/* Mobile Header */}
            <div className="mobile-chat-header">
                <div className="flex items-center justify-between">
                    <Link to="/" className="mobile-button bg-white/10 flex items-center px-3 py-2 rounded-lg">
                        <ArrowLeft size={16} className="mr-2" />
                        <span className="text-sm">Tilbake</span>
                    </Link>

                    <div className="flex items-center">
                        <Smartphone size={16} className="text-blue-400 mr-2" />
                        <span className="text-xs text-white/70">Mobil versjon</span>
                    </div>
                </div>
            </div>

            {/* Mobile Content */}
            <div className="mobile-chat-messages flex-1 flex items-center justify-center">
                <div className="mobile-card w-full max-w-sm mx-auto">
                    {/* Mobile Logo */}
                    <div className="text-center mb-8">
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
                            Norges nye chat platform
                        </p>
                    </div>

                    {/* Mobile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
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
                                </div>
                            </div>

                            {/* Password Input */}
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
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

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
                            disabled={loading}
                            className="mobile-button w-full flex items-center justify-center"
                            style={{
                                background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                boxShadow: loading ? 'none' : '0 8px 32px rgba(79, 172, 254, 0.3)'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Logger inn...
                                </>
                            ) : (
                                <>
                                    Logg inn
                                    <ArrowRight className="w-5 h-5 ml-2" />
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
                                Har du ikke konto?
                            </p>
                            <Link
                                to="/register"
                                className="mobile-button bg-white/10 hover:bg-white/20 w-full text-blue-400 border border-blue-400/30"
                            >
                                Registrer deg gratis
                            </Link>
                        </div>

                        {/* Quick features for mobile users */}
                        <div className="text-xs text-white/50 space-y-1">
                            <div className="flex items-center justify-center">
                                <span>📱 Optimalisert for mobil</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span>🔒 Sikker norsk chat</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span>⚡ Rask og enkel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileLogin;
