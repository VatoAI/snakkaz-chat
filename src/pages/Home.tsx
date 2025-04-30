import React from 'react';
import WelcomeDashboard from '@/components/WelcomeDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Home: React.FC = () => {
  return (
    <ProtectedRoute>
      <WelcomeDashboard />
    </ProtectedRoute>
  );
};

export default Home;