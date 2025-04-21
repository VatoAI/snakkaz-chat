
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileUsernameForm } from "@/components/profile/ProfileUsernameForm";
import { useProfileState } from "@/components/profile/hooks/useProfileState";
import { useProfileValidation } from "@/components/profile/hooks/useProfileValidation";
import { UserQrCodeDisplay } from "@/components/chat/friends/UserQrCode";
import { Airplay } from "lucide-react";

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

  const handleShareQrCode = async () => {
    try {
      const QRCode = await import('qrcode');
      if (!username) throw new Error("Du må ha brukernavn for å dele QR-kode");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Ingen brukersesjon");
      const payload = JSON.stringify({
        type: 'friend-request',
        userId: session.user.id,
        username: username
      });
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        color: {
          dark: '#000',
          light: '#fff'
        },
        width: 256,
        margin: 1
      });
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      const file = new File([svgBlob], `${username}-snakkaz-qr.svg`, { type: 'image/svg+xml' });
      if ((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          title: `Del min QR`,
          text: `Skann QR for å legge til ${username} som venn på SnakkaZ`,
          files: [file]
        });
      } else {
        toast({
          title: "Deling ikke støttet",
          description: "Denne funksjonen er kun tilgjengelig på enheter som støtter deling av filer (AirDrop, Android Nearby osv).",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Feil ved deling",
        description: (err as Error)?.message ?? "Ukjent feil ved deling av QR",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-cyberdark-950">
      <ProfileNavigation />
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cyberdark-800/90 border-2 border-cybergold-400/50 animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-cybergold-400">Min Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
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

            <div className="flex flex-col gap-3">
              <UserQrCodeDisplay />
              <button
                className="flex items-center justify-center gap-2 bg-cyberblue-700 hover:bg-cyberblue-500 text-white rounded-lg px-4 py-2 font-semibold shadow-neon-blue transition-all"
                onClick={handleShareQrCode}
                type="button"
              >
                <Airplay className="w-5 h-5" />
                Del QR-kode (AirDrop/Nearby)
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
