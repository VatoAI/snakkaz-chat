/**
 * SnakkaZ Invite Service - Production-ready invitation tracking and analytics
 */

import { supabase } from '@/lib/supabaseClient';

export interface InviteData {
  id: string;
  inviter_id: string;
  code: string;
  type: 'app' | 'group' | 'room';
  target_id?: string; // group or room id
  uses_count: number;
  max_uses: number;
  expires_at?: string;
  created_at: string;
  is_active: boolean;
}

export interface InviteStats {
  totalSent: number;
  totalJoined: number;
  bonusPoints: number;
  conversionRate: number;
  topPlatform: string;
}

export interface InviteClick {
  id: string;
  invite_id: string;
  platform: string;
  user_agent: string;
  ip_address: string;
  converted: boolean;
  created_at: string;
}

class InviteService {
  private static instance: InviteService;

  static getInstance(): InviteService {
    if (!InviteService.instance) {
      InviteService.instance = new InviteService();
    }
    return InviteService.instance;
  }

  /**
   * Create a new invite code for user
   */
  async createInvite(inviterId: string, type: 'app' | 'group' | 'room', targetId?: string): Promise<InviteData> {
    try {
      // Generate unique invite code
      const code = this.generateInviteCode(inviterId);
      
      const { data, error } = await supabase
        .from('invites')
        .insert({
          inviter_id: inviterId,
          code,
          type,
          target_id: targetId,
          uses_count: 0,
          max_uses: type === 'app' ? 100 : 50, // Higher limit for app invites
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invite:', error);
      throw error;
    }
  }

  /**
   * Get user's invite statistics
   */
  async getInviteStats(userId: string): Promise<InviteStats> {
    try {
      // Get invite data with analytics
      const { data: invites, error: inviteError } = await supabase
        .from('invites')
        .select(`
          *,
          invite_clicks(*),
          invite_conversions(*)
        `)
        .eq('inviter_id', userId);

      if (inviteError) throw inviteError;

      // Calculate stats
      const totalSent = invites?.length || 0;
      const totalJoined = invites?.reduce((sum, invite) => sum + (invite.invite_conversions?.length || 0), 0) || 0;
      const bonusPoints = totalJoined * 10; // 10 points per successful referral
      const conversionRate = totalSent > 0 ? (totalJoined / totalSent) * 100 : 0;

      // Find top platform
      const platformCounts = {};
      invites?.forEach(invite => {
        invite.invite_clicks?.forEach(click => {
          platformCounts[click.platform] = (platformCounts[click.platform] || 0) + 1;
        });
      });

      const topPlatform = Object.keys(platformCounts).reduce((a, b) => 
        platformCounts[a] > platformCounts[b] ? a : b, 'whatsapp'
      );

      return {
        totalSent,
        totalJoined,
        bonusPoints,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topPlatform
      };
    } catch (error) {
      console.error('Error fetching invite stats:', error);
      return {
        totalSent: 0,
        totalJoined: 0,
        bonusPoints: 0,
        conversionRate: 0,
        topPlatform: 'whatsapp'
      };
    }
  }

  /**
   * Track invite click
   */
  async trackInviteClick(inviteCode: string, platform: string): Promise<void> {
    try {
      // Get invite by code
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('id')
        .eq('code', inviteCode)
        .eq('is_active', true)
        .single();

      if (inviteError || !invite) return;

      // Record click
      await supabase
        .from('invite_clicks')
        .insert({
          invite_id: invite.id,
          platform,
          user_agent: navigator.userAgent,
          ip_address: 'client', // Anonymized for privacy
          converted: false
        });

    } catch (error) {
      console.error('Error tracking invite click:', error);
    }
  }

  /**
   * Track successful conversion
   */
  async trackInviteConversion(inviteCode: string, newUserId: string): Promise<void> {
    try {
      // Get invite by code
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('id, inviter_id')
        .eq('code', inviteCode)
        .eq('is_active', true)
        .single();

      if (inviteError || !invite) return;

      // Record conversion
      await supabase
        .from('invite_conversions')
        .insert({
          invite_id: invite.id,
          inviter_id: invite.inviter_id,
          new_user_id: newUserId
        });

      // Update invite uses count
      await supabase
        .from('invites')
        .update({ 
          uses_count: supabase.sql`uses_count + 1` 
        })
        .eq('id', invite.id);

      // Award bonus points to inviter
      await this.awardBonusPoints(invite.inviter_id, 10);

    } catch (error) {
      console.error('Error tracking invite conversion:', error);
    }
  }

  /**
   * Generate invite URL
   */
  generateInviteUrl(code: string, platform?: string): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      ref: code,
      source: platform || 'app-invite'
    });
    
    return `${baseUrl}/register?${params.toString()}`;
  }

  /**
   * Generate shareable message with invite link
   */
  generateShareMessage(code: string, customMessage?: string): string {
    const inviteUrl = this.generateInviteUrl(code);
    
    if (customMessage) {
      return `${customMessage}\n\n🔗 ${inviteUrl}`;
    }

    return `🚀 Bli med meg på SnakkaZ Beta - den nye generasjonen chat!\n\n` +
           `✨ End-to-end kryptering\n` +
           `💎 AI-assistert chat\n` +
           `🎮 Interaktive funksjoner\n` +
           `🔒 100% privat og sikkert\n\n` +
           `Vi får begge bonuser når du registrerer deg! 🎁\n\n` +
           `🔗 ${inviteUrl}`;
  }

  /**
   * Get platform-specific share URL
   */
  getPlatformShareUrl(platform: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    
    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${encodedMessage}`;
      case 'telegram':
        return `https://t.me/share/url?text=${encodedMessage}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedMessage}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedMessage}`;
      case 'email':
        return `mailto:?subject=${encodeURIComponent('Bli med på SnakkaZ Beta!')}&body=${encodedMessage}`;
      case 'sms':
        return `sms:?body=${encodedMessage}`;
      default:
        return message;
    }
  }

  /**
   * Private helper methods
   */
  private generateInviteCode(userId: string): string {
    const userPart = userId.slice(-4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${userPart}${randomPart}`;
  }

  private async awardBonusPoints(userId: string, points: number): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({ 
          bonus_points: supabase.sql`bonus_points + ${points}` 
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error awarding bonus points:', error);
    }
  }
}

export const inviteService = InviteService.getInstance();
