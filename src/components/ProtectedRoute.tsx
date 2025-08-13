import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/authentication';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Clean Auth Verification Loading - No ugly squares
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-8 relative">
                        {/* Simple spinner instead of ugly squares */}
                        <div className="w-12 h-12 mx-auto mb-6">
                            <div className="w-full h-full border-4 border-purple-300 border-t-green-400 rounded-full animate-spin"></div>
                        </div>

                        <div className="text-green-300 text-sm font-mono animate-pulse">
                            {'> Verifying authentication...'}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-3 font-display">SnakkaZ</h1>
                    <p className="text-purple-300 text-sm animate-pulse">Sjekker innlogging...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render children if authenticated
    return <>{children}</>;
};
