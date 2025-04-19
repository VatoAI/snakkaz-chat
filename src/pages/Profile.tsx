
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileUsernameForm } from "@/components/profile/ProfileUsernameForm";
import { useProfileState } from "@/components/profile/hooks/useProfileState";
import { useProfileValidation } from "@/components/profile/hooks/useProfileValidation";

const Profile = () => {
  const {
    loading,
    setLoading,
    username,
    usernameError,
    setUsernameError,
    avatarUrl,
    setAvatarUrl,
    uploading,
    setUploading,
    handleUsernameChange,
    toast
  } = useProfileState();

  const { validateUsername } = useProfileValidation();

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Feil",
          description: "Du må være logget inn for å oppdatere profilen",
          variant: "destructive",
        });
        return;
      }

      const isValid = await validateUsername(username, setUsernameError);
      if (!isValid) {
        toast({
          title: "Feil",
          description: usernameError || "Ugyldig brukernavn",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Suksess",
        description: "Profilen din har blitt oppdatert",
      });
      setUsernameError(null);
      
      document.dispatchEvent(new CustomEvent('username-updated', {
        detail: {
          userId: session.user.id,
          username: username
        }
      }));
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere profilen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Ingen aktiv sesjon');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Du må velge en fil å laste opp');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: filePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(filePath);
      toast({
        title: "Suksess",
        description: "Profilbildet ditt har blitt oppdatert",
      });
      
      document.dispatchEvent(new CustomEvent('avatar-updated', {
        detail: {
          userId: session.user.id,
          avatarUrl: filePath
        }
      }));
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp profilbilde",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cyberdark-950">
      <ProfileNavigation />
      
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cyberdark-800/90 border-2 border-cybergold-400/50 animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Min Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileAvatar 
              avatarUrl={avatarUrl}
              uploading={uploading}
              onUpload={uploadAvatar}
            />

            <ProfileUsernameForm
              username={username}
              usernameError={usernameError}
              loading={loading}
              onUsernameChange={handleUsernameChange}
              onSubmit={updateProfile}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
