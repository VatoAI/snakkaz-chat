import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PremiumFeature } from '@/services/subscription/types';

interface PremiumGateProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  title?: string;
  description?: string;
  redirectOnClick?: boolean;
}

/**
 * Component that restricts access to premium features
 * Shows children if user has premium access, otherwise shows a premium upgrade prompt
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  children,
  title = 'Premium Feature',
  description = 'This feature requires a premium subscription',
  redirectOnClick = true
}) => {
  const { isPremium, subscription } = useAuth();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    if (redirectOnClick) {
      navigate('/subscription');
    }
  };

  // If user has premium, show the children
  if (isPremium) {
    return <>{children}</>;
  }

  // Otherwise show the premium gate
  return (
    <Card className="border border-cybergold-900/50 bg-cyberdark-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center">
          <Lock className="h-5 w-5 text-cybergold-500 mr-2" />
          <CardTitle className="text-cybergold-400">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-cybergold-300 text-lg">
            Unlock this feature with a premium subscription
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpgradeClick}
          className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
        >
          Upgrade to Premium
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumGate;
