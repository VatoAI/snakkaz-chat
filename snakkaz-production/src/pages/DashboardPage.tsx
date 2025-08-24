import React, { useState, useEffect } from 'react'
import { User, Crown, CreditCard, Settings, LogOut, BarChart3, Calendar, MessageSquare, Users, TrendingUp, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { PRICING_PLANS, paymentService } from '../lib/payments'
import { mcpAnalytics } from '../lib/mcp-api'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
    id: string
    full_name: string
    avatar_url?: string
    subscription_tier: string
}

interface Subscription {
    id: string
    plan: string
    active: boolean
    expires_at: string
    stripe_subscription_id?: string
}

interface DashboardStats {
    messagesCount: number
    roomsCount: number
    activeUsers: number
    revenue: number
}

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [stats, setStats] = useState<DashboardStats>({
        messagesCount: 0,
        roomsCount: 0,
        activeUsers: 0,
        revenue: 0
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        loadDashboardData()
        mcpAnalytics.trackEvent('page_view', { page: 'dashboard' })
    }, [])

    const loadDashboardData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                navigate('/auth')
                return
            }

            setUser(session.user)

            // Load user profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
            }

            // Load subscription data
            const { data: subData } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('active', true)
                .single()

            if (subData) {
                setSubscription(subData)
            }

            // Load basic stats (mock data for now)
            setStats({
                messagesCount: Math.floor(Math.random() * 1000) + 100,
                roomsCount: Math.floor(Math.random() * 20) + 5,
                activeUsers: Math.floor(Math.random() * 100) + 10,
                revenue: Math.floor(Math.random() * 10000) + 1000
            })
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            mcpAnalytics.trackEvent('logout', {})
            navigate('/auth')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const getCurrentPlan = () => {
        if (!subscription) return PRICING_PLANS[0] // Free plan
        return PRICING_PLANS.find(p => p.id === subscription.plan) || PRICING_PLANS[0]
    }

    const handleUpgrade = () => {
        mcpAnalytics.trackEvent('upgrade_click', { current_plan: subscription?.plan || 'free' })
        navigate('/pricing')
    }

    const handleManageSubscription = async () => {
        if (!subscription?.stripe_subscription_id) return

        try {
            // In a real implementation, this would create a Stripe customer portal session
            mcpAnalytics.trackEvent('manage_subscription_click', { subscription_id: subscription.id })
            alert('Funksjonen for å administrere abonnement kommer snart!')
        } catch (error) {
            console.error('Error managing subscription:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const currentPlan = getCurrentPlan()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">Velkommen tilbake, {profile?.full_name || user?.email}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${currentPlan.id === 'free'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                {currentPlan.id !== 'free' && <Crown className="w-4 h-4" />}
                                <span>{currentPlan.name}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logg ut</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Meldinger sendt</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.messagesCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chat-rom</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.roomsCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Aktive brukere</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-orange-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Månedlig aktivitet</p>
                                <p className="text-2xl font-bold text-gray-900">87%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Account Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Kontoinformasjon
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                        {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {profile?.full_name || 'Ikke oppgitt'}
                                        </h3>
                                        <p className="text-gray-600">{user?.email}</p>
                                        <p className="text-sm text-gray-500">
                                            Medlem siden {new Date(user?.created_at).toLocaleDateString('nb-NO')}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            E-post
                                        </label>
                                        <p className="text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fullt navn
                                        </label>
                                        <p className="text-gray-900">{profile?.full_name || 'Ikke oppgitt'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hurtigtilgang</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                    <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">Gå til chat</div>
                                        <div className="text-sm text-gray-600">Start en samtale</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                                >
                                    <Crown className="w-8 h-8 text-green-600 mr-3" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">Se alle planer</div>
                                        <div className="text-sm text-gray-600">Oppgrader kontoen din</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Panel */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Abonnement
                            </h2>

                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border-2 ${currentPlan.popular
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{currentPlan.name}</h3>
                                        {currentPlan.popular && (
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                Aktiv
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-2">
                                        {paymentService.formatPrice(currentPlan.priceNOK, 'NOK')}
                                        {currentPlan.priceNOK > 0 && <span className="text-sm text-gray-600">/måned</span>}
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {currentPlan.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {subscription && (
                                    <div className="text-sm text-gray-600">
                                        <p>Fornyes: {new Date(subscription.expires_at).toLocaleDateString('nb-NO')}</p>
                                        <p>Status: {subscription.active ? 'Aktiv' : 'Inaktiv'}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {currentPlan.id === 'free' ? (
                                        <button
                                            onClick={handleUpgrade}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Oppgrader nå
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleUpgrade}
                                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                            >
                                                Bytt plan
                                            </button>
                                            <button
                                                onClick={handleManageSubscription}
                                                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Administrer abonnement
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Sikkerhet
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">To-faktor autentisering</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        Ikke aktivert
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Krypterte meldinger</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Aktivert
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Innloggingsvarslinger</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Aktivert
                                    </span>
                                </div>

                                <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                                    Sikkerhetsinnstilingen →
                                </button>
                            </div>
                        </div>

                        {/* Activity Summary */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Aktivitet i dag
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Meldinger sendt</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 50) + 5}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Rom besøkt</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 10) + 1}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Filer delt</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 5)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tid online</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 8) + 1}t</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
