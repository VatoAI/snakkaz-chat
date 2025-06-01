import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
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
 * Component that provides access information for enhanced features
 * Shows children if user has access, otherwise shows friendly information
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  children,
  title = 'Avansert Funksjon',
  description = 'Denne funksjonen er tilgjengelig for alle medlemmer',
  redirectOnClick = true
}) => {
  const { isPremium, subscription } = useAuth();
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    if (redirectOnClick) {
      navigate('/info');
    }
  };

  // If user has premium, show the children
  if (isPremium) {
    return <>{children}</>;
  }

  // Otherwise show friendly community information
  return (
    <Card className="border border-cybergold-900/30 bg-cyberdark-900/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-cybergold-400 mr-2" />
          <CardTitle className="text-cybergold-300">{title}</CardTitle>
        </div>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-cybergold-200 text-base">
            Bli med i fellesskapet for å få tilgang til alle funksjoner
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleLearnMoreClick}
          variant="outline"
          className="w-full border-cybergold-600/50 text-cybergold-300 hover:bg-cybergold-900/30"
        >
          Lær mer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumGate;
