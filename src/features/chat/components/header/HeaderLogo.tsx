
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const HeaderLogo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      const checkPremiumStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error checking premium status:', error);
            return;
          }
          
          setIsPremium(data?.is_premium || false);
        } catch (err) {
          console.error('Failed to check premium status:', err);
        }
      };
      
      checkPremiumStatus();
    }
  }, [user]);
  
  return (
    <div 
      onClick={() => navigate("/")}
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cybergold-500/40 shadow-neon-gold overflow-hidden cursor-pointer hover:shadow-neon-intense transition-all duration-300"
    >
      <img 
        src="/snakkaz-logo.png"
        alt="SnakkaZ" 
        className="w-full h-full object-cover p-0.5"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
  );
};
