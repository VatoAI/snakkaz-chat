import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

/**
 * Hook for å få tilgang til autentiseringskonteksten
 * Kombinerer funksjonalitet fra både useAuth.ts og useAuth.tsx
 * 
 * @returns Autentiseringskonteksten med brukerdata, innloggingstilstand og relaterte funksjoner
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
