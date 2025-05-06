
/**
 * Get initials from a username or full name
 * Returns up to 2 uppercase characters
 */
export const getInitials = (name?: string | null): string => {
  if (!name) return 'U';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
