
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { GroupVisibility, SecurityLevel } from '@/types/group';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  EyeOff,
  Lock,
  Globe,
  Shield,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CreateGroupComponentProps {
  isModal: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (groupId: string) => void;
}

interface FormData {
  name: string;
  description: string;
  visibility: GroupVisibility;
  securityLevel: SecurityLevel;
  password?: string;
  isEncrypted: boolean;
}

export const CreateGroupComponent = ({
  isModal,
  isOpen = false,
  onClose,
  onSuccess,
}: CreateGroupComponentProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private' as GroupVisibility,
      securityLevel: 'standard' as SecurityLevel,
      isEncrypted: true,
    },
  });
  
  const visibility = watch('visibility');
  const isEncrypted = watch('isEncrypted');
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { name, description, visibility, isEncrypted } = data;
      const securityLevel = isEncrypted ? 'high' : 'standard';

      const { data: groupData, error } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          visibility,
          creator_id: user.id,
          security_level: securityLevel,
          password: data.password || null, // Only include password if set
          is_premium: false,
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Add current user as owner
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'owner',
        });
        
      if (memberError) throw memberError;
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" er opprettet.`,
      });
      
      // Reset form
      reset();
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess(groupData.id);
      }
      
      // Close modal if applicable
      if (isModal && onClose) {
        onClose();
      } else if (!isModal) {
        navigate(`/group-chat/${groupData.id}`);
      }
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Kunne ikke opprette gruppen",
        description: error.message || "En ukjent feil oppstod.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password requirement when visibility changes
  React.useEffect(() => {
    setNeedsPassword(visibility === 'private');
  }, [visibility]);
  
  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Gruppenavn</Label>
          <Input
            id="name"
            placeholder="Skriv inn et navn for gruppen"
            {...register('name', {
              required: 'Gruppenavn er påkrevd',
              maxLength: {
                value: 50,
                message: 'Gruppenavn kan ikke være lengre enn 50 tegn',
              },
            })}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description">Beskrivelse</Label>
          <Textarea
            id="description"
            placeholder="Beskrivelse av gruppen (valgfritt)"
            {...register('description', {
              maxLength: {
                value: 300,
                message: 'Beskrivelse kan ikke være lengre enn 300 tegn',
              },
            })}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="visibility">Synlighet</Label>
          <Select
            defaultValue="private"
            onValueChange={(value) => setValue('visibility', value as GroupVisibility)}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Velg synlighet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Privat - Bare synlig for medlemmer</span>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Offentlig - Synlig for alle</span>
                  </div>
                </SelectItem>
                <SelectItem value="hidden">
                  <div className="flex items-center">
                    <EyeOff className="w-4 h-4 mr-2" />
                    <span>Skjult - Bare via invitasjon</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {needsPassword && (
          <div>
            <Label htmlFor="password">Passord for tilgang (valgfritt)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sett et gruppepassord"
              {...register('password')}
              className="mt-1"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isEncrypted">Krypterte meldinger</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Slå på for å øke sikkerheten
            </p>
          </div>
          <Switch
            id="isEncrypted"
            checked={isEncrypted}
            onCheckedChange={(checked) => setValue('isEncrypted', checked)}
          />
        </div>
      </div>
      
      <div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Oppretter...' : 'Opprett gruppe'}
        </Button>
      </div>
    </form>
  );
  
  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Opprett ny gruppe</DialogTitle>
            <DialogDescription>
              Lag en gruppe for å chatte med flere personer samtidig.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <div className="bg-white dark:bg-cyberdark-900 rounded-md shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Opprett ny gruppe</h2>
      {formContent}
    </div>
  );
};
