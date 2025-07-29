import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const CleanLogin: React.FC = () => {
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
                    title: "✅ Velkommen tilbake!",
                    description: "Du er nå logget inn på SnakkaZ",
                });
                navigate('/chat');
            } else {
                setError(result.error || 'Innlogging feilet');
            }
        } catch (err: any) {
            setError(err.message || 'Innlogging feilet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyber-void via-cyber-dark to-cyber-void text-white">
            {/* Aurora background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="aurora-effect animate-pulse opacity-30"></div>
                <div className="stars"></div>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={() => navigate('/')}
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
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-aurora-cyan/20 rounded-2xl mb-4">
                            <span className="text-3xl font-bold text-aurora-cyan">S</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-aurora-cyan to-aurora-blue bg-clip-text text-transparent mb-2">
                            SNAKKAZ
                        </h1>
                        <p className="text-white/70">
                            Logg inn for å chatte med vennene dine
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                                    {error}
                                </div>
                            )}

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
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-aurora-cyan focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 transition-all duration-200"
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
                                        placeholder="Ditt passord"
                                        className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-aurora-cyan focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 transition-all duration-200"
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

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-aurora-cyan to-aurora-blue hover:from-aurora-blue hover:to-aurora-cyan text-cyber-dark font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        <span>Logger inn...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Logg inn</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/60">
                                Har du ikke konto?{' '}
                                <Link
                                    to="/register"
                                    className="text-aurora-cyan hover:text-aurora-blue transition-colors font-medium"
                                >
                                    Registrer deg her
                                </Link>
                            </p>
                        </div>

                        {/* Quick Demo Access */}
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => {
                                    setEmail('demo@snakkaz.com');
                                    setPassword('demo123');
                                }}
                                className="text-white/60 hover:text-white/80 text-sm transition-colors"
                            >
                                Eller prøv demo (demo@snakkaz.com)
                            </button>
                        </div>
                    </div>

                    {/* Features Preview */}
                    <div className="mt-8 text-center space-y-2">
                        <div className="flex items-center justify-center space-x-6 text-white/60">
                            <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">Sikker chat</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-aurora-cyan rounded-full"></div>
                                <span className="text-sm">Norsk platform</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-aurora-blue rounded-full"></div>
                                <span className="text-sm">Gratis å bruke</span>
                            </span>
                        </div>
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

export default CleanLogin;
