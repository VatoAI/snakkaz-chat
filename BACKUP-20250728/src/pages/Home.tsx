import React, { useState, useEffect } from 'react';
import WelcomeDashboard from '@/components/dashboard/WelcomeDashboard';
import FirstTimeUserWelcome from '@/components/FirstTimeUserWelcome';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage<boolean>(`welcome_seen_${user?.id}`, false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Vis velkomstdialogen bare hvis brukeren ikke har sett den før
    if (user && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [user, hasSeenWelcome]);
  
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    setHasSeenWelcome(true);
  };
  
  return (
    <ProtectedRoute>
      <WelcomeDashboard />
      
      {showWelcome && user && (
        <FirstTimeUserWelcome
          username={user.user_metadata?.name || user.email?.split('@')[0] || 'bruker'}
          onClose={handleCloseWelcome}
        />
      )}
    </ProtectedRoute>
  );
};

export default Home;