import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PinManagement } from "@/components/pin/PinManagement";
import { useProfileState } from "@/components/profile/hooks/useProfileState";
import { useProfileValidation } from "@/components/profile/hooks/useProfileValidation";
import { ProfileUsernameForm } from "@/components/profile/ProfileUsernameForm";
import { ProfileShareSection } from "@/components/profile/ProfileShareSection";
import { PinPreferences } from "@/components/profile/PinPreferences";
import { useAuth } from "@/contexts/AuthContext";
import { StatusDropdown } from "@/components/online-users/StatusDropdown";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { UserStatus } from "@/types/presence";
import { usePresence } from "@/components/chat/hooks/usePresence";
import { useStatusRefresh } from "@/hooks/useStatusRefresh";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { isRefreshing, lastUpdated, refresh } = useStatusRefresh();
  
  const {
    loading,
    username,
    usernameError,
    avatarUrl,
    uploading,
    handleUsernameChange,
    setUsernameError,
    setAvatarUrl,
    setUploading,
    toast
  } = useProfileState();
  
  const { validateUsername } = useProfileValidation();
  const { user } = useAuth();

  // Use the centralized usePresence hook
  const { currentStatus, handleStatusChange, userPresence } = usePresence(
    user?.id,
    'online',
    undefined,
    false
  );

  // Upload avatar
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Du må velge en fil');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Update profile with new avatar url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(filePath);
      
      // Broadcast avatar update
      document.dispatchEvent(new CustomEvent('avatar-updated', {
        detail: { userId: user?.id, avatarUrl: filePath }
      }));
      
      toast({
        title: "Suksess",
        description: "Profilbilde oppdatert",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp bilde",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Update profile logic
  async function updateProfile() {
    try {
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
        detail: { userId: session.user.id, username }
      }));
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere profilen",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 text-white pt-4 pb-8 px-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800/50 mb-4"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Tilbake
      </Button>

      <ProfileContainer>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-cybergold-300">Min Profil</h1>
            <p className="text-sm text-cyberdark-400">
              Administrer din profil, preferanser og sikkerhetsinnstillinger
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-cyberdark-400">Status:</span>
              <StatusDropdown 
                currentStatus={currentStatus} 
                onStatusChange={handleStatusChange} 
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-cyberdark-400 hover:text-cybergold-300"
              onClick={refresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Oppdaterer..." : `Oppdatert: ${lastUpdated.toLocaleTimeString()}`}
            </Button>
          </div>
        </div>
        
        <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ProfileAvatar 
                  avatarUrl={avatarUrl} 
                  uploading={uploading} 
                  onUpload={uploadAvatar} 
                />
              </div>
              
              <div>
                <ProfileUsernameForm
                  username={username}
                  usernameError={usernameError}
                  loading={loading}
                  onUsernameChange={handleUsernameChange}
                  onSubmit={updateProfile}
                />
                <ProfileShareSection username={username} />
              </div>
            </div>
          </ProfileCard>
        )}
        
        {activeTab === "security" && (
          <ProfileCard>
            <PinManagement />
          </ProfileCard>
        )}
        
        {activeTab === "notifications" && (
          <ProfileCard>
            <h2 className="text-lg font-semibold text-cybergold-300 mb-6">Varslingsinnstillinger</h2>
            <div className="space-y-8">
              <PinPreferences userId={user?.id || null} />
              <h2 className="text-lg font-semibold text-cybergold-300 mb-4">Varslingsinnstillinger</h2>
              <p className="text-cyberdark-300">Varslingsinnstillinger kommer snart.</p>
            </div>
          </ProfileCard>
        )}
      </ProfileContainer>
    </div>
  );
};

export default Profile;
