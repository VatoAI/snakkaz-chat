import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Globe, Lock, Shield } from 'lucide-react';

export const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    allow_member_invites: true
  });
  
  const [loading, setLoading] = useState(false);

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate('/login', { state: { returnUrl: '/create-group' } });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Create room in existing schema for now
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          name: formData.name,
          description: formData.description,
          is_private: formData.is_private,
          created_by: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      toast({
        title: 'Gruppe opprettet!',
        description: `${formData.name} er nå klar for bruk.`,
      });

      navigate(`/chat/group/${room.id}`);
    } catch (err) {
      console.error('Error creating group:', err);
      toast({
        title: 'Kunne ikke opprette gruppe',
        description: 'Prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Tilbake
        </Button>
        <h1 className="text-2xl font-bold dark:text-cybergold-300">Opprett ny gruppe</h1>
      </div>
      
      <div className="mb-8">
        <p className="dark:text-cybergold-400 mb-4">
          Opprett en gruppe for å starte samtaler med venner, familie eller kolleger. 
          Du kan invitere medlemmer etter at gruppen er opprettet.
        </p>
        
        {isCreated ? (
          <div className="p-4 bg-green-100 dark:bg-cybergreen-900/30 border border-green-200 dark:border-cybergreen-800/50 rounded-md mb-6">
            <p className="text-green-800 dark:text-cybergreen-400">
              Gruppen er opprettet! Du blir omdirigert til gruppen...
            </p>
          </div>
        ) : null}
      </div>
      
      <CreateGroup onSuccess={handleGroupCreated} />
    </div>
  );
};

export default CreateGroupPage;