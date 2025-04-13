
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const PROGRESS_KEY = 'site_progress_value';
const DEFAULT_PROGRESS = 50;

export const useProgressState = () => {
  const [progressValue, setProgressValue] = useState<number>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial progress value
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Try to get from health table first
        const { data, error } = await supabase
          .from('health')
          .select('status')
          .eq('id', PROGRESS_KEY)
          .single();
        
        if (error || !data) {
          // Fallback to localStorage
          const localProgress = localStorage.getItem(PROGRESS_KEY);
          if (localProgress) {
            setProgressValue(parseInt(localProgress));
          }
        } else {
          // Extract progress from status field (format: "progress_50")
          const match = data.status.match(/progress_(\d+)/);
          if (match && match[1]) {
            setProgressValue(parseInt(match[1]));
          }
        }
      } catch (err) {
        console.error("Error loading progress:", err);
        // Fallback to default
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  // Save progress value whenever it changes
  const updateProgress = async (value: number) => {
    setProgressValue(value);
    
    // Save to localStorage as backup
    localStorage.setItem(PROGRESS_KEY, value.toString());
    
    try {
      // Save to Supabase health table
      await supabase
        .from('health')
        .upsert({ 
          id: PROGRESS_KEY,
          status: `progress_${value}`, 
          last_checked: new Date().toISOString() 
        })
        .match({ id: PROGRESS_KEY });
    } catch (err) {
      console.error("Error saving progress to database:", err);
    }
  };

  return {
    progressValue,
    updateProgress,
    isLoading
  };
};
