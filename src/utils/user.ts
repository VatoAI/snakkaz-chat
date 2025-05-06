
/**
 * Gets initials from a name
 * @param name Full name or username
 * @returns Up to 2 characters representing the initials
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return name.charAt(0).toUpperCase();
  }
  
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  return '?';
}

/**
 * Gets the display name for a user
 * @param user User object
 * @returns The best display name available
 */
export function getDisplayName(user: any): string {
  if (!user) return 'Unknown User';
  
  return user.displayName || 
         user.full_name || 
         user.username || 
         user.email?.split('@')[0] || 
         'Unknown User';
}

/**
 * Format the last seen timestamp into a readable string
 * @param lastSeen ISO date string
 * @returns Formatted last seen text
 */
export function formatLastSeen(lastSeen: string): string {
  if (!lastSeen) return 'Unknown';
  
  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 7) {
    return date.toLocaleDateString();
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
