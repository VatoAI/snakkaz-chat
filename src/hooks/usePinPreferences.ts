
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
        // Ensure we have a properly typed object by merging with default values
        const pinPrefs = data.pin_preferences as Record<string, boolean>;
        setPreferences(prev => ({
          ...prev,
          requirePinForDelete: !!pinPrefs.requirePinForDelete,
          requirePinForEdit: !!pinPrefs.requirePinForEdit,
          requirePinForSensitive: !!pinPrefs.requirePinForSensitive,
        }));
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
