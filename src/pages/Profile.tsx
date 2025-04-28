import { useState, useEffect, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Key, Lock, LogOut, ShieldCheck, Upload, User } from "lucide-react";
import { PremiumUser } from "@/components/profile/PremiumUser";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { Skeleton } from "@/components/ui/skeleton";
import { AppEncryptionContext } from "@/contexts/AppEncryptionContext";
import { useProfileLoader } from "@/hooks/useProfileLoader";

export default function Profile() {
  const { user, signOut, updateUserProfile } = useAuth();
  const { isPremium, upgradeToPremium } = useGroups();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { isEncryptionEnabled } = useContext(AppEncryptionContext);
  const { profileData, isProfileLoading, refreshProfile } = useProfileLoader(user?.id);

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
          setAvatarUrl(profileData.avatar_url);
        }
      }
    }
  }, [user, profileData]);

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
      await updateUserProfile({
        display_name: displayName,
      });

      if (isEncryptionEnabled && profileData) {
        // Pseudokode for oppdatering av kryptert profildata
        // await updateEncryptedProfile({
        //   display_name: displayName,
        //   avatar_url: avatarUrl,
        // });
      }

      await refreshProfile();

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

    setIsLoading(true);
    try {
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
            <TabsList className="w-full grid grid-cols-3 bg-cyberdark-800">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Sikkerhet</TabsTrigger>
              <TabsTrigger value="privacy">Personvern</TabsTrigger>
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
                  <Button variant="outline" className="w-full border-cyberdark-600 text-gray-300">
                    <Lock className="h-4 w-4 mr-2" /> Endre passord
                  </Button>

                  {isPremium && (
                    <>
                      <Button variant="outline" className="w-full border-cyberdark-600 text-gray-300">
                        <Eye className="h-4 w-4 mr-2" /> Administrer to-faktor autentisering
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
                        <input
                          type="checkbox"
                          id="online-status"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Lesebekreftelser</h3>
                        <p className="text-xs text-gray-400">Send og motta lesebekreftelser</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="read-receipts"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Tillat invitasjoner</h3>
                        <p className="text-xs text-gray-400">Tillat andre å invitere deg til grupper</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allow-invites"
                          defaultChecked={true}
                          className="rounded text-cyberblue-500 focus:ring-cyberblue-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-cyberblue-600 hover:bg-cyberblue-500">
                    Lagre innstillinger
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
