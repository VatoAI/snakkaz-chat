/**
 * Group Role Management Utilities
 * 
 * Provides helper functions for managing role permissions in group chats
 */

import { GroupMember, GroupRole } from "@/types/group";

/**
 * Role hierarchy from highest to lowest permissions
 */
export const ROLE_HIERARCHY: GroupRole[] = [
  'admin',
  'moderator',
  'premium',
  'member'
];

/**
 * Validate a role change operation to ensure it follows permission rules:
 * - Admins can change any role
 * - Moderators can only change members to premium and back
 * - Members can't change roles
 * - The last admin can't be demoted
 *
 * @param members - All group members
 * @param currentUserId - The ID of the user making the change
 * @param targetUserId - The ID of the user being changed
 * @param newRole - The proposed new role
 * @returns An object with a valid flag and a message if invalid
 */
export function validateRoleChange(
  members: GroupMember[],
  currentUserId: string,
  targetUserId: string,
  newRole: GroupRole
): { valid: boolean; message?: string } {
  // Get current user and target user roles
  const currentUserMember = members.find(m => m.user_id === currentUserId);
  const targetUserMember = members.find(m => m.user_id === targetUserId);
  
  if (!currentUserMember || !targetUserMember) {
    return { 
      valid: false, 
      message: "Could not find one or both users in the group." 
    };
  }
  
  const currentUserRole = currentUserMember.role;
  const targetUserRole = targetUserMember.role;
  
  // Check if current user has permission to change roles
  if (!hasRolePermission(currentUserRole, 'moderator')) {
    return { 
      valid: false, 
      message: "You don't have permission to change member roles." 
    };
  }
  
  // Only admins can promote to admin or moderator
  if ((newRole === 'admin' || newRole === 'moderator') && 
      !hasRolePermission(currentUserRole, 'admin')) {
    return { 
      valid: false, 
      message: "Only administrators can promote members to admin or moderator roles." 
    };
  }
  
  // Prevent demotion of the last admin
  if (targetUserRole === 'admin' && newRole !== 'admin') {
    const adminCount = members.filter(m => m.role === 'admin').length;
    if (adminCount <= 1) {
      return { 
        valid: false, 
        message: "Cannot demote the last administrator." 
      };
    }
  }
  
  // Prevent users from changing roles of users with higher permissions
  if (hasRolePermission(targetUserRole, 'admin') && 
      !hasRolePermission(currentUserRole, 'admin')) {
    return { 
      valid: false, 
      message: "You cannot change the role of a user with higher permissions than you." 
    };
  }
  
  return { valid: true };
}

/**
 * Check if a user has a specific role or higher
 * 
 * @param userRole - The user's current role
 * @param requiredRole - The minimum role required
 * @returns True if the user has sufficient permissions
 */
export function hasRolePermission(userRole: GroupRole, requiredRole: GroupRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false;
  }
  
  return userRoleIndex <= requiredRoleIndex;
}

/**
 * Get allowed actions for a specific role
 * 
 * @param role - The group role to check permissions for
 * @returns Object with boolean flags for different permissions
 */
export function getRolePermissions(role: GroupRole) {
  return {
    canManageRoles: hasRolePermission(role, 'admin'),
    canModerateMessages: hasRolePermission(role, 'moderator'),
    canInviteMembers: hasRolePermission(role, 'moderator'),
    canRemoveMembers: hasRolePermission(role, 'moderator'),
    canManageFiles: hasRolePermission(role, 'moderator'),
    canCreatePolls: hasRolePermission(role, 'moderator'),
    canUploadUnlimitedFiles: hasRolePermission(role, 'premium'),
    canCreateEncryptedChats: hasRolePermission(role, 'premium'),
    canSendMessages: true
  };
}

/**
 * Get a human-readable label for a role
 * 
 * @param role - The group role
 * @returns A user-friendly label for the role
 */
export function getRoleLabel(role: GroupRole): string {
  const labels: Record<GroupRole, string> = {
    'admin': 'Administrator',
    'moderator': 'Moderator',
    'premium': 'Premium Member',
    'member': 'Member'
  };
  
  return labels[role] || 'Unknown Role';
}

/**
 * Get a description of role permissions
 * 
 * @param role - The group role
 * @returns A description of what the role can do
 */
export function getRoleDescription(role: GroupRole): string {
  const descriptions: Record<GroupRole, string> = {
    'admin': 'Full control of group settings and members',
    'moderator': 'Can manage members, messages and files',
    'premium': 'Standard member with access to premium features',
    'member': 'Standard member with basic permissions'
  };
  
  return descriptions[role] || 'Unknown role permissions';
}
