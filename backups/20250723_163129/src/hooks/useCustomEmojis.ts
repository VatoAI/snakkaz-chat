import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { uploadCustomEmoji, deleteCustomEmojiFile, validateShortcode, type EmojiUploadOptions } from '@/utils/customEmojiUpload';

export interface CustomEmoji {
  id: string;
  shortcode: string;
  name: string;
  url: string;
  category: string;
  isAnimated: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usage: number;
  isFavorite: boolean;
}

interface UseCustomEmojisReturn {
  customEmojis: CustomEmoji[];
  isLoading: boolean;
  error: string | null;
  fetchCustomEmojis: () => Promise<void>;
  addCustomEmoji: (emoji: Omit<CustomEmoji, 'id' | 'createdAt' | 'usage'>) => Promise<boolean>;
  addCustomEmojiWithFile: (file: File, shortcode: string, name: string, category?: string, isPublic?: boolean) => Promise<boolean>;
  deleteCustomEmoji: (emojiId: string) => Promise<boolean>;
  toggleFavorite: (emojiId: string) => Promise<boolean>;
  incrementUsage: (emojiId: string) => Promise<void>;
  validateShortcodeAvailability: (shortcode: string) => Promise<{ available: boolean; error?: string }>;
  getUserCustomEmojis: () => CustomEmoji[];
  getPublicCustomEmojis: () => CustomEmoji[];
  getFavoriteCustomEmojis: () => CustomEmoji[];
}

export const useCustomEmojis = (): UseCustomEmojisReturn => {
  const [customEmojis, setCustomEmojis] = useState<CustomEmoji[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch custom emojis from the database
  const fetchCustomEmojis = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all public emojis and user's private emojis
      const { data, error } = await supabase
        .from('custom_emojis')
        .select('*')
        .or(`is_public.eq.true,created_by.eq.${user.id}`)
        .order('usage', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const emojis: CustomEmoji[] = (data || []).map(emoji => ({
        id: emoji.id,
        shortcode: emoji.shortcode,
        name: emoji.name,
        url: emoji.url,
        category: emoji.category || 'custom',
        isAnimated: emoji.is_animated || false,
        isPublic: emoji.is_public || false,
        createdBy: emoji.created_by,
        createdAt: emoji.created_at,
        usage: emoji.usage || 0,
        isFavorite: emoji.is_favorite || false
      }));

      setCustomEmojis(emojis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch custom emojis';
      setError(errorMessage);
      console.error('Error fetching custom emojis:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to load custom emojis',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Add a new custom emoji
  const addCustomEmoji = useCallback(async (emoji: Omit<CustomEmoji, 'id' | 'createdAt' | 'usage'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('custom_emojis')
        .insert([{
          shortcode: emoji.shortcode,
          name: emoji.name,
          url: emoji.url,
          category: emoji.category,
          is_animated: emoji.isAnimated,
          is_public: emoji.isPublic,
          created_by: user.id,
          usage: 0,
          is_favorite: emoji.isFavorite
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const newEmoji: CustomEmoji = {
        id: data.id,
        shortcode: data.shortcode,
        name: data.name,
        url: data.url,
        category: data.category || 'custom',
        isAnimated: data.is_animated || false,
        isPublic: data.is_public || false,
        createdBy: data.created_by,
        createdAt: data.created_at,
        usage: data.usage || 0,
        isFavorite: data.is_favorite || false
      };

      setCustomEmojis(prev => [newEmoji, ...prev]);

      toast({
        title: 'Success',
        description: 'Custom emoji added successfully!'
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add custom emoji';
      console.error('Error adding custom emoji:', err);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });

      return false;
    }
  }, [user, toast]);

  // Delete a custom emoji
  const deleteCustomEmoji = useCallback(async (emojiId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('custom_emojis')
        .delete()
        .eq('id', emojiId)
        .eq('created_by', user.id); // Only allow deleting own emojis

      if (error) {
        throw error;
      }

      // Remove from local state
      setCustomEmojis(prev => prev.filter(emoji => emoji.id !== emojiId));

      toast({
        title: 'Success',
        description: 'Custom emoji deleted successfully!'
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete custom emoji';
      console.error('Error deleting custom emoji:', err);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });

      return false;
    }
  }, [user, toast]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (emojiId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const emoji = customEmojis.find(e => e.id === emojiId);
      if (!emoji) return false;

      const { error } = await supabase
        .from('custom_emojis')
        .update({ is_favorite: !emoji.isFavorite })
        .eq('id', emojiId)
        .eq('created_by', user.id); // Only allow favoriting own emojis

      if (error) {
        throw error;
      }

      // Update local state
      setCustomEmojis(prev => prev.map(e => 
        e.id === emojiId ? { ...e, isFavorite: !e.isFavorite } : e
      ));

      return true;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return false;
    }
  }, [user, customEmojis]);

  // Increment usage count when emoji is used
  const incrementUsage = useCallback(async (emojiId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('custom_emojis')
        .update({ usage: supabase.sql`usage + 1` })
        .eq('id', emojiId);

      if (error) {
        console.error('Error incrementing usage:', error);
        return;
      }

      // Update local state
      setCustomEmojis(prev => prev.map(e => 
        e.id === emojiId ? { ...e, usage: e.usage + 1 } : e
      ));
    } catch (err) {
      console.error('Error incrementing emoji usage:', err);
    }
  }, []);

  // Get user's custom emojis
  const getUserCustomEmojis = useCallback((): CustomEmoji[] => {
    if (!user) return [];
    return customEmojis.filter(emoji => emoji.createdBy === user.id);
  }, [customEmojis, user]);

  // Get public custom emojis
  const getPublicCustomEmojis = useCallback((): CustomEmoji[] => {
    return customEmojis.filter(emoji => emoji.isPublic);
  }, [customEmojis]);

  // Get favorite custom emojis
  const getFavoriteCustomEmojis = useCallback((): CustomEmoji[] => {
    if (!user) return [];
    return customEmojis.filter(emoji => emoji.isFavorite && emoji.createdBy === user.id);
  }, [customEmojis, user]);

  // Fetch emojis on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCustomEmojis();
    } else {
      setCustomEmojis([]);
    }
  }, [user, fetchCustomEmojis]);

  // Set up real-time subscription for custom emojis
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('custom_emojis_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_emojis'
        },
        (payload) => {
          // Refetch on any changes to keep data in sync
          fetchCustomEmojis();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCustomEmojis]);

  return {
    customEmojis,
    isLoading,
    error,
    fetchCustomEmojis,
    addCustomEmoji,
    deleteCustomEmoji,
    toggleFavorite,
    incrementUsage,
    getUserCustomEmojis,
    getPublicCustomEmojis,
    getFavoriteCustomEmojis
  };
};
