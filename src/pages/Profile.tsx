import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente profildata",
        variant: "destructive",
      });
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    console.log('Nytt brukernavn:', newUsername); // Debug logging
    setUsername(newUsername);
  };

  const validateUsername = async (username: string) => {
    console.log('Validerer brukernavn:', username); // Debug logging
    
    if (!username) {
      setUsernameError("Brukernavn kan ikke være tomt");
      return false;
    }

    if (username.length < 3) {
      setUsernameError("Brukernavn må være minst 3 tegn");
      return false;
    }

    if (username.length > 20) {
      setUsernameError("Brukernavn kan ikke være lengre enn 20 tegn");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Brukernavn kan kun inneholde bokstaver, tall og underscore");
      return false;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setUsernameError("Du må være logget inn");
      return false;
    }

    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', session.user.id)
      .maybeSingle();

    console.log('Eksisterende bruker sjekk:', { existingUser, error }); // Debug logging

    if (existingUser) {
      setUsernameError("Dette brukernavnet er allerede i bruk");
      return false;
    }

    setUsernameError(null);
    return true;
  };

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

      const isValid = await validateUsername(username);
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
      
      // Send en global hendelse for å oppdatere brukernavn i hele applikasjonen
      document.dispatchEvent(new CustomEvent('username-updated', {
        detail: {
          userId: session.user.id,
          username: username
        }
      }));
      
    } catch (error: any) {
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
      
      // Send en global hendelse for å oppdatere profilbilde i hele applikasjonen
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
      <div className="fixed top-4 left-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/')}
          className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/chat')}
          className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
      
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

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-base font-medium text-cybergold-400 mb-2">
                  Brukernavn
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="bg-cyberdark-700 border-2 border-cybergold-400/50 text-cybergold-100 placeholder-cybergold-400/50 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/30 h-12 text-lg px-4"
                  placeholder="Velg ditt brukernavn"
                  autoComplete="username"
                />
                {usernameError && (
                  <p className="mt-2 text-sm text-red-400 bg-red-950/20 p-2 rounded-md border border-red-500/20">
                    {usernameError}
                  </p>
                )}
                <p className="mt-2 text-sm text-cybergold-400/70 bg-cyberdark-900/50 p-2 rounded-md">
                  Brukernavn kan inneholde bokstaver, tall og underscore (_)
                </p>
              </div>

              <Button
                onClick={updateProfile}
                disabled={loading}
                className="w-full bg-cybergold-400 hover:bg-cybergold-500 text-black h-12 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  'Lagre endringer'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
