
// Status colors for user online status indicators
export const statusColors = {
  online: {
    primary: 'text-emerald-500',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_10px_theme(colors.emerald.500)]'
  },
  busy: {
    primary: 'text-amber-500',
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_10px_theme(colors.amber.500)]'
  },
  brb: {
    primary: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    glow: 'shadow-[0_0_10px_theme(colors.blue.500)]'
  },
  away: {
    primary: 'text-purple-500',
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    glow: 'shadow-[0_0_10px_theme(colors.purple.500)]'
  },
  offline: {
    primary: 'text-gray-500',
    bg: 'bg-gray-500',
    border: 'border-gray-500',
    glow: 'shadow-[0_0_10px_theme(colors.gray.500)]'
  },
  invisible: {
    primary: 'text-gray-400',
    bg: 'bg-gray-400',
    border: 'border-gray-400',
    glow: 'shadow-[0_0_10px_theme(colors.gray.400)]'
  }
};

// Security level colors for encryption indicators
export const securityColors = {
  p2p_e2ee: {
    primary: 'text-emerald-500',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_10px_theme(colors.emerald.500)]'
  },
  server_e2ee: {
    primary: 'text-blue-500',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500',
    glow: 'shadow-[0_0_10px_theme(colors.blue.500)]'
  },
  standard: {
    primary: 'text-amber-500',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_10px_theme(colors.amber.500)]'
  }
};
