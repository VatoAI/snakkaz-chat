import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import ModernDashboard from '../components/dashboard/ModernDashboard';

const LiquidDreamMain: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Quick load for authenticated users
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            // Fallback timeout
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white mb-2">Laster SnakkaZ...</h2>
                    <p className="text-gray-300">Forbereder din sikre chat-opplevelse</p>
                </div>
            </div>
        );
    }

    return <ModernDashboard />;
};

export default LiquidDreamMain;
