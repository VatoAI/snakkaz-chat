import { useState, useEffect } from 'react';
import { initializeStorage } from '@/utils/storage-init';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for initializing storage buckets when the application starts
 */
export function useStorageInit() {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        setInitializing(true);
        setError(null);

        const result = await initializeStorage();
        
        if (result.success) {
          setInitialized(true);
          console.log('Storage initialization successful');
        } else {
          setError(`Storage initialization issues: ${result.errors.join(', ')}`);
          console.error('Storage initialization issues:', result.errors);
          
          // Show toast only for critical errors
          if (result.errors.some(e => e.includes('permission denied') || e.includes('authentication'))) {
            toast({
              title: 'Storage initialization issue',
              description: 'Some storage features may be limited',
              variant: 'warning'
            });
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error initializing storage:', err);
        
        // Don't show toast for network errors to avoid spamming the user
        if (!(err instanceof Error) || !errorMessage.includes('network')) {
          toast({
            title: 'Storage initialization failed',
            description: 'Some images and media may not be available',
            variant: 'destructive'
          });
        }
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, [toast]);

  return { initialized, initializing, error };
}