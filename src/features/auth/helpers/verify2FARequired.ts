/**
 * Helper utility for 2FA verification
 * 
 * This module provides utility functions to check if 2FA verification is required
 * and to handle 2FA verification in protected routes.
 * 
 * Del av STRATEGISK UTVIKLINGSPLAN - FASE 1: Sikkerhet
 */

import { Session, User } from "@supabase/supabase-js";

/**
 * Check if 2FA is enabled for a user
 * 
 * @param user The user object from Supabase Auth
 * @returns boolean True if 2FA is enabled for the user
 */
export const is2FAEnabled = (user: User | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.totp_enabled === true;
};

/**
 * Check if 2FA verification is required for the current session
 * 
 * @param user The user object from Supabase Auth
 * @param session The session object from Supabase Auth
 * @returns boolean True if 2FA verification is required
 */
export const requires2FAVerification = (user: User | null, session: Session | null): boolean => {
  // If no user or no session, no verification is required (user is not logged in)
  if (!user || !session) return false;
  
  // Check if 2FA is enabled for the user
  const totpEnabled = is2FAEnabled(user);
  
  // Check if 2FA was already verified in this session
  const twoFactorVerified = session?.user?.user_metadata?.two_factor_verified === true;
  
  // 2FA verification is required if it's enabled but not yet verified
  return totpEnabled && !twoFactorVerified;
};

/**
 * Mark 2FA as verified for the current session
 * 
 * @param user The user object from Supabase Auth
 * @returns Promise<boolean> True if the operation was successful
 */
export const mark2FAAsVerified = async (updateUserFn: (data: any) => Promise<any>): Promise<boolean> => {
  try {
    // Mark 2FA as verified in user metadata
    await updateUserFn({
      two_factor_verified: true,
      two_factor_verified_at: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error marking 2FA as verified:', error);
    return false;
  }
};
