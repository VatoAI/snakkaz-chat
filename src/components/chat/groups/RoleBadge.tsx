import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldAlert, Users, Crown, Star } from 'lucide-react';

export type GroupRole = 'admin' | 'moderator' | 'member' | 'premium' | 'guest';

export interface RoleBadgeProps {
  role: GroupRole;
  showText?: boolean; 
  showIcon?: boolean;
  className?: string;
}

/**
 * RoleBadge Component - Displays a badge with role information for group members
 * 
 * @param role - The role of the group member
 * @param showText - Whether to display the role text
 * @param showIcon - Whether to display the role icon
 * @param className - Additional CSS class names
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  showText = true,
  showIcon = true,
  className = "",
}) => {
  /**
   * Get variant for the badge based on the role
   */
  const getRoleBadgeVariant = (role: GroupRole) => {
    switch (role) {
      case 'admin':
        return "secondary";
      case 'moderator':
        return "default";
      case 'premium':
        return "outline";
      case 'guest':
        return "destructive";
      default:
        return "outline";
    }
  };

  /**
   * Get role icon based on the role
   */
  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="h-3 w-3 mr-0.5 text-amber-400" />;
      case 'moderator':
        return <ShieldCheck className="h-3 w-3 mr-0.5 text-green-400" />;
      case 'premium':
        return <Star className="h-3 w-3 mr-0.5 text-amber-400" />;
      case 'guest':
        return <Shield className="h-3 w-3 mr-0.5 text-gray-400" />;
      default:
        return <Users className="h-3 w-3 mr-0.5" />;
    }
  };

  /**
   * Get role label based on the role
   */
  const getRoleLabel = (role: GroupRole) => {
    switch (role) {
      case 'admin':
        return "Admin";
      case 'moderator':
        return "Moderator";
      case 'premium':
        return "Premium";
      case 'guest':
        return "Guest";
      default:
        return "Member";
    }
  };

  return (
    <Badge variant={getRoleBadgeVariant(role)} className={className}>
      {showIcon && getRoleIcon(role)}
      {showText && getRoleLabel(role)}
    </Badge>
  );
};

export default RoleBadge;