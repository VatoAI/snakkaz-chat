import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('@/pages/LandingPage'))
const AuthPage = React.lazy(() => import('@/pages/AuthPage'))
const ChatPage = React.lazy(() => import('@/pages/ChatPage'))
const PricingPage = React.lazy(() => import('@/pages/PricingPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))

// Loading component
const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="glass-card text-center">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Laster SnakkaZ...</p>
        </div>
    </div>
)

function App() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [subscription, setSubscription] = useState<string | null>(null)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserSubscription(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    fetchUserSubscription(session.user.id)
                } else {
                    setSubscription(null)
                }
                setLoading(false)
            }
        )

        return () => authSubscription.unsubscribe()
    }, [])

    const fetchUserSubscription = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('user_subscriptions')
                .select('plan')
                .eq('user_id', userId)
                .eq('active', true)
                .single()

            setSubscription(data?.plan || 'free')
        } catch (error) {
            console.log('No subscription found, defaulting to free')
            setSubscription('free')
        }
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="App min-h-screen bg-gradient-primary">
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />

                    {/* Auth routes */}
                    <Route
                        path="/auth"
                        element={!user ? <AuthPage /> : <Navigate to="/chat" />}
                    />

                    {/* Protected routes */}
                    <Route
                        path="/chat"
                        element={
                            user ? (
                                <ChatPage user={user} subscription={subscription} />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            user ? (
                                <DashboardPage user={user} subscription={subscription} />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default App
