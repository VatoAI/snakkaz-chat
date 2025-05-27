export type TrustLevel = 'NEW_USER' | 'TRUSTED' | 'VERIFIED' | 'COMMUNITY_CHAMPION';

// Helper function til å bestemme trust-level basert på interaksjoner
export function calculateTrustLevel(interactions: number): TrustLevel {
  if (interactions >= 1000) return 'COMMUNITY_CHAMPION';
  if (interactions >= 500) return 'VERIFIED';
  if (interactions >= 100) return 'TRUSTED';
  return 'NEW_USER';
}

// Hook for å hente trust-level for en bruker
export function useTrustLevel(userId: string): TrustLevel {
  // I en ekte implementasjon ville dette hente data fra database
  // For nå returnerer vi en demo-verdi
  const demoInteractions = Math.floor(Math.random() * 1500);
  return calculateTrustLevel(demoInteractions);
}

export const trustConfig = {
  NEW_USER: {
    icon: '🆕',
    label: 'Ny bruker',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  },
  TRUSTED: {
    icon: '✅',
    label: 'Pålitelig',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  VERIFIED: {
    icon: '🔷',
    label: 'Verifisert',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  COMMUNITY_CHAMPION: {
    icon: '🏆',
    label: 'Community Champion',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30'
  }
};
