import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { mcpAnalytics } from '../lib/mcp-api'
import { Eye, EyeOff, MessageCircle, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
    })

    useEffect(() => {
        mcpAnalytics.trackEvent('page_view', { page: isLogin ? 'login' : 'signup' })

        // Check if user is already logged in
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const redirectTo = searchParams.get('redirect') || '/dashboard'
                navigate(redirectTo)
            }
        }
        checkUser()
    }, [isLogin, navigate, searchParams])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setMessage('') // Clear any existing messages
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            if (isLogin) {
                // Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                })

                if (error) throw error

                mcpAnalytics.trackEvent('login_success', { method: 'email' })
                const redirectTo = searchParams.get('redirect') || '/dashboard'
                navigate(redirectTo)
            } else {
                // Sign up
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passordene matcher ikke')
                }

                if (formData.password.length < 6) {
                    throw new Error('Passordet må være minst 6 tegn')
                }

                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                        }
                    }
                })

                if (error) throw error

                // Create profile
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                full_name: formData.fullName,
                                updated_at: new Date().toISOString()
                            }
                        ])

                    if (profileError) console.error('Profile creation error:', profileError)
                }

                mcpAnalytics.trackConversion('signup', 0, data.user?.id || '')
                setMessage('Kontroller e-posten din for å bekrefte kontoen din.')
            }
        } catch (error: any) {
            setMessage(error.message || 'En feil oppstod. Prøv igjen.')
            mcpAnalytics.trackEvent('auth_error', {
                type: isLogin ? 'login' : 'signup',
                error: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSocialAuth = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            })

            if (error) throw error

            mcpAnalytics.trackEvent('social_auth_attempt', { provider })
        } catch (error: any) {
            setMessage(error.message || `Feil ved innlogging med ${provider}`)
            mcpAnalytics.trackEvent('social_auth_error', { provider, error: error.message })
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setMessage('')
        setFormData({
            email: '',
            password: '',
            fullName: '',
            confirmPassword: ''
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 mb-4">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                        <span>SnakkaZ</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Velkommen tilbake!' : 'Opprett konto'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin
                            ? 'Logg inn for å fortsette til SnakkaZ'
                            : 'Bli med i Norges smarteste chat-community'
                        }
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Social Auth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleSocialAuth('google')}
                            className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Chrome className="w-5 h-5" />
                            <span>Fortsett med Google</span>
                        </button>
                        <button
                            onClick={() => handleSocialAuth('github')}
                            className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <span>Fortsett med GitHub</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">eller</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fullt navn
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Ola Nordmann"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-post
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="din@epost.no"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Passord
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Minst 6 tegn"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bekreft passord
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Gjenta passordet"
                                    />
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.includes('Kontroller') || message.includes('suksess')
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center space-x-2 font-semibold"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Logg inn' : 'Opprett konto'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot Password */}
                    {isLogin && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => {
                                    // Handle forgot password
                                    mcpAnalytics.trackEvent('forgot_password_click', {})
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                            >
                                Glemt passord?
                            </button>
                        </div>
                    )}

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">
                            {isLogin ? 'Har du ikke en konto?' : 'Har du allerede en konto?'}
                        </span>
                        <button
                            onClick={toggleMode}
                            className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            {isLogin ? 'Registrer deg' : 'Logg inn'}
                        </button>
                    </div>

                    {/* Terms and Privacy */}
                    {!isLogin && (
                        <div className="mt-4 text-center text-xs text-gray-500">
                            Ved å opprette en konto godtar du våre{' '}
                            <Link to="/terms" className="text-blue-600 hover:underline">
                                vilkår
                            </Link>{' '}
                            og{' '}
                            <Link to="/privacy" className="text-blue-600 hover:underline">
                                personvernpolicy
                            </Link>
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-800 transition-colors inline-flex items-center space-x-1"
                    >
                        <span>← Tilbake til forsiden</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
