import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Login:', { email, password });
            navigate('/app');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="login-page">
            {/* Background Effects */}
            <div className="login-background">
                <div className="aurora-layer-1"></div>
                <div className="aurora-layer-2"></div>
                <div className="aurora-layer-3"></div>
            </div>

            {/* Login Card */}
            <div className="login-card">
                {/* Logo Section */}
                <div className="login-header">
                    <div className="login-logo">
                        <img src="/logos/snakkaz-logo.png" alt="SnakkaZ" className="logo-image" />
                    </div>
                    <h1 className="login-title">Welcome to SnakkaZ</h1>
                    <p className="login-subtitle">Sign in to continue to your conversations</p>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className="input-icon">✉️</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-wrapper">
                            <input type="checkbox" />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        className="login-button"
                    >
                        Sign In
                    </Button>
                </form>

                {/* Divider */}
                <div className="divider">
                    <span className="divider-text">or continue with</span>
                </div>

                {/* Social Login */}
                <div className="social-buttons">
                    <Button variant="secondary" className="social-button">
                        <span className="social-icon">🍎</span>
                        Apple
                    </Button>
                    <Button variant="secondary" className="social-button">
                        <span className="social-icon">🔍</span>
                        Google
                    </Button>
                </div>

                {/* Register Link */}
                <div className="register-prompt">
                    <span>Don't have an account? </span>
                    <Link to="/register" className="register-link">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
