import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProfileState } from "@/components/profile/hooks/useProfileState";
import { useProfileValidation } from "@/components/profile/hooks/useProfileValidation";
import { ProfileUsernameForm } from "@/components/profile/ProfileUsernameForm";
import { ProfileShareSection } from "@/components/profile/ProfileShareSection";
import { SecuritySettings } from "@/components/security/SecuritySettings";
import { useAuth } from "@/contexts/AuthContext";
import { StatusDropdown } from "@/components/online-users/StatusDropdown";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { usePresence } from "@/components/chat/hooks/usePresence";
import { useStatusRefresh } from "@/hooks/useStatusRefresh";
import { supabase } from "@/integrations/supabase/client";
import { NotificationSettings } from "@/components/chat/notification/NotificationSettings";

const PremiumBadge = ({ isPremium = false }) => {
  if (!isPremium) return null;

  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cybergold-600/30 via-cybergold-500/20 to-cybergold-600/30 rounded-full border border-cybergold-400/30 shadow-neon-gold">
      <Crown className="h-3.5 w-3.5 text-cybergold-400" />
      <span className="text-xs font-semibold text-cybergold-400">Premium</span>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { isRefreshing, lastUpdated, refresh } = useStatusRefresh();
  const [isPremium, setIsPremium] = useState(false);

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

  const { currentStatus, handleStatusChange } = usePresence(
    user?.id,
    'online',
    undefined,
    false
  );

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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(filePath);

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
    <div className="min-h-screen bg-cyberdark-950 text-white pt-4 pb-20 px-4">
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
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-cybergold-300">Min Profil</h1>
                <PremiumBadge isPremium={isPremium} />
              </div>
              <p className="text-sm text-cyberdark-400">
                Administrer din profil, preferanser og sikkerhetsinnstillinger
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
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
                className="text-cyberdark-400 hover:text-cybergold-300 whitespace-nowrap"
                onClick={refresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Oppdaterer..." : `Oppdatert: ${lastUpdated.toLocaleTimeString()}`}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-cyberdark-700 pb-1">
            <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {activeTab === "profile" && (
          <ProfileCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center md:items-start">
                <div className={`relative ${isPremium ? 'animate-pulse-slow' : ''}`}>
                  <ProfileAvatar
                    avatarUrl={avatarUrl}
                    uploading={uploading}
                    onUpload={uploadAvatar}
                  />
                  {isPremium && (
                    <div className="absolute -bottom-2 -right-2 bg-cyberdark-900 rounded-full p-1 border border-cybergold-500/30 shadow-neon-gold">
                      <Crown className="h-4 w-4 text-cybergold-400" />
                    </div>
                  )}
                </div>

                {isPremium && (
                  <div className="mt-6 p-4 bg-cyberdark-800/50 rounded-lg border border-cybergold-500/20 shadow-neon-gold/10 max-w-xs">
                    <h3 className="text-cybergold-400 font-semibold mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Premium-konto
                    </h3>
                    <p className="text-sm text-cyberdark-400">
                      Du har tilgang til alle premium-funksjoner og krypterte grupper.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-cybergold-500/20 text-cybergold-400 hover:bg-cybergold-900/10"
                      >
                        Administrer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-cybergold-400 hover:bg-cybergold-900/10"
                      >
                        Vis fordeler
                      </Button>
                    </div>
                  </div>
                )}

                {!isPremium && (
                  <div className="mt-6 p-4 bg-cyberdark-800/50 rounded-lg border border-cybergold-500/20 max-w-xs">
                    <h3 className="text-cybergold-400 font-semibold mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Oppgrader til Premium
                    </h3>
                    <p className="text-sm text-cyberdark-400">
                      Få tilgang til krypterte grupper og avanserte sikkerhetsfunksjoner.
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-gradient-to-r from-cybergold-700 to-cybergold-500 hover:from-cybergold-600 hover:to-cybergold-400 text-cyberdark-950 font-semibold"
                    >
                      Oppgrader nå
                    </Button>
                  </div>
                )}
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
            <SecuritySettings userId={user?.id || null} />
          </ProfileCard>
        )}

        {activeTab === "notifications" && (
          <ProfileCard>
            <h2 className="text-lg font-semibold text-cybergold-300 mb-6">Varslingsinnstillinger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-cyberdark-300">
                  Velg hvordan du vil motta varsler og tilpass lyden etter dine preferanser.
                </p>
                <div className="w-full md:max-w-xs">
                  <NotificationSettings />
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Notifications illustration"
                  className="opacity-40 w-full max-w-xs mx-auto"
                />
              </div>
            </div>
          </ProfileCard>
        )}

        {activeTab === "premium" && (
          <ProfileCard>
            <h2 className="text-xl font-bold text-cybergold-300 mb-6">Premium-abonnement</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className={`p-5 border ${isPremium ? 'border-cybergold-500/30 shadow-neon-gold/20' : 'border-cyberdark-700'} rounded-xl bg-cyberdark-800/60`}>
                  <h3 className={`text-lg font-semibold ${isPremium ? 'text-cybergold-400' : 'text-cyberblue-400'} mb-3`}>
                    {isPremium ? 'Du har Premium' : 'Oppgrader til Premium'}
                  </h3>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                        <div className="h-3 w-3 rounded-full bg-cybergold-500" />
                      </div>
                      <span>Opprett krypterte premium-grupper</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                        <div className="h-3 w-3 rounded-full bg-cybergold-500" />
                      </div>
                      <span>Førsteklasses end-to-end kryptering</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="rounded-full bg-cybergold-500/20 p-0.5 mt-0.5">
                        <div className="h-3 w-3 rounded-full bg-cybergold-500" />
                      </div>
                      <span>Tilgang til alle fremtidige premium-funksjoner</span>
                    </li>
                  </ul>

                  {!isPremium && (
                    <div className="space-y-3">
                      <p className="text-sm">
                        <span className="text-cybergold-400 font-bold">99 kr/mnd</span>
                        <span className="text-xs text-cyberdark-400 ml-2">Betal med Bitcoin</span>
                      </p>

                      <Button
                        className="w-full bg-gradient-to-r from-cybergold-700 to-cybergold-500 hover:from-cybergold-600 hover:to-cybergold-400 text-cyberdark-950 font-semibold"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Oppgrader til Premium
                      </Button>
                    </div>
                  )}

                  {isPremium && (
                    <div className="space-y-3">
                      <p className="text-sm flex items-center">
                        <span className="text-cybergold-400 font-bold">Aktivt abonnement</span>
                        <span className="text-xs text-cyberdark-400 ml-2">Fornyes 15. mai 2025</span>
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-cybergold-500/20 text-cybergold-400 hover:bg-cybergold-900/10"
                        >
                          Forny
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 text-cyberred-400 hover:bg-cyberred-900/10"
                        >
                          Kanseller
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center p-4">
                <div className="bg-cyberdark-900/50 p-6 rounded-xl border border-cybergold-500/10 text-center max-w-xs">
                  <Crown className="h-8 w-8 text-cybergold-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-cybergold-300 mb-2">Betal med Bitcoin</h4>
                  <p className="text-sm mb-4 text-cyberdark-400">
                    Send Bitcoin til vår adresse for å aktivere ditt premium-abonnement.
                  </p>
                  <div className="p-3 bg-white rounded-lg mb-3">
                    <div className="h-32 w-32 bg-cyberdark-900/20 flex items-center justify-center mx-auto">
                      <span className="text-xs text-cyberdark-700">Bitcoin QR-kode</span>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-cybergold-400 p-2 bg-cyberdark-800 rounded-md overflow-hidden text-center break-all">
                    1A2b3C4d5E6f7G8h9I
                  </div>
                </div>
              </div>
            </div>
          </ProfileCard>
        )}
      </ProfileContainer>
    </div>
  );
};

export default Profile;
