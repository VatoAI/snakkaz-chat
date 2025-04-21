
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PinPreferences {
  requirePinForDelete: boolean;
  requirePinForEdit: boolean;
  requirePinForSensitive: boolean;
}

export const usePinPreferences = (userId: string | null) => {
  const [preferences, setPreferences] = useState<PinPreferences>({
    requirePinForDelete: false,
    requirePinForEdit: false,
    requirePinForSensitive: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pin_preferences')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      if (data && data.pin_preferences) {
        setPreferences(data.pin_preferences);
      }
    } catch (error) {
      console.error('Error fetching PIN preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<PinPreferences>) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          pin_preferences: { ...preferences, ...newPreferences },
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      toast({
        title: "Innstillinger oppdatert",
        description: "PIN-innstillingene dine har blitt lagret",
      });
    } catch (error) {
      console.error('Error updating PIN preferences:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere PIN-innstillingene",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};
