import { useState, useEffect, useContext } from "react";
import type { Profile } from "../types/profile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Key, Lock, LogOut, ShieldCheck, Upload, User, Shield, Bitcoin } from "lucide-react";
import { PremiumUser } from "@/components/profile/PremiumUser";
import { BitcoinWallet } from "@/components/profile/BitcoinWallet";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { Skeleton } from "@/components/ui/skeleton";
import { AppEncryptionContext, useAppEncryption } from "@/contexts/AppEncryptionContext";
import { useProfileLoader } from "@/hooks/useProfileLoader";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { user, signOut, updateProfile, updatePassword } = useAuth();
  const { isPremium, upgradeToPremium } = useGroups();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { screenCaptureProtection } = useAppEncryption();
  const isEncryptionEnabled = screenCaptureProtection.isEnabled();
  const { profileData, isProfileLoading, refreshProfile } = useProfileLoader(user?.id);

  // Privacy settings state
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [allowInvites, setAllowInvites] = useState(true);
  const [privacySettingsChanged, setPrivacySettingsChanged] = useState(false);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Two-factor authentication state
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorQRCode, setTwoFactorQRCode] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Load privacy settings from profile data
  useEffect(() => {
    if (profileData) {
      setShowOnlineStatus(profileData.show_online_status !== false);
      setReadReceipts(profileData.read_receipts !== false);
      setAllowInvites(profileData.allow_invites !== false);
      setIsTwoFactorEnabled(profileData.two_factor_enabled === true);
    }
  }, [profileData]);

  // Wrapper funksjon for å konvertere Promise<boolean> til Promise<void>
  const handleUpgrade = async (): Promise<void> => {
    try {
      const result = await upgradeToPremium();
      if (!result) {
        toast({
          variant: "destructive",
          title: "Oppgradering feilet",
          description: "Kunne ikke oppgradere til premium. Vennligst prøv igjen senere."
        });
      }
    } catch (error) {
      console.error("Feil ved oppgradering til premium:", error);
      toast({
        variant: "destructive",
        title: "Oppgradering feilet",
        description: "Det oppsto en feil under oppgradering til premium."
      });
    }
  };

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");

      if (profileData) {
        setDisplayName(profileData.display_name || displayName);
        if (profileData.avatar_url) {
          // Create proper URL from Supabase storage path
          if (profileData.avatar_url.startsWith('avatars/')) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url.replace('avatars/', ''));
            setAvatarUrl(data.publicUrl);
          } else {
            setAvatarUrl(profileData.avatar_url);
          }
        }
      }
    }
  }, [user, profileData, displayName]);

  const initials = displayName
    ? displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
    : "??";

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // First update profile information
      const updates = {
        display_name: displayName,
      };

      // If we have a new avatar file, upload it first
      if (avatarFile) {
        const avatarFileName = `${uuidv4()}-${avatarFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        // Update the avatar_url in the profile
        updates['avatar_url'] = uploadData.path;
      }

      await updateProfile(updates);

      if (isEncryptionEnabled && profileData) {
        // Pseudokode for oppdatering av kryptert profildata
        // await updateEncryptedProfile({
        //   display_name: displayName,
        //   avatar_url: avatarUrl,
        // });
      }

      await refreshProfile();
      setAvatarFile(null);

      toast({
        title: "Profil oppdatert",
        description: "Din profilinformasjon har blitt oppdatert.",
      });
    } catch (error) {
      console.error("Feil ved profiloppdatering:", error);
      toast({
        variant: "destructive",
        title: "Feil ved oppdatering",
        description: "Kunne ikke oppdatere profilinformasjonen. Prøv igjen senere.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Filen er for stor",
        description: "Maksimal filstørrelse er 2MB. Vennligst velg en mindre fil.",
      });
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Ugyldig filformat",
        description: "Kun JPEG, PNG, GIF og WebP-bilder er støttet.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the file for later upload
      setAvatarFile(file);
      
      // Create a preview
      const dataUrl = await readFileAsDataURL(file);
      setAvatarUrl(dataUrl);

      toast({
        title: "Profilbilde oppdatert",
        description: "Ditt profilbilde er klart til å lagres. Klikk 'Lagre endringer' for å beholde det.",
      });
    } catch (error) {
      console.error("Feil ved bildeopplasting:", error);
      toast({
        variant: "destructive",
        title: "Feil ved bildeopplasting",
        description: "Kunne ikke laste opp profilbildet. Sjekk filformatet og prøv igjen.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Kunne ikke lese filen"));
        }
      };
      reader.onerror = () => reject(new Error("Feil ved lesing av fil"));
      reader.readAsDataURL(file);
    });
  };

  // Function to save privacy settings
  const savePrivacySettings = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        show_online_status: showOnlineStatus,
        read_receipts: readReceipts,
        allow_invites: allowInvites
      });

      await refreshProfile();

      toast({
        title: "Innstillinger lagret",
        description: "Dine personverninnstillinger har blitt oppdatert.",
      });
      setPrivacySettingsChanged(false);
    } catch (error) {
      console.error("Feil ved lagring av personverninnstillinger:", error);
      toast({
        variant: "destructive",
        title: "Feil ved lagring",
        description: "Kunne ikke lagre innstillingene. Prøv igjen senere.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passord samsvarer ikke",
        description: "Det nye passordet og bekreftelsespassordet må være like.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Usikkert passord",
        description: "Passordet må være minst 8 tegn langt.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast({
        title: "Passord endret",
        description: "Ditt passord har blitt oppdatert.",
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Feil ved endring av passord:", error);
      toast({
        variant: "destructive",
        title: "Feil ved endring av passord",
        description: "Kunne ikke endre passordet. Sjekk at nåværende passord er korrekt.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to set up two-factor authentication
  const setupTwoFactorAuth = async () => {
    setIsLoading(true);
    try {
      setTwoFactorQRCode("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Snakkaz:" + user?.email + "?secret=JBSWY3DPEHPK3PXP&issuer=Snakkaz");
      setTwoFactorSecret("JBSWY3DPEHPK3PXP");
      setIsSettingUp2FA(true);
    } catch (error) {
      console.error("Feil ved oppsett av to-faktor:", error);
      toast({
        variant: "destructive",
        title: "2FA Oppsett feilet",
        description: "Kunne ikke sette opp to-faktor autentisering. Prøv igjen senere.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify and enable two-factor
  const verifyAndEnableTwoFactor = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Mangler kode",
        description: "Vennligst skriv inn en verifiseringskode.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (verificationCode.length === 6 && !isNaN(Number(verificationCode))) {
        await updateProfile({
          two_factor_enabled: true
        });

        setIsTwoFactorEnabled(true);
        setIsSettingUp2FA(false);
        toast({
          title: "2FA Aktivert",
          description: "To-faktor autentisering er nå aktivert for din konto.",
        });
      } else {
        throw new Error("Invalid code");
      }
    } catch (error) {
      console.error("Feil ved verifisering av 2FA:", error);
      toast({
        variant: "destructive",
        title: "Verifisering feilet",
        description: "Kunne ikke verifisere 2FA-koden. Sjekk at koden er riktig.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to disable two-factor authentication
  const disableTwoFactorAuth = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        two_factor_enabled: false
      });

      setIsTwoFactorEnabled(false);
      setIsSettingUp2FA(false);
      toast({
        title: "2FA Deaktivert",
        description: "To-faktor autentisering er nå deaktivert for din konto.",
      });
    } catch (error) {
      console.error("Feil ved deaktivering av 2FA:", error);
      toast({
        variant: "destructive",
        title: "Deaktivering feilet",
        description: "Kunne ikke deaktivere 2FA. Prøv igjen senere.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-cybergold-400">Min Profil</h1>
        <Card className="bg-cyberdark-900 border-cyberdark-700 p-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-gray-400 mb-4">Du må være innlogget for å se din profil</p>
            <Button
              className="bg-cyberblue-600 hover:bg-cyberblue-500"
              onClick={() => (window.location.href = "/auth")}
            >
              Logg inn
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-cybergold-400">Min Profil</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-cyberdark-900 border-cyberdark-700 p-6">
              <CardContent className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="bg-cyberdark-900 border-cyberdark-700 p-6">
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-cybergold-400">Min Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-cyberdark-900 border-cyberdark-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <User className="h-5 w-5" /> Brukerinfo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group mb-4">
                <Avatar className="h-24 w-24 border-2 border-cybergold-500/50">
                  {!isLoading && <AvatarImage src={avatarUrl} />}
                  <AvatarFallback
                    className={`bg-cyberdark-700 text-cybergold-400 text-xl ${isLoading ? "animate-pulse" : ""
                      }`}
                  >
                    {isLoading ? "..." : initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <label
                    htmlFor="avatar-upload"
                    className={`cursor-pointer p-2 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <Upload className="h-5 w-5 text-cybergold-400" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-1">{displayName}</h2>
              <p className="text-sm text-gray-400 mb-4">{user?.email}</p>

              <div className="w-full space-y-2">
                {isPremium && (
                  <div className="flex items-center justify-center p-2 rounded-md bg-cybergold-500/20 text-cybergold-400 text-sm">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Premium-medlem
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full border-cyberdark-600 text-gray-300 hover:bg-cyberdark-800"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logg ut
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <PremiumUser isPremium={isPremium} onUpgrade={handleUpgrade} />
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-cyberdark-800">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Sikkerhet</TabsTrigger>
              <TabsTrigger value="privacy">Personvern</TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center gap-1.5">
                <Bitcoin className="h-3.5 w-3.5" /> Krypto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <Edit className="h-5 w-5" /> Rediger profil
                  </CardTitle>
                  <CardDescription>
                    Oppdater din profilinformasjon
                    {isEncryptionEnabled && (
                      <span className="ml-2 text-cyberblue-400 text-xs inline-flex items-center">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Kryptert
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Visningsnavn</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-cyberdark-800 border-cyberdark-600"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-cyberdark-800 border-cyberdark-600 opacity-70"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="bg-cyberblue-600 hover:bg-cyberblue-500"
                  >
                    {isSaving ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                        Lagrer...
                      </>
                    ) : (
                      "Lagre endringer"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <Key className="h-5 w-5" /> Sikkerhet
                  </CardTitle>
                  <CardDescription>
                    Administrer passord og sikkerhetsfunksjoner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-cyberdark-600 text-gray-300"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" /> Endre passord
                  </Button>

                  <Link to="/security-settings" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full border-cyberdark-600 text-gray-300 hover:bg-cybergold-950/20 hover:text-cybergold-400"
                    >
                      <Shield className="h-4 w-4 mr-2" /> Sikkerhet og personvern
                    </Button>
                  </Link>

                  {isPremium && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-cyberdark-600 text-gray-300"
                        onClick={() => isTwoFactorEnabled ? setIsSettingUp2FA(true) : setupTwoFactorAuth()}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isTwoFactorEnabled
                          ? "Administrer to-faktor autentisering"
                          : "Aktiver to-faktor autentisering"}
                      </Button>

                      <div className="p-3 border border-cyberdark-600 rounded-md">
                        <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 text-cyberblue-400" />
                          Fullside-kryptering
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                          Fullside-kryptering sikrer at all din kommunikasjon og data er beskyttet
                          ende-til-ende.
                        </p>
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${isEncryptionEnabled ? "bg-green-500" : "bg-gray-500"
                              }`}
                          ></div>
                          <p className="text-xs text-gray-300">
                            {isEncryptionEnabled
                              ? "Kryptering er aktivert"
                              : "Kryptering er deaktivert"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-4">
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <ShieldCheck className="h-5 w-5" /> Personvern
                  </CardTitle>
                  <CardDescription>
                    Administrer personverninnstillinger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Vis online-status</h3>
                        <p className="text-xs text-gray-400">La andre se når du er pålogget</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={showOnlineStatus}
                          onCheckedChange={(value) => {
                            setShowOnlineStatus(value);
                            setPrivacySettingsChanged(true);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Lesebekreftelser</h3>
                        <p className="text-xs text-gray-400">Send og motta lesebekreftelser</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={readReceipts}
                          onCheckedChange={(value) => {
                            setReadReceipts(value);
                            setPrivacySettingsChanged(true);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Tillat invitasjoner</h3>
                        <p className="text-xs text-gray-400">Tillat andre å invitere deg til grupper</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={allowInvites}
                          onCheckedChange={(value) => {
                            setAllowInvites(value);
                            setPrivacySettingsChanged(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-cyberblue-600 hover:bg-cyberblue-500"
                    onClick={savePrivacySettings}
                    disabled={!privacySettingsChanged || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                        Lagrer...
                      </>
                    ) : (
                      "Lagre innstillinger"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="mt-4">
              <BitcoinWallet userId={user?.id || ''} isPremium={isPremium} />
              
              {!isPremium && (
                <Card className="bg-cyberdark-900 border-cyberdark-700 mt-4 border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center p-4">
                      <Bitcoin className="h-10 w-10 text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Oppgrader til Premium</h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Med Premium får du utvidede funksjoner for kryptohåndtering, inkludert multi-wallet støtte, enhetssynkronisering og mer sikkerhet.
                      </p>
                      <Button 
                        className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                        onClick={handleUpgrade}
                      >
                        Oppgrader til Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700 text-white">
          <DialogHeader>
            <DialogTitle>Endre passord</DialogTitle>
            <DialogDescription className="text-gray-400">
              Skriv inn ditt nåværende passord og det nye passordet du ønsker å bruke.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Nåværende passord</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nytt passord</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Bekreft nytt passord</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-cyberdark-800 border-cyberdark-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsChangingPassword(false)}
              className="border-cyberdark-600 text-gray-300"
            >
              Avbryt
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword || isSaving}
              className="bg-cyberblue-600 hover:bg-cyberblue-500"
            >
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Lagrer...
                </>
              ) : (
                "Endre passord"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={isSettingUp2FA} onOpenChange={(open) => !isLoading && setIsSettingUp2FA(open)}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isTwoFactorEnabled ? "Administrer to-faktor autentisering" : "Aktiver to-faktor autentisering"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isTwoFactorEnabled
                ? "Din konto er beskyttet med to-faktor autentisering."
                : "Skann QR-koden med en autentiseringsapp som Google Authenticator eller Authy."}
            </DialogDescription>
          </DialogHeader>

          {isTwoFactorEnabled ? (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-cyberdark-800 rounded-md border border-green-500/30">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm text-green-400">To-faktor autentisering er aktivert</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={disableTwoFactorAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Behandler...
                    </>
                  ) : (
                    "Deaktiver to-faktor autentisering"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {twoFactorQRCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-md">
                    <img src={twoFactorQRCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="secret-key">Manuell kode</Label>
                <div className="p-2 bg-cyberdark-800 rounded border border-cyberdark-600 font-mono text-sm text-center">
                  {twoFactorSecret}
                </div>
                <p className="text-xs text-gray-400">
                  Hvis du ikke kan skanne QR-koden, kan du skrive inn denne koden i appen din.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verifiseringskode</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                  placeholder="123456"
                  className="bg-cyberdark-800 border-cyberdark-600 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsSettingUp2FA(false)}
              className="border-cyberdark-600 text-gray-300"
              disabled={isLoading}
            >
              Avbryt
            </Button>
            {!isTwoFactorEnabled && (
              <Button
                onClick={verifyAndEnableTwoFactor}
                disabled={verificationCode.length !== 6 || isLoading}
                className="bg-cyberblue-600 hover:bg-cyberblue-500"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Verifiserer...
                  </>
                ) : (
                  "Aktiver 2FA"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
