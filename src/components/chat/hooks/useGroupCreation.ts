import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/groups';
import { SecurityLevel } from '@/types/security';

export type GroupWritePermission = "all" | "admin" | "selected";
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export const useGroupCreation = (currentUserId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createGroup = async (formData: {
    name: string;
    description?: string;
    visibility: string;
    securityLevel: SecurityLevel;
    password?: string;
    writePermissions?: GroupWritePermission;
  }): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          creator_id: currentUserId,
          name: formData.name,
          description: formData.description,
          visibility: formData.visibility,
          security_level: formData.securityLevel,
          password: formData.visibility === 'private' && formData.password ? formData.password : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          write_permissions: formData.writePermissions || 'all'
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to create group');
      }
      
      // Add the creator as a member of the group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: currentUserId,
          role: 'admin',
          joined_at: new Date().toISOString()
        });
      
      if (memberError) {
        throw memberError;
      }

      const newGroup = {
        creator_id: currentUserId,
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        security_level: formData.securityLevel,
        password: formData.visibility === 'private' && formData.password ? formData.password : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        write_permissions: formData.writePermissions || 'all'
      } as Group;
      
      return data.id;
    } catch (err: any) {
      console.error('Error creating group:', err);
      setError(err.message || 'Failed to create group');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    createGroup
  };
};
